import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
import { toast } from '@/hooks/use-toast';

interface Web3ContextType {
  web3: Web3 | null;
  account: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  chainId: number | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchToNetwork: (chainId: string) => Promise<void>;
}

const Web3Context = createContext<Web3ContextType | null>(null);

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

interface Web3ProviderProps {
  children: ReactNode;
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [chainId, setChainId] = useState<number | null>(null);

  // Check if wallet is already connected on component mount
  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const provider = await detectEthereumProvider();
      if (provider && window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        const accounts = await web3Instance.eth.getAccounts();
        
        if (accounts.length > 0) {
          setWeb3(web3Instance);
          setAccount(accounts[0]);
          setIsConnected(true);
          
          // Get chain ID
          const networkId = await web3Instance.eth.getChainId();
          setChainId(Number(networkId));
          
          setupEventListeners();
        }
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
    }
  };

  const setupEventListeners = () => {
    if (window.ethereum) {
      // Account changed
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          setAccount(accounts[0]);
        }
      });

      // Chain changed
      window.ethereum.on('chainChanged', (chainId: string) => {
        setChainId(parseInt(chainId, 16));
        window.location.reload(); // Reload to avoid issues
      });

      // Disconnect
      window.ethereum.on('disconnect', () => {
        disconnectWallet();
      });
    }
  };

  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      const provider = await detectEthereumProvider();
      
      if (!provider) {
        toast({
          title: "MetaMask Not Found",
          description: "Please install MetaMask to use this application.",
          variant: "destructive"
        });
        return;
      }

      if (window.ethereum) {
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        const web3Instance = new Web3(window.ethereum);
        const accounts = await web3Instance.eth.getAccounts();
        
        if (accounts.length > 0) {
          setWeb3(web3Instance);
          setAccount(accounts[0]);
          setIsConnected(true);
          
          // Get chain ID
          const networkId = await web3Instance.eth.getChainId();
          setChainId(Number(networkId));
          
          setupEventListeners();
          
          toast({
            title: "Wallet Connected",
            description: `Connected to ${accounts[0].substring(0, 6)}...${accounts[0].substring(38)}`,
          });
        }
      }
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setWeb3(null);
    setAccount(null);
    setIsConnected(false);
    setChainId(null);
    
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    });
  };

  const switchToNetwork = async (targetChainId: string) => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: targetChainId }],
      });
    } catch (error: any) {
      if (error.code === 4902) {
        // Network doesn't exist, add it
        toast({
          title: "Network Not Found",
          description: "Please add this network to MetaMask manually.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Network Switch Failed",
          description: error.message || "Failed to switch network",
          variant: "destructive"
        });
      }
    }
  };

  const value = {
    web3,
    account,
    isConnected,
    isConnecting,
    chainId,
    connectWallet,
    disconnectWallet,
    switchToNetwork,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};

// Extend window object for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}