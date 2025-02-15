export interface TokenInfo {
  name: string;
  symbol: string;
  mint: string;
  decimals: number;
  image?: string;
  uri?: string;
  hasFileMetaData?: boolean;
}

export interface Pool {
  liquidity: {
    quote: number;
    usd: number;
  };
  price: {
    quote: number;
    usd: number;
  };
  tokenSupply: number;
  lpBurn: number;
  tokenAddress: string;
  marketCap: {
    quote: number;
    usd: number;
  };
  market: string;
  quoteToken: string;
  decimals: number;
  lastUpdated: number;
  createdAt: number;
  poolId: string;
}

export interface TokenPool {
  price: {
    usd: number;
  };
  marketCap: {
    usd: number;
  };
  liquidity?: {
    usd: number;
  };
  tokenSupply?: number;
}

export interface TokenEvents {
  '24h'?: {
    priceChangePercentage: number;
  };
  '7d'?: {
    priceChangePercentage: number;
  };
  '30d'?: {
    priceChangePercentage: number;
  };
}

export interface TokenRisk {
  score: number;
}

export interface TokenResponse {
  token: TokenInfo;
  pools: TokenPool[];
  events: TokenEvents;
  risk: TokenRisk;
}

export interface ChartDataPoint {
  open: number;
  close: number;
  low: number;
  high: number;
  volume: number;
  time: number;
}

export interface ChartResponse {
  oclhv: ChartDataPoint[];
}

export interface WalletToken {
  token: TokenInfo;
  pools?: TokenPool[];
  events?: TokenEvents;
  risk?: TokenRisk;
  balance: number;
  value: number;
}

export interface BasicWalletToken {
  address: string;
  balance: number;
  value: number;
}

export interface WalletTrade {
  tx: string;
  from: {
    address: string;
    amount: number;
    token: {
      name: string;
      symbol: string;
      image: string;
      decimals: number;
    };
  };
  to: {
    address: string;
    amount: number;
    token: {
      name: string;
      symbol: string;
      image: string;
      decimals: number;
    };
  };
  price: {
    usd: number;
    sol: string;
  };
  volume: {
    usd: number;
    sol: number;
  };
  wallet: string;
  program: string;
  time: number;
}

export interface TokenPnL {
  holding: number;
  held: number;
  sold: number;
  realized: number;
  unrealized: number;
  total: number;
  total_sold: number;
  total_invested: number;
  average_buy_amount: number;
  current_value: number;
  cost_basis: number;
}

export interface WalletPnL {
  tokens: {
    [key: string]: TokenPnL;
  };
  summary: {
    realized: number;
    unrealized: number;
    total: number;
    totalInvested: number;
    averageBuyAmount: number;
    totalWins: number;
    totalLosses: number;
    winPercentage: number;
    lossPercentage: number;
  };
}

export interface WalletResponse {
  tokens: WalletToken[];
  total: number;
  totalSol: number;
  timestamp: string;
}

export interface BasicWalletResponse {
  tokens: BasicWalletToken[];
  total: number;
  totalSol: number;
  timestamp: string;
}

export interface WalletTradesResponse {
  trades: WalletTrade[];
  nextCursor: number;
  hasNextPage: boolean;
}

export interface PriceResponse {
  price: number;
  liquidity: number;
  marketCap: number;
  lastUpdated: number;
}

export interface TopTrader {
  wallet: string;
  summary: {
    realized: number;
    unrealized: number;
    total: number;
    totalInvested: number;
    totalWins: number;
    totalLosses: number;
    winPercentage: number;
    lossPercentage: number;
    neutralPercentage: number;
  };
}

export interface TopTradersResponse {
  wallets: TopTrader[];
} 