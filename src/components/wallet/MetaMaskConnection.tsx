import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useWeb3 } from '@/contexts/Web3Context';
import { toast } from '@/hooks/use-toast';
import { 
  Wallet, 
  Shield, 
  AlertTriangle, 
  ExternalLink,
  Download,
  RefreshCw,
  Globe
} from 'lucide-react';

const MetaMaskConnection = () => {
  const { 
    isConnected, 
    isConnecting, 
    account, 
    chainId, 
    connectWallet,
    switchToNetwork
  } = useWeb3();
  
  const [isInstalling, setIsInstalling] = useState(false);
  const [showNetworkSwitcher, setShowNetworkSwitcher] = useState(false);

  const detectMetaMask = () => {
    return typeof window !== 'undefined' && 
           typeof window.ethereum !== 'undefined' && 
           window.ethereum.isMetaMask;
  };

  const installMetaMask = () => {
    setIsInstalling(true);
    window.open('https://metamask.io/download/', '_blank');
    
    // Check for MetaMask every 2 seconds
    const checkInterval = setInterval(() => {
      if (detectMetaMask()) {
        clearInterval(checkInterval);
        setIsInstalling(false);
        toast({
          title: "MetaMask Detected!",
          description: "You can now connect your wallet.",
        });
      }
    }, 2000);

    // Stop checking after 30 seconds
    setTimeout(() => {
      clearInterval(checkInterval);
      setIsInstalling(false);
    }, 30000);
  };

  const networks = [
    {
      name: 'Ethereum Mainnet',
      chainId: '0x1',
      rpcUrl: 'https://mainnet.infura.io/v3/',
      explorer: 'https://etherscan.io',
      color: 'bg-blue-500'
    },
    {
      name: 'Sepolia Testnet',
      chainId: '0xaa36a7',
      rpcUrl: 'https://sepolia.infura.io/v3/',
      explorer: 'https://sepolia.etherscan.io',
      color: 'bg-purple-500'
    },
    {
      name: 'Ganache Local',
      chainId: '0x1691',
      rpcUrl: 'http://127.0.0.1:7545',
      explorer: 'http://localhost:7545',
      color: 'bg-orange-500'
    }
  ];

  const getCurrentNetwork = () => {
    return networks.find(network => 
      parseInt(network.chainId, 16) === chainId
    );
  };

  if (!detectMetaMask()) {
    return (
      <Card className="bg-gradient-card shadow-cyber border-warning/20 max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow">
            <Wallet className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-xl">MetaMask Not Found</CardTitle>
          <CardDescription>
            MetaMask wallet extension is required to use this decentralized voting system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="border-warning/20 bg-warning/5">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              MetaMask is a secure browser extension that manages your Ethereum wallet and enables blockchain interactions.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <Button 
              variant="blockchain" 
              className="w-full gap-2" 
              onClick={installMetaMask}
              disabled={isInstalling}
            >
              {isInstalling ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Waiting for Installation...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Install MetaMask
                  <ExternalLink className="w-3 h-3" />
                </>
              )}
            </Button>

            <Button 
              variant="outline" 
              className="w-full gap-2" 
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="w-4 h-4" />
              Refresh Page
            </Button>
          </div>

          <div className="text-xs text-muted-foreground text-center space-y-2">
            <p>Why do I need MetaMask?</p>
            <ul className="space-y-1 text-left">
              <li>• Secure wallet management</li>
              <li>• Blockchain transaction signing</li>
              <li>• Decentralized authentication</li>
              <li>• Vote privacy and security</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isConnected && account) {
    const currentNetwork = getCurrentNetwork();
    
    return (
      <Card className="bg-gradient-card shadow-glow border-accent/20 max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-trust rounded-full flex items-center justify-center mx-auto mb-4 shadow-neon">
            <Shield className="w-8 h-8 text-trust-foreground" />
          </div>
          <CardTitle className="text-xl">Wallet Connected</CardTitle>
          <CardDescription>
            Ready to participate in blockchain voting
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-card/50 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Address:</span>
              <Badge variant="outline" className="font-mono text-xs">
                {account.substring(0, 6)}...{account.substring(38)}
              </Badge>
            </div>
            
            {currentNetwork && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Network:</span>
                <Badge className={`${currentNetwork.color} text-white gap-1`}>
                  <Globe className="w-3 h-3" />
                  {currentNetwork.name}
                </Badge>
              </div>
            )}
          </div>

          {!currentNetwork && (
            <Alert className="border-warning/20 bg-warning/5">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Unknown network detected. Please switch to a supported network.
              </AlertDescription>
            </Alert>
          )}

          <Button 
            variant="outline" 
            className="w-full gap-2"
            onClick={() => setShowNetworkSwitcher(!showNetworkSwitcher)}
          >
            <Globe className="w-4 h-4" />
            Switch Network
          </Button>

          {showNetworkSwitcher && (
            <div className="space-y-2">
              {networks.map((network) => (
                <Button
                  key={network.chainId}
                  variant={getCurrentNetwork()?.chainId === network.chainId ? "default" : "outline"}
                  className="w-full justify-start gap-2"
                  onClick={() => switchToNetwork(network.chainId)}
                >
                  <div className={`w-3 h-3 rounded-full ${network.color}`} />
                  {network.name}
                </Button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-card shadow-card border-primary/20 max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow">
          <Wallet className="w-8 h-8 text-primary-foreground" />
        </div>
        <CardTitle className="text-xl">Connect Your Wallet</CardTitle>
        <CardDescription>
          Connect MetaMask to access the decentralized voting system
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="border-primary/20 bg-primary/5">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Your wallet connection is secure and encrypted. We never store your private keys.
          </AlertDescription>
        </Alert>

        <Button 
          variant="blockchain" 
          className="w-full gap-2 shadow-glow" 
          onClick={connectWallet}
          disabled={isConnecting}
        >
          {isConnecting ? (
            <>
              <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Wallet className="w-4 h-4" />
              Connect MetaMask
            </>
          )}
        </Button>

        <div className="text-xs text-muted-foreground text-center space-y-2">
          <p>By connecting, you agree to:</p>
          <ul className="space-y-1 text-left">
            <li>• Use your wallet for voting authentication</li>
            <li>• Pay network gas fees for transactions</li>
            <li>• Follow election rules and regulations</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetaMaskConnection;