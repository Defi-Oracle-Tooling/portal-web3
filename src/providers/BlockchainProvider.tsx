import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
// @ts-ignore - Tatum SDK types are not available
import { TatumSDK } from '@tatumio/sdk';
// @ts-ignore - ThirdwebSDK types are not available
import { ThirdwebSDK } from '@thirdweb-dev/sdk';

interface BlockchainState {
  isConnected: boolean;
  wallet: string | null;
  balance: string | null;
  currentChain: string | null;
}

interface BlockchainContextType {
  state: BlockchainState;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  switchChain: (chainId: string) => Promise<void>;
  sendTransaction: (to: string, amount: string) => Promise<void>;
  deployContract: (name: string, symbol: string) => Promise<void>;
}

const BlockchainContext = createContext<BlockchainContextType | undefined>(undefined);

export const useBlockchain = () => {
  const context = useContext(BlockchainContext);
  if (!context) {
    throw new Error('useBlockchain must be used within a BlockchainProvider');
  }
  return context;
};

interface BlockchainProviderProps {
  children: ReactNode;
}

export const BlockchainProvider = ({ children }: BlockchainProviderProps) => {
  const [state, setState] = useState<BlockchainState>({
    isConnected: false,
    wallet: null,
    balance: null,
    currentChain: null
  });

  const thirdwebSDK = new ThirdwebSDK('ethereum');

  const connect = useCallback(async () => {
    try {
      const wallet = await thirdwebSDK.wallet.connect({ chainId: 1 }); // Connect to Ethereum mainnet
      const balance = await wallet.getBalance();
      setState(prev => ({
        ...prev,
        isConnected: true,
        wallet: wallet.address,
        balance: balance.displayValue
      }));
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  }, [thirdwebSDK]);

  const disconnect = useCallback(async () => {
    try {
      await thirdwebSDK.wallet.disconnect();
      setState(prev => ({
        ...prev,
        isConnected: false,
        wallet: null,
        balance: null
      }));
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  }, [thirdwebSDK]);

  const switchChain = useCallback(async (chainId: string) => {
    try {
      await thirdwebSDK.wallet.switchChain(parseInt(chainId));
      setState(prev => ({ ...prev, currentChain: chainId }));
    } catch (error) {
      console.error('Failed to switch chain:', error);
    }
  }, [thirdwebSDK]);

  const sendTransaction = useCallback(async (to: string, amount: string) => {
    try {
      await thirdwebSDK.wallet.transfer(to, amount);
    } catch (error) {
      console.error('Failed to send transaction:', error);
    }
  }, [thirdwebSDK]);

  const deployContract = useCallback(async (name: string, symbol: string) => {
    try {
      await thirdwebSDK.deployer.deployNFTCollection({
        name,
        symbol,
        primary_sale_recipient: state.wallet || ''
      });
    } catch (error) {
      console.error('Failed to deploy contract:', error);
    }
  }, [thirdwebSDK, state.wallet]);

  return (
    <BlockchainContext.Provider
      value={{
        state,
        connect,
        disconnect,
        switchChain,
        sendTransaction,
        deployContract
      }}
    >
      {children}
    </BlockchainContext.Provider>
  );
}; 