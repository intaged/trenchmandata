import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import TokenCard from '../components/TokenCard';
import StatsCard from '../components/dashboard/StatsCard';
import AlertsBreakdown from '../components/dashboard/AlertsBreakdown';
import TopTradersCard from '../components/dashboard/TopTradersCard';
import TokenSearch from '../components/TokenSearch';
import { fetchTrendingTokens, fetchTopTraders } from '../utils/api';
import type { TokenResponse } from '../types/api';

interface TopTrader {
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

interface Alert {
  id: string;
  type: 'whale' | 'trend' | 'target';
  icon: string;
  title: string;
  value: string;
  timestamp: string;
  token?: {
    name: string;
    symbol: string;
    change?: number;
  };
}

export default function Home() {
  const [trendingTokens, setTrendingTokens] = useState<TokenResponse[]>([]);
  const [topTraders, setTopTraders] = useState<TopTrader[]>([]);
  const [loading, setLoading] = useState({
    tokens: true,
    traders: true
  });
  const [error, setError] = useState({
    tokens: null as string | null,
    traders: null as string | null
  });
  const [selectedTimeframe, setSelectedTimeframe] = useState<'24h' | '7d' | '30d'>('24h');
  const [trendingTimeframe, setTrendingTimeframe] = useState<'24h' | '7d' | '30d'>('24h');

  // Mock alerts data with more details
  const latestAlerts: Alert[] = [
    {
      id: '1',
      type: 'whale',
      icon: '🐋',
      title: 'Large Whale Transaction',
      value: '$50,000',
      timestamp: '2 mins ago',
      token: {
        name: 'Solana',
        symbol: 'SOL',
      }
    },
    {
      id: '2',
      type: 'trend',
      icon: '📈',
      title: 'New Trending Token',
      value: '$SOLAPE',
      timestamp: '5 mins ago',
      token: {
        name: 'Solana Ape',
        symbol: 'SOLAPE',
        change: 125.5,
      }
    },
    {
      id: '3',
      type: 'target',
      icon: '🎯',
      title: 'Price Target Hit',
      value: '+25%',
      timestamp: '12 mins ago',
      token: {
        name: 'Bonk',
        symbol: 'BONK',
        change: 25,
      }
    },
    {
      id: '4',
      type: 'whale',
      icon: '🐳',
      title: 'Whale Accumulation',
      value: '$120,000',
      timestamp: '15 mins ago',
      token: {
        name: 'Raydium',
        symbol: 'RAY',
      }
    },
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(prev => ({ ...prev, tokens: true }));
        setError(prev => ({ ...prev, tokens: null }));
        
        const tokensData = await fetchTrendingTokens(trendingTimeframe);
        setTrendingTokens(tokensData.slice(0, 15));
      } catch (err) {
        console.error('Error loading data:', err);
        setError(prev => ({
          ...prev,
          tokens: err instanceof Error ? err.message : 'Failed to load trending tokens'
        }));
      } finally {
        setLoading(prev => ({ ...prev, tokens: false }));
      }
    };

    const loadTraders = async (timeframe: '24h' | '7d' | '30d') => {
      try {
        setLoading(prev => ({ ...prev, traders: true }));
        setError(prev => ({ ...prev, traders: null }));
        
        const tradersData = await fetchTopTraders({ 
          expandPnl: true, 
          sortBy: 'total',
          timeframe,
          page: 1
        });
        setTopTraders(tradersData.wallets || []);
      } catch (err) {
        console.error('Error fetching top traders:', err);
        setError(prev => ({
          ...prev,
          traders: err instanceof Error ? err.message : 'Failed to load top traders'
        }));
      } finally {
        setLoading(prev => ({ ...prev, traders: false }));
      }
    };

    loadData();
    loadTraders(selectedTimeframe);

    // Set up auto-refresh for trending tokens
    const refreshInterval = setInterval(loadData, 30000); // Refresh every 30 seconds

    return () => clearInterval(refreshInterval);
  }, [selectedTimeframe, trendingTimeframe]);

  // Calculate aggregated stats from all traders
  const stats = {
    totalValue: topTraders.reduce((sum, trader) => sum + trader.summary.total, 0).toLocaleString(),
    totalTraders: topTraders.length.toString(),
    avgWinRate: topTraders.length > 0
      ? `${(topTraders.reduce((acc, trader) => acc + trader.summary.winPercentage, 0) / topTraders.length).toFixed(1)}%`
      : '0%',
    volume24h: topTraders.reduce((sum, trader) => sum + trader.summary.totalInvested, 0).toLocaleString()
  };

  // Calculate alerts data for the breakdown chart
  const alertsData = {
    whaleAlerts: latestAlerts.filter(a => a.type === 'whale').length,
    marketShifts: latestAlerts.filter(a => a.type === 'trend').length,
    tokenLaunches: latestAlerts.filter(a => a.type === 'target').length,
  };

  // Render loading skeleton if both data fetches are loading
  if (loading.tokens && loading.traders) {
    return (
      <Layout>
        <div className="animate-pulse space-y-8">
          {/* Loading skeleton content */}
          <div className="h-48 bg-secondary/30 rounded-xl"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-secondary/30 rounded-xl"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-96 bg-secondary/30 rounded-xl"></div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative overflow-hidden mb-12">
        {/* Enhanced Background Elements */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-accent opacity-[0.07] rounded-full blur-[100px] animate-float"></div>
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-accent-light opacity-[0.05] rounded-full blur-[80px] animate-float" style={{ animationDelay: '-2s' }}></div>
        <div className="absolute top-1/4 right-1/3 w-[300px] h-[300px] bg-gradient-to-br from-accent to-accent-light opacity-[0.06] rounded-full blur-[60px] animate-pulse-slow"></div>
        
        <div className="relative z-10 py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4">
            {/* Premium Gradient Border */}
            <div className="relative mx-auto max-w-3xl text-center">
              <div className="absolute -inset-1 bg-gradient-to-r from-accent/50 via-accent-light/50 to-accent/50 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
              
              {/* Main Content */}
              <div className="relative space-y-8">
                {/* Title with Enhanced Gradient */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                  <span className="block mb-2">Welcome to</span>
                  <span className="block bg-gradient-to-r from-accent via-accent-light to-accent bg-clip-text text-transparent pb-2">
                    DataTrench
                  </span>
                </h1>

                {/* Subtitle with Premium Styling */}
                <p className="mx-auto mt-6 max-w-2xl text-lg sm:text-xl text-text-secondary leading-relaxed">
                  Your gateway to the Solana ecosystem. Track top wallets, explore detailed token statistics, and discover the hottest trending tokens. With real-time price updates and comprehensive analytics, stay ahead of the market and make informed decisions in the world of crypto.
                </p>

                {/* Premium Decorative Elements */}
                <div className="flex items-center justify-center space-x-4 text-text-secondary text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
                    <span>Real-time Updates</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                    <span>Live Analytics</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-accent-light animate-pulse"></div>
                    <span>Market Insights</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Premium Decorative Lines */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border-color to-transparent opacity-30"></div>
        <div className="absolute bottom-[1px] left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent opacity-50"></div>
      </div>

      {/* Search Section */}
      <div className="mb-16">
        <TokenSearch />
      </div>

      {/* Dashboard Overview */}
      <div className="space-y-12 mb-16">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <StatsCard
            title="Top Trader Performance"
            value={`$${stats.totalValue}`}
            change={5.2}
            type="currency"
            isLoading={loading.traders}
            error={error.traders}
          />
          <StatsCard
            title="Total Active Traders"
            value={stats.totalTraders}
            change={2.8}
            type="number"
            isLoading={loading.traders}
            error={error.traders}
          />
          <StatsCard
            title="Average Win Rate"
            value={stats.avgWinRate}
            change={1.5}
            type="percentage"
            isLoading={loading.traders}
            error={error.traders}
          />
          <StatsCard
            title="Total Volume (24h)"
            value={stats.volume24h}
            change={-3.4}
            type="currency"
            isLoading={loading.traders}
            error={error.traders}
          />
        </div>

        {/* Alerts and Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Alerts Breakdown */}
          <div className="lg:col-span-1">
            <AlertsBreakdown data={alertsData} />
          </div>

          {/* Latest Alerts */}
          <div className="lg:col-span-1">
            <div className="glass p-6 rounded-xl relative overflow-hidden group h-full">
              {/* Background Effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent-light/5 opacity-50"></div>
              <div className="absolute inset-0 bg-gradient-radial from-accent/5 via-transparent to-transparent opacity-30"></div>

              <div className="relative z-10 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">
                      Latest Alerts
                    </h2>
                    <p className="text-xs text-text-secondary">Real-time market activity</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-text-secondary">Live</span>
                    <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                  </div>
                </div>

                {/* Alerts List */}
                <div className="space-y-3">
                  {latestAlerts.map((alert, index) => (
                    <div
                      key={alert.id}
                      className="group/alert p-4 bg-secondary/30 hover:bg-secondary/50 rounded-lg transition-all duration-300 cursor-pointer transform hover:scale-[1.02] hover:shadow-lg hover:shadow-accent/5"
                    >
                      <div className="flex items-start space-x-4">
                        {/* Alert Icon */}
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          alert.type === 'whale' ? 'bg-accent/20' :
                          alert.type === 'trend' ? 'bg-success/20' :
                          'bg-accent-light/20'
                        } group-hover/alert:scale-110 transition-transform duration-300`}>
                          <span className="text-lg">{alert.icon}</span>
                        </div>

                        {/* Alert Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-text-primary">
                              {alert.title}
                            </p>
                            <span className="text-xs text-text-secondary">
                              {alert.timestamp}
                            </span>
                          </div>

                          <div className="mt-1 flex items-center space-x-2">
                            {alert.token && (
                              <>
                                <span className="text-xs text-text-secondary">
                                  {alert.token.name}
                                </span>
                                <span className="text-xs text-text-secondary">•</span>
                              </>
                            )}
                            <span className={`text-sm font-medium ${
                              alert.type === 'whale' ? 'text-accent' :
                              alert.type === 'trend' ? 'text-success' :
                              alert.token?.change && alert.token.change > 0 ? 'text-success' : 'text-error'
                            }`}>
                              {alert.value}
                            </span>
                            {alert.token?.change && (
                              <span className={`text-xs ${alert.token.change > 0 ? 'text-success' : 'text-error'}`}>
                                ({alert.token.change > 0 ? '+' : ''}{alert.token.change}%)
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Hover Indicator */}
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover/alert:opacity-100 transition-opacity duration-300">
                        <svg className="w-5 h-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>

                {/* View All Button */}
                <button className="w-full px-4 py-3 bg-accent/10 hover:bg-accent/20 text-accent rounded-lg text-sm font-medium transition-all duration-300 hover:shadow-lg hover:shadow-accent/10 transform hover:-translate-y-0.5 relative overflow-hidden group">
                  <span className="relative z-10">View All Alerts</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-accent-light/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>
            </div>
          </div>

          {/* Top Traders */}
          <TopTradersCard 
            traders={topTraders} 
            isLoading={loading.traders}
            error={error.traders}
            selectedTimeframe={selectedTimeframe}
            onTimeframeChange={setSelectedTimeframe}
          />
        </div>
      </div>

      {/* Trending Section */}
      <div className="relative mt-16">
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold sm:text-3xl bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">
                Trending Now
              </h2>
              <p className="mt-2 text-text-secondary">
                Top performing tokens in the Solana ecosystem
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Timeframe Selector */}
              <div className="flex space-x-2">
                {['24h', '7d', '30d'].map((timeframe) => (
                  <button
                    key={timeframe}
                    onClick={() => setTrendingTimeframe(timeframe as '24h' | '7d' | '30d')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      trendingTimeframe === timeframe
                        ? 'bg-accent text-white shadow-lg shadow-accent/25'
                        : 'text-text-secondary hover:text-text-primary hover:bg-secondary/50'
                    }`}
                  >
                    {timeframe.toUpperCase()}
                  </button>
                ))}
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-text-secondary">
                  Auto-refresh
                </span>
                <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading.tokens ? (
              // Loading skeleton
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="glass p-6 rounded-xl animate-pulse">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-secondary/50 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-secondary/50 rounded w-3/4"></div>
                      <div className="h-3 bg-secondary/50 rounded w-1/2"></div>
                    </div>
                    <div className="w-16 h-8 bg-secondary/50 rounded-full"></div>
                  </div>
                </div>
              ))
            ) : error.tokens ? (
              <div className="col-span-full text-center py-12">
                <p className="text-error mb-4">{error.tokens}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-light transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : (
              trendingTokens.map((token) => (
                <TokenCard key={token.token.mint} token={token} />
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
} 