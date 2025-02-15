import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import TokenCard from '../components/TokenCard';
import { fetchTrendingTokens } from '../utils/api';
import { TokenResponse } from '../types/api';

export default function Trending() {
  const [tokens, setTokens] = useState<TokenResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'24h' | '7d' | '30d'>('24h');

  useEffect(() => {
    const loadTokens = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchTrendingTokens(selectedTimeframe);
        setTokens(data);
      } catch (err) {
        console.error('Error loading trending tokens:', err);
        setError(err instanceof Error ? err.message : 'Failed to load trending tokens');
      } finally {
        setLoading(false);
      }
    };

    loadTokens();
  }, [selectedTimeframe]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="relative">
            <div className="w-12 h-12 border-2 border-accent rounded-full animate-spin border-t-transparent"></div>
            <div className="absolute inset-0 blur-lg bg-accent/30 animate-pulse"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <p className="text-error">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-light transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">
              Trending Tokens
            </h1>
            <p className="mt-2 text-text-secondary">
              Discover the hottest tokens in the Solana ecosystem
            </p>
          </div>

          {/* Timeframe Selector */}
          <div className="flex space-x-2">
            {['24h', '7d', '30d'].map((timeframe) => (
              <button
                key={timeframe}
                onClick={() => setSelectedTimeframe(timeframe as '24h' | '7d' | '30d')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  selectedTimeframe === timeframe
                    ? 'bg-accent text-white shadow-lg shadow-accent/25'
                    : 'text-text-secondary hover:text-text-primary hover:bg-secondary/50'
                }`}
              >
                {timeframe.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Token Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tokens.map((token, index) => (
            <TokenCard 
              key={`${token.token.mint}-${index}`} 
              token={token} 
            />
          ))}
        </div>

        {tokens.length === 0 && (
          <div className="text-center py-12">
            <p className="text-text-secondary">No trending tokens found</p>
          </div>
        )}
      </div>
    </Layout>
  );
} 