import { Avatar, Center, Divider, Group, Paper, Grid, Stack, Text, Badge } from "@mantine/core";
import { GetRouteResponse } from "../api/routes";
import Xarrow from "react-xarrows";
import { useRef } from "react";

interface ResutsProps {
  result: GetRouteResponse;
  tokenIn: CoinBadgeProps,
  tokenOut: CoinBadgeProps 
}

interface CoinBadgeProps {
  label: string, 
  image: string
}

function CoinBadge({label, image}: CoinBadgeProps) {
  return (
    <Center>
      <Group noWrap display={'table-column'}>
        <Avatar id={label} size={'sm'} src={image}/>
        <Text size="sm">{label}</Text>
      </Group>
    </Center>

  );
}

function TokenPair({ token1 , token2 }: {token1: CoinBadgeProps, token2: CoinBadgeProps}) {
  return (
    <Avatar.Group spacing="sm">
      <Avatar radius={100} size={'sm'} src={token1.image}/>
      <Avatar radius={100} size={'sm'} src={token2.image}/>
    </Avatar.Group>
  );
}

function ResultLine({ name, result }: {name: string, result: string }) {
  return (
    <Group my={10} style={{ justifyContent: 'space-between'}}>
      <Text >
        {name}
      </Text>
      <span style={{color:  '#0fe337', fontWeight: 'bold', textAlign:'right'}}>{result}</span>
    </Group>
  );
}

export function Results({result, tokenIn, tokenOut}: ResutsProps) {

  const tokenInRef = useRef(null);
  const proportion1Ref = useRef(null);
  const proportion2Ref = useRef(null);

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
        <Grid>
          <Xarrow
            strokeWidth={2}
            start={tokenIn.label}
            end={proportion1Ref}
            dashness
            showHead={false}
          />

          <Xarrow
            strokeWidth={2}
            start={tokenIn.label}
            end={proportion2Ref}
            dashness
            showHead={false}
          />

          <Xarrow
            strokeWidth={2}
            start={proportion1Ref}
            end={tokenOut.label}
            dashness
            showHead={false}
          />

          <Xarrow
            strokeWidth={2}
            start={proportion2Ref}
            end={tokenOut.label}
            dashness
            showHead={false}

          />

          <Grid.Col span={2} display={'flex'}>
            <CoinBadge {...tokenIn} />
          </Grid.Col>
          
          <Grid.Col span={8}>
            <Center style={{ flexDirection: 'column'}}>
              <Badge ref={proportion1Ref} m={20} color={'violet'}>
                <Text >
                  {result.routes[0].amm} - {result.routes[0].proportion.toFixed(2)}%
                </Text>
              </Badge>
                <TokenPair token1={tokenIn} token2={tokenOut}/>
              <Badge ref={proportion2Ref} m={20} color={'orange'}>
                <Text >
                  {result.routes[1].amm} - {result.routes[1].proportion.toFixed(2)}%
                </Text>
              </Badge>
            </Center>
          </Grid.Col>

          <Grid.Col span={2} display={'flex'}>
            <CoinBadge {...tokenOut} />
          </Grid.Col>
        </Grid>
      </Paper>
    </Stack>

  );
}