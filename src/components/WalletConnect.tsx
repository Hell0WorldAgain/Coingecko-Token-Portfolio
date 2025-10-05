import React, { useState } from 'react';

const WalletConnect: React.FC = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const connectWallet = () => {
    const randomBytes = new Uint8Array(20);
    crypto.getRandomValues(randomBytes);
    const mockAddress = '0x' + Array.from(randomBytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
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