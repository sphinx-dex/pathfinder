import { Divider, Group, Paper, Text } from "@mantine/core";
import { GetRouteResponse } from "../api/routes";

interface ResutsProps {
  result: GetRouteResponse;
  tokenOut?: string | null;
}

export function Results({result, tokenOut}: ResutsProps) {
  return (
    <Paper style={{ textAlign: 'start', background: '#2C2E33' }} p={'md'}>
      <Group my={10} style={{ justifyContent: 'space-between'}}>
        <Text >
          Original price impact on Jediswap
        </Text>
        <span style={{color: '#0fe337', fontWeight: 'bold', textAlign:'right'}}>{result.originalPrice * 100}%</span>
      </Group>

      <Divider></Divider>

      <Group my={10} style={{ justifyContent: 'space-between'}}>
        <Text>
          After price routing impact
        </Text>
        <span style={{color: '#0fe337', fontWeight: 'bold'}}>{result.priceRoutingImpact * 100}%</span>
      </Group>

      <Divider></Divider>

      <Group my={10} style={{ justifyContent: 'space-between'}}>
        <Text>
          Slippage reduction
        </Text>
        <span style={{color: '#0fe337', fontWeight: 'bold'}}>{result.slippageReduction * 100}%</span>
      </Group>

      <Divider></Divider>

      <Group my={10} style={{ justifyContent: 'space-between'}}>
        <Text>Additional tokens received </Text>
        <span style={{ fontWeight: 'bold'}}>{result.originalTokensOut + ' -> ' + result.tokensOut}</span>
      </Group>
      
    </Paper>
  );
}