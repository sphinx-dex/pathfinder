require('isomorphic-fetch')

const ETH = '0x050fe7f38d5276a7a53f7d525f08bc93bd8c37c0db318fcb68f24e3d29283925';
const USDC = '0x02bf326f9c2224ea7a206da512238b314ba07f8b2e4e59e101daa83b8db19018';

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
}

runSimulation()
