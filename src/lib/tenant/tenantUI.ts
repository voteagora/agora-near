import { StaticImageData } from "next/image";
import { icons } from "@/assets/icons";

type UIToggle = {
  name: string;
  enabled: boolean;
};

export type UILink = {
  name: string;
  title: string;
  url: string;
  image?: string | StaticImageData;
};

type UIPage = {
  description: string;
  hero?: StaticImageData | string;
  href?: string;
  links?: UILink[];
  route: string;
  title: string;
  meta: {
    title: string;
    description: string;
    imageTitle: string;
    imageDescription: string;
  };
};

type UIAssets = {
  success: string;
  pending: string;
  failed?: string; //TODO: make this required for all tenants
  delegate: string;
};

type UIDelegates = {
  allowed: `0x${string}`[];
  advanced: `0x${string}`[];
  retired: `0x${string}`[];
};

type UIGovernanceIssue = {
  icon: keyof typeof icons;
  key: string;
  title: string;
};

type TenantUIParams = {
  assets: UIAssets;
  delegates?: UIDelegates;
  governanceIssues?: UIGovernanceIssue[];
  hideAgoraBranding?: boolean;
  hideAgoraFooter?: boolean;
  links?: UILink[];
  logo: string;
  pages?: UIPage[];
  title: string;
  toggles?: UIToggle[];
  customization?: {
    primary?: string;
    secondary?: string;
    tertiary?: string;
    neutral?: string;
    wash?: string;
    line?: string;
    positive?: string;
    negative?: string;
    brandPrimary?: string;
    brandSecondary?: string;
    font?: string;
    tokenAmountFont?: string;
    letterSpacing?: string;
  };
  theme?: "light" | "dark";
  favicon?: {
    "apple-touch-icon"?: string;
    icon32x32?: string;
    icon16x16?: string;
    "shortcut-icon"?: string;
  };
  tacticalStrings?: {
    myBalance?: string;
  };
};

export class TenantUI {
  private _assets: UIAssets;
  private _delegates?: UIDelegates;
  private _governanceIssues?: UIGovernanceIssue[];
  private _hideAgoraBranding?: boolean;
  private _hideAgoraFooter?: boolean;
  private _links?: UILink[];
  private _logo: string;
  private _pages?: UIPage[];
  private _title: string;
  private _toggles?: UIToggle[];
  private _customization?: {
    primary?: string;
    secondary?: string;
    tertiary?: string;
    neutral?: string;
    wash?: string;
    line?: string;
    positive?: string;
    negative?: string;
    brandPrimary?: string;
    brandSecondary?: string;
    font?: string;
    tokenAmountFont?: string;
    letterSpacing?: string;
  };
  private _theme: "light" | "dark";
  private _favicon?: {
    "apple-touch-icon"?: string;
    icon32x32?: string;
    icon16x16?: string;
    "shortcut-icon"?: string;
  };
  private _linksCache: { [key: string]: UILink | undefined } = {};
  private _pagesCache: { [key: string]: UIPage | undefined } = {};
  private _togglesCache: { [key: string]: UIToggle | undefined } = {};

  private _tacticalStrings?: {
    myBalance?: string;
  };

  constructor({
    assets,
    customization,
    delegates,
    favicon,
    governanceIssues,
    hideAgoraBranding,
    hideAgoraFooter,
    links,
    logo,
    pages,
    title,
    toggles,
    tacticalStrings,
    theme,
  }: TenantUIParams) {
    this._assets = assets;
    this._customization = customization;
    this._delegates = delegates;
    this._favicon = favicon;
    this._governanceIssues = governanceIssues;
    this._hideAgoraBranding = hideAgoraBranding;
    this._hideAgoraFooter = hideAgoraFooter;
    this._links = links;
    this._logo = logo;
    this._pages = pages;
    this._title = title;
    this._toggles = toggles;
    this._tacticalStrings = tacticalStrings;
    this._theme = theme ?? "light";
  }

  public get assets(): UIAssets {
    return this._assets;
  }

  public get delegates(): UIDelegates | undefined {
    return this._delegates;
  }

  public get governanceIssues(): UIGovernanceIssue[] | undefined {
    return this._governanceIssues;
  }

  public get hideAgoraBranding(): boolean {
    return this._hideAgoraBranding || false;
  }

  public get hideAgoraFooter(): boolean {
    return this._hideAgoraFooter || false;
  }

  public get title(): string {
    return this._title;
  }

  public get logo(): string {
    return this._logo;
  }

  public get customization():
    | {
        primary?: string;
        secondary?: string;
        tertiary?: string;
        neutral?: string;
        wash?: string;
        line?: string;
        positive?: string;
        negative?: string;
        brandPrimary?: string;
        brandSecondary?: string;
        font?: string;
        tokenAmountFont?: string;
        letterSpacing?: string;
      }
    | undefined {
    return this._customization;
  }

  public get theme(): "light" | "dark" {
    return this._theme;
  }

  public get favicon():
    | {
        "apple-touch-icon"?: string;
        icon32x32?: string;
        icon16x16?: string;
        "shortcut-icon"?: string;
      }
    | undefined {
    return this._favicon;
  }

  public link(name: string): UILink | undefined {
    if (this._linksCache[name] !== undefined) {
      return this._linksCache[name];
    }

    const result = this._links?.find((t) => t.name === name);
    this._linksCache[name] = result;
    return result;
  }

  public toggle(name: string): UIToggle | undefined {
    if (this._togglesCache[name] !== undefined) {
      return this._togglesCache[name];
    }

    const result = this._toggles?.find((t) => t.name === name);
    this._togglesCache[name] = result;
    return result;
  }

  public page(route: string): UIPage | undefined {
    if (this._pagesCache[route] !== undefined) {
      return this._pagesCache[route];
    }

    const result = this._pages?.find((t) => t.route === route);
    this._pagesCache[route] = result;
    return result;
  }

  public get tacticalStrings():
    | {
        myBalance?: string;
      }
    | undefined {
    return this._tacticalStrings;
  }
}
