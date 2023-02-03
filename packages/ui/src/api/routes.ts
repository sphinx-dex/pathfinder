
export interface GetRouteProps {
  tokenIn: string;
  tokenOut: string;
  amountIn: number;
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function getRoute(props: GetRouteProps) {
  await sleep(2000);
  return {};
}