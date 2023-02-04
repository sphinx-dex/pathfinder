import React, { useState } from 'react';
import './App.css';
import { Stack, Paper, AppShell, Center, Button, Header, Text, Loader, Avatar, Group } from '@mantine/core';
import { TokenSelect } from './components/TokenSelect';
import { getCalls, getRoute, GetRouteResponse } from './api/routes';
import { Results } from './components/Results';
import { tokens } from './tokens';
import logo from './assets/sphinx_logo.png'
import { ConnectWallet } from './components/ConnectWallet';
import { StarknetWindowObject } from 'get-starknet';
import routerAbi from './abis/Router.json';
import orderBookAbi from './abis/OrderBook.json';

const ETH = '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7';
const USDC = '0x005a643907b9a4bc6a55e9069c4fd5fd1f5c79a22470690f75556c4736e34426';

function App() {
  
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState<number>();
  const [amountOut, setAmountOut] = useState<number>();
  const [tokenIn, setTokenIn] = useState<string | undefined>();
  const [tokenOut, setTokenOut] = useState<string | undefined>();
  const [wallet, setWallet] = useState<StarknetWindowObject | null>(null);

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

  const onSwap = () => {
    if (!wallet || !wallet.account) {
      console.log(wallet)
      throw new Error('No Wallet')
    }
    if (!result) {
      throw new Error('No results');
    }
    const calls = getCalls(result.ammPair, result.routes[0].amount, result.routes[1].amount, wallet.account.address, USDC, ETH);
    wallet.account?.execute(calls, [routerAbi, orderBookAbi])
  }

  return (
    <AppShell
      header={
        <Header height={70} p="md">
          <div style={{ display:'flex', justifyContent:'space-between' }}>
            <Group>
              <Avatar src={logo} alt={'sphinx'} size={'md'}></Avatar>
              <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                <Text>Pathfinder</Text>
              </div>
            </Group>
            <Group>
              <ConnectWallet onWalletChange={setWallet} />
            </Group>
          </div>
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
              onClick={result ? onSwap : onPreviewRoute} 
              leftIcon={loading && <Loader size={'xs'}/>}>
              
              {loading ? 
                <Text color={'dimmed'}>Finding best route</Text> : 
                result ? 'Swap' : 'Preview Route'}
            </Button>
          </Stack>
        </Paper>
      </Center>
    </AppShell>
  )
}

export default App
