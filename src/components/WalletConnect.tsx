import React, { useState } from 'react';

const WalletConnect: React.FC = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const connectWallet = () => {
    // Mock wallet connection - generates a random Ethereum address
    const mockAddress = '0x' + Math.random().toString(16).substr(2, 40);
    setWalletAddress(mockAddress);
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
  };

  if (walletAddress) {
    return (
      <div className="wallet-address">
        <span>{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span>
        <button onClick={disconnectWallet} className="disconnect-btn">
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button onClick={connectWallet} className="connect-wallet-btn">
      <span>●</span> Connect Wallet
    </button>
  );
};

export default WalletConnect;