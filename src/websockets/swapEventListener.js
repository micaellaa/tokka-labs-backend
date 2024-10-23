import { ethers } from "ethers";
import { infuraWebSocketProvider } from "../utils/apiProviders.js";
import { getTransactionByHash } from "../services/transactionService.js";

const poolAddress = process.env.POOL_ADDRESS;
const swapEventSignature = ethers.id(
  "Swap(address,address,int256,int256,uint160,uint128,int24)"
);

export const swapEventListener = (io) => {
  console.log("in swapEventListener...")
  infuraWebSocketProvider.on({
    address: poolAddress,
    topics: [swapEventSignature]
  }, async (log) => {
    const swapEventAbi = [
      "event Swap(address indexed sender, address indexed recipient, int256 amount0, int256 amount1, uint160 sqrtPriceX96, uint128 liquidity, int24 tick)"
    ];
    const iface = new ethers.Interface(swapEventAbi);
    const decodedLog = iface.parseLog(log);

    console.log(decodedLog.args)

    const swapEventData = {
      sender: decodedLog.args.sender,
      recipient: decodedLog.args.recipient,
      amount0: decodedLog.args.amount0.toString(),
      amount1: decodedLog.args.amount1.toString(),
      price: decodedLog.args.sqrtPriceX96.toString(),
      liquidity: decodedLog.args.liquidity.toString(),
      tick: decodedLog.args.tick.toString()
    };

    io.emit('swapEvent', swapEventData);

    try {
      const { txFeeEth, txFeeUsdt } = await getTransactionByHash(log.transactionHash);

      console.log(`Transaction Fee in ETH: ${txFeeEth} ETH`);
      console.log(`Transaction Fee in USDT: ${txFeeUsdt} USDT`);

      // // Emit the transaction fee data
      // io.emit('transactionFee', { txFeeEth, txFeeUsdt });

      swapEventData.feeETH = txFeeEth;
      swapEventData.feeUSDT = txFeeEth;

      io.emit('swapEvent', swapEventData);
    } catch (error) {
      console.error("Error calculating transaction fee:", error);
    }
  });
};
