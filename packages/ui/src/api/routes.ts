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
  if (ammOutputPrice === 0) return 0;
  const diff = ammOutputPrice - ammMidPrice;
  const proportionalDiff = diff / ammMidPrice;
  return proportionalDiff * 100;
}

function getAfterPriceRoutingImpact({ammMidPrice, finalPrice}: SimulationResponse) {
  if (finalPrice === 0) return 0;
  const diff = finalPrice - ammMidPrice;
  const proportionalDiff = diff / ammMidPrice;
  return proportionalDiff * 100;
}

function getSlippageReduction({ ammMidPrice, ammOutputPrice, finalPrice }: SimulationResponse) {
  const slippageWithoutRouting = ammOutputPrice - ammMidPrice;
  const slippageWithRouting = finalPrice - ammMidPrice;
  if (slippageWithoutRouting === 0) return 0;

  const diff = slippageWithRouting - slippageWithoutRouting ;
  const proportionalDiff = diff / slippageWithoutRouting;
  return proportionalDiff * 100;
}

function getProportions(input: number, remainingInput: number): [jediswap: number, sphinx: number] {
  const diff = input - remainingInput;

  const jediswapProportion = diff / input;
  const sphinxProportion = 1 - jediswapProportion;
  return [jediswapProportion, sphinxProportion];
}

export async function getRoute(props: GetRouteProps): Promise<GetRouteResponse> {
  const result: SimulationResponse = await runSimulation(props.amountIn * 1e6);
  const originalPriceImpact = getOriginalPriceImpact(result);
  const afterPriceRoutingImpact = getAfterPriceRoutingImpact(result);
  const [sphinxProportion, jediswapProportion] = getProportions(props.amountIn, result.remainingInput);
  return {
    originalPriceImpact: originalPriceImpact,
    priceRoutingImpact: afterPriceRoutingImpact,
    slippageReduction: originalPriceImpact - afterPriceRoutingImpact,
    tokensOut: result.bestOutput,
    originalTokensOut: result.ammOutput,
    routes: [
      {
        amm: 'Sphinx',
        type: 'Orderbook',
        pair: {
          in: 'ETH',
          out: 'USDC'
        },
        proportion: sphinxProportion * 100
      },
      {
        amm: 'Jediswap',
        type: 'AMM V2',
        pair: {
          in: 'ETH',
          out: 'USDC'
        },
        proportion: jediswapProportion * 100
      }
    ]
  };
}

