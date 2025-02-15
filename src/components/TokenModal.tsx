import { useEffect, useState } from 'react';
import { TokenResponse, ChartResponse } from '../types/api';
import { fetchTokenChart } from '../utils/api';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface TokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  token?: TokenResponse;
}

const TokenModal: React.FC<TokenModalProps> = ({ isOpen, onClose, token }) => {
  const [chartData, setChartData] = useState<ChartResponse | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && token?.token?.mint) {
      loadData();
    }
  }, [isOpen, token?.token?.mint, selectedTimeframe]);

  const loadData = async () => {
    if (!token?.token?.mint) return;
    
    try {
      setLoading(true);
      const chartResponse = await fetchTokenChart(token.token.mint, '1h');
      setChartData(chartResponse);
    } catch (error) {
      console.error('Error loading token data:', error);
    } finally {
      setLoading(false);
    }
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(20, 22, 31, 0.9)',
        titleColor: '#F9FAFB',
        bodyColor: '#F9FAFB',
        borderColor: 'rgba(139, 92, 246, 0.3)',
        borderWidth: 1,
        padding: 12,
        bodyFont: {
          size: 14,
        },
        titleFont: {
          size: 14,
          weight: 'bold' as const,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#9CA3AF',
          font: {
            size: 12,
          },
        },
      },
      y: {
        grid: {
          color: 'rgba(156, 163, 175, 0.1)',
        },
        ticks: {
          color: '#9CA3AF',
          font: {
            size: 12,
          },
          callback: function(value: number | string) {
            if (typeof value === 'number') {
              return `$${value.toFixed(6)}`;
            }
            return value;
          },
        },
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
  };

  const timeframes = [
    { label: '24H', value: '24h' },
    { label: '7D', value: '7d' },
    { label: '30D', value: '30d' },
  ];

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!isOpen || !token) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-75 backdrop-blur-sm" onClick={onClose}></div>

        <div className="relative inline-block w-full max-w-6xl p-6 overflow-hidden text-left align-middle transition-all transform bg-primary border border-border-color rounded-2xl shadow-xl">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-text-secondary hover:text-text-primary transition-colors rounded-lg hover:bg-secondary/50"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Token Header */}
          <div className="flex items-center space-x-4 mb-8">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 bg-gradient-primary rounded-full opacity-20 animate-pulse"></div>
              <img
                src={token.token.image}
                alt={token.token.name}
                className="relative z-10 w-full h-full rounded-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h2 className="text-3xl font-bold text-text-primary">
                  {token.token.name}
                </h2>
                <span className="px-2 py-1 text-sm bg-secondary/50 rounded-lg text-text-secondary">
                  {token.token.symbol}
                </span>
                {token.token.uri && (
                  <a
                    href={token.token.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-text-secondary hover:text-accent transition-colors rounded-lg hover:bg-secondary/50"
                  >
                    <ArrowTopRightOnSquareIcon className="w-5 h-5" />
                  </a>
                )}
              </div>
              <p className="text-sm text-text-secondary mt-1">
                Mint: {formatAddress(token.token.mint)}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8">
            {/* Market Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {token.pools[0] && (
                <>
                  <div className="glass p-4 rounded-xl space-y-1">
                    <p className="text-sm text-text-secondary">Current Price</p>
                    <p className="text-2xl font-bold gradient-text">
                      ${token.pools[0].price.usd.toFixed(6)}
                    </p>
                  </div>
                  <div className="glass p-4 rounded-xl space-y-1">
                    <p className="text-sm text-text-secondary">Market Cap</p>
                    <p className="text-2xl font-bold gradient-text">
                      ${token.pools[0].marketCap.usd.toLocaleString()}
                    </p>
                  </div>
                  <div className="glass p-4 rounded-xl space-y-1">
                    <p className="text-sm text-text-secondary">Liquidity</p>
                    <p className="text-2xl font-bold gradient-text">
                      ${token.pools[0].liquidity.usd.toLocaleString()}
                    </p>
                  </div>
                  <div className="glass p-4 rounded-xl space-y-1">
                    <p className="text-sm text-text-secondary">Total Supply</p>
                    <p className="text-2xl font-bold gradient-text">
                      {token.pools[0].tokenSupply.toLocaleString()}
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Price Chart */}
            <div className="glass p-6 rounded-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-text-primary">Price Chart</h3>
                <div className="flex space-x-2">
                  {timeframes.map((tf) => (
                    <button
                      key={tf.value}
                      onClick={() => setSelectedTimeframe(tf.value)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedTimeframe === tf.value
                          ? 'bg-accent text-white shadow-lg shadow-accent/25'
                          : 'text-text-secondary hover:text-text-primary hover:bg-secondary/50'
                      }`}
                    >
                      {tf.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-[400px]">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="relative">
                      <div className="w-12 h-12 border-2 border-accent rounded-full animate-spin border-t-transparent"></div>
                      <div className="absolute inset-0 blur-lg bg-accent/30 animate-pulse"></div>
                    </div>
                  </div>
                ) : chartData ? (
                  <Line
                    data={{
                      labels: chartData.oclhv.map(point => 
                        new Date(point.time * 1000).toLocaleTimeString()
                      ),
                      datasets: [
                        {
                          label: 'Price',
                          data: chartData.oclhv.map(point => point.close),
                          borderColor: '#8B5CF6',
                          backgroundColor: 'rgba(139, 92, 246, 0.1)',
                          fill: true,
                          tension: 0.4,
                          borderWidth: 2,
                          pointRadius: 0,
                          pointHoverRadius: 4,
                          pointHoverBackgroundColor: '#8B5CF6',
                          pointHoverBorderColor: '#fff',
                          pointHoverBorderWidth: 2,
                        },
                      ],
                    }}
                    options={chartOptions}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-text-secondary">
                    No chart data available
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenModal; 