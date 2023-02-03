const { Provider, Contract } = require('starknet');
const pairAbi = require('./pair/Pair.json')
const factoryAbi = require('./pair/Factory.json')

const wbtc = '0x03fe2b97c1fd336e750087d68b9b867997fd64a2661ff3ca5a7c771641e8e7ac';
const usdt = '0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8';

const factoryAddress = '0xdad44c139a476c7a17fc8141e6db680e9abc9f56fe249a105094c44382c2fd';

(async function() {
  const provider = new Provider({
    sequencer: {
      network: 'mainnet-alpha' // or 'goerli-alpha'
    }
  })

  const factory = new Contract(factoryAbi, factoryAddress, provider);
  const { pair } = await factory.get_pair(wbtc, usdt);

  const contract = new Contract(pairAbi, '0x' + pair.toString(16), provider);
  const { reserve0, reserve1 } = await contract.get_reserves();
  console.log({ reserve0, reserve1 });
})()
