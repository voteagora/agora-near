import { TenantNamespace } from "@/lib/types";
import { TENANT_NAMESPACES } from "@/lib/constants";
import { nearTenantUIConfig } from "@/lib/tenant/configs/ui/near";

export default class TenantUIFactory {
  public static create(namespace: TenantNamespace): any {
    switch (namespace) {
      case TENANT_NAMESPACES.NEAR:
        return nearTenantUIConfig;

      default:
        throw new Error(`Invalid namespace: ${namespace}`);
    }
  }
}
