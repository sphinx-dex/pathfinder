require('isomorphic-fetch')
const { Provider, Contract } = require('starknet');
const pairAbi = require('./abis/Pair.json')
const factoryAbi = require('./abis/Factory.json')
const orderBookAbi = require('./abis/OrderBook.json')


function getOutput(input, reserveInput, reserveOutput) {
  return reserveOutput - ((reserveInput * reserveOutput) / (reserveInput + (input * 0.997)));
}

const ETH = '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7';
const USDC = '0x005a643907b9a4bc6a55e9069c4fd5fd1f5c79a22470690f75556c4736e34426';
const factoryAddress = '0x262744f8cea943dadc8823c318eaf24d0110dee2ee8026298f49a3bc58ed74a';
const orderBookAddress = '0x017c254cb2a3652455984e3da0ad97b377d80b62c4b87402c5b50c0f7bdd72f0';

async function runSimulation() {
  const provider = new Provider({
    sequencer: {
      network: 'goerli-alpha',
    }
  })

  const orderBook = new Contract(orderBookAbi, orderBookAddress, provider);
  const { prices, amounts } = await orderBook.view_order_book(ETH, USDC, 0);
  const orders = prices.map((price, i) => ({ price, amount: amounts[i] }));
  console.log(orders);

  const factory = new Contract(factoryAbi, factoryAddress, provider);
  const { pair } = await factory.get_pair(USDC, ETH);

  if (pair.toString() === '0') {
    throw new Error('Couldn\'t find pair');
  }

  const contract = new Contract(pairAbi, '0x' + pair.toString(16), provider);
  const { reserve0, reserve1 } = await contract.get_reserves();
  console.log({ reserve0, reserve1 });
}

runSimulation()
