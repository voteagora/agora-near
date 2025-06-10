// Cast for more accurate arithmetic
import Tenant from "@/lib/tenant/tenant";
import { Block } from "ethers";

const { contracts, ui } = Tenant.current();

const chainId = ui.toggle("use-l1-block-number")?.enabled
  ? contracts.chainForTime?.id
  : contracts.token.chain.id;

const forceTokenChainId = contracts.token.chain.id;

export function secondsToBlocks(seconds: number): number {
  return Math.floor(seconds / getSecondsPerBlock(chainId));
}

export function blocksToSeconds(blocks: number): number {
  return blocks * getSecondsPerBlock(chainId);
}

export function getSecondsPerBlock(chainId: number | undefined): number {
  switch (chainId) {
    case 10: // Optimism
      return 2;

    case 534352: // Scroll
      return 3;

    case 42161: // Arbitrum one
    case 421614: // Arbitrum sepolia
      return 0.25;

    case 901: // Derive
    case 957: // Derive Testnet
      return 2;

    case 7560: // Cyber Mainnet
    case 111557560: // Cyber Testnet
      return 2;

    case 1: // Eth Mainnet
    case 11155111: // Sepolia Testnet
      return 12;

    case 8453: // Base Mainnet
      return 2;

    default:
      throw new Error(`Block time for chain:${chainId} not specified`);
  }
}

/*
 * @param {number} blockNumber
 * @param {Block} latestBlock
 * @returns {Date}
 * @description Converts a block number to a human-readable date
 */
export function getHumanBlockTime(
  blockNumber: number,
  referenceTime: number,
  referenceBlock: number
) {
  const refDate = new Date(referenceTime / 1000000);
  const blockDiff = blockNumber - referenceBlock;
  const estimatedDate = new Date(refDate.getTime() + blockDiff * 1000);
  return estimatedDate;
}
