import { connect, disconnect } from "get-starknet"
import { Button } from "@mantine/core";
import { useState } from "react";
import { type StarknetWindowObject } from "get-starknet-core";

export function ConnectWallet({ onWalletChange }: { onWalletChange: (wallet: StarknetWindowObject | null ) => void }) {
  const [wallet, setWallet] = useState<StarknetWindowObject | null>(null);

  const connectWallet = async () => {
    const wallet = await connect();
    setWallet(wallet);
    onWalletChange(wallet);
  }

  const disconnectWallet = async () => {
    await disconnect();
    setWallet(null);
    onWalletChange(null);
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