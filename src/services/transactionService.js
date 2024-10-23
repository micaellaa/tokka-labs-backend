import { infuraProvider, etherscanApi } from '../utils/apiProviders.js';
import { getEthToUsdt } from './ethPriceService.js';
import { ethers } from 'ethers';
import axios from 'axios';

// Fetch a single transaction by hash and calculate the fee
// Sample hash: 0x125e0b641d4a4b08806bf52c0c6757648c9963bcda8681e4f996f09e00d4c2cc
export const getTransactionByHash = async (txHash) => {
  const tx = await infuraProvider.getTransaction(txHash);
  console.log("tx", tx);
  if (!tx) throw new Error('Transaction not found');

  const receipt = await infuraProvider.getTransactionReceipt(txHash);
  console.log("receipt", receipt);

  const gasUsed = tx.gasLimit.toString();
  const gasPrice = tx.gasPrice.toString();
  const txFeeEth = ethers.formatEther(receipt.gasUsed.toString()) * ethers.formatUnits(gasPrice, 'gwei');

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

export const getHistoricalTransactionByTimeStamp = async (time) => {
  try {
    const params = {
      module: 'block',
      action: 'getblocknobytime',
      timestamp: time,
      closest: 'before'
    }
    const response = await etherscanApi.get('/api', {
      params
    });
    return response.data.result;
  } catch (e) {
    console.error("Error fetching historical transaction block no:", error.message);
    throw new Error('Failed to fetch historical transaction block no');
  }
}

export const getHistoricalTransactions = async (page, limit, txhash, startTime, endTime) => {
  // for Reference: https://etherscan.io/address/0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640#tokentxns
  try {
    const params = {
      module: 'account',
      action: 'tokentx',
      address: process.env.POOL_ADDRESS,
      startblock: 0,  
      endblock: 99999999, 
      sort: 'asc',
    }

    if (!txhash) {
      if (page) {
        params.page = page;
      }
      if (limit) {
        params.offset = limit;
      }
    }
    if (startTime && endTime) {
      const startblock = await getHistoricalTransactionByTimeStamp(startTime);
      const endblock = await getHistoricalTransactionByTimeStamp(endTime);
      params.startblock = startblock;
      params.endblock = endblock;
    }
    
    const response = await etherscanApi.get('/api', {
      params
    });
    let transactions = response.data.result;
    if (txhash) {
      if (txhash) {
        transactions = transactions.filter(tx => tx.hash.startsWith(txhash));
      }
    }
    // console.log(transactions.length)

    return transactions;
  } catch (error) {
    console.error("Error fetching historical transactions:", error.message);
    throw new Error('Failed to fetch historical transactions');
  }
};