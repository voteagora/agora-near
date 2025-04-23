export const VOTING_CONTRACT_ABI = {
  schema_version: "0.4.0",
  metadata: {
    name: "voting-contract",
    version: "0.0.1",
    authors: ["Fastnear Inc <hello@fastnear.com>"],
    build: {
      compiler: "rustc 1.86.0",
      builder: "cargo-near cargo-near-build 0.4.6",
    },
    wasm_hash: "HHoyPWdeCX4DqLMWjmPt6Pxe9ANkR4FShkweSRYMZggr",
  },
  body: {
    functions: [
      {
        name: "approve_proposal",
        doc: " Approves the proposal to start the voting process.\n An optional voting start time in seconds can be provided to delay the start of the voting.\n Requires 1 yocto attached to the call.\n Can only be called by the reviewers.",
        kind: "call",
        modifiers: ["payable"],
        params: {
          serialization_type: "json",
          args: [
            {
              name: "proposal_id",
              type_schema: {
                type: "integer",
                format: "uint32",
                minimum: 0.0,
              },
            },
            {
              name: "voting_start_time_sec",
              type_schema: {
                type: ["integer", "null"],
                format: "uint32",
                minimum: 0.0,
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
        name: "contract_source_metadata",
        kind: "view",
      },
      {
        name: "create_proposal",
        doc: " Creates a new proposal with the given metadata.\n The proposal is created by the predecessor account and requires a deposit to cover the\n storage and the base proposal fee.",
        kind: "call",
        modifiers: ["payable"],
        params: {
          serialization_type: "json",
          args: [
            {
              name: "metadata",
              type_schema: {
                $ref: "#/definitions/ProposalMetadata",
              },
            },
          ],
        },
        result: {
          serialization_type: "json",
          type_schema: {
            type: "integer",
            format: "uint32",
            minimum: 0.0,
          },
        },
      },
      {
        name: "get_approved_proposals",
        doc: " Returns a list of approved proposals from the given index based on the approved proposals\n order.",
        kind: "view",
        params: {
          serialization_type: "json",
          args: [
            {
              name: "from_index",
              type_schema: {
                type: "integer",
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
          serialization_type: "json",
          type_schema: {
            type: "array",
            items: {
              $ref: "#/definitions/ProposalInfo",
            },
          },
        },
      },
      {
        name: "get_config",
        doc: " Returns the current contract configuration.",
        kind: "view",
        result: {
          serialization_type: "json",
          type_schema: {
            $ref: "#/definitions/Config",
          },
        },
      },
      {
        name: "get_num_approved_proposals",
        doc: " Returns the number of approved proposals.",
        kind: "view",
        result: {
          serialization_type: "json",
          type_schema: {
            type: "integer",
            format: "uint32",
            minimum: 0.0,
          },
        },
      },
      {
        name: "get_num_proposals",
        doc: " Returns the number of proposals.",
        kind: "view",
        result: {
          serialization_type: "json",
          type_schema: {
            type: "integer",
            format: "uint32",
            minimum: 0.0,
          },
        },
      },
      {
        name: "get_proposal",
        doc: " Returns the proposal information by the given proposal ID.",
        kind: "view",
        params: {
          serialization_type: "json",
          args: [
            {
              name: "proposal_id",
              type_schema: {
                type: "integer",
                format: "uint32",
                minimum: 0.0,
              },
            },
          ],
        },
        result: {
          serialization_type: "json",
          type_schema: {
            anyOf: [
              {
                $ref: "#/definitions/ProposalInfo",
              },
              {
                type: "null",
              },
            ],
          },
        },
      },
      {
        name: "get_proposals",
        doc: " Returns a list of proposals from the given index based on the proposal ID order.",
        kind: "view",
        params: {
          serialization_type: "json",
          args: [
            {
              name: "from_index",
              type_schema: {
                type: "integer",
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
          serialization_type: "json",
          type_schema: {
            type: "array",
            items: {
              $ref: "#/definitions/ProposalInfo",
            },
          },
        },
      },
      {
        name: "get_version",
        doc: " Returns the version of the contract from the Cargo.toml.",
        kind: "view",
        result: {
          serialization_type: "json",
          type_schema: {
            type: "string",
          },
        },
      },
      {
        name: "get_vote",
        doc: " Returns the vote of the given account ID and proposal ID.",
        kind: "view",
        params: {
          serialization_type: "json",
          args: [
            {
              name: "account_id",
              type_schema: {
                $ref: "#/definitions/AccountId",
              },
            },
            {
              name: "proposal_id",
              type_schema: {
                type: "integer",
                format: "uint32",
                minimum: 0.0,
              },
            },
          ],
        },
        result: {
          serialization_type: "json",
          type_schema: {
            type: ["integer", "null"],
            format: "uint8",
            minimum: 0.0,
          },
        },
      },
      {
        name: "migrate_state",
        doc: " Private method to migrate the contract state during the contract upgrade.",
        kind: "call",
        modifiers: ["init"],
      },
      {
        name: "new",
        doc: " Initializes the contract with the given configuration.",
        kind: "call",
        modifiers: ["init"],
        params: {
          serialization_type: "json",
          args: [
            {
              name: "config",
              type_schema: {
                $ref: "#/definitions/Config",
              },
            },
          ],
        },
      },
      {
        name: "on_get_snapshot",
        doc: " A callback after the snapshot is received for approving the proposal.",
        kind: "call",
        modifiers: ["private"],
        params: {
          serialization_type: "json",
          args: [
            {
              name: "reviewer_id",
              type_schema: {
                $ref: "#/definitions/AccountId",
              },
            },
            {
              name: "proposal_id",
              type_schema: {
                type: "integer",
                format: "uint32",
                minimum: 0.0,
              },
            },
            {
              name: "voting_start_time_sec",
              type_schema: {
                type: ["integer", "null"],
                format: "uint32",
                minimum: 0.0,
              },
            },
          ],
        },
        callbacks: [
          {
            serialization_type: "json",
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
        ],
        result: {
          serialization_type: "json",
          type_schema: {
            $ref: "#/definitions/ProposalInfo",
          },
        },
      },
      {
        name: "reject_proposal",
        doc: " Rejects the proposal.\n Requires 1 yocto attached to the call.\n Can only be called by the reviewers.",
        kind: "call",
        modifiers: ["payable"],
        params: {
          serialization_type: "json",
          args: [
            {
              name: "proposal_id",
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
        name: "set_base_proposal_fee",
        doc: " Updates the base fee required to create a proposal.\n Can only be called by the owner.\n Requires 1 yocto NEAR.",
        kind: "call",
        modifiers: ["payable"],
        params: {
          serialization_type: "json",
          args: [
            {
              name: "base_proposal_fee",
              type_schema: {
                type: "string",
              },
            },
          ],
        },
      },
      {
        name: "set_max_number_of_voting_options",
        doc: " Updates the maximum number of voting options per proposal.\n Can only be called by the owner.\n Requires 1 yocto NEAR.",
        kind: "call",
        modifiers: ["payable"],
        params: {
          serialization_type: "json",
          args: [
            {
              name: "max_number_of_voting_options",
              type_schema: {
                type: "integer",
                format: "uint8",
                minimum: 0.0,
              },
            },
          ],
        },
      },
      {
        name: "set_owner_account_id",
        doc: " Sets the account ID that can upgrade the current contract and modify the config.\n Can only be called by the owner.\n Requires 1 yocto NEAR.",
        kind: "call",
        modifiers: ["payable"],
        params: {
          serialization_type: "json",
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
        name: "set_reviewer_ids",
        doc: " Updates the list of account IDs that can review proposals.\n Can only be called by the owner.\n Requires 1 yocto NEAR.",
        kind: "call",
        modifiers: ["payable"],
        params: {
          serialization_type: "json",
          args: [
            {
              name: "reviewer_ids",
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
        name: "set_venear_account_id",
        doc: " Updates the account ID of the veNEAR contract.\n Can only be called by the owner.\n Requires 1 yocto NEAR.",
        kind: "call",
        modifiers: ["payable"],
        params: {
          serialization_type: "json",
          args: [
            {
              name: "venear_account_id",
              type_schema: {
                $ref: "#/definitions/AccountId",
              },
            },
          ],
        },
      },
      {
        name: "set_vote_storage_fee",
        doc: " Updates the storage fee required to store a vote for an active proposal.\n Can only be called by the owner.\n Requires 1 yocto NEAR.\n Will panic if called, because it requires contract upgrade to change the storage fee.",
        kind: "call",
        modifiers: ["payable"],
        params: {
          serialization_type: "json",
          args: [
            {
              name: "_vote_storage_fee",
              type_schema: {
                type: "string",
              },
            },
          ],
        },
      },
      {
        name: "set_voting_duration",
        doc: " Updates the maximum duration of the voting period in seconds.\n Can only be called by the owner.\n Requires 1 yocto NEAR.",
        kind: "call",
        modifiers: ["payable"],
        params: {
          serialization_type: "json",
          args: [
            {
              name: "voting_duration_sec",
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
        name: "vote",
        doc: " Cast a vote for the given proposal and the given voting option.\n The caller has to provide a merkle proof and the account state from the snapshot.\n The caller should match the account ID in the account state.\n Requires a deposit to cover the storage fee or at least 1 yoctoNEAR if changing the vote.",
        kind: "call",
        modifiers: ["payable"],
        params: {
          serialization_type: "json",
          args: [
            {
              name: "proposal_id",
              type_schema: {
                type: "integer",
                format: "uint32",
                minimum: 0.0,
              },
            },
            {
              name: "vote",
              type_schema: {
                type: "integer",
                format: "uint8",
                minimum: 0.0,
              },
            },
            {
              name: "merkle_proof",
              type_schema: {
                $ref: "#/definitions/MerkleProof",
              },
            },
            {
              name: "v_account",
              type_schema: {
                $ref: "#/definitions/VAccount",
              },
            },
          ],
        },
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
        Config: {
          description: "The configuration of the voting contract.",
          type: "object",
          required: [
            "base_proposal_fee",
            "max_number_of_voting_options",
            "owner_account_id",
            "reviewer_ids",
            "venear_account_id",
            "vote_storage_fee",
            "voting_duration_ns",
          ],
          properties: {
            base_proposal_fee: {
              description:
                "The base fee in addition to the storage fee required to create a proposal.",
              type: "string",
            },
            max_number_of_voting_options: {
              description: "The maximum number of voting options per proposal.",
              type: "integer",
              format: "uint8",
              minimum: 0.0,
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
            reviewer_ids: {
              description:
                "The account ID that can approve or reject proposals.",
              type: "array",
              items: {
                $ref: "#/definitions/AccountId",
              },
            },
            venear_account_id: {
              description: "The account ID of the veNEAR contract.",
              allOf: [
                {
                  $ref: "#/definitions/AccountId",
                },
              ],
            },
            vote_storage_fee: {
              description:
                "Storage fee required to store a vote for an active proposal. It can be refunded once the proposal is finalized.",
              type: "string",
            },
            voting_duration_ns: {
              description:
                "The maximum duration of the voting period in nanoseconds.",
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
        Promise: true,
        ProposalInfo: {
          description:
            "The proposal information structure that contains the proposal and its metadata.",
          type: "object",
          required: [
            "creation_time_ns",
            "id",
            "proposer_id",
            "rejected",
            "status",
            "total_votes",
            "votes",
            "voting_duration_ns",
            "voting_options",
          ],
          properties: {
            creation_time_ns: {
              description:
                "The timestamp in nanoseconds when the proposal was created, generated automatically.",
              type: "string",
            },
            description: {
              description: "The description of the proposal.",
              type: ["string", "null"],
            },
            id: {
              description:
                "The unique identifier of the proposal, generated automatically.",
              type: "integer",
              format: "uint32",
              minimum: 0.0,
            },
            link: {
              description: "The link to the proposal.",
              type: ["string", "null"],
            },
            proposer_id: {
              description: "The account ID of the proposer.",
              allOf: [
                {
                  $ref: "#/definitions/AccountId",
                },
              ],
            },
            rejected: {
              description:
                "The flag indicating if the proposal was rejected by the reviewer.",
              type: "boolean",
            },
            reviewer_id: {
              description:
                "The account ID of the reviewer, who approved or rejected the proposal.",
              anyOf: [
                {
                  $ref: "#/definitions/AccountId",
                },
                {
                  type: "null",
                },
              ],
            },
            snapshot_and_state: {
              description:
                "The snapshot of the contract state and global state. Fetched when the proposal is approved.",
              anyOf: [
                {
                  $ref: "#/definitions/SnapshotAndState",
                },
                {
                  type: "null",
                },
              ],
            },
            status: {
              description:
                "The status of the proposal. It's optional and can be computed from the proposal itself.",
              allOf: [
                {
                  $ref: "#/definitions/ProposalStatus",
                },
              ],
            },
            title: {
              description: "The title of the proposal.",
              type: ["string", "null"],
            },
            total_votes: {
              description:
                "The total aggregated voting information across all voting options.",
              allOf: [
                {
                  $ref: "#/definitions/VoteStats",
                },
              ],
            },
            votes: {
              description: "Aggregated votes per voting option.",
              type: "array",
              items: {
                $ref: "#/definitions/VoteStats",
              },
            },
            voting_duration_ns: {
              description:
                "The voting duration in nanoseconds, generated from the config.",
              type: "string",
            },
            voting_options: {
              description: "The voting options for the proposal.",
              type: "array",
              items: {
                type: "string",
              },
            },
            voting_start_time_ns: {
              description:
                "The timestamp when the voting starts, provided by the reviewer.",
              type: ["string", "null"],
            },
          },
        },
        ProposalMetadata: {
          description: "Metadata for a proposal.",
          type: "object",
          required: ["voting_options"],
          properties: {
            description: {
              description: "The description of the proposal.",
              type: ["string", "null"],
            },
            link: {
              description: "The link to the proposal.",
              type: ["string", "null"],
            },
            title: {
              description: "The title of the proposal.",
              type: ["string", "null"],
            },
            voting_options: {
              description: "The voting options for the proposal.",
              type: "array",
              items: {
                type: "string",
              },
            },
          },
        },
        ProposalStatus: {
          description: "The status of the proposal",
          oneOf: [
            {
              description:
                "The proposal was created and is waiting for the approver to approve or reject it.",
              type: "string",
              enum: ["Created"],
            },
            {
              description: "The proposal was rejected by the approver.",
              type: "string",
              enum: ["Rejected"],
            },
            {
              description:
                "The proposal was approved by the approver and is waiting for the voting to start.",
              type: "string",
              enum: ["Approved"],
            },
            {
              description: "The proposal is in the voting phase.",
              type: "string",
              enum: ["Voting"],
            },
            {
              description:
                "The proposal voting is finished and the results are available.",
              type: "string",
              enum: ["Finished"],
            },
          ],
        },
        SnapshotAndState: {
          description:
            "The snapshot of the Merkle tree and the global state at the moment when the proposal was approved.",
          type: "object",
          required: [
            "snapshot",
            "timestamp_ns",
            "total_venear",
            "venear_growth_config",
          ],
          properties: {
            snapshot: {
              description:
                "The snapshot of the Merkle tree at the moment when the proposal was approved.",
              allOf: [
                {
                  $ref: "#/definitions/MerkleTreeSnapshot",
                },
              ],
            },
            timestamp_ns: {
              description:
                "The timestamp in nanoseconds when the global state was last updated.",
              type: "string",
            },
            total_venear: {
              description:
                "The total amount of veNEAR tokens at the moment when the proposal was approved.",
              type: "string",
            },
            venear_growth_config: {
              description:
                "The growth configuration of the veNEAR tokens from the global state.",
              allOf: [
                {
                  $ref: "#/definitions/VenearGrowthConfig",
                },
              ],
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
        VoteStats: {
          description:
            "The vote statistics structure that contains the total amount of veNEAR tokens and the total number of votes.",
          type: "object",
          required: ["total_venear", "total_votes"],
          properties: {
            total_venear: {
              description: "The total venear balance at the updated timestamp.",
              type: "string",
            },
            total_votes: {
              description: "The total number of votes.",
              type: "integer",
              format: "uint32",
              minimum: 0.0,
            },
          },
        },
      },
    },
  },
};
