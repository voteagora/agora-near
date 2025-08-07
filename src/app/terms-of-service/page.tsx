import React from "react";
import Image from "next/image";

export default function TermsOfServicePage() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-black text-primary mb-8">
        House of Stake Contracts & Agora Governance Client Architecture
      </h1>

      <div className="text-sm text-tertiary mb-8">Jul 29, 2025</div>

      <div className="space-y-8">
        <div>
          <h3 className="text-2xl font-black text-primary mb-4">
            About the Interface
          </h3>
          <div className="text-secondary space-y-4">
            <p>
              The Interface aggregates and presents publicly available and
              derived information related to staking activity and validator
              performance on the NEAR blockchain.
            </p>
            <p>
              The Interface also provides methods through which the User may
              indicate staking-related actions they wish to perform via the
              House of Stake smart contracts, which are deployed on the NEAR
              blockchain. These methods enable the Interface to prepare draft
              transaction messages that the User can review and execute using a
              third-party NEAR-compatible wallet or device.
            </p>
            <p>
              When used in this way, the Interface facilitates user-initiated
              interactions such as staking, unstaking, and reward claiming.
              These actions are executed solely through the User&apos;s
              connected wallet and the House of Stake contracts. The Interface
              does not process or broadcast any transaction itself.
            </p>
            <p>
              Separately, the Interface also surfaces historical and real-time
              data through integration with the Agora Indexer. This includes
              visualizations of staking flows, validator rewards, and other
              relevant protocol data. The Indexer is read-only and provides no
              capability to initiate or execute transactions.
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-black text-primary mb-4">
            About the Middleware
          </h3>
          <div className="text-secondary space-y-4">
            <p>The Middleware includes two distinct components:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong className="text-primary">House of Stake</strong> — A
                suite of smart contracts deployed on the NEAR blockchain that
                facilitate delegation, undelegation, and reward interactions
                between Users and NEAR validators. These contracts are open,
                permissionless, and can be accessed directly by any User via a
                compatible wallet or client.
              </li>
              <li>
                <strong className="text-primary">Agora Indexer</strong> — A
                dedicated component relying on one or more vendors to extract
                data from the NEAR blockchain and write records to a relational
                database.
              </li>
            </ul>
            <p>
              The House of Stake contract layer operates independently and can
              be accessed without using the Interface. The Agora Indexer is
              fit-for-purpose and hosted only for consumption by the interface.
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-black text-primary mb-4">
            Architecture Diagram
          </h3>
          <div className="flex justify-center">
            <Image
              src="/images/diagram_ToS.svg"
              alt="House of Stake Contracts & Agora Governance Client Architecture Diagram"
              width={1000}
              height={1000}
              className="max-w-full h-auto border border-line rounded-lg"
            />
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-black text-primary mb-4">
            Interface relationship to Middleware
          </h3>
          <div className="text-secondary space-y-4">
            <p>
              Users are not required to use the Interface in order to interact
              with either the House of Stake smart contracts or the Agora
              Indexer. Anyone with a compatible wallet or API client can engage
              directly with the Middleware components or with the NEAR
              blockchain.
            </p>
            <p>
              The Interface maintainers do not operate or control the NEAR
              blockchain, wallet software, validator infrastructure, or
              Middleware. They simply provide a user-friendly presentation of
              publicly available data and facilitate interaction with the House
              of Stake contracts through transaction message drafting.
            </p>
            <p>
              On-chain data—including balances, delegation status, and
              transaction history—may also be accessed through NEAR-compatible
              block explorers and RPC endpoints. Off-chain data made available
              through the Agora Indexer is independently queryable and publicly
              documented.
            </p>
            <p>
              By combining publicly available information with the User&apos;s
              actions, the Interface may generate NEAR-compatible transaction
              messages intended for use with the House of Stake contracts. These
              messages are delivered to a compatible third-party wallet selected
              by the User after choosing to connect (e.g., via a &quot;Connect
              Wallet&quot; button).
            </p>
            <p>
              All transaction messages must be reviewed and signed by the User.
              Signing requires the use of the User&apos;s private key, which is
              never accessible to the Interface, its maintainers, or
              contributors. The Interface cannot initiate or broadcast
              transactions on behalf of the User.
            </p>
            <p>
              Once authorized, the transaction may be submitted by the
              User&apos;s wallet to the NEAR blockchain. Network fees may apply.
              Any changes in token balances or delegation status resulting from
              such transactions can later be queried through the Agora Indexer.
            </p>
            <p>
              The Interface and its maintainers are not agents, custodians, or
              intermediaries. They do not hold, manage, or have access to any
              tokens, private keys, passwords, or other property of the User.
              All blockchain activity is executed solely through the User&apos;s
              interactions with the NEAR network and the Middleware. The
              Interface maintainers do not collect any compensation from Users
              for the use of the Interface.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
