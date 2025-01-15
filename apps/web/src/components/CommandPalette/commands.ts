import { PaletteCommand } from './types';
import { useTheme } from '../../providers/ThemeProvider';
import { useLayout } from '../../providers/LayoutProvider';
import { useTerminal } from '../BottomPanel/Terminal/useTerminal';
import { useBlockchain } from '../../providers/BlockchainProvider';
import { useMarket } from '../../providers/MarketProvider';
import { useAnalytics } from '../../providers/AnalyticsProvider';

export const useCommands = () => {
  const { toggleTheme } = useTheme();
  const { 
    toggleLeftPanel,
    toggleRightPanel,
    toggleBottomPanel,
    setLayoutMode,
  } = useLayout();
  const { executeCommand } = useTerminal();
  const { connect, disconnect } = useBlockchain();
  const { fetchMarketData, placeOrder, getMarketSentiment, getPortfolioMetrics, getProfitLoss } = useMarket();
  const { generateReport, exportData } = useAnalytics();

  const commands: PaletteCommand[] = [
    // General Commands
    {
      id: 'command-palette',
      title: 'Show Command Palette',
      category: 'general',
      shortcut: '⌘K',
      keywords: ['palette', 'commands', 'search'],
      action: () => {},
      icon: '⌨️'
    },

    // Layout Commands
    {
      id: 'toggle-left-panel',
      title: 'Toggle Left Panel',
      category: 'layout',
      shortcut: '⌘\\',
      keywords: ['panel', 'left', 'toggle', 'sidebar'],
      action: toggleLeftPanel,
      icon: '◀️'
    },
    {
      id: 'toggle-right-panel',
      title: 'Toggle Right Panel',
      category: 'layout',
      shortcut: '⌘]',
      keywords: ['panel', 'right', 'toggle', 'sidebar'],
      action: toggleRightPanel,
      icon: '▶️'
    },
    {
      id: 'toggle-bottom-panel',
      title: 'Toggle Bottom Panel',
      category: 'layout',
      shortcut: '⌘J',
      keywords: ['panel', 'bottom', 'toggle', 'terminal'],
      action: toggleBottomPanel,
      icon: '▼'
    },
    {
      id: 'layout-single',
      title: 'Single Layout',
      category: 'layout',
      keywords: ['layout', 'single', 'full'],
      action: () => setLayoutMode('single'),
      icon: '□'
    },
    {
      id: 'layout-columns',
      title: 'Two Columns Layout',
      category: 'layout',
      keywords: ['layout', 'columns', 'split'],
      action: () => setLayoutMode('columns'),
      icon: '▣'
    },
    {
      id: 'layout-grid',
      title: 'Grid Layout',
      category: 'layout',
      keywords: ['layout', 'grid', 'quadrant'],
      action: () => setLayoutMode('grid'),
      icon: '⧉'
    },

    // Theme Commands
    {
      id: 'toggle-theme',
      title: 'Toggle Theme',
      category: 'theme',
      shortcut: '⌘T',
      keywords: ['theme', 'dark', 'light', 'toggle'],
      action: toggleTheme,
      icon: '🎨'
    },

    // Terminal Commands
    {
      id: 'terminal-help',
      title: 'Show Terminal Help',
      category: 'terminal',
      shortcut: '⌘H',
      keywords: ['terminal', 'help', 'commands', 'manual'],
      action: () => executeCommand('help'),
      icon: '❓'
    },
    {
      id: 'terminal-clear',
      title: 'Clear Terminal',
      category: 'terminal',
      shortcut: '⌘K',
      keywords: ['terminal', 'clear', 'clean'],
      action: () => executeCommand('clear'),
      icon: '🧹'
    },
    {
      id: 'terminal-history',
      title: 'Show Command History',
      category: 'terminal',
      keywords: ['terminal', 'history', 'commands'],
      action: () => executeCommand('history'),
      icon: '📜'
    },

    // Blockchain Commands
    {
      id: 'blockchain-connect',
      title: 'Connect to Blockchain',
      category: 'blockchain',
      keywords: ['blockchain', 'connect', 'wallet'],
      action: connect,
      icon: '🔗'
    },
    {
      id: 'blockchain-disconnect',
      title: 'Disconnect Wallet',
      category: 'blockchain',
      keywords: ['blockchain', 'disconnect', 'wallet'],
      action: disconnect,
      icon: '🔌'
    },
    {
      id: 'blockchain-deploy-contract',
      title: 'Deploy Smart Contract',
      category: 'blockchain',
      keywords: ['blockchain', 'deploy', 'contract', 'smart contract'],
      action: () => executeCommand('deploy contract'),
      icon: '📄',
      description: 'Deploy a new smart contract to the blockchain'
    },
    {
      id: 'blockchain-mint-nft',
      title: 'Mint NFT',
      category: 'blockchain',
      keywords: ['blockchain', 'nft', 'mint', 'token'],
      action: () => executeCommand('mint nft'),
      icon: '🎨',
      description: 'Mint a new NFT on a specified contract'
    },
    {
      id: 'blockchain-stake',
      title: 'Stake Tokens',
      category: 'blockchain',
      keywords: ['blockchain', 'stake', 'validator', 'tokens'],
      action: () => executeCommand('stake'),
      icon: '🔒',
      description: 'Stake tokens with a validator'
    },
    {
      id: 'blockchain-gas',
      title: 'Check Gas Price',
      category: 'blockchain',
      keywords: ['blockchain', 'gas', 'price', 'fee'],
      action: () => executeCommand('gas price'),
      icon: '⛽',
      description: 'Check current gas prices'
    },
    {
      id: 'blockchain-switch-network',
      title: 'Switch Network',
      category: 'blockchain',
      keywords: ['blockchain', 'network', 'chain', 'switch'],
      action: () => executeCommand('switch network'),
      icon: '🔄',
      description: 'Switch to a different blockchain network'
    },

    // AI Commands
    {
      id: 'ai-analyze',
      title: 'Analyze Transaction',
      category: 'ai',
      keywords: ['ai', 'analyze', 'transaction', 'smart'],
      action: () => executeCommand('ai analyze'),
      icon: '🤖'
    },
    {
      id: 'ai-predict',
      title: 'Predict Market Trend',
      category: 'ai',
      keywords: ['ai', 'predict', 'market', 'trend'],
      action: () => executeCommand('ai predict'),
      icon: '📈'
    },

    // Market Commands
    {
      id: 'market-refresh',
      title: 'Refresh Market Data',
      category: 'market',
      shortcut: '⌘R',
      keywords: ['market', 'refresh', 'data', 'price'],
      action: () => fetchMarketData(),
      icon: '🔄',
      description: 'Fetch latest market data and prices'
    },
    {
      id: 'market-order',
      title: 'Place Market Order',
      category: 'market',
      keywords: ['market', 'order', 'trade', 'buy', 'sell'],
      action: () => placeOrder('market'),
      icon: '📊',
      description: 'Place a new market order'
    },

    // Trading Commands
    {
      id: 'trading-limit-order',
      title: 'Place Limit Order',
      category: 'trading',
      keywords: ['trading', 'limit', 'order'],
      action: () => placeOrder('limit'),
      icon: '📈',
      description: 'Place a new limit order'
    },
    {
      id: 'trading-stop-loss',
      title: 'Set Stop Loss',
      category: 'trading',
      keywords: ['trading', 'stop', 'loss'],
      action: () => placeOrder('stop-loss'),
      icon: '🛑',
      description: 'Set a stop loss order'
    },

    // Analytics Commands
    {
      id: 'analytics-report',
      title: 'Generate Analytics Report',
      category: 'analytics',
      keywords: ['analytics', 'report', 'generate'],
      action: () => generateReport(),
      icon: '📊',
      description: 'Generate a comprehensive analytics report'
    },
    {
      id: 'analytics-export',
      title: 'Export Analytics Data',
      category: 'analytics',
      keywords: ['analytics', 'export', 'data'],
      action: () => exportData(),
      icon: '📤',
      description: 'Export analytics data to CSV'
    },

    // Settings Commands
    {
      id: 'settings-preferences',
      title: 'Open Preferences',
      category: 'settings',
      shortcut: '⌘,',
      keywords: ['settings', 'preferences', 'config'],
      action: () => executeCommand('settings'),
      icon: '⚙️',
      description: 'Open application preferences'
    },
    {
      id: 'settings-keyboard',
      title: 'Keyboard Shortcuts',
      category: 'settings',
      keywords: ['settings', 'keyboard', 'shortcuts'],
      action: () => executeCommand('shortcuts'),
      icon: '⌨️',
      description: 'View and customize keyboard shortcuts'
    }
  ];

  const marketCommands: PaletteCommand[] = [
    {
      id: 'market-orderbook',
      title: 'View Order Book',
      category: 'market',
      keywords: ['market', 'orderbook', 'orders', 'depth'],
      action: () => executeCommand('orderbook'),
      icon: '📚',
      description: 'View the current order book for selected asset'
    },
    {
      id: 'market-depth',
      title: 'Market Depth Chart',
      category: 'market',
      keywords: ['market', 'depth', 'chart', 'liquidity'],
      action: () => executeCommand('depth chart'),
      icon: '📊',
      description: 'Display market depth and liquidity visualization'
    },
    {
      id: 'market-sentiment',
      title: 'Market Sentiment',
      category: 'market',
      keywords: ['market', 'sentiment', 'analysis', 'trend'],
      action: () => getMarketSentiment(),
      icon: '📈',
      description: 'Analyze current market sentiment'
    },
    {
      id: 'market-portfolio',
      title: 'Portfolio Overview',
      category: 'market',
      keywords: ['portfolio', 'overview', 'balance', 'assets'],
      action: () => getPortfolioMetrics(),
      icon: '💼',
      description: 'View portfolio metrics and performance'
    },
    {
      id: 'market-pnl',
      title: 'Profit/Loss Analysis',
      category: 'market',
      keywords: ['profit', 'loss', 'pnl', 'performance'],
      action: () => getProfitLoss('24h'),
      icon: '💹',
      description: 'View profit/loss analysis for your portfolio'
    }
  ];

  const analyticsCommands: PaletteCommand[] = [
    {
      id: 'analytics-portfolio-performance',
      title: 'Portfolio Performance',
      category: 'analytics',
      keywords: ['analytics', 'portfolio', 'performance', 'metrics'],
      action: () => generateReport('portfolio', '30d'),
      icon: '📊',
      description: 'Generate detailed portfolio performance analysis'
    },
    {
      id: 'analytics-risk-assessment',
      title: 'Risk Assessment',
      category: 'analytics',
      keywords: ['analytics', 'risk', 'assessment', 'exposure'],
      action: () => generateReport('risk', '7d'),
      icon: '⚠️',
      description: 'Analyze portfolio risk and exposure'
    },
    {
      id: 'analytics-market-correlation',
      title: 'Market Correlation',
      category: 'analytics',
      keywords: ['analytics', 'correlation', 'market', 'assets'],
      action: () => generateReport('correlation', '14d'),
      icon: '🔄',
      description: 'Analyze asset correlations and market patterns'
    },
    {
      id: 'analytics-volume-analysis',
      title: 'Volume Analysis',
      category: 'analytics',
      keywords: ['analytics', 'volume', 'liquidity', 'trading'],
      action: () => generateReport('volume', '24h'),
      icon: '📈',
      description: 'Analyze trading volumes and liquidity patterns'
    },
    {
      id: 'analytics-smart-money',
      title: 'Smart Money Flow',
      category: 'analytics',
      keywords: ['analytics', 'smart', 'money', 'flow', 'institutional'],
      action: () => generateReport('smart-money', '7d'),
      icon: '🏦',
      description: 'Track institutional investor movements'
    },
    {
      id: 'analytics-historical-volatility',
      title: 'Historical Volatility',
      category: 'analytics',
      keywords: ['analytics', 'volatility', 'historical', 'risk'],
      action: () => generateReport('volatility', '30d'),
      icon: '📉',
      description: 'Analyze historical price volatility'
    }
  ];

  const advancedMarketCommands: PaletteCommand[] = [
    {
      id: 'market-technical-analysis',
      title: 'Technical Analysis',
      category: 'market',
      keywords: ['market', 'technical', 'analysis', 'indicators'],
      action: () => getTechnicalAnalysis('ETH', '1d'),
      icon: '📊',
      description: 'View comprehensive technical analysis with indicators'
    },
    {
      id: 'market-order-flow',
      title: 'Order Flow Analysis',
      category: 'market',
      keywords: ['market', 'order', 'flow', 'analysis'],
      action: () => getOrderFlowAnalysis('ETH'),
      icon: '🌊',
      description: 'Analyze order flow patterns and trends'
    },
    {
      id: 'market-liquidity',
      title: 'Liquidity Analysis',
      category: 'market',
      keywords: ['market', 'liquidity', 'depth', 'analysis'],
      action: () => getLiquidityAnalysis('ETH'),
      icon: '💧',
      description: 'View market liquidity and depth analysis'
    },
    {
      id: 'market-volume-profile',
      title: 'Volume Profile',
      category: 'market',
      keywords: ['market', 'volume', 'profile', 'analysis'],
      action: () => getVolumeProfile('ETH', '1d'),
      icon: '📈',
      description: 'Analyze trading volume distribution'
    },
    {
      id: 'market-correlation-matrix',
      title: 'Correlation Matrix',
      category: 'market',
      keywords: ['market', 'correlation', 'matrix', 'assets'],
      action: () => executeCommand('correlation matrix'),
      icon: '🔄',
      description: 'View asset correlation matrix'
    },
    {
      id: 'market-heat-map',
      title: 'Market Heat Map',
      category: 'market',
      keywords: ['market', 'heat', 'map', 'overview'],
      action: () => executeCommand('heat map'),
      icon: '🗺️',
      description: 'Visual representation of market performance'
    }
  ];

  return [...commands, ...marketCommands, ...analyticsCommands, ...advancedMarketCommands];
}; 