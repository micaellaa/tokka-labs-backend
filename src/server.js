import express from 'express';
import { ethers } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Infura provider
// const provider = new ethers.providers.InfuraProvider('mainnet', {
//   projectId: process.env.INFURA_API_KEY,
//   projectSecret: process.env.INFURA_API_KEY_SECRET
// });

// const provider = new ethers.providers.InfuraProvider('mainnet', process.env.INFURA_API_KEY);

const provider = new ethers.InfuraProvider('mainnet', {
  apiKey: process.env.INFURA_API_KEY,
  secret: process.env.INFURA_API_KEY_SECRET
});

app.get('/', (req, res) => {
  res.send('test-message');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get('/transaction/:txHash', async (req, res) => {
  const { txHash } = req.params;

  try {
    const tx = await provider.getTransaction(txHash);
    if (!tx) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    const receipt = await provider.getTransactionReceipt(txHash);
    const gasUsed = ethers.utils.formatEther(receipt.gasUsed.toString());
    const gasPrice = ethers.utils.formatUnits(tx.gasPrice.toString(), 'gwei');
    const txFeeEth = Number(gasUsed) * Number(gasPrice);

    // Fetch current ETH to USDT price using an API (e.g., Binance)
    const ethToUsdtRate = await getEthToUsdt();
    const txFeeUsdt = txFeeEth * ethToUsdtRate;

    res.json({
      txHash,
      gasUsed,
      gasPrice,
      txFeeEth,
      txFeeUsdt
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const getEthToUsdt = async () => {
  try {
    const response = await axios.get('https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT');
    return parseFloat(response.data.price);
  } catch (error) {
    console.error('Error fetching ETH/USDT price:', error);
    return 0;
  }
};

