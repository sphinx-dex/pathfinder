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

function ResultLine({ name, result, color }: {name: string, result: string, color: string }) {
  return (
    <Group my={10} style={{ justifyContent: 'space-between'}}>
      <Text >
        {name}
      </Text>
      <span style={{color , fontWeight: 'bold', textAlign:'right'}}>{result}</span>
    </Group>
  );
}

export function Results({result, tokenIn, tokenOut}: ResutsProps) {
  const proportion1Ref = useRef(null);
  const proportion2Ref = useRef(null);

  return (
    <Stack>
      <Paper radius={20} style={{ textAlign: 'start', background: '#2C2E33' }} p={'md'}>
        <ResultLine name={'Original slippage on Jediswap'} color={'red'} result={`${result.originalPriceImpact.toFixed(2)}%`}/>
        <Divider></Divider>
        <ResultLine name={'Slippage after routing optimization'} color={'rgb(243 138 32)'} result={`${result.priceRoutingImpact.toFixed(2)}%`}/>
        <Divider></Divider>
        <ResultLine name={'Slippage reduction'} color={'#0fe337'} result={`+${result.slippageReduction.toFixed(2)}%`}/>
        <Divider></Divider>

        <Group my={10} style={{ justifyContent: 'space-between'}}>
          <Text>Tokens gained</Text>
          <div>
          <span style={{color: 'red', fontWeight: 'bold'}}>{result.originalTokensOut.toFixed(2)} {tokenOut.label}</span>
          {" -> "}
          <span style={{color: 'rgb(15 227 55)',fontWeight: 'bold'}}>{result.tokensOut.toFixed(2)} {tokenOut.label}</span>
          </div>
        </Group>
      </Paper>

      <Paper radius={20} style={{ textAlign: 'start', background: '#2C2E33' }} p={'md'}>
        <Grid>
          <Xarrow
            lineColor={'gray'}
            strokeWidth={2}
            start={tokenIn.label}
            end={proportion1Ref}
            dashness
            showHead={false}
          />

          <Xarrow
            lineColor={'gray'}
            strokeWidth={2}
            start={tokenIn.label}
            end={proportion2Ref}
            dashness
            showHead={false}
          />

          <Xarrow
            lineColor={'gray'}
            strokeWidth={2}
            start={proportion1Ref}
            end={tokenOut.label}
            dashness
            showHead={false}
          />

          <Xarrow
            lineColor={'gray'}
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
              <Badge ref={proportion1Ref} m={20} size="lg" color={'orange'}>
                <Text >
                  {result.routes[0].amm} - {result.routes[0].proportion.toFixed(2)}%
                </Text>
              </Badge>
                <TokenPair token1={tokenIn} token2={tokenOut}/>
              <Badge ref={proportion2Ref} m={20} size="lg" color={'violet'}>
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