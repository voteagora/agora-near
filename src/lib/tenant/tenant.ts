import TenantContractFactory from "@/lib/tenant/tenantContractFactory";
import { TenantUI } from "@/lib/tenant/tenantUI";
import {
  type TenantContracts,
  type TenantNamespace,
  type TenantToken,
} from "../types";
import { nearTenantUIConfig } from "./configs/ui/near";

export const BRAND_NAME_MAPPINGS: Record<string, string> = {
  ens: "ENS",
  etherfi: "EtherFi",
  pguild: "PGuild",
  boost: "Boost",
  demo: "Canopy",
};

export default class Tenant {
  private static instance: Tenant;

  private readonly _contracts: TenantContracts;
  private readonly _isProd: boolean;
  private readonly _namespace: TenantNamespace;

  private constructor() {
    this._namespace = process.env
      .NEXT_PUBLIC_AGORA_INSTANCE_NAME as TenantNamespace;
    this._isProd = process.env.NEXT_PUBLIC_AGORA_ENV === "prod";
    this._contracts = TenantContractFactory.create(
      this._namespace,
      this._isProd,
      process.env.NEXT_PUBLIC_ALCHEMY_ID as string
    );
  }

  public get contracts(): TenantContracts {
    return this._contracts;
  }

  public get isProd(): boolean {
    return this._isProd;
  }

  public get namespace(): TenantNamespace {
    return "near";
  }

  public get slug(): string {
    return "NEAR";
  }

  public get token(): TenantToken {
    return {
      name: "NEAR Protocol",
      symbol: "NEAR",
      decimals: 18,
    };
  }

  public get ui(): TenantUI {
    return nearTenantUIConfig;
  }

  public get brandName(): string {
    return "NEAR";
  }

  public static current(): Tenant {
    if (!Tenant.instance) {
      Tenant.instance = new Tenant();
    }
    return Tenant.instance;
  }
}
