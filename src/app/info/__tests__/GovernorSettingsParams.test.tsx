import Tenant from "@/lib/tenant/tenant";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import GovernorSettingsParams from "../components/GovernorSettingsParams";

vi.mock("@/lib/tenant/tenant", () => {
  return {
    default: {
      current: vi.fn().mockImplementation(() => ({
        contracts: {
          token: {
            chain: {
              id: 1,
            },
          },
          governor: {
            chain: {
              id: 1,
            },
            address: "0x123",
          },
          timelock: {
            chain: {
              id: 1,
            },
            address: "0x456",
          },
        },
        ui: {
          toggle: vi.fn(),
        },
      })),
    },
  };
});

describe("GovernorSettingsParams", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("displays correct voting parameters when data is loaded", () => {
    render(<GovernorSettingsParams />);

    expect(screen.getByText("Voting Delay")).toBeInTheDocument();
    expect(screen.getByText("Voting Period")).toBeInTheDocument();
    expect(screen.getByText("Timelock Delay")).toBeInTheDocument();
  });

  it("renders without timelock when not configured", () => {
    const mockCurrent = vi.mocked(Tenant.current);
    mockCurrent.mockImplementation(
      () =>
        ({
          contracts: {
            token: {
              chain: {
                id: 1,
              },
            },
            governor: {
              chain: {
                id: 1,
              },
              address: "0x123",
            },
          },
          ui: {
            toggle: vi.fn(),
          },
        }) as any
    );

    render(<GovernorSettingsParams />);

    expect(screen.queryByText("Timelock Delay")).not.toBeInTheDocument();
  });
});
