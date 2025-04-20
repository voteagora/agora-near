/**
 * Type guard to check if a function exists in a NEAR ABI and matches the specified kind
 *
 * @param abi - The NEAR contract ABI
 * @param functionName - Name of the function to check
 * @param kind - Kind of function ('view' or 'call')
 * @returns Boolean indicating if the function exists and is of the specified kind
 */
export function hasFunction(
  abi: Record<string, any> | undefined,
  functionName: string,
  kind: "view" | "call"
): boolean {
  if (
    !abi ||
    !abi.body ||
    !abi.body.functions ||
    !Array.isArray(abi.body.functions)
  ) {
    return false;
  }

  return abi.body.functions.some(
    (func: any) => func.name === functionName && func.kind === kind
  );
}

/**
 * Extract parameter types from a NEAR ABI function
 *
 * @param abi - The NEAR contract ABI
 * @param functionName - Name of the function to extract parameters from
 * @returns Array of parameter definitions or null if not found
 */
export function getFunctionParams(
  abi: Record<string, any> | undefined,
  functionName: string
): Array<{ name: string; type_schema: any }> | null {
  if (
    !abi ||
    !abi.body ||
    !abi.body.functions ||
    !Array.isArray(abi.body.functions)
  ) {
    return null;
  }

  const func = abi.body.functions.find((f: any) => f.name === functionName);
  if (!func || !func.params || !func.params.args) {
    return null;
  }

  return func.params.args;
}

/**
 * Extract result type from a NEAR ABI function
 *
 * @param abi - The NEAR contract ABI
 * @param functionName - Name of the function to extract result from
 * @returns Result type schema or null if not found
 */
export function getFunctionResult(
  abi: Record<string, any> | undefined,
  functionName: string
): any | null {
  if (
    !abi ||
    !abi.body ||
    !abi.body.functions ||
    !Array.isArray(abi.body.functions)
  ) {
    return null;
  }

  const func = abi.body.functions.find((f: any) => f.name === functionName);
  if (!func || !func.result || !func.result.type_schema) {
    return null;
  }

  return func.result.type_schema;
}

/**
 * Get all function names from a NEAR ABI that match the specified kind
 *
 * @param abi - The NEAR contract ABI
 * @param kind - Kind of functions to get ('view' or 'call')
 * @returns Array of function names
 */
export function getFunctionNames(
  abi: Record<string, any> | undefined,
  kind: "view" | "call"
): string[] {
  if (
    !abi ||
    !abi.body ||
    !abi.body.functions ||
    !Array.isArray(abi.body.functions)
  ) {
    return [];
  }

  return abi.body.functions
    .filter((func: any) => func.kind === kind)
    .map((func: any) => func.name);
}

/**
 * Creates a type for the expected args structure based on the ABI parameter definitions
 *
 * @param params - Array of parameter definitions from the ABI
 * @returns Record mapping parameter names to their expected types
 */
export function createArgsTypeFromParams(
  params: Array<{ name: string; type_schema: any }> | null
): Record<string, any> {
  if (!params) {
    return {};
  }

  return params.reduce(
    (acc, param) => {
      acc[param.name] = param.type_schema;
      return acc;
    },
    {} as Record<string, any>
  );
}
