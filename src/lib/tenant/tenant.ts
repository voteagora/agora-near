import { TenantUI } from "@/lib/tenant/tenantUI";
import {
  type TenantContracts,
  type TenantNamespace,
  type TenantToken,
} from "../types";
import { demoTenantConfig } from "./configs/contracts/demo";
import { nearTenantUIConfig } from "./configs/ui/near";

export const BRAND_NAME_MAPPINGS: Record<string, string> = {
  near: "NEAR",
};

export default class Tenant {
  private static instance: Tenant;

  private readonly _isProd: boolean;

  private constructor() {
    this._isProd = process.env.NEXT_PUBLIC_AGORA_ENV === "prod";
  }

  public get contracts(): TenantContracts {
    return demoTenantConfig({
      isProd: this._isProd,
      alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_ID as string,
    });
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
