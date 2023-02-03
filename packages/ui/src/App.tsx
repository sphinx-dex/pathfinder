import React from 'react';
import './App.css';
import { Stack, Input, Paper, AppShell, Center, Button, Select, Header, Text } from '@mantine/core';
import { tokens } from './tokens';
import { SelectItem } from './components/SelectItem';

function App() {

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
            <Input
              variant="filled"
              placeholder="0"
              radius="md"
              size="xl"
              type={'number'}
              rightSectionWidth={130}
              rightSection={<Select
                itemComponent={SelectItem}
                mr={10}
                data={tokens}
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
              rightSectionWidth={130}
              rightSection={<Select
                itemComponent={SelectItem}
                mr={10}
                data={tokens}
                placeholder="Token"
                radius="xl"
              />}
            />
            <Button color="orange" mt={'xl'} radius="lg" size="xl">
              Preview Route
            </Button>
          </Stack>
        </Paper>
      </Center>
    </AppShell>
  )
}

export default App
