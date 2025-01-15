import React, { createContext, useContext, useState, useCallback } from 'react';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { TatumSDK } from '@tatumio/sdk';

interface BlockchainState {
  isConnected: boolean;
  currentChain: string;
  wallet: string | null;
  balance: string;
}

interface BlockchainContextType extends BlockchainState {
  connect: (chainId?: string) => Promise<void>;
  disconnect: () => Promise<void>;
  switchChain: (chainId: string) => Promise<void>;
  sendTransaction: (to: string, amount: string) => Promise<void>;
  deployContract: (abi: any, bytecode: string) => Promise<void>;
  mintNFT: (contractAddress: string, metadata: any) => Promise<void>;
  stake: (amount: string, validator: string) => Promise<void>;
  getGasPrice: () => Promise<string>;
}

const BlockchainContext = createContext<BlockchainContextType | undefined>(undefined);

export const BlockchainProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<BlockchainState>({
    isConnected: false,
    currentChain: '',
    wallet: null,
    balance: '0',
  });

  const thirdwebSDK = new ThirdwebSDK('ethereum');
  const tatumSDK = TatumSDK.init({ network: 'ethereum' });

  const connect = useCallback(async (chainId?: string) => {
    try {
      const wallet = await thirdwebSDK.wallet.connect();
      const balance = await wallet.balance();
      setState(prev => ({
        ...prev,
        isConnected: true,
        wallet: wallet.address,
        currentChain: chainId || 'ethereum',
        balance: balance.displayValue,
      }));
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  }, []);

  const disconnect = useCallback(async () => {
    try {
      await thirdwebSDK.wallet.disconnect();
      setState({
        isConnected: false,
        currentChain: '',
        wallet: null,
        balance: '0',
      });
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
      throw error;
    }
  }, []);

  const switchChain = useCallback(async (chainId: string) => {
    try {
      await thirdwebSDK.wallet.switchChain(parseInt(chainId));
      setState(prev => ({ ...prev, currentChain: chainId }));
    } catch (error) {
      console.error('Failed to switch chain:', error);
      throw error;
    }
  }, []);

  const sendTransaction = useCallback(async (to: string, amount: string) => {
    try {
      const tx = await thirdwebSDK.wallet.send(to, amount);
      return tx;
    } catch (error) {
      console.error('Failed to send transaction:', error);
      throw error;
    }
  }, []);

  const deployContract = useCallback(async (abi: any, bytecode: string) => {
    try {
      const contract = await thirdwebSDK.deployer.deployContract({
        abi,
        bytecode,
      });
      return contract;
    } catch (error) {
      console.error('Failed to deploy contract:', error);
      throw error;
    }
  }, []);

  const mintNFT = useCallback(async (contractAddress: string, metadata: any) => {
    try {
      const contract = await thirdwebSDK.getContract(contractAddress);
      const tx = await contract.erc721.mint(metadata);
      return tx;
    } catch (error) {
      console.error('Failed to mint NFT:', error);
      throw error;
    }
  }, []);

  const stake = useCallback(async (amount: string, validator: string) => {
    try {
      // Implement staking logic using Tatum SDK
      const tx = await tatumSDK.blockchain.stake(amount, validator);
      return tx;
    } catch (error) {
      console.error('Failed to stake:', error);
      throw error;
    }
  }, []);

  const getGasPrice = useCallback(async () => {
    try {
      const gasPrice = await thirdwebSDK.getProvider().getGasPrice();
      return gasPrice.toString();
    } catch (error) {
      console.error('Failed to get gas price:', error);
      throw error;
    }
  }, []);

  return (
    <BlockchainContext.Provider
      value={{
        ...state,
        connect,
        disconnect,
        switchChain,
        sendTransaction,
        deployContract,
        mintNFT,
        stake,
        getGasPrice,
      }}
    >
      {children}
    </BlockchainContext.Provider>
  );
};

export const useBlockchain = () => {
  const context = useContext(BlockchainContext);
  if (context === undefined) {
    throw new Error('useBlockchain must be used within a BlockchainProvider');
  }
  return context;
}; 