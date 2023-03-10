require('isomorphic-fetch')
import { Provider, Contract } from 'starknet';
import BN from 'bn.js';
const pairAbi = require('./abis/Pair.json')
const factoryAbi = require('./abis/Factory.json')
const orderBookAbi = require('./abis/OrderBook.json')

const ETH = '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7';
const USDC = '0x005a643907b9a4bc6a55e9069c4fd5fd1f5c79a22470690f75556c4736e34426';
const factoryAddress = '0x262744f8cea943dadc8823c318eaf24d0110dee2ee8026298f49a3bc58ed74a';
const orderBookAddress = '0x017c254cb2a3652455984e3da0ad97b377d80b62c4b87402c5b50c0f7bdd72f0';

function getAMMOutput(input: BN, reserveInput: BN, reserveOutput: BN): BN {
  return reserveOutput.sub(reserveInput.mul(reserveOutput).div(reserveInput.add(input.mul(new BN(997)).div(new BN(1000)))));
  // return reserveOutput - ((reserveInput * reserveOutput) / (reserveInput + (input * 0.997)));
}

interface Order {
  price: BN
  amount: BN
}

const printableOrder = (order: Order) => ({
  price: parseInt(order.price.toString()) / 1e18,
  amount: parseInt(order.amount.toString()) / 1e18,
})

function getPartialFill({ order, remainingInput, reserve0, reserve1, currentOrderOutput, bestOutput }: {
  order: Order,
  remainingInput: BN,
  reserve0: BN,
  reserve1: BN,
  currentOrderOutput: BN
  bestOutput: BN
}) {
  let amount = order.amount.div(new BN(2));

  const NUM_ITERATIONS = 10;

  for (let i = 0; i < NUM_ITERATIONS; i += 1) {
    const orderCost = order.price.mul(amount).div(new BN(10).pow(new BN(30)));

    const ammOut = getAMMOutput(remainingInput.sub(orderCost), reserve0, reserve1);
    const output = currentOrderOutput.add(order.amount).add(ammOut);

    if (output > bestOutput) {
      amount = amount.add(order.amount.div(new BN(2 ** i)));
    } else {
      amount = amount.sub(order.amount.div(new BN(2 ** i)));

      if (i == NUM_ITERATIONS - 1) {
        return null;
      }
    }
  }

  return { amount, price: order.price };
}

async function runSimulation(input: number) {
  const provider = new Provider({
    sequencer: {
      network: 'goerli-alpha',
    }
  });

  const orderBook = new Contract(orderBookAbi, orderBookAddress, provider);
  const { prices, amounts } = await orderBook.view_order_book_orders(ETH, USDC, 0);
  const orders: Order[] = (prices as any[]).map((price: BN, i) => ({ price, amount: amounts[i] as BN }));
  // @ts-ignore
  console.log(orders.map(printableOrder));

  const factory = new Contract(factoryAbi, factoryAddress, provider);
  const { pair } = await factory.get_pair(USDC, ETH);

  if (pair.toString() === '0') {
    throw new Error('Couldn\'t find pair');
  }

  const contract = new Contract(pairAbi, '0x' + pair.toString(16), provider);
  const { reserve0, reserve1 } = await contract.get_reserves();

  const ammMidPrice = reserve0.low.toString() / reserve1.low.toString() * 1e12;

  const ammOutput = getAMMOutput(new BN(input), reserve0.low, reserve1.low);
  const ammOutputPrice = input / parseInt(ammOutput.toString()) * 1e12;

  const selectedOrders: Order[] = [];

  let remainingInput = new BN(input);
  let bestOutput = ammOutput;
  let currentOrderOutput = new BN(0);

  for (const order of orders) {
    // console.log({ price: order.price.toString(), amount: order.amount.toString() })
    const orderCost = order.price.mul(order.amount).div(new BN(10).pow(new BN(30)));
    // @ts-ignore
    // console.log({orderCost: orderCost.toString() / 1e30 })
    if (orderCost.gt(remainingInput)) {
      const partialOrder = { amount: remainingInput, price: order.price }
      const partialFill = getPartialFill({
        order: partialOrder,
        remainingInput,
        reserve0: reserve0.low,
        reserve1: reserve1.low,
        currentOrderOutput,
        bestOutput,
      });
      if (partialFill) {
        selectedOrders.push(partialFill);
      }

      break;
    }

    const ammOut = getAMMOutput(remainingInput.sub(orderCost), reserve0.low, reserve1.low);

    const output = currentOrderOutput.add(order.amount).add(ammOut);

    if (output > bestOutput) {
      selectedOrders.push(order);
      remainingInput = remainingInput.sub(orderCost);
      bestOutput = output;
      currentOrderOutput = currentOrderOutput.add(order.amount);
    } else {
      const partialFill = getPartialFill({
        order,
        remainingInput,
        reserve0: reserve0.low,
        reserve1: reserve1.low,
        currentOrderOutput,
        bestOutput,
      });
      if (partialFill) {
        selectedOrders.push(partialFill);
      }
      break;
    }
  }

  // @ts-ignore
  const finalPrice = input / bestOutput.toString() * 1e12;

  console.log({
    finalPrice,
    ammMidPrice,
    ammOutputPrice,
    ammOutput: parseInt(ammOutput.toString()) / 1e18,
    bestOutput: parseInt(bestOutput.toString()) / 1e18,
    clobOutput: parseInt(currentOrderOutput.toString()) / 1e6,
    remainingInput: parseInt(remainingInput.toString()) / 1e6,
    selectedOrders: selectedOrders.map(printableOrder),
  })
}

runSimulation(60000 * 1e6)
