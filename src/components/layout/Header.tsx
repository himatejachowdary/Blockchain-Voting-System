import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useWeb3 } from '@/contexts/Web3Context';
import { Wallet, Shield, Vote, LogOut, Network } from 'lucide-react';

const Header = () => {
  const { account, isConnected, isConnecting, chainId, connectWallet, disconnectWallet } = useWeb3();

  const getNetworkName = (chainId: number | null) => {
    switch (chainId) {
      case 1: return 'Ethereum Mainnet';
      case 11155111: return 'Sepolia Testnet';
      case 5777: return 'Ganache Local';
      default: return 'Unknown Network';
    }
  };

  const getNetworkColor = (chainId: number | null) => {
    switch (chainId) {
      case 1: return 'bg-accent';
      case 11155111: return 'bg-trust';
      case 5777: return 'bg-warning';
      default: return 'bg-muted';
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-gradient-card backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 border-border/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-cyber rounded-lg shadow-glow">
              <Vote className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-cyber bg-clip-text text-transparent">
                BlockVote
              </h1>
              <p className="text-xs text-muted-foreground">Decentralized Voting System</p>
            </div>
          </div>

          {/* Network and Wallet Info */}
          <div className="flex items-center gap-4">
            {/* Network Badge */}
            {isConnected && chainId && (
              <Badge 
                variant="secondary" 
                className={`${getNetworkColor(chainId)} text-foreground gap-2 px-3 py-1.5`}
              >
                <Network className="w-3 h-3" />
                {getNetworkName(chainId)}
              </Badge>
            )}

            {/* Wallet Connection */}
            {isConnected && account ? (
              <Card className="px-4 py-2 bg-gradient-card shadow-cyber border-primary/20">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                    <Shield className="w-4 h-4 text-trust" />
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">
                      {account.substring(0, 6)}...{account.substring(38)}
                    </p>
                    <p className="text-xs text-muted-foreground">Connected</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={disconnectWallet}
                    className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                  >
                    <LogOut className="w-3 h-3" />
                  </Button>
                </div>
              </Card>
            ) : (
              <Button 
                variant="blockchain" 
                onClick={connectWallet} 
                disabled={isConnecting}
                className="gap-2"
              >
                <Wallet className="w-4 h-4" />
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;