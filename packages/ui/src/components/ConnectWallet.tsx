import { connect, disconnect } from "get-starknet"
import { Button } from "@mantine/core";
import { useState } from "react";
import { type StarknetWindowObject } from "get-starknet-core";

export function ConnectWallet() {
  const [wallet, setWallet] = useState<StarknetWindowObject | null>(null);

  const connectWallet = async () => {
    const wallet = await connect();
    setWallet(wallet)
  }

  const disconnectWallet = async () => {
    await disconnect();
    setWallet(null);
  }

  if (wallet) {
    return (
      <Button onClick={disconnectWallet}>Disconnect</Button>
    );
  }

  return (
    <Button onClick={connectWallet}>Connect Wallet</Button>
  );
}