import fs from "fs";
import path from "path";
import {
  AbiRoot,
  AbiFunction,
  AbiFunctionKind,
  AbiFunctionModifier,
  AbiSerializationType,
  AbiJsonParameter,
} from "near-abi";
import { JSONSchema7, JSONSchema7Definition } from "json-schema";

// Define paths
const abiDir = path.resolve(process.cwd(), "src/lib/contracts/abis/near");
const outputDir = path.resolve(
  process.cwd(),
  "src/lib/contracts/generated/near"
);

// Ensure the output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Helper function to check if a schema definition is an object with properties
function isJsonSchemaObject(def: JSONSchema7Definition): def is JSONSchema7 {
  return typeof def !== "boolean" && def !== undefined;
}

// Helper to safely get options from anyOf/oneOf arrays
function getSchemaOptions(schema: JSONSchema7): JSONSchema7[] {
  if (schema.anyOf) {
    // Cast to any to bypass type checking, then filter out non-objects
    return (schema.anyOf as JSONSchema7Definition[]).filter(isJsonSchemaObject);
  }
  if (schema.oneOf) {
    // Cast to any to bypass type checking, then filter out non-objects
    return (schema.oneOf as JSONSchema7Definition[]).filter(isJsonSchemaObject);
  }
  return [];
}

/**
 * Extract TypeScript type from a JSON schema
 */
function getTypeFromSchema(
  schema: JSONSchema7,
  definitions: Record<string, JSONSchema7Definition>
): string {
  // Handle $ref directly
  if (schema.$ref) {
    const refType = schema.$ref.split("/").pop() || "any";
    return refType;
  }

  // Handle primitives
  if (schema.type === "string") {
    return "string";
  } else if (schema.type === "boolean") {
    return "boolean";
  } else if (schema.type === "null") {
    return "null";
  } else if (schema.type === "integer" || schema.type === "number") {
    if (schema.format) {
      // Handle numeric formats
      switch (schema.format) {
        case "uint8":
        case "uint16":
        case "uint32":
        case "uint64":
        case "int8":
        case "int16":
        case "int32":
        case "int64":
          return "number"; // In TypeScript/JavaScript all integers are numbers
        default:
          return "number";
      }
    }
    return "number";
  } else if (schema.type === "array" && schema.items) {
    // Handle arrays - handle both object and array items
    if (Array.isArray(schema.items)) {
      // Mixed item types - use any[]
      return "any[]";
    } else if (isJsonSchemaObject(schema.items)) {
      const itemType = getTypeFromSchema(schema.items, definitions);
      return `${itemType}[]`;
    }
    return "any[]";
  } else if (schema.type === "object") {
    // For objects, we could generate an inline interface, but for simplicity return Record<string, any>
    return "Record<string, any>";
  }

  // Handle union types (anyOf, oneOf)
  if (schema.anyOf || schema.oneOf) {
    const options = getSchemaOptions(schema);
    if (options.length > 0) {
      const typeOptions = options.map((option) =>
        getTypeFromSchema(option, definitions)
      );
      return typeOptions.join(" | ");
    }
  }

  // Default fallback
  return "any";
}

/**
 * Extract parameter type from an ABI parameter definition
 */
function getParameterType(
  param: AbiJsonParameter,
  definitions: Record<string, JSONSchema7Definition>
): string {
  const schema = param.type_schema;

  if (!isJsonSchemaObject(schema)) {
    return "any";
  }

  // Special handling for common NEAR types
  if (schema.$ref) {
    const refType = schema.$ref.split("/").pop() || "any";
    // If it's a reference to AccountId, we know it's a string
    if (refType === "AccountId") {
      return "string"; // AccountId is always a string
    }
    return refType;
  }

  // Handle null union types (string | null becomes string?)
  if (schema.anyOf) {
    const options = (schema.anyOf as JSONSchema7Definition[])
      .filter(isJsonSchemaObject)
      .map((opt) => {
        if (opt.type === "null") return "null";
        return getTypeFromSchema(opt, definitions);
      });

    // If one of the options is null, make it optional
    if (options.includes("null") && options.length === 2) {
      const nonNullType = options.find((type) => type !== "null");
      return `${nonNullType} | null`;
    }

    return options.join(" | ");
  }

  // Handle specific types
  if (schema.type === "string") {
    return "string";
  } else if (schema.type === "integer" || schema.type === "number") {
    if (schema.format === "uint64" || schema.format === "int64") {
      // For 64-bit integers, use bigint in TypeScript
      return "bigint";
    }
    return "number";
  }

  return getTypeFromSchema(schema, definitions);
}

/**
 * Get the return type for a function from its ABI definition
 */
function getFunctionReturnType(
  func: AbiFunction,
  definitions: Record<string, JSONSchema7Definition>
): string {
  if (!func.result) {
    return "void";
  }

  const schema = func.result.type_schema;

  if (!isJsonSchemaObject(schema)) {
    return "any";
  }

  // Special handling for Promise types
  if (schema.$ref && schema.$ref.includes("Promise")) {
    return "any"; // Promise in NEAR ABI context is not the same as JS Promise
  }

  return getTypeFromSchema(schema, definitions);
}

function generateTypesFromAbi(abiJson: AbiRoot): string {
  const metadata = abiJson.metadata || {};
  const functions = abiJson.body?.functions || [];
  const definitions = abiJson.body?.root_schema?.definitions || {};

  let output = `// Auto-generated TypeScript definitions for ${metadata.name || "NEAR ABI"} v${metadata.version || "0.0.0"}\n`;
  output += `// Generated on ${new Date().toISOString()}\n\n`;

  // Import the near-abi package
  output += `import { AbiFunctionKind, AbiFunctionModifier, AbiSerializationType } from 'near-abi';\n\n`;

  // Generate interfaces for definitions
  for (const [defName, definition] of Object.entries(definitions)) {
    if (typeof definition === "boolean") continue; // Skip boolean definitions like Promise
    if (!isJsonSchemaObject(definition)) continue; // Skip non-object definitions

    // Special handling for AccountId
    if (defName === "AccountId") {
      output += `/** NEAR Account Identifier */\n`;
      output += `export type AccountId = string;\n\n`;
      continue;
    }

    output += `export interface ${defName} {\n`;

    if (definition.type === "object" && definition.properties) {
      for (const [propName, propDef] of Object.entries(definition.properties)) {
        if (!isJsonSchemaObject(propDef)) continue; // Skip if not a proper JSON schema object

        const isRequired = definition.required?.includes(propName);
        const typeAnnotation = isRequired ? "" : "?";

        let typeName = getTypeFromSchema(propDef, definitions);

        // Add documentation if available
        if (propDef.description) {
          output += `  /** ${propDef.description} */\n`;
        }

        output += `  ${propName}${typeAnnotation}: ${typeName};\n`;
      }
    } else if (definition.oneOf) {
      output += `  // Union type with ${Array.isArray(definition.oneOf) ? definition.oneOf.length : "unknown"} variants\n`;

      const oneOfOptions = Array.isArray(definition.oneOf)
        ? (definition.oneOf as JSONSchema7Definition[]).filter(
            isJsonSchemaObject
          )
        : [];

      const variants = oneOfOptions
        .map((variant, index) => {
          if (
            variant.type === "string" &&
            variant.enum &&
            variant.enum.length > 0
          ) {
            return `'${variant.enum[0]}'`;
          }
          return `Variant${index + 1}`;
        })
        .join(" | ");
      output += `  // Possible values: ${variants}\n`;
    }

    output += `}\n\n`;
  }

  // Generate interface for contract methods
  output += `export interface ContractMethods {\n`;

  for (const func of functions) {
    const funcName = func.name;
    const funcKind = func.kind || AbiFunctionKind.Call;
    const funcModifiers = func.modifiers || [];

    // Add documentation if available
    if (func.doc) {
      output += `  /** ${func.doc.replace(/\n/g, "\n   * ")} */\n`;
    }

    // Generate method signature
    if (funcKind === AbiFunctionKind.View) {
      // View function
      let paramType = "void";
      let returnType = getFunctionReturnType(func, definitions);

      if (func.params?.args?.length) {
        const paramsContent = func.params.args
          .map((arg) => {
            const argType = getParameterType(arg, definitions);
            return `${arg.name}: ${argType}`;
          })
          .join("; ");
        paramType = `{ ${paramsContent} }`;
      }

      output += `  ${funcName}(params${func.params?.args?.length ? "" : "?"}: ${paramType}): Promise<${returnType}>;\n`;
    } else {
      // Call function
      let paramType = "void";
      let options = "{ gas?: string; attachedDeposit?: string }";
      let returnType = getFunctionReturnType(func, definitions);

      if (func.params?.args?.length) {
        const paramsContent = func.params.args
          .map((arg) => {
            const argType = getParameterType(arg, definitions);
            return `${arg.name}: ${argType}`;
          })
          .join("; ");
        paramType = `{ ${paramsContent} }`;
      }

      output += `  ${funcName}(params${func.params?.args?.length ? "" : "?"}: ${paramType}, options?: ${options}): Promise<${returnType}>;\n`;
    }
  }

  output += `}\n\n`;

  // Generate contract class
  output += `export class Contract {\n`;
  output += `  constructor(public readonly contractId: string, public readonly account: any) {}\n\n`;

  // Generate contract method implementations
  for (const func of functions) {
    const funcName = func.name;
    const funcKind = func.kind || AbiFunctionKind.Call;
    const funcModifiers = func.modifiers || [];

    if (funcKind === AbiFunctionKind.View) {
      // View function
      let paramType = "void";
      let returnType = getFunctionReturnType(func, definitions);

      if (func.params?.args?.length) {
        const paramsContent = func.params.args
          .map((arg) => {
            const argType = getParameterType(arg, definitions);
            return `${arg.name}: ${argType}`;
          })
          .join("; ");
        paramType = `{ ${paramsContent} }`;
      }

      output += `  async ${funcName}(params${func.params?.args?.length ? "" : "?"}: ${paramType}): Promise<${returnType}> {\n`;
      output += `    return await this.account.viewFunction({\n`;
      output += `      contractId: this.contractId,\n`;
      output += `      methodName: "${funcName}",\n`;
      output += `      args: params || {}\n`;
      output += `    });\n`;
      output += `  }\n\n`;
    } else {
      // Call function
      let paramType = "void";
      let options = "{ gas?: string; attachedDeposit?: string }";
      let returnType = getFunctionReturnType(func, definitions);

      if (func.params?.args?.length) {
        const paramsContent = func.params.args
          .map((arg) => {
            const argType = getParameterType(arg, definitions);
            return `${arg.name}: ${argType}`;
          })
          .join("; ");
        paramType = `{ ${paramsContent} }`;
      }

      const needsDeposit = funcModifiers.includes(AbiFunctionModifier.Payable);

      output += `  async ${funcName}(params${func.params?.args?.length ? "" : "?"}: ${paramType}, options?: ${options}): Promise<${returnType}> {\n`;
      output += `    return await this.account.functionCall({\n`;
      output += `      contractId: this.contractId,\n`;
      output += `      methodName: "${funcName}",\n`;
      output += `      args: params || {},\n`;
      if (needsDeposit) {
        output += `      attachedDeposit: options?.attachedDeposit || "1",\n`;
      }
      output += `      gas: options?.gas || "100000000000000"\n`;
      output += `    });\n`;
      output += `  }\n\n`;
    }
  }

  output += `}\n`;

  return output;
}

// Get all JSON files from the ABI directory
const abiFiles = fs
  .readdirSync(abiDir)
  .filter((file) => file.endsWith("_abi.json"));

// Process each ABI file
abiFiles.forEach((abiFile) => {
  console.log(`Processing ${abiFile}...`);

  // Read the ABI file
  const abiPath = path.join(abiDir, abiFile);
  const abiJson = JSON.parse(fs.readFileSync(abiPath, "utf-8")) as AbiRoot;

  // Generate TypeScript code
  const typescriptCode = generateTypesFromAbi(abiJson);

  // Define output file name (replace .json with .ts)
  const outputFileName = abiFile.replace("_abi.json", ".ts");
  const outputPath = path.join(outputDir, outputFileName);

  // Write the TypeScript code to file
  fs.writeFileSync(outputPath, typescriptCode);

  console.log(`Generated ${outputPath}`);
});

// Create an index.ts file to export all types
const indexContent = abiFiles
  .map((file) => {
    const baseName = path.basename(file, "_abi.json");
    return `export * from './${baseName}';`;
  })
  .join("\n");

fs.writeFileSync(path.join(outputDir, "index.ts"), indexContent + "\n");
console.log("Generated index.ts");

console.log("NEAR ABI TypeScript generation complete!");
