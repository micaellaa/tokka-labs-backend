import { ethers } from "ethers";
import { infuraWebSocketProvider } from "../utils/apiProviders.js";
import { getTransactionByHash } from "../services/transactionService.js";

const poolAddress = process.env.POOL_ADDRESS;
const transferEventSignature = ethers.id("Transfer(address,address,uint256)");

// Transfer Event Listener
export const transferEventListener = (io) => {
  console.log("in transferEventListener...");
  infuraWebSocketProvider.on({
    address: poolAddress,
    topics: [transferEventSignature]
  }, async (log) => {
    const transferEventAbi = [
      "event Transfer(address indexed from, address indexed to, uint256 value)"
    ];
    const iface = new ethers.Interface(transferEventAbi);
    const decodedLog = iface.parseLog(log);

    console.log(decodedLog.args);

    const transferEventData = {
      from: decodedLog.args.from,
      to: decodedLog.args.to,
      value: ethers.formatUnits(decodedLog.args.value, 18) // Adjust decimals based on token's decimals
    };

    // io.emit('transferEvent', transferEventData);

    try {
      const { txFeeEth, txFeeUsdt } = await getTransactionByHash(log.transactionHash);

      console.log(`Transaction Fee in ETH: ${txFeeEth} ETH`);
      console.log(`Transaction Fee in USDT: ${txFeeUsdt} USDT`);

      transferEventData.feeETH = txFeeEth;
      transferEventData.feeUSDT = txFeeUsdt;

      io.emit('transferEvent', transferEventData);
    } catch (error) {
      console.error("Error calculating transaction fee:", error);
    }
  });
};
