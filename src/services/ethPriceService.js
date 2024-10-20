import axios from "axios";

export const getEthToUsdt = async () => {
  const response = await axios.get('https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT');
  return parseFloat(response.data.price);
};
