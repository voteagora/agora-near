import {
  AbiFunctionKind,
  AbiFunctionModifier,
  AbiSerializationType,
} from "near-abi";

export const VENEAR_CONTRACT_ABI = {
  schema_version: "0.4.0",
  metadata: {
    name: "venear-contract",
    version: "0.0.1",
    authors: ["Fastnear Inc <hello@fastnear.com>"],
    build: {
      compiler: "rustc 1.86.0",
      builder: "cargo-near cargo-near-build 0.4.6",
    },
    wasm_hash: "5te5fYXmQjZCLEhNgYJuxwWHigLtq34DfvWKCHBB1YdB",
  },
  body: {
    functions: [
      {
        name: "contract_source_metadata",
        kind: AbiFunctionKind.View,
      },
      {
        name: "delegate_all",
        doc: " Delegate all veNEAR tokens to the given receiver account ID.\n The receiver account ID must be registered in the contract.\n Requires 1 yocto NEAR.",
        kind: AbiFunctionKind.Call,
        modifiers: [AbiFunctionModifier.Payable],
        params: {
          serialization_type: AbiSerializationType.Json,
          args: [
            {
              name: "receiver_id",
              type_schema: {
                $ref: "#/definitions/AccountId",
              },
            },
          ],
        },
      },
      {
        name: "deploy_lockup",
        doc: " Deploys the lockup contract.\n If the lockup contract is already deployed, the method will fail after the attempt.\n Requires the caller to attach the deposit for the lockup contract of at least\n `get_lockup_deployment_cost()`.\n Requires the caller to already be registered.",
        kind: AbiFunctionKind.Call,
        modifiers: [AbiFunctionModifier.Payable],
      },
      {
        name: "ft_balance_of",
        doc: " Returns the balance of the account in the veNEAR.",
        kind: AbiFunctionKind.View,
        params: {
          serialization_type: AbiSerializationType.Json,
          args: [
            {
              name: "account_id",
              type_schema: {
                $ref: "#/definitions/AccountId",
              },
            },
          ],
        },
        result: {
          serialization_type: AbiSerializationType.Json,
          type_schema: {
            type: "string",
          },
        },
      },
      {
        name: "ft_metadata",
        doc: " Returns the metadata of the veNEAR fungible token.",
        kind: AbiFunctionKind.View,
        result: {
          serialization_type: AbiSerializationType.Json,
          type_schema: true,
        },
      },
      {
        name: "ft_total_supply",
        doc: " Returns the total supply of the veNEAR.",
        kind: AbiFunctionKind.View,
        result: {
          serialization_type: AbiSerializationType.Json,
          type_schema: {
            type: "string",
          },
        },
      },
      {
        name: "ft_transfer",
        doc: " Method to match the fungible token interface. Can't be called.",
        kind: AbiFunctionKind.Call,
        modifiers: [AbiFunctionModifier.Payable],
      },
      {
        name: "ft_transfer_call",
        doc: " Method to match the fungible token interface. Can't be called.",
        kind: AbiFunctionKind.Call,
        modifiers: [AbiFunctionModifier.Payable],
      },
      {
        name: "get_account_by_index",
        doc: " Returns the account info for a given index in the Merkle tree.",
        kind: AbiFunctionKind.View,
        params: {
          serialization_type: AbiSerializationType.Json,
          args: [
            {
              name: "index",
              type_schema: {
                type: "integer",
                format: "uint32",
                minimum: 0.0,
              },
            },
          ],
        },
        result: {
          serialization_type: AbiSerializationType.Json,
          type_schema: {
            anyOf: [
              {
                $ref: "#/definitions/AccountInfo",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
      {
        name: "get_account_info",
        doc: " Returns the account info for a given account ID.",
        kind: AbiFunctionKind.View,
        params: {
          serialization_type: AbiSerializationType.Json,
          args: [
            {
              name: "account_id",
              type_schema: {
                $ref: "#/definitions/AccountId",
              },
            },
          ],
        },
        result: {
          serialization_type: AbiSerializationType.Json,
          type_schema: {
            anyOf: [
              {
                $ref: "#/definitions/AccountInfo",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
      {
        name: "get_accounts",
        doc: " Returns a list of account info from the given index based on the merkle tree order.",
        kind: AbiFunctionKind.View,
        params: {
          serialization_type: AbiSerializationType.Json,
          args: [
            {
              name: "from_index",
              type_schema: {
                type: ["integer", "null"],
                format: "uint32",
                minimum: 0.0,
              },
            },
            {
              name: "limit",
              type_schema: {
                type: ["integer", "null"],
                format: "uint32",
                minimum: 0.0,
              },
            },
          ],
        },
        result: {
          serialization_type: AbiSerializationType.Json,
          type_schema: {
            type: "array",
            items: {
              $ref: "#/definitions/AccountInfo",
            },
          },
        },
      },
      {
        name: "get_accounts_raw",
        doc: " Returns a list of raw account data from the given index based on the merkle tree order.",
        kind: AbiFunctionKind.View,
        params: {
          serialization_type: AbiSerializationType.Json,
          args: [
            {
              name: "from_index",
              type_schema: {
                type: ["integer", "null"],
                format: "uint32",
                minimum: 0.0,
              },
            },
            {
              name: "limit",
              type_schema: {
                type: ["integer", "null"],
                format: "uint32",
                minimum: 0.0,
              },
            },
          ],
        },
        result: {
          serialization_type: AbiSerializationType.Json,
          type_schema: {
            type: "array",
            items: {
              $ref: "#/definitions/VAccount",
            },
          },
        },
      },
      {
        name: "get_config",
        doc: " Returns the current contract configuration.",
        kind: AbiFunctionKind.View,
        result: {
          serialization_type: AbiSerializationType.Json,
          type_schema: {
            $ref: "#/definitions/Config",
          },
        },
      },
      {
        name: "get_lockup_account_id",
        doc: " Returns the account ID for the lockup contract for the given account.\n Note, the lockup contract is not guaranteed to be deployed.",
        kind: AbiFunctionKind.View,
        params: {
          serialization_type: AbiSerializationType.Json,
          args: [
            {
              name: "account_id",
              type_schema: {
                $ref: "#/definitions/AccountId",
              },
            },
          ],
        },
        result: {
          serialization_type: AbiSerializationType.Json,
          type_schema: {
            $ref: "#/definitions/AccountId",
          },
        },
      },
      {
        name: "get_lockup_deployment_cost",
        doc: " Returns the minimum required balance to deploy a lockup.",
        kind: AbiFunctionKind.View,
        result: {
          serialization_type: AbiSerializationType.Json,
          type_schema: {
            type: "string",
          },
        },
      },
      {
        name: "get_num_accounts",
        doc: " Returns the number of accounts.",
        kind: AbiFunctionKind.View,
        result: {
          serialization_type: AbiSerializationType.Json,
          type_schema: {
            type: "integer",
            format: "uint32",
            minimum: 0.0,
          },
        },
      },
      {
        name: "get_proof",
        doc: " Returns the proof for the given account and the raw account value.",
        kind: AbiFunctionKind.View,
        params: {
          serialization_type: AbiSerializationType.Json,
          args: [
            {
              name: "account_id",
              type_schema: {
                $ref: "#/definitions/AccountId",
              },
            },
          ],
        },
        result: {
          serialization_type: AbiSerializationType.Json,
          type_schema: {
            type: "array",
            items: [
              {
                $ref: "#/definitions/MerkleProof",
              },
              {
                $ref: "#/definitions/VAccount",
              },
            ],
            maxItems: 2,
            minItems: 2,
          },
        },
      },
      {
        name: "get_snapshot",
        doc: " Returns the current snapshot of the Merkle tree and the global state.",
        kind: AbiFunctionKind.View,
        result: {
          serialization_type: AbiSerializationType.Json,
          type_schema: {
            type: "array",
            items: [
              {
                $ref: "#/definitions/MerkleTreeSnapshot",
              },
              {
                $ref: "#/definitions/VGlobalState",
              },
            ],
            maxItems: 2,
            minItems: 2,
          },
        },
      },
      {
        name: "get_version",
        doc: " Returns the version of the contract from the Cargo.toml.",
        kind: AbiFunctionKind.View,
        result: {
          serialization_type: AbiSerializationType.Json,
          type_schema: {
            type: "string",
          },
        },
      },
      {
        name: "migrate_state",
        doc: " Private method to migrate the contract state during the contract upgrade.",
        kind: AbiFunctionKind.Call,
        modifiers: [AbiFunctionModifier.Init],
      },
      {
        name: "new",
        doc: " Initializes the contract with the given configuration.",
        kind: AbiFunctionKind.Call,
        modifiers: [AbiFunctionModifier.Init],
        params: {
          serialization_type: AbiSerializationType.Json,
          args: [
            {
              name: "config",
              type_schema: {
                $ref: "#/definitions/Config",
              },
            },
            {
              name: "venear_growth_config",
              type_schema: {
                $ref: "#/definitions/VenearGrowthConfigFixedRate",
              },
            },
          ],
        },
      },
      {
        name: "on_lockup_deployed",
        doc: " Callback after the attempt to deploy the lockup contract.\n Returns the lockup contract account ID if the deployment was successful.",
        kind: AbiFunctionKind.Call,
        modifiers: [AbiFunctionModifier.Private],
        params: {
          serialization_type: AbiSerializationType.Json,
          args: [
            {
              name: "version",
              type_schema: {
                type: "integer",
                format: "uint64",
                minimum: 0.0,
              },
            },
            {
              name: "account_id",
              type_schema: {
                $ref: "#/definitions/AccountId",
              },
            },
            {
              name: "lockup_update_nonce",
              type_schema: {
                type: "string",
              },
            },
            {
              name: "lockup_deposit",
              type_schema: {
                type: "string",
              },
            },
          ],
        },
        result: {
          serialization_type: AbiSerializationType.Json,
          type_schema: {
            anyOf: [
              {
                $ref: "#/definitions/AccountId",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
      {
        name: "on_lockup_update",
        doc: " Called by one of the lockup contracts to update the amount of NEAR locked in the lockup\n contract.",
        kind: AbiFunctionKind.Call,
        params: {
          serialization_type: AbiSerializationType.Json,
          args: [
            {
              name: "version",
              type_schema: {
                type: "integer",
                format: "uint64",
                minimum: 0.0,
              },
            },
            {
              name: "owner_account_id",
              type_schema: {
                $ref: "#/definitions/AccountId",
              },
            },
            {
              name: "update",
              type_schema: {
                $ref: "#/definitions/VLockupUpdate",
              },
            },
          ],
        },
      },
      {
        name: "set_local_deposit",
        doc: " Sets the amount in NEAR required for local storage in veNEAR contract.\n Can only be called by the owner.\n Requires 1 yocto NEAR.",
        kind: AbiFunctionKind.Call,
        modifiers: [AbiFunctionModifier.Payable],
        params: {
          serialization_type: AbiSerializationType.Json,
          args: [
            {
              name: "local_deposit",
              type_schema: {
                type: "string",
              },
            },
          ],
        },
      },
      {
        name: "set_lockup_code_deployers",
        doc: " Sets the list of account IDs that can store new lockup contract code.\n Can only be called by the owner.\n Requires 1 yocto NEAR.",
        kind: AbiFunctionKind.Call,
        modifiers: [AbiFunctionModifier.Payable],
        params: {
          serialization_type: AbiSerializationType.Json,
          args: [
            {
              name: "lockup_code_deployers",
              type_schema: {
                type: "array",
                items: {
                  $ref: "#/definitions/AccountId",
                },
              },
            },
          ],
        },
      },
      {
        name: "set_lockup_contract",
        doc: " Updates the active lockup contract to the given contract hash and sets the minimum lockup\n deposit.\n Can only be called by the owner.\n Requires 1 yocto NEAR.",
        kind: AbiFunctionKind.Call,
        modifiers: [AbiFunctionModifier.Payable],
        params: {
          serialization_type: AbiSerializationType.Json,
          args: [
            {
              name: "contract_hash",
              type_schema: {
                type: "string",
              },
            },
            {
              name: "min_lockup_deposit",
              type_schema: {
                type: "string",
              },
            },
          ],
        },
      },
      {
        name: "set_owner_account_id",
        doc: " Sets the owner account ID.\n Can only be called by the owner.\n Requires 1 yocto NEAR.",
        kind: AbiFunctionKind.Call,
        modifiers: [AbiFunctionModifier.Payable],
        params: {
          serialization_type: AbiSerializationType.Json,
          args: [
            {
              name: "owner_account_id",
              type_schema: {
                $ref: "#/definitions/AccountId",
              },
            },
          ],
        },
      },
      {
        name: "set_staking_pool_whitelist_account_id",
        doc: " Sets the account ID of the staking pool whitelist for lockup contract.\n Can only be called by the owner.\n Requires 1 yocto NEAR.",
        kind: AbiFunctionKind.Call,
        modifiers: [AbiFunctionModifier.Payable],
        params: {
          serialization_type: AbiSerializationType.Json,
          args: [
            {
              name: "staking_pool_whitelist_account_id",
              type_schema: {
                $ref: "#/definitions/AccountId",
              },
            },
          ],
        },
      },
      {
        name: "set_unlock_duration_sec",
        doc: " Sets the unlock duration in seconds.\n Note, this method will only affect new lockups.\n Can only be called by the owner.\n Requires 1 yocto NEAR.",
        kind: AbiFunctionKind.Call,
        modifiers: [AbiFunctionModifier.Payable],
        params: {
          serialization_type: AbiSerializationType.Json,
          args: [
            {
              name: "unlock_duration_sec",
              type_schema: {
                type: "integer",
                format: "uint32",
                minimum: 0.0,
              },
            },
          ],
        },
      },
      {
        name: "storage_balance_bounds",
        doc: " Returns the minimum required balance to register an account.",
        kind: AbiFunctionKind.View,
        result: {
          serialization_type: AbiSerializationType.Json,
          type_schema: {
            $ref: "#/definitions/StorageBalanceBounds",
          },
        },
      },
      {
        name: "storage_balance_of",
        doc: " Returns the storage balance of the given account.",
        kind: AbiFunctionKind.View,
        params: {
          serialization_type: AbiSerializationType.Json,
          args: [
            {
              name: "account_id",
              type_schema: {
                $ref: "#/definitions/AccountId",
              },
            },
          ],
        },
        result: {
          serialization_type: AbiSerializationType.Json,
          type_schema: {
            anyOf: [
              {
                $ref: "#/definitions/StorageBalance",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
      {
        name: "storage_deposit",
        doc: " Registers a new account. If the account is already registered, it refunds the attached\n deposit.\n Requires a deposit of at least `storage_balance_bounds().min`.",
        kind: AbiFunctionKind.Call,
        modifiers: [AbiFunctionModifier.Payable],
        params: {
          serialization_type: AbiSerializationType.Json,
          args: [
            {
              name: "account_id",
              type_schema: {
                anyOf: [
                  {
                    $ref: "#/definitions/AccountId",
                  },
                  {
                    type: "null",
                  },
                ],
              },
            },
          ],
        },
        result: {
          serialization_type: AbiSerializationType.Json,
          type_schema: {
            $ref: "#/definitions/StorageBalance",
          },
        },
      },
      {
        name: "storage_withdraw",
        doc: " Method to match the interface of the storage deposit. Fails with a panic.",
        kind: AbiFunctionKind.Call,
        modifiers: [AbiFunctionModifier.Payable],
      },
      {
        name: "undelegate",
        doc: " Undelegate all veNEAR tokens.\n Requires 1 yocto NEAR.",
        kind: AbiFunctionKind.Call,
        modifiers: [AbiFunctionModifier.Payable],
      },
    ],
    root_schema: {
      $schema: "http://json-schema.org/draft-07/schema#",
      title: "String",
      type: "string",
      definitions: {
        Account: {
          description:
            "The account details that are stored in the Merkle Tree.",
          type: "object",
          required: [
            "account_id",
            "balance",
            "delegated_balance",
            "update_timestamp",
          ],
          properties: {
            account_id: {
              description:
                "The account ID of the account. Required for the security of the Merkle Tree proofs.",
              allOf: [
                {
                  $ref: "#/definitions/AccountId",
                },
              ],
            },
            balance: {
              description:
                "The total NEAR balance of the account as reported by the lockup contract and additional veNEAR accumulated over time.",
              allOf: [
                {
                  $ref: "#/definitions/VenearBalance",
                },
              ],
            },
            delegated_balance: {
              description:
                "The total amount of NEAR and veNEAR that was delegated to this account.",
              allOf: [
                {
                  $ref: "#/definitions/VenearBalance",
                },
              ],
            },
            delegation: {
              description:
                "The delegation details, in case this account has delegated balance to another account.",
              anyOf: [
                {
                  $ref: "#/definitions/AccountDelegation",
                },
                {
                  type: "null",
                },
              ],
            },
            update_timestamp: {
              description:
                "The timestamp in nanoseconds when the account was last updated.",
              type: "string",
            },
          },
        },
        AccountDelegation: {
          description:
            "The details of the delegation of veNEAR from one account to another. In the first version we assume that the whole balance was delegated.",
          type: "object",
          required: ["account_id"],
          properties: {
            account_id: {
              description:
                "The account ID of the account that the veNEAR was delegated to.",
              allOf: [
                {
                  $ref: "#/definitions/AccountId",
                },
              ],
            },
          },
        },
        AccountId: {
          description:
            'NEAR Account Identifier.\n\nThis is a unique, syntactically valid, human-readable account identifier on the NEAR network.\n\n[See the crate-level docs for information about validation.](index.html#account-id-rules)\n\nAlso see [Error kind precedence](AccountId#error-kind-precedence).\n\n## Examples\n\n``` use near_account_id::AccountId;\n\nlet alice: AccountId = "alice.near".parse().unwrap();\n\nassert!("ƒelicia.near".parse::<AccountId>().is_err()); // (ƒ is not f) ```',
          type: "string",
        },
        AccountInfo: {
          description: "Full information about the account",
          type: "object",
          required: ["account", "internal"],
          properties: {
            account: {
              description: "Current account value from the Merkle tree.",
              allOf: [
                {
                  $ref: "#/definitions/Account",
                },
              ],
            },
            internal: {
              description: "Internal account information.",
              allOf: [
                {
                  $ref: "#/definitions/AccountInternal",
                },
              ],
            },
          },
        },
        AccountInternal: {
          description: "Internal account information from veNEAR contract.",
          type: "object",
          required: ["deposit", "lockup_update_nonce"],
          properties: {
            deposit: {
              description:
                "The amount of NEAR tokens that are retained for the storage of the account.",
              type: "string",
            },
            lockup_update_nonce: {
              description: "The nonce of the last lockup update.",
              type: "string",
            },
            lockup_version: {
              description:
                "The version of the lockup contract deployed. None means the lockup is not deployed.",
              type: ["integer", "null"],
              format: "uint64",
              minimum: 0.0,
            },
          },
        },
        Config: {
          type: "object",
          required: [
            "local_deposit",
            "lockup_code_deployers",
            "min_lockup_deposit",
            "owner_account_id",
            "staking_pool_whitelist_account_id",
            "unlock_duration_ns",
          ],
          properties: {
            local_deposit: {
              description:
                "The amount in NEAR required for local storage in veNEAR contract.",
              type: "string",
            },
            lockup_code_deployers: {
              description:
                "The list of account IDs that can store new lockup contract code.",
              type: "array",
              items: {
                $ref: "#/definitions/AccountId",
              },
            },
            lockup_contract_config: {
              description:
                "The configuration of the current lockup contract code.",
              anyOf: [
                {
                  $ref: "#/definitions/LockupContractConfig",
                },
                {
                  type: "null",
                },
              ],
            },
            min_lockup_deposit: {
              description:
                "The minimum amount in NEAR required for lockup deployment.",
              type: "string",
            },
            owner_account_id: {
              description:
                "The account ID that can upgrade the current contract and modify the config.",
              allOf: [
                {
                  $ref: "#/definitions/AccountId",
                },
              ],
            },
            staking_pool_whitelist_account_id: {
              description:
                "The account ID of the staking pool whitelist for lockup contract.",
              allOf: [
                {
                  $ref: "#/definitions/AccountId",
                },
              ],
            },
            unlock_duration_ns: {
              description: "Initialization arguments for the lockup contract.",
              type: "string",
            },
          },
        },
        Fraction: {
          type: "object",
          required: ["denominator", "numerator"],
          properties: {
            denominator: {
              type: "string",
            },
            numerator: {
              type: "string",
            },
          },
        },
        GlobalState: {
          description:
            "The global state of the veNEAR contract and the merkle tree.",
          type: "object",
          required: [
            "total_venear_balance",
            "update_timestamp",
            "venear_growth_config",
          ],
          properties: {
            total_venear_balance: {
              $ref: "#/definitions/VenearBalance",
            },
            update_timestamp: {
              type: "string",
            },
            venear_growth_config: {
              $ref: "#/definitions/VenearGrowthConfig",
            },
          },
        },
        LockupContractConfig: {
          type: "object",
          required: ["contract_hash", "contract_size", "contract_version"],
          properties: {
            contract_hash: {
              type: "string",
            },
            contract_size: {
              type: "integer",
              format: "uint32",
              minimum: 0.0,
            },
            contract_version: {
              type: "integer",
              format: "uint64",
              minimum: 0.0,
            },
          },
        },
        LockupUpdateV1: {
          description:
            "The lockup update is the information passed from the lockup contract to update veNEAR balances. It includes the total amount of NEAR that is locked in the lockup contract and the list of fungible tokens that are locked in the lockup contract.",
          type: "object",
          required: ["locked_near_balance", "lockup_update_nonce", "timestamp"],
          properties: {
            locked_near_balance: {
              description:
                "The amount of NEAR that is locked in the lockup contract.",
              type: "string",
            },
            lockup_update_nonce: {
              description:
                "The nonce of the lockup update. It should be incremented for every new update by the lockup contract.",
              type: "string",
            },
            timestamp: {
              description:
                "The timestamp in nanoseconds when the update was created.",
              type: "string",
            },
          },
        },
        MerkleProof: {
          description: "A proof of inclusion in the Merkle tree.",
          type: "object",
          required: ["index", "path"],
          properties: {
            index: {
              description: "The index of the leaf in the tree.",
              type: "integer",
              format: "uint32",
              minimum: 0.0,
            },
            path: {
              description:
                "The corresponding hashes of the siblings in the tree on the path to the root.",
              type: "array",
              items: {
                type: "string",
              },
            },
          },
        },
        MerkleTreeSnapshot: {
          description: "A snapshot of the Merkle tree.",
          type: "object",
          required: ["block_height", "length", "root"],
          properties: {
            block_height: {
              description: "The block height when the snapshot was taken.",
              type: "integer",
              format: "uint64",
              minimum: 0.0,
            },
            length: {
              description: "The length of the tree.",
              type: "integer",
              format: "uint32",
              minimum: 0.0,
            },
            root: {
              description: "The root hash of the tree.",
              type: "string",
            },
          },
        },
        StorageBalance: {
          type: "object",
          required: ["available", "total"],
          properties: {
            available: {
              type: "string",
            },
            total: {
              type: "string",
            },
          },
        },
        StorageBalanceBounds: {
          type: "object",
          required: ["min"],
          properties: {
            max: {
              type: ["string", "null"],
            },
            min: {
              type: "string",
            },
          },
        },
        VAccount: {
          oneOf: [
            {
              type: "object",
              required: ["V0"],
              properties: {
                V0: {
                  $ref: "#/definitions/Account",
                },
              },
              additionalProperties: false,
            },
          ],
        },
        VGlobalState: {
          oneOf: [
            {
              type: "object",
              required: ["V0"],
              properties: {
                V0: {
                  $ref: "#/definitions/GlobalState",
                },
              },
              additionalProperties: false,
            },
          ],
        },
        VLockupUpdate: {
          oneOf: [
            {
              type: "object",
              required: ["V1"],
              properties: {
                V1: {
                  $ref: "#/definitions/LockupUpdateV1",
                },
              },
              additionalProperties: false,
            },
          ],
        },
        VenearBalance: {
          description:
            "Represents balance of NEAR and veNEAR tokens. NEAR tokens grow over time, while veNEAR tokens do not.",
          type: "object",
          required: ["extra_venear_balance", "near_balance"],
          properties: {
            extra_venear_balance: {
              description:
                "The balance in veNEAR tokens. This balance doesn't grow over time.",
              type: "string",
            },
            near_balance: {
              description:
                "The balance in NEAR tokens. This balance grows over time.",
              type: "string",
            },
          },
        },
        VenearGrowthConfig: {
          oneOf: [
            {
              type: "object",
              required: ["FixedRate"],
              properties: {
                FixedRate: {
                  $ref: "#/definitions/VenearGrowthConfigFixedRate",
                },
              },
              additionalProperties: false,
            },
          ],
        },
        VenearGrowthConfigFixedRate: {
          description:
            "The fixed annual growth rate of veNEAR tokens. Note, the growth rate can be changed in the future through the upgrade mechanism, by introducing timepoints when the growth rate changes.",
          type: "object",
          required: ["annual_growth_rate_ns"],
          properties: {
            annual_growth_rate_ns: {
              description:
                "The growth rate of veNEAR tokens per nanosecond. E.g. 6 / (100 * NUM_SEC_IN_YEAR * 10**9) means 6% annual growth rate.",
              allOf: [
                {
                  $ref: "#/definitions/Fraction",
                },
              ],
            },
          },
        },
      },
    },
  },
};
