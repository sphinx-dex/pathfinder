import React from 'react';
import './App.css';
import { Stack, Input, Paper, AppShell, Center, Button, Select } from '@mantine/core';

const symbols = ['USDC', 'ETH'];

function App() {
  return (
    <AppShell>
      <Center>
        <Paper w={400} p={'lg'} pt={50} withBorder radius={'lg'}>
          <Stack spacing="xs">
            <Input
              variant="filled"
              placeholder="0"
              radius="md"
              size="xl"
              type={'number'}
              rightSectionWidth={100}
              rightSection={<Select
                mr={10}
                data={symbols}
                placeholder="Token"
                radius="xl"
              />}
            />
            <Input
              variant="filled"
              placeholder="0"
              radius="md"
              size="xl"
              type={'number'}
              rightSectionWidth={100}
              rightSection={<Select
                mr={10}
                data={symbols}
                placeholder="Token"
                radius="xl"
              />}
            />
            <Button color="orange" mt={'xl'} radius="lg" size="xl">
              Preview
            </Button>
          </Stack>
        </Paper>
      </Center>
    </AppShell>
  )
}

export default App
