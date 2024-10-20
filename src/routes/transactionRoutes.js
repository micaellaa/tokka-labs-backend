import express from 'express';
import { fetchTransactionByHash, fetchHistoricalTransactions } from '../controllers/transactionController.js';

const router = express.Router();

// Test
router.get('/', async (req, res) => {
  try {
    res.status(200).json("Testing default");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get History
router.get('/getHistory', fetchHistoricalTransactions);

// Fetch a transaction by hash
router.get('/getTransactionByHash/:txHash', fetchTransactionByHash);


export default router;
