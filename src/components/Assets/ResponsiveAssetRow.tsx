import { memo } from "react";
import { TokenMetadata } from "@/lib/types";
import { AssetRow } from "./AssetRow";
import { MobileAssetRow } from "./MobileAssetRow";

type OverflowButton = {
  title: string;
  onClick: () => void;
  showExternalIcon?: boolean;
};

type ResponsiveAssetRowProps = {
  metadata?: TokenMetadata | null;
  columns: {
    title: React.ReactNode;
    subtitle: React.ReactNode;
  }[];
  showOverflowMenu?: boolean;
  overflowButtons?: OverflowButton[];
  actionButton?: {
    title: string;
    onClick: () => void;
    disabled?: boolean;
    isLoading?: boolean;
  };
};

export const ResponsiveAssetRow = memo<ResponsiveAssetRowProps>(
  ({
    metadata,
    columns,
    showOverflowMenu = false,
    overflowButtons,
    actionButton,
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
          className="hidden sm:table-row"
        />

        {/* Mobile version */}
        <div className="sm:hidden">
          <MobileAssetRow
            metadata={metadata}
            columns={columns}
            overflowButtons={overflowButtons}
            actionButton={actionButton}
          />
        </div>
      </>
    );
  }
);

ResponsiveAssetRow.displayName = "ResponsiveAssetRow";
