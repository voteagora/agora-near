import nearLogo from "@/assets/tenant/near_logo.svg";
import { TenantUI } from "@/lib/tenant/tenantUI";

export const nearTenantUIConfig = new TenantUI({
  title: "",
  logo: nearLogo,

  assets: {
    success: nearLogo,
    pending: nearLogo,
    delegate: nearLogo,
  },

  governanceIssues: [
    {
      icon: "stack",
      title: "Cross chain ecosystem",
      key: "crossChain",
    },
    {
      icon: "piggyBank",
      title: "Funding and grants",
      key: "fundingAndGrants",
    },
    {
      icon: "piggyBank",
      title: "Incentivized participation",
      key: "incentivizedParticipation",
    },
    {
      icon: "lockClosed",
      title: "Security",
      key: "security",
    },
    {
      icon: "community",
      title: "House of Stake",
      key: "houseOfStake",
    },
  ],

  customization: {
    primary: "0 0 0",
    secondary: "64 64 64",
    tertiary: "115 115 115",
    neutral: "255 255 255",
    wash: "250 250 250",
    line: "229 229 229",
    positive: "97 209 97",
    negative: "226 54 54",
    brandPrimary: "0 0 0",
    brandSecondary: "255 255 255",
    tokenAmountFont: "font-chivoMono",
  },

  links: [
    {
      name: "discord",
      title: "Discord",
      url: "https://discord.gg/nearprotocol",
    },
    {
      name: "bugs",
      title: "Report bugs & feedback",
      url: "https://app.deform.cc/form/7180b273-7662-4f96-9e66-1eae240a52bc",
    },
    {
      name: "governance-forum",
      title: "Governance Forum",
      url: "https://gov.near.org/",
    },
    {
      name: "code-of-conduct",
      title: "Delegate Code of Conduct",
      url: "https://gov.near.org/t/near-call-for-delegates-house-of-stake/40513#p-137747-h-6-delegate-code-of-conduct-6",
    },
    {
      name: "delegate-statement-template",
      title: "View Template",
      url: "https://gov.near.org/t/near-call-for-delegates-house-of-stake/40513",
    },
  ],

  pages: [
    {
      route: "/",
      title: "Agora is the home of NEAR voters",
      description:
        "NEAR House of Stake governance empowers token holders to lock NEAR for voting rights, delegate votes to trusted representatives, and earn rewards for active participation.",
      meta: {
        title: "NEAR Agora",
        description: "Home of the NEAR House of Stake governance",
        imageTitle: "NEAR Agora",
        imageDescription: "Home of the NEAR House of Stake governance",
      },
    },
    {
      route: "proposals",
      title: "Agora is the home of NEAR voters",
      description:
        "NEAR House of Stake governance empowers token holders to lock NEAR for voting rights, delegate votes to trusted representatives, and earn rewards for active participation.",
      meta: {
        title: "NEAR Agora",
        description: "Home of the NEAR House of Stake governance",
        imageTitle: "NEAR Agora",
        imageDescription: "Home of the NEAR House of Stake governance",
      },
    },
    {
      route: "delegates",
      title: "Agora is the home of NEAR voters",
      description:
        "NEAR House of Stake governance empowers token holders to lock NEAR for voting rights, delegate votes to trusted representatives, and earn rewards for active participation.",
      meta: {
        title: "Voter on Agora",
        description: "Delegate your voting power to a trusted representative",
        imageTitle: "Voter on Agora",
        imageDescription:
          "Delegate your voting power to a trusted representative",
      },
    },
    {
      route: "assets",
      title: "Agora is the home of NEAR voters",
      description:
        "NEAR House of Stake governance empowers token holders to lock NEAR for voting rights, delegate votes to trusted representatives, and earn rewards for active participation.",
      meta: {
        title: "NEAR Agora",
        description: "Home of the NEAR House of Stake governance",
        imageTitle: "NEAR Agora",
        imageDescription: "Home of the NEAR House of Stake governance",
      },
    },
  ],

  toggles: [
    {
      name: "admin",
      enabled: false,
    },
    {
      name: "proposals",
      enabled: true,
    },
    {
      name: "proposals/create",
      enabled: true,
    },
    {
      name: "delegates",
      enabled: true,
    },
    {
      name: "delegates/code-of-conduct",
      enabled: true,
    },
    {
      name: "delegates/edit",
      enabled: true,
    },
    {
      name: "info",
      enabled: false,
    },
    {
      name: "proposal-execute",
      enabled: false,
    },
    {
      name: "email-subscriptions",
      enabled: false,
    },
    {
      name: "proposal-lifecycle",
      enabled: false,
    },
    {
      name: "assets",
      enabled: true,
    },
  ],
});
