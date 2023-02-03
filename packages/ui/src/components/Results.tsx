import { Divider, Group, Paper, Stack, Text } from "@mantine/core";
import { GetRouteResponse } from "../api/routes";

interface ResutsProps {
  result: GetRouteResponse;
  tokenOut?: string | null;
}

function ResultLine({name, result }: {name: string, result: string }) {
  return (
    <Group my={10} style={{ justifyContent: 'space-between'}}>
      <Text >
        {name}
      </Text>
      <span style={{color:  '#0fe337', fontWeight: 'bold', textAlign:'right'}}>{result}</span>
    </Group>
  );
}

export function Results({result, tokenOut}: ResutsProps) {
  return (
    <Stack>
      <Paper style={{ textAlign: 'start', background: '#2C2E33' }} p={'md'}>
        <ResultLine name={'Original price impact on Jediswap'} result={`+${result.originalPriceImpact.toFixed(2)}%`}/>
        <Divider></Divider>
        <ResultLine name={'After price routing impact'} result={`+${result.priceRoutingImpact.toFixed(2)}%`}/>
        <Divider></Divider>
        <ResultLine name={'Slippage reduction'} result={`${result.slippageReduction.toFixed(2)}%`}/>
        <Divider></Divider>

        <Group my={10} style={{ justifyContent: 'space-between'}}>
          <Text> Price reduction </Text>
          <span style={{ fontWeight: 'bold'}}>{result.originalTokensOut.toFixed(2) + ' -> ' + result.tokensOut.toFixed(2)}</span>
        </Group>
      </Paper>

      <Paper style={{ textAlign: 'start', background: '#2C2E33' }} p={'md'}>
        <div>
          {result.routes[0].amm} {result.routes[0].proportion.toFixed(2)}%
        </div>
        <div>
          {result.routes[1].amm} {result.routes[1].proportion.toFixed(2)}%
        </div>
      </Paper>
    </Stack>

  );
}