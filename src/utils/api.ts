import axios, { AxiosError } from 'axios';
import axiosRetry from 'axios-retry';
import { 
  TokenResponse, 
  TopTradersResponse, 
  WalletResponse,
  BasicWalletResponse,
  WalletTradesResponse,
  WalletPnL,
  TokenPnL
} from '../types/api';

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const BASE_URL = 'https://data.solanatracker.io';

if (!API_KEY) {
  console.warn('API Key is not configured. Please check your .env file.');
}

// Create axios instance with improved configuration
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'x-api-key': API_KEY,
    'Content-Type': 'application/json',
  },
  timeout: 30000, // Increased timeout to 30 seconds
  validateStatus: (status) => status >= 200 && status < 500, // Handle 4xx errors gracefully
});

// Enhanced retry logic
axiosRetry(api, {
  retries: 3,
  retryDelay: (retryCount) => {
    return Math.min(1000 * Math.pow(2, retryCount), 10000); // Exponential backoff with max 10s
  },
  retryCondition: (error: AxiosError) => {
    return (
      axiosRetry.isNetworkOrIdempotentRequestError(error) ||
      error.response?.status === 429 || // Rate limit
      error.response?.status === 500 || // Server error
      error.code === 'ECONNABORTED' || // Timeout
      !error.response // No response
    );
  },
  onRetry: (retryCount, error, requestConfig) => {
    console.warn(`Retrying request (${retryCount}/3): ${error.message}`);
  },
});

// Mock data for development when API is unavailable
const MOCK_DATA_ENABLED = process.env.NODE_ENV === 'development';

// Define types for mock data
interface MockDataType {
  '/tokens/trending': Array<{
    token: {
      name: string;
      symbol: string;
      mint: string;
      decimals: number;
      image: string;
    };
    pools: Array<{
      price: { usd: number };
      marketCap: { usd: number };
    }>;
    events: {
      '24h': { priceChangePercentage: number };
    };
    risk: { score: number };
  }>;
  '/top-traders': {
    wallets: Array<{
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
    }>;
  };
}

const getMockData = (endpoint: keyof MockDataType): MockDataType[keyof MockDataType] | null => {
  const mockData: MockDataType = {
    '/tokens/trending': [
      {
        token: {
          name: 'Solana',
          symbol: 'SOL',
          mint: 'So11111111111111111111111111111111111111112',
          decimals: 9,
          image: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
        },
        pools: [{
          price: { usd: 123.45 },
          marketCap: { usd: 50000000000 },
        }],
        events: {
          '24h': { priceChangePercentage: 5.67 }
        },
        risk: { score: 2 }
      },
    ],
    '/top-traders': {
      wallets: [
        {
          wallet: 'Demo1...8u4x',
          summary: {
            realized: 75000,
            unrealized: 25000,
            total: 100000,
            totalInvested: 50000,
            totalWins: 80,
            totalLosses: 20,
            winPercentage: 80,
            lossPercentage: 20,
            neutralPercentage: 0
          }
        },
        {
          wallet: 'Demo2...9v5y',
          summary: {
            realized: 45000,
            unrealized: 15000,
            total: 60000,
            totalInvested: 40000,
            totalWins: 65,
            totalLosses: 35,
            winPercentage: 65,
            lossPercentage: 35,
            neutralPercentage: 0
          }
        },
        {
          wallet: 'Demo3...7w3z',
          summary: {
            realized: 35000,
            unrealized: 5000,
            total: 40000,
            totalInvested: 30000,
            totalWins: 70,
            totalLosses: 30,
            winPercentage: 70,
            lossPercentage: 30,
            neutralPercentage: 0
          }
        },
        {
          wallet: 'Demo4...6x2a',
          summary: {
            realized: 25000,
            unrealized: 5000,
            total: 30000,
            totalInvested: 20000,
            totalWins: 75,
            totalLosses: 25,
            winPercentage: 75,
            lossPercentage: 25,
            neutralPercentage: 0
          }
        },
        {
          wallet: 'Demo5...5y1b',
          summary: {
            realized: 15000,
            unrealized: 5000,
            total: 20000,
            totalInvested: 15000,
            totalWins: 60,
            totalLosses: 40,
            winPercentage: 60,
            lossPercentage: 40,
            neutralPercentage: 0
          }
        }
      ]
    }
  };

  return mockData[endpoint] || null;
};

const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    // Handle specific error cases
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timed out. Please try again.');
    }
    
    if (!error.response) {
      throw new Error('Network error. Please check your connection.');
    }

    // Handle specific status codes
    switch (error.response.status) {
      case 401:
        throw new Error('Invalid API key. Please check your configuration.');
      case 404:
        throw new Error('Resource not found.');
      case 429:
        throw new Error('Rate limit exceeded. Please try again in a few minutes.');
      case 400:
        throw new Error(error.response.data?.message || 'Invalid request parameters.');
      case 500:
        throw new Error('Server error. Our team has been notified.');
      default:
        throw new Error(error.response.data?.message || 'An unexpected error occurred.');
    }
  }
  throw new Error('An unexpected error occurred. Please try again.');
};

export const fetchTokenInfo = async (tokenAddress: string) => {
  try {
    const response = await api.get(`/tokens/${tokenAddress}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching token info:', error);
    throw handleApiError(error);
  }
};

export const fetchTrendingTokens = async (timeframe = '24h'): Promise<TokenResponse[]> => {
  try {
    const response = await api.get(`/tokens/trending/${timeframe}`);
    if (!response.data || !Array.isArray(response.data)) {
      throw new Error('Invalid response format');
    }
    
    // Transform and validate the data
    const tokens: TokenResponse[] = response.data.map(token => ({
      token: {
        name: token.token?.name || 'Unknown',
        symbol: token.token?.symbol || 'N/A',
        mint: token.token?.mint || '',
        decimals: token.token?.decimals || 0,
        image: token.token?.image || undefined,
      },
      pools: (token.pools || []).map((pool: any) => ({
        price: { usd: pool.price?.usd || 0 },
        marketCap: { usd: pool.marketCap?.usd || 0 },
        liquidity: pool.liquidity ? { usd: pool.liquidity.usd } : undefined,
        tokenSupply: pool.tokenSupply,
      })),
      events: {
        '24h': token.events?.['24h'] || undefined,
        '7d': token.events?.['7d'] || undefined,
        '30d': token.events?.['30d'] || undefined,
      },
      risk: {
        score: token.risk?.score || 0,
      },
    }));
    
    return tokens;
  } catch (error) {
    console.error('Error fetching trending tokens:', error);
    throw handleApiError(error);
  }
};

export const fetchTokenPrice = async (tokenAddress: string) => {
  try {
    const response = await api.get(`/price?token=${tokenAddress}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching token price:', error);
    throw handleApiError(error);
  }
};

export const fetchWalletInfo = async (walletAddress: string): Promise<WalletResponse> => {
  try {
    const response = await api.get(`/wallet/${walletAddress}`);
    
    // Validate response data structure
    if (!response.data || typeof response.data !== 'object') {
      throw new Error('Invalid response format');
    }
    
    return response.data;
  } catch (error) {
    console.error('Error fetching wallet info:', error);
    throw handleApiError(error);
  }
};

export const fetchBasicWalletInfo = async (walletAddress: string): Promise<BasicWalletResponse> => {
  try {
    const response = await api.get(`/wallet/${walletAddress}/basic`);
    
    if (!response.data || typeof response.data !== 'object') {
      throw new Error('Invalid response format');
    }
    
    return response.data;
  } catch (error) {
    console.error('Error fetching basic wallet info:', error);
    throw handleApiError(error);
  }
};

export const fetchWalletTrades = async (
  walletAddress: string,
  cursor?: number
): Promise<WalletTradesResponse> => {
  try {
    const params = new URLSearchParams();
    if (cursor) {
      params.append('cursor', cursor.toString());
    }
    
    const response = await api.get(`/wallet/${walletAddress}/trades?${params}`);
    
    if (!response.data || !Array.isArray(response.data.trades)) {
      throw new Error('Invalid response format');
    }
    
    return response.data;
  } catch (error) {
    console.error('Error fetching wallet trades:', error);
    throw handleApiError(error);
  }
};

export const fetchWalletPnL = async (
  walletAddress: string,
  options?: {
    showHistoricPnL?: boolean;
    holdingCheck?: boolean;
    hideDetails?: boolean;
  }
): Promise<WalletPnL> => {
  try {
    const params = new URLSearchParams();
    if (options?.showHistoricPnL) {
      params.append('showHistoricPnL', 'true');
    }
    if (options?.holdingCheck) {
      params.append('holdingCheck', 'true');
    }
    if (options?.hideDetails) {
      params.append('hideDetails', 'true');
    }
    
    const response = await api.get(`/pnl/${walletAddress}?${params}`);
    
    if (!response.data || typeof response.data !== 'object') {
      throw new Error('Invalid response format');
    }
    
    return response.data;
  } catch (error) {
    console.error('Error fetching wallet PnL:', error);
    throw handleApiError(error);
  }
};

export const fetchTokenPnL = async (
  walletAddress: string,
  tokenAddress: string
): Promise<TokenPnL> => {
  try {
    const response = await api.get(`/pnl/${walletAddress}/${tokenAddress}`);
    
    if (!response.data || typeof response.data !== 'object') {
      throw new Error('Invalid response format');
    }
    
    return response.data;
  } catch (error) {
    console.error('Error fetching token PnL:', error);
    throw handleApiError(error);
  }
};

export const fetchTokenChart = async (
  tokenAddress: string,
  interval = '1h',
  timeFrom?: number,
  timeTo?: number
) => {
  try {
    const params = new URLSearchParams({
      type: interval,
      ...(timeFrom && { time_from: timeFrom.toString() }),
      ...(timeTo && { time_to: timeTo.toString() }),
    });
    
    const response = await api.get(`/chart/${tokenAddress}?${params}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching token chart:', error);
    throw handleApiError(error);
  }
};

export const fetchTopTraders = async ({
  expandPnl = false,
  sortBy = 'total',
  page = 1,
  timeframe = '24h'
}: {
  expandPnl?: boolean;
  sortBy?: 'total' | 'winPercentage';
  page?: number;
  timeframe?: '24h' | '7d' | '30d';
} = {}) => {
  try {
    // Use mock data in development if enabled
    if (MOCK_DATA_ENABLED) {
      const mockData = getMockData('/top-traders');
      if (mockData) {
        return mockData;
      }
    }

    const params = new URLSearchParams({
      expandPnl: expandPnl.toString(),
      sortBy,
      page: page.toString(),
      timeframe,
    });
    
    const response = await api.get(`/top-traders/all/${page}?${params}`);
    
    if (!response.data || !Array.isArray(response.data.wallets)) {
      throw new Error('Invalid response format');
    }
    
    return response.data;
  } catch (error) {
    console.error('Error fetching top traders:', error);
    throw handleApiError(error);
  }
};

export const fetchTokenTopTraders = async (tokenAddress: string) => {
  try {
    const response = await api.get(`/tokens/${tokenAddress}/holders`);
    return response.data;
  } catch (error) {
    console.error('Error fetching token top traders:', error);
    throw handleApiError(error);
  }
};

export const fetchTokenStats = async (tokenAddress: string) => {
  try {
    const endpoint = `/tokens/${tokenAddress}/stats`;
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error('Error fetching token stats:', error);
    throw handleApiError(error);
  }
};

export default api; 