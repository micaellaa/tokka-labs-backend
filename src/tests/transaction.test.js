// transaction.test.js
import request from 'supertest';
import express from 'express';
import transactionRoutes from '../routes/transactionRoutes.js'
import { getTransactionByHash, getHistoricalTransactions } from '../services/transactionService.js';
jest.mock('../services/transactionService.js');

const app = express();
app.use(express.json());
app.use("/transaction", transactionRoutes);

describe('Transaction Routes', () => {

  it('should fetch a transaction by hash', async () => {
    const mockTransaction = {
      txHash: '0x123',
      gasUsed: '100000',
      gasPrice: '20000000000',
      txFeeEth: 0.002,
      txFeeUsdt: 0.6
    };

    getTransactionByHash.mockResolvedValueOnce(mockTransaction);

    const response = await request(app).get('/transaction/getTransactionByHash/0x123');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockTransaction);
  });

  it('should fetch historical transactions', async () => {
    const mockTransactions = [{
      txHash: '0x456',
      gasUsed: '21000',
      gasPrice: '5000000000',
      feeETH: 0.001,
      feeUSDT: 0.3
    }];

    getHistoricalTransactions.mockResolvedValueOnce(mockTransactions);

    const response = await request(app).get('/transaction/getHistory?page=1&limit=1');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockTransactions);
  });

  it('should handle errors in fetch transaction by hash', async () => {
    getTransactionByHash.mockRejectedValueOnce(new Error('Transaction not found'));
    
    const response = await request(app).get('/transaction/getTransactionByHash/invalidHash');
    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Transaction not found');
  });

  it('should handle errors in fetch historical transactions', async () => {
    getHistoricalTransactions.mockRejectedValueOnce(new Error('Failed to fetch historical transactions'));

    const response = await request(app).get('/transaction/getHistory');
    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Failed to fetch historical transactions');
  });
});
