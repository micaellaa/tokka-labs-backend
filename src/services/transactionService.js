import { infuraProvider, etherscanApi } from '../utils/apiProviders.js';
import { getEthToUsdt } from './ethPriceService.js';
import axios from 'axios';

// Fetch a single transaction by hash and calculate the fee
// Sample hash: 0x125e0b641d4a4b08806bf52c0c6757648c9963bcda8681e4f996f09e00d4c2cc
export const getTransactionByHash = async (txHash) => {
  const tx = await infuraProvider.getTransaction(txHash);
  if (!tx) throw new Error('Transaction not found');

  const receipt = await infuraProvider.getTransactionReceipt(txHash);
  const gasUsed = tx.gasLimit.toString();
  const gasPrice = tx.gasPrice.toString();
  const txFeeEth = ethers.utils.formatEther(receipt.gasUsed.toString()) * ethers.utils.formatUnits(gasPrice, 'gwei');

  const ethToUsdtRate = await getEthToUsdt();
  const txFeeUsdt = txFeeEth * ethToUsdtRate;

  return {
    txHash,
    gasUsed,
    gasPrice,
    txFeeEth,
    txFeeUsdt,
  };
};

export const getHistoricalTransactions = async () => {
  // for Reference: https://etherscan.io/address/0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640#tokentxns

  try {
    const response = await etherscanApi.get('/api', {
      params: {
        module: 'account',
        action: 'tokentx',
        address: process.env.POOL_ADDRESS,
      },
    });

    return response;
  } catch (error) {
    console.error("Error fetching historical transactions:", error.message);
    throw new Error('Failed to fetch historical transactions');
  }
};