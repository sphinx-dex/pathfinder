import { Divider, Group, Paper, Text } from "@mantine/core";
import { GetRouteResponse } from "../api/routes";

interface ResutsProps {
  result: GetRouteResponse;
  tokenOut?: string | null;
}

function ResultLine({name, result}: {name: string, result: string}) {
  return (
    <Group my={10} style={{ justifyContent: 'space-between'}}>
      <Text >
        {name}
      </Text>
      <span style={{color: '#0fe337', fontWeight: 'bold', textAlign:'right'}}>{result}</span>
    </Group>
  );

}

export function Results({result, tokenOut}: ResutsProps) {
  return (
    <Paper style={{ textAlign: 'start', background: '#2C2E33' }} p={'md'}>

      <ResultLine name={'Original price impact on Jediswap'} result={`${result.originalPriceImpact.toFixed(2)}%`}/>
      <Divider></Divider>
      <ResultLine name={'After price routing impact'} result={`${result.priceRoutingImpact * 100}%`}/>
      <Divider></Divider>
      <ResultLine name={'Slippage reduction'} result={`${result.slippageReduction * 100}%`}/>
      <Divider></Divider>

      <Group my={10} style={{ justifyContent: 'space-between'}}>
        <Text>Additional tokens received </Text>
        <span style={{ fontWeight: 'bold'}}>{result.originalTokensOut + ' -> ' + result.tokensOut}</span>
      </Group>
      
    </Paper>
  );
}