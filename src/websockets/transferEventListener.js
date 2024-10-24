import { ethers } from "ethers";
import { infuraWebSocketProvider } from "../utils/apiProviders.js";
import { getTransactionByHash } from "../services/transactionService.js";

const poolAddress = process.env.POOL_ADDRESS;
const transferEventSignature = ethers.id("Transfer(address,address,uint256)");

// Transfer Event Listener
export const transferEventListener = (io) => {
  infuraWebSocketProvider.on({
    address: poolAddress,
    topics: [transferEventSignature]
  }, async (log) => {
    // console.log(log);
    const transferEventAbi = [
      "event Transfer(address indexed from, address indexed to, uint256 value)"
    ];
    const iface = new ethers.Interface(transferEventAbi);
    const decodedLog = iface.parseLog(log);
    // console.log(decodedLog.args);

    const transferEventData = {
      from: decodedLog.args.from,
      to: decodedLog.args.to,
      value: ethers.formatUnits(decodedLog.args.value, 18) // Adjust decimals based on token's decimals
    };

    try {
      const { txFeeEth, txFeeUsdt } = await getTransactionByHash(log.transactionHash);

      transferEventData.feeETH = txFeeEth;
      transferEventData.feeUSDT = txFeeUsdt;

      io.emit('transferEvent', transferEventData);
    } catch (error) {
      console.error("Error calculating transaction fee:", error);
    }
  });
};
