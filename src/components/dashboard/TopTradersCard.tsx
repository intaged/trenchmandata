import React, { useState } from 'react';
import { TopTrader } from '../../types/api';
import { formatNumber, shortenAddress } from '../../utils/format';
import { ClipboardDocumentIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';

interface TopTradersCardProps {
  traders: TopTrader[];
  isLoading?: boolean;
  error?: string | null;
  selectedTimeframe: '24h' | '7d' | '30d';
  onTimeframeChange: (timeframe: '24h' | '7d' | '30d') => void;
}

export default function TopTradersCard({
  traders,
  isLoading = false,
  error = null,
  selectedTimeframe,
  onTimeframeChange
}: TopTradersCardProps) {
  const [copiedWallet, setCopiedWallet] = useState<string | null>(null);

  const handleCopyWallet = async (e: React.MouseEvent, wallet: string) => {
    e.preventDefault(); // Prevent any default behavior
    e.stopPropagation(); // Stop event bubbling
    
    console.log('Attempting to copy wallet:', wallet); // Debug log
    
    try {
      // First, let's verify we have the wallet address
      if (!wallet) {
        console.error('No wallet address provided');
        return;
      }

      // Try to copy using the newer clipboard API
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(wallet);
        console.log('Copied using Clipboard API'); // Debug log
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = wallet;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
          document.execCommand('copy');
          textArea.remove();
          console.log('Copied using execCommand'); // Debug log
        } catch (err) {
          console.error('execCommand error:', err);
          textArea.remove();
          throw new Error('Failed to copy');
        }
      }

      // If we got here, the copy was successful
      setCopiedWallet(wallet);
      setTimeout(() => {
        setCopiedWallet(null);
      }, 2000);

    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="glass p-6 rounded-xl relative overflow-hidden group h-full">
        <div className="space-y-6 animate-pulse">
          <div className="flex justify-between items-center">
            <div className="h-6 w-32 bg-secondary/50 rounded"></div>
            <div className="flex space-x-2">
              {['24h', '7d', '30d'].map((t) => (
                <div key={t} className="h-8 w-16 bg-secondary/50 rounded"></div>
              ))}
            </div>
          </div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-secondary/50 rounded-xl"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 w-24 bg-secondary/50 rounded"></div>
                <div className="h-3 w-16 bg-secondary/50 rounded"></div>
              </div>
              <div className="h-6 w-20 bg-secondary/50 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass p-6 rounded-xl relative overflow-hidden group h-full">
        <div className="space-y-4 text-center">
          <div className="text-error">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-light transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass p-6 rounded-xl relative overflow-hidden group h-full">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent-light/5 opacity-50"></div>
      <div className="absolute inset-0 bg-gradient-radial from-accent/5 via-transparent to-transparent opacity-30"></div>

      <div className="relative z-10 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h2 className="text-xl font-bold bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">
              Top Traders
            </h2>
            <p className="text-xs text-text-secondary">Best performing traders by PnL</p>
          </div>
          <div className="flex space-x-2">
            {['24H', '7D', '30D'].map((timeframe) => (
              <button
                key={timeframe}
                onClick={() => onTimeframeChange(timeframe.toLowerCase() as '24h' | '7d' | '30d')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${
                  selectedTimeframe === timeframe.toLowerCase()
                    ? 'bg-accent text-white shadow-lg shadow-accent/25'
                    : 'text-text-secondary hover:text-text-primary hover:bg-secondary/50'
                }`}
              >
                {timeframe}
              </button>
            ))}
          </div>
        </div>

        {/* Traders List */}
        <div className="space-y-3">
          {traders.slice(0, 5).map((trader, index) => (
            <div
              key={trader.wallet}
              className="group/trader relative overflow-hidden"
            >
              {/* Hover Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-accent/10 to-accent-light/10 opacity-0 group-hover/trader:opacity-100 transition-opacity duration-300"></div>
              
              {/* Main Content */}
              <div className="relative p-4 rounded-xl bg-secondary/30 hover:bg-secondary/40 transition-all duration-300 cursor-pointer backdrop-blur-sm">
                <div className="flex items-center space-x-4">
                  {/* Rank with enhanced styling */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-accent/20 rounded-xl blur-md transform group-hover/trader:scale-110 transition-transform duration-300"></div>
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent font-bold text-lg relative">
                      #{index + 1}
                    </div>
                  </div>

                  {/* Trader Info with simplified copy functionality */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-text-primary">
                        {shortenAddress(trader.wallet)}
                      </p>
                      <button
                        type="button"
                        onClick={(e) => handleCopyWallet(e, trader.wallet)}
                        className="group/copy relative p-1.5 rounded-lg bg-secondary/50 hover:bg-accent/20 transition-all duration-300"
                      >
                        {copiedWallet === trader.wallet ? (
                          <div className="flex items-center space-x-1">
                            <ClipboardDocumentCheckIcon className="w-4 h-4 text-success" />
                            <span className="absolute -right-16 -top-8 px-2 py-1 text-xs font-medium text-success bg-success/10 rounded-lg">
                              Copied!
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1">
                            <ClipboardDocumentIcon className="w-4 h-4 text-text-secondary group-hover/copy:text-accent" />
                            <span className="absolute -right-16 -top-8 px-2 py-1 text-xs font-medium text-accent bg-accent/10 rounded-lg opacity-0 group-hover/copy:opacity-100">
                              Copy
                            </span>
                          </div>
                        )}
                      </button>
                    </div>
                    <div className="mt-1">
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-text-secondary">Win Rate:</span>
                        <span className="text-xs font-medium text-success">
                          {trader.summary.winPercentage.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Performance Metrics with enhanced ROI display */}
                  <div className="text-right flex flex-col items-end space-y-1">
                    {/* Total Amount */}
                    <div className="flex items-center justify-end space-x-2">
                      <svg className="w-4 h-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      <p className="text-base font-medium text-success">
                        {formatNumber(trader.summary.total, 'currency')}
                      </p>
                    </div>

                    {/* Invested Amount */}
                    <p className="text-xs text-text-secondary">
                      {formatNumber(trader.summary.totalInvested, 'currency')} invested
                    </p>

                    {/* Enhanced ROI Display */}
                    <div className="flex items-center space-x-1.5">
                      <svg className="w-3 h-3 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      <span className={`text-xs font-medium ${
                        ((trader.summary.total / trader.summary.totalInvested) * 100) > 0 
                          ? 'text-success' 
                          : 'text-error'
                      }`}>
                        ROI: {((trader.summary.total / trader.summary.totalInvested) * 100).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Enhanced Hover Info */}
                <div className="mt-3 pt-3 border-t border-border-color/30 opacity-0 group-hover/trader:opacity-100 transition-all duration-300">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-2 rounded-lg bg-secondary/20 backdrop-blur-sm">
                      <p className="text-xs text-text-secondary">Total Trades</p>
                      <p className="text-sm font-medium text-text-primary">
                        {trader.summary.totalWins + trader.summary.totalLosses}
                      </p>
                    </div>
                    <div className="p-2 rounded-lg bg-secondary/20 backdrop-blur-sm">
                      <p className="text-xs text-text-secondary">Win/Loss</p>
                      <p className="text-sm font-medium">
                        <span className="text-success">{trader.summary.totalWins}</span>
                        <span className="text-text-secondary mx-1">/</span>
                        <span className="text-error">{trader.summary.totalLosses}</span>
                      </p>
                    </div>
                    <div className="p-2 rounded-lg bg-secondary/20 backdrop-blur-sm">
                      <p className="text-xs text-text-secondary">Realized PnL</p>
                      <p className="text-sm font-medium text-text-primary">
                        {formatNumber(trader.summary.realized, 'currency')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Premium Hover Effects */}
                <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-accent-light/5 opacity-0 group-hover/trader:opacity-100 transition-all duration-500 rounded-xl"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent opacity-0 group-hover/trader:opacity-100 transition-all duration-500 rounded-xl"></div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <button className="w-full px-4 py-3 bg-accent/10 hover:bg-accent/20 text-accent rounded-lg text-sm font-medium transition-all duration-300 hover:shadow-lg hover:shadow-accent/10 transform hover:-translate-y-0.5 relative overflow-hidden group">
          <span className="relative z-10">View All Traders</span>
          <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-accent-light/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
      </div>
    </div>
  );
} 