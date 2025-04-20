export const LOCKUP_ABI = {
  schema_version: "0.4.0",
  metadata: {
    name: "lockup-contract",
    version: "0.0.1",
    authors: ["Fastnear Inc <hello@fastnear.com>"],
  },
  body: {
    functions: [
      {
        name: "begin_unlock_near",
        doc: " OWNER'S METHOD\n\n Requires 1 yoctoNEAR attached\n\n Starts the unlocking process of the in the lockup contract.\n You specify the amount of near to unlock, or if you don't specify it, all the locked NEAR\n will be unlocked.\n (works similarly to unstaking from a staking pool).",
        kind: "call",
        modifiers: ["payable"],
        params: {
          serialization_type: "json",
          args: [
            {
              name: "amount",
              type_schema: {
                type: ["string", "null"],
              },
            },
          ],
        },
      },
      {
        name: "contract_source_metadata",
        kind: "view",
      },
      {
        name: "delete_lockup",
        doc: " OWNER'S METHOD\n\n Requires 1 yoctoNEAR attached\n Requires no locked balances or staking pool deposits.\n\n Removes the lockup contract and transfers all NEAR to the initial owner.",
        kind: "call",
        modifiers: ["payable"],
        result: {
          serialization_type: "json",
          type_schema: {
            $ref: "#/definitions/Promise",
          },
        },
      },
      {
        name: "deposit_and_stake",
        doc: " OWNER'S METHOD\n\n Requires 125 TGas (5 * BASE_GAS)\n Requires 1 yoctoNEAR attached\n\n Deposits and stakes the given extra amount to the selected staking pool",
        kind: "call",
        modifiers: ["payable"],
        params: {
          serialization_type: "json",
          args: [
            {
              name: "amount",
              type_schema: {
                type: "string",
              },
            },
          ],
        },
        result: {
          serialization_type: "json",
          type_schema: {
            $ref: "#/definitions/Promise",
          },
        },
      },
      {
        name: "deposit_to_staking_pool",
        doc: " OWNER'S METHOD\n\n Requires 100 TGas (4 * BASE_GAS)\n Requires 1 yoctoNEAR attached\n\n Deposits the given extra amount to the staking pool",
        kind: "call",
        modifiers: ["payable"],
        params: {
          serialization_type: "json",
          args: [
            {
              name: "amount",
              type_schema: {
                type: "string",
              },
            },
          ],
        },
        result: {
          serialization_type: "json",
          type_schema: {
            $ref: "#/definitions/Promise",
          },
        },
      },
      {
        name: "end_unlock_near",
        doc: " OWNER'S METHOD\n\n Requires 1 yoctoNEAR attached\n Requires that the unlock timestamp is reached\n\n Finishes the unlocking process of the NEAR in the lockup contract.\n You can specify the amount of NEAR to unlock, or if you don't specify it, all the pending\n NEAR will be unlocked.",
        kind: "call",
        modifiers: ["payable"],
        params: {
          serialization_type: "json",
          args: [
            {
              name: "amount",
              type_schema: {
                type: ["string", "null"],
              },
            },
          ],
        },
      },
      {
        name: "get_balance",
        doc: " Returns total balance of the account including tokens deposited to the staking pool.",
        kind: "view",
        result: {
          serialization_type: "json",
          type_schema: {
            type: "string",
          },
        },
      },
      {
        name: "get_known_deposited_balance",
        doc: " Returns the amount of tokens that were deposited to the staking pool.\n NOTE: The actual balance can be larger than this known deposit balance due to staking\n rewards acquired on the staking pool.\n To refresh the amount the owner can call `refresh_staking_pool_balance`.",
        kind: "view",
        result: {
          serialization_type: "json",
          type_schema: {
            type: "string",
          },
        },
      },
      {
        name: "get_liquid_owners_balance",
        doc: " Returns the amount of tokens the owner can transfer from the account.\n Transfers have to be enabled.",
        kind: "view",
        result: {
          serialization_type: "json",
          type_schema: {
            type: "string",
          },
        },
      },
      {
        name: "get_lockup_update_nonce",
        doc: " Returns the nonce of the lockup update",
        kind: "view",
        result: {
          serialization_type: "json",
          type_schema: {
            type: "string",
          },
        },
      },
      {
        name: "get_owner_account_id",
        doc: " Returns the account ID of the owner.",
        kind: "view",
        result: {
          serialization_type: "json",
          type_schema: {
            $ref: "#/definitions/AccountId",
          },
        },
      },
      {
        name: "get_owners_balance",
        doc: " Returns the balance of the account owner. It includes vested and extra tokens that\n may have been deposited to this account.\n NOTE: Some of this tokens may be deposited to the staking pool.",
        kind: "view",
        result: {
          serialization_type: "json",
          type_schema: {
            type: "string",
          },
        },
      },
      {
        name: "get_staking_pool_account_id",
        doc: " Returns the account ID of the selected staking pool.",
        kind: "view",
        result: {
          serialization_type: "json",
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
        name: "get_venear_liquid_balance",
        doc: " Returns the amount of NEAR that is liquid (the NEAR that can be locked)",
        kind: "view",
        result: {
          serialization_type: "json",
          type_schema: {
            type: "string",
          },
        },
      },
      {
        name: "get_venear_locked_balance",
        doc: " Returns the amount of NEAR locked in the lockup contract",
        kind: "view",
        result: {
          serialization_type: "json",
          type_schema: {
            type: "string",
          },
        },
      },
      {
        name: "get_venear_pending_balance",
        doc: " Returns the amount of NEAR that is pending to be unlocked",
        kind: "view",
        result: {
          serialization_type: "json",
          type_schema: {
            type: "string",
          },
        },
      },
      {
        name: "get_venear_unlock_timestamp",
        doc: " Returns the timestamp in nanoseconds when the pending amount will be unlocked",
        kind: "view",
        result: {
          serialization_type: "json",
          type_schema: {
            type: "string",
          },
        },
      },
      {
        name: "get_version",
        doc: " Returns the version of the Lockup contract.",
        kind: "view",
        result: {
          serialization_type: "json",
          type_schema: {
            type: "integer",
            format: "uint64",
            minimum: 0.0,
          },
        },
      },
      {
        name: "lock_near",
        doc: " OWNER'S METHOD\n\n Requires 1 yoctoNEAR attached\n\n Locks the NEAR in the lockup contract.\n You can specify the amount of NEAR to lock, or if you don't specify it, all the liquid NEAR\n will be locked.",
        kind: "call",
        modifiers: ["payable"],
        params: {
          serialization_type: "json",
          args: [
            {
              name: "amount",
              type_schema: {
                type: ["string", "null"],
              },
            },
          ],
        },
      },
      {
        name: "lock_pending_near",
        doc: " OWNER'S METHOD\n\n Requires 1 yoctoNEAR attached\n\n Locks the pending NEAR in the lockup contract.\n You can specify the amount of NEAR to lock, or if you don't specify it, all the pending NEAR\n will be locked.",
        kind: "call",
        modifiers: ["payable"],
        params: {
          serialization_type: "json",
          args: [
            {
              name: "amount",
              type_schema: {
                type: ["string", "null"],
              },
            },
          ],
        },
      },
      {
        name: "new",
        doc: " Requires 25 TGas (1 * BASE_GAS)\n\n Initializes lockup contract.\n - `owner_account_id` - the account ID of the owner. Only this account can call owner's\n    methods on this contract.\n - `venear_account_id` - the account ID of the VeNEAR contract.\n - `unlock_duration_ns` - The time in nanoseconds for unlocking the lockup amount.\n - `staking_pool_whitelist_account_id` - the Account ID of the staking pool whitelist contract.\n    The version of the contract. It is a monotonically increasing number.\n - `version` - Version of the lockup contract will be tracked by the veNEAR contract.\n - `lockup_update_nonce` - The nonce of the lockup update. It should be incremented for every\n   new update by the lockup contract.\n - `min_lockup_deposit` - The minimum amount in NEAR required for lockup deployment.",
        kind: "call",
        modifiers: ["init", "payable"],
        params: {
          serialization_type: "json",
          args: [
            {
              name: "owner_account_id",
              type_schema: {
                $ref: "#/definitions/AccountId",
              },
            },
            {
              name: "venear_account_id",
              type_schema: {
                $ref: "#/definitions/AccountId",
              },
            },
            {
              name: "unlock_duration_ns",
              type_schema: {
                type: "string",
              },
            },
            {
              name: "staking_pool_whitelist_account_id",
              type_schema: {
                $ref: "#/definitions/AccountId",
              },
            },
            {
              name: "version",
              type_schema: {
                type: "integer",
                format: "uint64",
                minimum: 0.0,
              },
            },
            {
              name: "lockup_update_nonce",
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
        name: "on_get_account_total_balance",
        doc: " Called after the request to get the current total balance from the staking pool.",
        kind: "call",
        modifiers: ["private"],
        callbacks: [
          {
            serialization_type: "json",
            type_schema: {
              type: "string",
            },
          },
        ],
      },
      {
        name: "on_get_account_unstaked_balance_to_withdraw_by_owner",
        doc: " Called after the request to get the current unstaked balance to withdraw everything by th\n owner.",
        kind: "call",
        modifiers: ["private"],
        callbacks: [
          {
            serialization_type: "json",
            type_schema: {
              type: "string",
            },
          },
        ],
        result: {
          serialization_type: "json",
          type_schema: {
            $ref: "#/definitions/PromiseOrValueBoolean",
          },
        },
      },
      {
        name: "on_staking_pool_deposit",
        doc: " Called after a deposit amount was transferred out of this account to the staking pool.\n This method needs to update staking pool status.",
        kind: "call",
        modifiers: ["private"],
        params: {
          serialization_type: "json",
          args: [
            {
              name: "amount",
              type_schema: {
                type: "string",
              },
            },
          ],
        },
        result: {
          serialization_type: "json",
          type_schema: {
            type: "boolean",
          },
        },
      },
      {
        name: "on_staking_pool_deposit_and_stake",
        doc: " Called after a deposit amount was transferred out of this account to the staking pool and it\n was staked on the staking pool.\n This method needs to update staking pool status.",
        kind: "call",
        modifiers: ["private"],
        params: {
          serialization_type: "json",
          args: [
            {
              name: "amount",
              type_schema: {
                type: "string",
              },
            },
          ],
        },
        result: {
          serialization_type: "json",
          type_schema: {
            type: "boolean",
          },
        },
      },
      {
        name: "on_staking_pool_stake",
        doc: " Called after the extra amount stake was staked in the staking pool contract.\n This method needs to update staking pool status.",
        kind: "call",
        modifiers: ["private"],
        params: {
          serialization_type: "json",
          args: [
            {
              name: "amount",
              type_schema: {
                type: "string",
              },
            },
          ],
        },
        result: {
          serialization_type: "json",
          type_schema: {
            type: "boolean",
          },
        },
      },
      {
        name: "on_staking_pool_unstake",
        doc: " Called after the given amount was unstaked at the staking pool contract.\n This method needs to update staking pool status.",
        kind: "call",
        modifiers: ["private"],
        params: {
          serialization_type: "json",
          args: [
            {
              name: "amount",
              type_schema: {
                type: "string",
              },
            },
          ],
        },
        result: {
          serialization_type: "json",
          type_schema: {
            type: "boolean",
          },
        },
      },
      {
        name: "on_staking_pool_unstake_all",
        doc: " Called after all tokens were unstaked at the staking pool contract\n This method needs to update staking pool status.",
        kind: "call",
        modifiers: ["private"],
        result: {
          serialization_type: "json",
          type_schema: {
            type: "boolean",
          },
        },
      },
      {
        name: "on_staking_pool_withdraw",
        doc: " Called after the given amount was requested to transfer out from the staking pool to this\n account.\n This method needs to update staking pool status.",
        kind: "call",
        modifiers: ["private"],
        params: {
          serialization_type: "json",
          args: [
            {
              name: "amount",
              type_schema: {
                type: "string",
              },
            },
          ],
        },
        result: {
          serialization_type: "json",
          type_schema: {
            type: "boolean",
          },
        },
      },
      {
        name: "on_whitelist_is_whitelisted",
        doc: " Called after a given `staking_pool_account_id` was checked in the whitelist.",
        kind: "call",
        modifiers: ["private"],
        params: {
          serialization_type: "json",
          args: [
            {
              name: "staking_pool_account_id",
              type_schema: {
                $ref: "#/definitions/AccountId",
              },
            },
          ],
        },
        callbacks: [
          {
            serialization_type: "json",
            type_schema: {
              type: "boolean",
            },
          },
        ],
        result: {
          serialization_type: "json",
          type_schema: {
            type: "boolean",
          },
        },
      },
      {
        name: "refresh_staking_pool_balance",
        doc: " OWNER'S METHOD\n\n Requires 75 TGas (3 * BASE_GAS)\n Requires 1 yoctoNEAR attached\n\n Retrieves total balance from the staking pool and remembers it internally.\n This method is helpful when the owner received some rewards for staking and wants to\n transfer them back to this account for withdrawal. In order to know the actual liquid\n balance on the account, this contract needs to query the staking pool.",
        kind: "call",
        modifiers: ["payable"],
        result: {
          serialization_type: "json",
          type_schema: {
            $ref: "#/definitions/Promise",
          },
        },
      },
      {
        name: "select_staking_pool",
        doc: " OWNER'S METHOD\n\n Requires 75 TGas (3 * BASE_GAS)\n Requires 1 yoctoNEAR attached\n\n Selects staking pool contract at the given account ID. The staking pool first has to be\n checked against the staking pool whitelist contract.",
        kind: "call",
        modifiers: ["payable"],
        params: {
          serialization_type: "json",
          args: [
            {
              name: "staking_pool_account_id",
              type_schema: {
                $ref: "#/definitions/AccountId",
              },
            },
          ],
        },
        result: {
          serialization_type: "json",
          type_schema: {
            $ref: "#/definitions/Promise",
          },
        },
      },
      {
        name: "stake",
        doc: " OWNER'S METHOD\n\n Requires 125 TGas (5 * BASE_GAS)\n Requires 1 yoctoNEAR attached\n\n Stakes the given extra amount at the staking pool",
        kind: "call",
        modifiers: ["payable"],
        params: {
          serialization_type: "json",
          args: [
            {
              name: "amount",
              type_schema: {
                type: "string",
              },
            },
          ],
        },
        result: {
          serialization_type: "json",
          type_schema: {
            $ref: "#/definitions/Promise",
          },
        },
      },
      {
        name: "transfer",
        doc: " OWNER'S METHOD\n\n Requires 50 TGas (2 * BASE_GAS)\n Requires 1 yoctoNEAR attached\n\n Transfers the given amount to the given receiver account ID.\n This requires transfers to be enabled within the voting contract.",
        kind: "call",
        modifiers: ["payable"],
        params: {
          serialization_type: "json",
          args: [
            {
              name: "amount",
              type_schema: {
                type: "string",
              },
            },
            {
              name: "receiver_id",
              type_schema: {
                $ref: "#/definitions/AccountId",
              },
            },
          ],
        },
        result: {
          serialization_type: "json",
          type_schema: {
            $ref: "#/definitions/Promise",
          },
        },
      },
      {
        name: "unselect_staking_pool",
        doc: " OWNER'S METHOD\n\n Requires 25 TGas (1 * BASE_GAS)\n Requires 1 yoctoNEAR attached\n\n Unselects the current staking pool.\n It requires that there are no known deposits left on the currently selected staking pool.",
        kind: "call",
        modifiers: ["payable"],
      },
      {
        name: "unstake",
        doc: " OWNER'S METHOD\n\n Requires 125 TGas (5 * BASE_GAS)\n Requires 1 yoctoNEAR attached\n\n Unstakes the given amount at the staking pool",
        kind: "call",
        modifiers: ["payable"],
        params: {
          serialization_type: "json",
          args: [
            {
              name: "amount",
              type_schema: {
                type: "string",
              },
            },
          ],
        },
        result: {
          serialization_type: "json",
          type_schema: {
            $ref: "#/definitions/Promise",
          },
        },
      },
      {
        name: "unstake_all",
        doc: " OWNER'S METHOD\n\n Requires 125 TGas (5 * BASE_GAS)\n Requires 1 yoctoNEAR attached\n\n Unstakes all tokens from the staking pool",
        kind: "call",
        modifiers: ["payable"],
        result: {
          serialization_type: "json",
          type_schema: {
            $ref: "#/definitions/Promise",
          },
        },
      },
      {
        name: "withdraw_all_from_staking_pool",
        doc: " OWNER'S METHOD\n\n Requires 175 TGas (7 * BASE_GAS)\n Requires 1 yoctoNEAR attached\n\n Tries to withdraws all unstaked balance from the staking pool",
        kind: "call",
        modifiers: ["payable"],
        result: {
          serialization_type: "json",
          type_schema: {
            $ref: "#/definitions/Promise",
          },
        },
      },
      {
        name: "withdraw_from_staking_pool",
        doc: " OWNER'S METHOD\n\n Requires 125 TGas (5 * BASE_GAS)\n Requires 1 yoctoNEAR attached\n\n Withdraws the given amount from the staking pool",
        kind: "call",
        modifiers: ["payable"],
        params: {
          serialization_type: "json",
          args: [
            {
              name: "amount",
              type_schema: {
                type: "string",
              },
            },
          ],
        },
        result: {
          serialization_type: "json",
          type_schema: {
            $ref: "#/definitions/Promise",
          },
        },
      },
    ],
    root_schema: {
      $schema: "http://json-schema.org/draft-07/schema#",
      title: "String",
      type: "string",
      definitions: {
        AccountId: {
          description:
            'NEAR Account Identifier.\n\nThis is a unique, syntactically valid, human-readable account identifier on the NEAR network.\n\n[See the crate-level docs for information about validation.](index.html#account-id-rules)\n\nAlso see [Error kind precedence](AccountId#error-kind-precedence).\n\n## Examples\n\n``` use near_account_id::AccountId;\n\nlet alice: AccountId = "alice.near".parse().unwrap();\n\nassert!("ƒelicia.near".parse::<AccountId>().is_err()); // (ƒ is not f) ```',
          type: "string",
        },
        Promise: true,
        PromiseOrValueBoolean: {
          type: "boolean",
        },
      },
    },
  },
};
