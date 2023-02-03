require('isomorphic-fetch')
const { Provider, Contract } = require('starknet');
const pairAbi = require('./pair/Pair.json')
const factoryAbi = require('./pair/Factory.json')

const ETH = '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7';
const USDC = '0x005a643907b9a4bc6a55e9069c4fd5fd1f5c79a22470690f75556c4736e34426';
const factoryAddress = '0x262744f8cea943dadc8823c318eaf24d0110dee2ee8026298f49a3bc58ed74a';

async function runSimulation() {
  const orderRes = await fetch("https://www.sphnx.xyz/api/view-order-book", {
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      baseAsset: ETH,
      quoteAsset: USDC,
      isBid: 0,
    }),
    method: "POST",
  });
  const { orders } = await orderRes.json();
  console.log(orders)

  const provider = new Provider({
    sequencer: {
      network: 'goerli-alpha',
    }
  })

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
