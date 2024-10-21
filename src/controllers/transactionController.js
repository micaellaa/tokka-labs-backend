import { getTransactionByHash, getHistoricalTransactions } from '../services/transactionService.js';
import { getEthToUsdt } from "../services/ethPriceService.js"
import dotenv from 'dotenv';

dotenv.config();

export const fetchTransactionByHash = async (req, res) => {
  const { txHash } = req.params;
  try {
    
    const transaction = await getTransactionByHash(txHash);

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const fetchHistoricalTransactions = async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    // Optional search params
    const txhash = req.query.txhash || null;
    const startTime = req.query.startTime ? parseFloat(req.query.startTime) : null;
    const endTime = req.query.endTime ? parseFloat(req.query.endTime) : null;

    const ethToUsdtRate = await getEthToUsdt();
    const transactions = await getHistoricalTransactions(page, limit, txhash, startTime, endTime);

    res.status(200).json(transactions.map(tx => ({
      feeETH: (tx.gasUsed * tx.gasPrice) / 1e18,
      feeUSDT: (tx.gasUsed * tx.gasPrice * ethToUsdtRate) / 1e18,
      ...tx
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
