import { runSimulation, SimulationResponse } from "../services/simulation";

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
  originalPriceImpact: number; // expressed in %
  priceRoutingImpact: number; // expressed in %
  slippageReduction: number; // expressed in %
  routes: Route[];
  tokensOut: number;
  originalTokensOut: number;
}

function getOriginalPriceImpact({ammMidPrice, ammOutputPrice}: SimulationResponse) {
  const difference =  ammMidPrice - ammOutputPrice;
  if (difference === 0) return 0;
  const proportionDiff = difference / ammMidPrice;
  return proportionDiff * 100;
}


export async function getRoute(props: GetRouteProps): Promise<GetRouteResponse> {

  const result: SimulationResponse = await runSimulation(6000 * 1e6);
  console.log(result);



  return {
    originalPriceImpact: getOriginalPriceImpact(result),
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

