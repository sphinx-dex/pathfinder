import React, { useState } from 'react';
import './App.css';
import { Stack, Paper, AppShell, Center, Button, Header, Text, Loader } from '@mantine/core';
import { TokenSelect } from './components/TokenSelect';
import { getRoute } from './api/routes';

function App() {
  
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState<number>();
  const [tokenIn, setTokenIn] = useState<string | null>();
  const [tokenOut, setTokenOut] = useState<string | null>();
  
  const onPreviewRoute = async () => {
    if (!amount || !tokenIn || !tokenOut) return;
    setLoading(true);
    const result = await getRoute({
      amountIn: amount,
      tokenIn: tokenIn,
      tokenOut: tokenOut
    });
    setLoading(false);
  }

  return (
    <AppShell
      header={
        <Header height={{ base: 50, md: 70 }} p="md">
          <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <Text>Sphinx Pathfinder</Text>
          </div>
        </Header>
      }
    >
      <Center>
        <Paper w={400} p={'lg'} pt={50} withBorder radius={'lg'}>
          <Stack spacing="xs">
            <TokenSelect onChange={(v) => setAmount(v)} onTokenSelected={(t) => setTokenIn(t)}/>
            <TokenSelect onChange={() => {}} disabled onTokenSelected={(t) => setTokenOut(t)}/>
            <Button
              disabled={loading}
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
