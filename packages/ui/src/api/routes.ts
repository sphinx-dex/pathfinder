
import { Provider, Contract, Call } from 'starknet';
import routerAbi from '../abis/Router.json';
import orderBookAbi from '../abis/OrderBook.json';
import { runSimulation, SimulationResponse } from "../services/simulation";
import BN from 'bn.js';

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
  amount: BN;
  proportion: number;
}

export interface GetRouteResponse {
  originalPriceImpact: number; // expressed in %
  priceRoutingImpact: number; // expressed in %
  slippageReduction: number; // expressed in %
  routes: Route[];
  tokensOut: number;
  originalTokensOut: number;
  ammPair: string;
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
  const [sphinxProportion, jediswapProportion] = getProportions(props.amountIn, parseInt(result.remainingInput.toString()) / 1e6);
  return {
    originalPriceImpact: originalPriceImpact,
    priceRoutingImpact: afterPriceRoutingImpact,
    slippageReduction: originalPriceImpact - afterPriceRoutingImpact,
    tokensOut: result.bestOutput,
    originalTokensOut: result.ammOutput,
    ammPair: result.ammPair,
    routes: [
      {
        amm: 'Sphinx',
        type: 'Orderbook',
        pair: {
          in: 'ETH',
          out: 'USDC'
        },
        amount: result.selectedOrders.reduce((sum, order) => order.amount, new BN(0)),
        proportion: sphinxProportion * 100
      },
      {
        amm: 'Jediswap',
        type: 'AMM V2',
        pair: {
          in: 'ETH',
          out: 'USDC'
        },
        amount: result.remainingInput,
        proportion: jediswapProportion * 100
      }
    ]
  };
}

const orderBookAddress = '0x017c254cb2a3652455984e3da0ad97b377d80b62c4b87402c5b50c0f7bdd72f0';
const routerAddress = '0x262744f8cea943dadc8823c318eaf24d0110dee2ee8026298f49a3bc58ed74a';

export function getCalls(pairAddr: string, clobAmount: BN, ammAmount: BN, walletAddr: string, baseAsset: string, quoteAsset: string): Call[] {
  const provider = new Provider({
    sequencer: {
      network: 'goerli-alpha',
    }
  });

  const orderBook = new Contract(orderBookAbi, orderBookAddress, provider);
  const router = new Contract(routerAbi, routerAddress, provider);

  const clobTx = orderBook.populateTransaction.market_buy(baseAsset, quoteAsset, clobAmount)
  const routerTx = router.populateTransaction.swap_exact_tokens_for_tokens({ low: ammAmount, high: new BN(0) }, { low: new BN(0), high: new BN(0) }, [pairAddr], walletAddr, new BN(100000000000));

  return [clobTx, routerTx];
}
