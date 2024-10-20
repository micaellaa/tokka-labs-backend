import { ethers } from 'ethers';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export const infuraProvider = new ethers.InfuraProvider('mainnet', {
  apiKey: process.env.INFURA_API_KEY,
  secret: process.env.INFURA_API_KEY_SECRET
});

export const infuraWebSocketProvider = new ethers.InfuraWebSocketProvider(
  "mainnet",
  process.env.INFURA_API_KEY
);

export const etherscanApi = axios.create({
  baseURL: 'https://api.etherscan.io',
  params: {
    apikey: process.env.ETHERSCAN_API_KEY,
  },
});