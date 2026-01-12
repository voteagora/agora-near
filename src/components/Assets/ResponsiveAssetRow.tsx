import { memo } from "react";
import { TokenMetadata } from "@/lib/types";
import { AssetRow } from "./AssetRow";
import { MobileAssetRow } from "./MobileAssetRow";

type OverflowButton = {
  title: string;
  onClick: () => void;
  showExternalIcon?: boolean;
};

type ActionButton = {
  title: string;
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  tooltip?: string;
};

type ResponsiveAssetRowProps = {
  metadata?: TokenMetadata | null;
  columns: {
    title: React.ReactNode;
    subtitle: React.ReactNode;
  }[];
  showOverflowMenu?: boolean;
  overflowButtons?: OverflowButton[];
  actionButton?: ActionButton;
  actionButtons?: ActionButton[];
  icon?: React.ReactNode;
};

export const ResponsiveAssetRow = memo<ResponsiveAssetRowProps>(
  ({
    metadata,
    columns,
    showOverflowMenu = false,
    overflowButtons,
    actionButton,
    actionButtons,
    icon,
  }) => {
    return (
      <>
        {/* Desktop version - hidden on mobile */}
        <AssetRow
          metadata={metadata}
          columns={columns}
          showOverflowMenu={showOverflowMenu}
          overflowButtons={overflowButtons}
          actionButton={actionButton}
          actionButtons={actionButtons}
          icon={icon}
          className="hidden sm:table-row"
        />

        {/* Mobile version */}
        <div className="sm:hidden">
          <MobileAssetRow
            metadata={metadata}
            columns={columns}
            overflowButtons={overflowButtons}
            actionButton={actionButton}
            actionButtons={actionButtons}
          />
        </div>
      </>
    );
  }
);

ResponsiveAssetRow.displayName = "ResponsiveAssetRow";
