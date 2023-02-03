
export interface GetRouteProps {
  tokenIn: string;
  tokenOut: string;
  amountIn: number;
}

export interface Route {
  amm: string;
  type: string;
  pair: {
    in: string;
    out: string; 
  }
  proportion: number;
}

export interface GetRouteResponse {
  originalPrice: number; // expressed in %
  priceRoutingImpact: number; // expressed in %
  slippageReduction: number; // expressed in %
  routes: Route[];
  tokensOut: number;
  originalTokensOut: number;
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function getRoute(props: GetRouteProps): Promise<GetRouteResponse> {
  await sleep(2000);
  return {
    originalPrice: -0.2,
    priceRoutingImpact: -0.02,
    slippageReduction: -0.33,
    tokensOut: 1002,
    originalTokensOut: 889,
    routes: [
      {
        amm: 'Jediswap',
        type: 'AMM V2',
        pair: {
          in: 'ETH',
          out: 'USDC'
        },
        proportion: 0.2
      },
      {
        amm: 'Sphinx',
        type: 'Orderbook',
        pair: {
          in: 'ETH',
          out: 'USDC'
        },
        proportion: 0.8
      }
    ]
  };
}