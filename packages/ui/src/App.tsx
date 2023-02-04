import React, { useState } from 'react';
import './App.css';
import { Stack, Paper, AppShell, Center, Button, Header, Text, Loader, Avatar, Group } from '@mantine/core';
import { TokenSelect } from './components/TokenSelect';
import { getRoute, GetRouteResponse } from './api/routes';
import { Results } from './components/Results';
import { tokens } from './tokens';
import logo from './assets/sphinx_logo.png'
import { ConnectWallet } from './components/ConnectWallet';

function App() {
  
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState<number>();
  const [amountOut, setAmountOut] = useState<number>();
  const [tokenIn, setTokenIn] = useState<string | undefined>();
  const [tokenOut, setTokenOut] = useState<string | undefined>();

  const [result, setResult] = useState<GetRouteResponse>();

  const valid = amount && tokenIn && tokenOut;
  
  const onPreviewRoute = async () => {
    if (!amount || !tokenIn || !tokenOut) return;
    try {
      setLoading(true);
      const response = await getRoute({
        amountIn: amount,
        tokenIn: tokenIn,
        tokenOut: tokenOut
      });
      setResult(response);
      setAmountOut(response.tokensOut);
    } catch (e) {
      console.warn(e);
    }
    setLoading(false);
  }

  const onParameterChanged = () => {
    setResult(undefined);
    setAmountOut(0);
  }

  return (
    <AppShell
      header={
        <Header height={{ base: 50, md: 70 }} p="md">
          <Group>
            <Avatar src={logo} alt={'sphinx'} size={'md'}></Avatar>
            <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
              <Text>Pathfinder</Text>
            </div>
          </Group>
          <Group>
            <ConnectWallet />
          </Group>
        </Header>
      }
    >
      <Center>
        <Paper w={450} p={'lg'} pt={50} withBorder radius={'lg'}>
          <Stack spacing="xs">
            <TokenSelect onChange={(v) => (setAmount(v), onParameterChanged())} onTokenSelected={(t) => (setTokenIn(t ?? undefined), onParameterChanged())}/>
            <TokenSelect value={amountOut?.toString()} onChange={() => {}} disabled onTokenSelected={(t) => (setTokenOut(t ?? undefined), onParameterChanged())}/>
            {result && 
            <Results 
              result={result} 
              tokenIn={tokens.find(t => t.value === tokenIn)!}
              tokenOut={tokens.find(t => t.value === tokenOut)!}/>
            }
            <Button
              disabled={loading || !valid}
              color={"orange"}
              mt={'xl'} 
              radius="lg" 
              size="xl" 
              onClick={onPreviewRoute} 
              leftIcon={loading && <Loader size={'xs'}/>}>
              {loading ? <Text color={'dimmed'}>Finding best route</Text> : 'Preview Route'}
            </Button>
          </Stack>
        </Paper>
      </Center>
    </AppShell>
  )
}

export default App
