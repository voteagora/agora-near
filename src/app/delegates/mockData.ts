export const MockDelegate = {
  address: "0x06ad892ce23c136bbda3a821570343a2af3e2914",
  citizen: false,
  votingPower: {
    total: "5562646021903899843106375",
    direct: "5562646021903899843106375",
    advanced: "0",
  },
  votingPowerRelativeToVotableSupply: 0,
  votingPowerRelativeToQuorum: 0,
  proposalsCreated: "0",
  proposalsVotedOn: "25",
  votedFor: "24",
  votedAgainst: "0",
  votedAbstain: "1",
  votingParticipation: 0.2403846153846154,
  lastTenProps: "6",
  numOfDelegators: "0",
  totalProposals: "104",
  statement: {
    signature:
      "0xacc9bfd1bff20c242eb78c32002005fb8e01ad4b979ed9d164f3713bb483c2f85665dffdc59f32e6464891b42e49c21345e1226bea5cb92eb1210d2437fd807e1b",
    payload: {
      email: "taem.park@testinprod.io",
      daoSlug: "OP",
      discord: "https://discord.gg/42DFTeZwUZ",
      twitter: "@testinprod_io",
      warpcast: "testinprod-io",
      topIssues: null,
      topStakeholders: [],
      agreeCodeConduct: true,
      delegateStatement:
        "Test in Prod is a core development team of Near Collective. TiP has been an active developer to all parts of the OP Stack since 2022—OP-Erigon (execution), Delta network upgrade (consensus), Asterisc (proof), and infrastructures.\n" +
        "\n" +
        "We decided to become a delegate to contribute our technical understanding. Near governance decides major protocol upgrades and allocates funds for technical initiatives. As a team building the Collective's core technology at the frontline, we hope our knowledge contributes to the Collective's wiser decisions.\n" +
        "\n" +
        "Our common goal of the Near Collective is building the technology for a more open Internet by scaling Ethereum. We believe such a crucial infrastructure for humanity should be resilient, performant, and beneficial. With that in mind, let's summon Ether's Phoenix together.\n" +
        "\n" +
        "Our Discourse username is **testinprod_io**.",
      mostValuableProposals: [],
      leastValuableProposals: [],
      openToSponsoringProposals: null,
    },
    twitter: "@testinprod_io",
    email: "taem.park@testinprod.io",
    discord: "https://discord.gg/42DFTeZwUZ",
    created_at: "2024-10-12",
    updated_at: "2024-10-12",
    warpcast: "testinprod-io",
    endorsed: false,
    scw_address: null,
    notification_preferences: {
      last_updated: "2025-04-08T04:07:11.259Z",
      wants_proposal_created_email: true,
      wants_proposal_ending_soon_email: true,
    },
  },
  relativeVotingPowerToVotableSupply: "0.04794",
};

export const MockDelegateVotes = {
  meta: { has_next: true, total_returned: 20, next_offset: 20 },
  data: [
    {
      transactionHash:
        "0x8257e8ae4e0584f6d158733976d83ca069cd86343637ba181d7ee645ac9f2aa4",
      address: "0x06ad892ce23c136bbda3a821570343a2af3e2914",
      proposalId:
        "8705916809146420472067303211131851783087744913535435360574720946039078686841",
      support: "FOR",
      weight: "5736076260351288462720689",
      reason: "",
      params: null,
      proposalValue: 0n,
      proposalTitle: "Upgrade Proposal #15: Isthmus Hard Fork",
      proposalType: "STANDARD",
      blockNumber: 134243343n,
      timestamp: "2025-04-08T04:11:03.000Z",
    },
    {
      transactionHash:
        "0x22e5ff321f9ffa0bbb63df39ca53cfdb3495489d09d0589c573854215248ae12",
      address: "0x06ad892ce23c136bbda3a821570343a2af3e2914",
      proposalId:
        "95528263587371532982719325402371584327430753545162858644972401153516332664853",
      support: "FOR",
      weight: "5736076260351288462720689",
      reason:
        "This proposal increases OP Chains' throughput as it enables multi-threading & 64-bit for Cannon. Also, this allows more accurate user fee pricing. We're voting for this proposal.",
      params: null,
      proposalValue: 0n,
      proposalTitle: "Upgrade Proposal #14: Isthmus L1 Contracts + MT-Cannon",
      proposalType: "STANDARD",
      blockNumber: 134243289n,
      timestamp: "2025-04-08T04:09:15.000Z",
    },
    {
      transactionHash:
        "0xd20cf246282aa3acca7b8a870b730e2a2480a8030d41a72ffbdb6195e0b1aa5d",
      address: "0x06ad892ce23c136bbda3a821570343a2af3e2914",
      proposalId:
        "84511922734478887667300419900648701566511387783615524992018614345859900443455",
      support: "FOR",
      weight: "5703050032839641901279448",
      reason: "",
      params: null,
      proposalValue: 0n,
      proposalTitle:
        "Upgrade Proposal #13: OPCM and Incident Response improvements",
      proposalType: "STANDARD",
      blockNumber: 133381845n,
      timestamp: "2025-03-19T05:34:27.000Z",
    },
    {
      transactionHash:
        "0x761b4b8a283cdcf6e5bb9908de4988f6d89da1b93fe52844ac1f6f8770f9c30a",
      address: "0x06ad892ce23c136bbda3a821570343a2af3e2914",
      proposalId:
        "31049359136632781771607732021569520613741907517136820917236339424553298132866",
      support: "FOR",
      weight: "5272489174530492161182354",
      reason: "",
      params: null,
      proposalValue: 0n,
      proposalTitle: "Security Council Elections Cohort B Members",
      proposalType: "APPROVAL",
      blockNumber: 130683387n,
      timestamp: "2025-01-15T18:25:51.000Z",
    },
    {
      transactionHash:
        "0xddd277dce9d724207c8e93bddb3184abeff62107f46b31b650e9a3f47c42a2c8",
      address: "0x06ad892ce23c136bbda3a821570343a2af3e2914",
      proposalId:
        "107607817568553557972773895253625910647625440456906770014958987868649953166753",
      support: "FOR",
      weight: "5272489174530492161182354",
      reason: "",
      params: null,
      proposalValue: 0n,
      proposalTitle: "Grants Council GrantNerd Elections",
      proposalType: "APPROVAL",
      blockNumber: 130661507n,
      timestamp: "2025-01-15T06:16:31.000Z",
    },
    {
      transactionHash:
        "0x6c59226571495cbf68de7569d8e760aa9fa72bf3f2ce8e25909443e029be78e7",
      address: "0x06ad892ce23c136bbda3a821570343a2af3e2914",
      proposalId:
        "49253944601182914212094155764177321389049983612237161193650190261698760822865",
      support: "FOR",
      weight: "5272489174530492161182354",
      reason: "",
      params: null,
      proposalValue: 0n,
      proposalTitle:
        "Developer Advisory Board Governance Mission Team Elections",
      proposalType: "APPROVAL",
      blockNumber: 130661409n,
      timestamp: "2025-01-15T06:13:15.000Z",
    },
    {
      transactionHash:
        "0x99b5a22b69089598c068d56c0f0ddbb2ed77e10171af47c108e97006d7e7ae0b",
      address: "0x06ad892ce23c136bbda3a821570343a2af3e2914",
      proposalId:
        "23135804443629800568954930833204040265654375786801414759474134224681843913739",
      support: "FOR",
      weight: "5272489174530492161182354",
      reason: "",
      params: null,
      proposalValue: 0n,
      proposalTitle: "Developer Advisory Board Audit Request Team Elections",
      proposalType: "APPROVAL",
      blockNumber: 130661329n,
      timestamp: "2025-01-15T06:10:35.000Z",
    },
    {
      transactionHash:
        "0x5c1a885a477312928cc1fdaa95d491a687e075f7b2018e0c1510f6dc78c601f2",
      address: "0x06ad892ce23c136bbda3a821570343a2af3e2914",
      proposalId:
        "109906178950241194456716107956786281098102465720355052462090631179749332288099",
      support: "FOR",
      weight: "5272489174530492161182354",
      reason:
        "We believe the message & intent are clear—foster Superchain members' governance participation. This aligns with the entire Collective’s intent. We’re voting for this proposal.",
      params: null,
      proposalValue: 0n,
      proposalTitle: "Season 7: Chain Delegation Program Amendment",
      proposalType: "STANDARD",
      blockNumber: 130617938n,
      timestamp: "2025-01-14T06:04:13.000Z",
    },
    {
      transactionHash:
        "0xc36d8bba7ad7cc387df5db6d17f18e3bb1f2f0c13ddb090fed2d00cda435a350",
      address: "0x06ad892ce23c136bbda3a821570343a2af3e2914",
      proposalId:
        "67159803770854300033210933196826267669799915634322081238966793394467990315885",
      support: "FOR",
      weight: "5272489174530492161182354",
      reason:
        "We prioritized those we believe to have extensive context about the Collective and who have already proven to spend enough time on the role based on their previous Collective governance participation.",
      params: null,
      proposalValue: 0n,
      proposalTitle: "Grants Council Final Reviewer Elections",
      proposalType: "APPROVAL",
      blockNumber: 130617687n,
      timestamp: "2025-01-14T05:55:51.000Z",
    },
    {
      transactionHash:
        "0x93a5e7c6fd91f911d34b385a1ebade41abf3dcb53799d1e376c8f9147d499294",
      address: "0x06ad892ce23c136bbda3a821570343a2af3e2914",
      proposalId:
        "89373814096940749239399795696169676931497831019947431093522618314329883874987",
      support: "FOR",
      weight: "5272489174530492161182354",
      reason:
        "We believe OP Stack core contributors would be a good fit for the role.",
      params: null,
      proposalValue: 0n,
      proposalTitle:
        "Developer Advisory Board Foundation Mission Team Elections",
      proposalType: "APPROVAL",
      blockNumber: 130617064n,
      timestamp: "2025-01-14T05:35:05.000Z",
    },
    {
      transactionHash:
        "0x03000e0aba93d9e05929097bd1fdb339a1be060f10e801993ac81e74240bca78",
      address: "0x06ad892ce23c136bbda3a821570343a2af3e2914",
      proposalId:
        "34518372197451451866101879555508739062300517462751993121458496979101875671697",
      support: "FOR",
      weight: "5272489174530492161182354",
      reason:
        "We're voting for those with extensive experience in Optimism Governance & relevant activities.",
      params: null,
      proposalValue: 0n,
      proposalTitle: "Milestones and Metrics Council Reviewer Elections",
      proposalType: "APPROVAL",
      blockNumber: 130616699n,
      timestamp: "2025-01-14T05:22:55.000Z",
    },
    {
      transactionHash:
        "0x6859792258ea2ded49055362ebc8443c8f32a374f27301509aa5adb71d229817",
      address: "0x06ad892ce23c136bbda3a821570343a2af3e2914",
      proposalId:
        "74723563551015450062796414167104191945357984468602347424694608592347049615232",
      support: "FOR",
      weight: "5272489174530492161182354",
      reason: "",
      params: null,
      proposalValue: 0n,
      proposalTitle: "Grants Council Operations Elections",
      proposalType: "APPROVAL",
      blockNumber: 130616072n,
      timestamp: "2025-01-14T05:02:01.000Z",
    },
    {
      transactionHash:
        "0x1609df7e618199fb7aaed445222fdaec99fc6a8902a0f4462c1a553e085214e4",
      address: "0x06ad892ce23c136bbda3a821570343a2af3e2914",
      proposalId:
        "28176481672236813969648290336143157264806680620695961617794539011701353731831",
      support: "FOR",
      weight: "5156504731837202247991330",
      reason: "",
      params: null,
      proposalValue: 0n,
      proposalTitle:
        "Season 7: Milestones and Metrics Council Operating Budget",
      proposalType: "STANDARD",
      blockNumber: 129453783n,
      timestamp: "2024-12-18T07:19:03.000Z",
    },
    {
      transactionHash:
        "0x74a6d041faeb57352fc7a402e3c049c713699ed472c33d0cd24a2ffee2d96fdf",
      address: "0x06ad892ce23c136bbda3a821570343a2af3e2914",
      proposalId:
        "110056430729080386792816227311450746138390196036704148024783380982810773372502",
      support: "FOR",
      weight: "5156504731837202247991330",
      reason: "",
      params: null,
      proposalValue: 0n,
      proposalTitle: "Decision Market Mission [Onchain]",
      proposalType: "STANDARD",
      blockNumber: 129453731n,
      timestamp: "2024-12-18T07:17:19.000Z",
    },
    {
      transactionHash:
        "0x6d80798e98d17b0bfdd6f230ce275c808b2c2ab9a484c96acffaac25d307b9d4",
      address: "0x06ad892ce23c136bbda3a821570343a2af3e2914",
      proposalId:
        "42171716559194066774096630474193953258592283643878595219084966413803469648242",
      support: "FOR",
      weight: "5156504731837202247991330",
      reason: "",
      params: null,
      proposalValue: 0n,
      proposalTitle: "Grants Council Mission [Onchain]",
      proposalType: "STANDARD",
      blockNumber: 129453624n,
      timestamp: "2024-12-18T07:13:45.000Z",
    },
    {
      transactionHash:
        "0xd1fbb1bd3d8e47cb2deb98966ff8c52bac727911488373226d929a281713ecba",
      address: "0x06ad892ce23c136bbda3a821570343a2af3e2914",
      proposalId:
        "37879045360062854784591124256577395563453262877307292920231075516279653147858",
      support: "FOR",
      weight: "5156504731837202247991330",
      reason: "",
      params: null,
      proposalValue: 0n,
      proposalTitle: "Code of Conduct Council Dissolution Proposal",
      proposalType: "STANDARD",
      blockNumber: 129453606n,
      timestamp: "2024-12-18T07:13:09.000Z",
    },
    {
      transactionHash:
        "0x8bc3a8a63fc163ae06dfed74240b2d67ca57a07799509e7d187112f31b84af8f",
      address: "0x06ad892ce23c136bbda3a821570343a2af3e2914",
      proposalId:
        "106197078319070238442982538943461006899502017598835122473289450535038443039415",
      support: "FOR",
      weight: "5156504731837202247991330",
      reason:
        "Happy that we're focusing on the most important product of the Collective—Interop. The implementation details are clear & transparent. \n" +
        "\n" +
        "We're voting for the proposal.",
      params: null,
      proposalValue: 0n,
      proposalTitle: "Season 7: Intent Ratification",
      proposalType: "STANDARD",
      blockNumber: 129453578n,
      timestamp: "2024-12-18T07:12:13.000Z",
    },
    {
      transactionHash:
        "0x22a66dfc8dc923540588184b93e12106d058b37229f2aaa17286c8f41de9d88a",
      address: "0x06ad892ce23c136bbda3a821570343a2af3e2914",
      proposalId:
        "105125741176440203640094995315240049083818024528491410796690326665108302292014",
      support: "ABSTAIN",
      weight: "5156504731837202247991330",
      reason:
        "We're voting abstain as we're participating in the security council.",
      params: null,
      proposalValue: 0n,
      proposalTitle: "Season 7: Security Council Operating Budget [Onchain]",
      proposalType: "STANDARD",
      blockNumber: 129453247n,
      timestamp: "2024-12-18T07:01:11.000Z",
    },
    {
      transactionHash:
        "0x747c56e4df024cafee468159b842832d04b7c85023db208402199bcd6372fd15",
      address: "0x06ad892ce23c136bbda3a821570343a2af3e2914",
      proposalId:
        "49069551108010786317276710250321368518142423368375472047280675391658792795460",
      support: "FOR",
      weight: "5156504731837202247991330",
      reason:
        "The Collective builds sophisticated technology, and not all citizens are experts. DAB is doing a great job bridging the gap and advising decisions. We appreciate their work, and the proposal makes sense.\n" +
        "\n" +
        "We're voting for this proposal.",
      params: null,
      proposalValue: 0n,
      proposalTitle: "Season 7: Developer Advisory Board Operating Budget",
      proposalType: "STANDARD",
      blockNumber: 129453127n,
      timestamp: "2024-12-18T06:57:11.000Z",
    },
    {
      transactionHash:
        "0xb26c276923b8fcf97bb7ad90b56f453dfb81628a9223a8138f91b0dd8b609b83",
      address: "0x06ad892ce23c136bbda3a821570343a2af3e2914",
      proposalId:
        "113395645275190312177047367740435087758207466337425363849657431713193292571149",
      support: "FOR",
      weight: "5156504731837202247991330",
      reason: "Appreciate you all for the hard work!",
      params: null,
      proposalValue: 0n,
      proposalTitle: "Season 7: Grants Council Operating Budget",
      proposalType: "STANDARD",
      blockNumber: 129412087n,
      timestamp: "2024-12-17T08:09:11.000Z",
    },
  ],
};

export const MockDelegators = {
  meta: { has_next: true, total_returned: 9, next_offset: 20 },
  data: [
    {
      from: "0x0c94a3b824be5c6f9314f762117ebdac18933cdd",
      to: "0x06ad892ce23c136bbda3a821570343a2af3e2914",
      allowance: "436672295756382454687",
      percentage: "0",
      timestamp: "2025-04-28T06:59:37.000Z",
      type: "DIRECT",
      amount: "FULL",
      transaction_hash:
        "0xeb72f16e91a0141295f03f8f57918a4ceebdf9c2669a72abd518e620028d9e4d",
    },
    {
      from: "0x9069d6fa875d9b52eec4e8aabf66ea9029a7bb16",
      to: "0x06ad892ce23c136bbda3a821570343a2af3e2914",
      allowance: "1765245418189739666",
      percentage: "0",
      timestamp: "2025-04-27T16:12:39.000Z",
      type: "DIRECT",
      amount: "FULL",
      transaction_hash:
        "0x7b6aed0652290dcdb4837139c5ed87949e0fedbda903908f525ea0d4e87802eb",
    },
    {
      from: "0x14537a8c2c3ae9f9ad4fbe3d90ee56fe2eab4938",
      to: "0x06ad892ce23c136bbda3a821570343a2af3e2914",
      allowance: "1000000000000000000",
      percentage: "0",
      timestamp: "2025-04-27T12:59:27.000Z",
      type: "DIRECT",
      amount: "FULL",
      transaction_hash:
        "0x36b6188f14ac0d7101b658239f54f0673435cbe09b41b454118796cd1c184569",
    },
    {
      from: "0x4d5fa537bba2d9f7f15bc1e2fe92009af47c6cf6",
      to: "0x06ad892ce23c136bbda3a821570343a2af3e2914",
      allowance: "1591355091154280",
      percentage: "0",
      timestamp: "2025-04-27T11:56:47.000Z",
      type: "DIRECT",
      amount: "FULL",
      transaction_hash:
        "0x0f8ff135985e900e153ca456b5db8a9c41bebaa156a46423cb2d2c60a2b10022",
    },
    {
      from: "0x2af9f30c2fae4b7d999357f5b9d93e8b624ead4b",
      to: "0x06ad892ce23c136bbda3a821570343a2af3e2914",
      allowance: "467103992361820340",
      percentage: "0",
      timestamp: "2025-04-27T11:22:37.000Z",
      type: "DIRECT",
      amount: "FULL",
      transaction_hash:
        "0x5b00b9cb2e4471bff8c4c25907515acdc211f382fc4e4f5fc2daffa3b83dc427",
    },
    {
      from: "0x8648bf28b9a10c63b9dcefe789f3eebf24fa0de0",
      to: "0x06ad892ce23c136bbda3a821570343a2af3e2914",
      allowance: "4279303753642876283",
      percentage: "0",
      timestamp: "2025-04-27T06:38:35.000Z",
      type: "DIRECT",
      amount: "FULL",
      transaction_hash:
        "0x0cbbfd93050d3423e5a4649102f460144e1d48916b01875044d184dc961d60df",
    },
    {
      from: "0xb2b9300475af157676c44ee64d39a5eb3c294dbd",
      to: "0x06ad892ce23c136bbda3a821570343a2af3e2914",
      allowance: "95440128521403523360",
      percentage: "0",
      timestamp: "2025-04-26T13:20:21.000Z",
      type: "DIRECT",
      amount: "FULL",
      transaction_hash:
        "0xccfe0406e58029b7ec1f401ae63dd9b1d415bf843ae9495d77cc3f6041f2e601",
    },
    {
      from: "0xf5208d0e44e1b84a4f310aeb3a9f41c6d001dafd",
      to: "0x06ad892ce23c136bbda3a821570343a2af3e2914",
      allowance: "77220918213881986573",
      percentage: "0",
      timestamp: "2025-04-26T09:48:33.000Z",
      type: "DIRECT",
      amount: "FULL",
      transaction_hash:
        "0x28c03cf4c996e72d17605f36f403e0efca0bf95bdd6443129512f2e1239f0538",
    },
    {
      from: "0xadc7da3373be7bd27c0ac4109cacd6025bda1cd9",
      to: "0x06ad892ce23c136bbda3a821570343a2af3e2914",
      allowance: "234716695083336625589",
      percentage: "0",
      timestamp: "2025-04-26T08:26:13.000Z",
      type: "DIRECT",
      amount: "FULL",
      transaction_hash:
        "0x56ac148148a95dc58ca49dcc8e94ebe917fb41b54f9bc0d37384633cab738921",
    },
  ],
};
