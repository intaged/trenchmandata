import React, { useState, useRef, useEffect } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { TokenResponse } from '../types/api';
import { fetchTokenInfo } from '../utils/api';
import TokenModal from './TokenModal';

const TokenSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedToken, setSelectedToken] = useState<TokenResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError(null);
    
    try {
      const tokenData = await fetchTokenInfo(searchQuery);
      if (!tokenData || !tokenData.token) {
        throw new Error('Token not found');
      }
      setSelectedToken(tokenData);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error searching token:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch token information');
      setSelectedToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Focus search input on mount
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-accent-light/5 rounded-2xl blur-xl"></div>
      
      {/* Search Container */}
      <div className="relative glass p-8 rounded-2xl border border-border-color shadow-xl">
        <div className="absolute inset-0 bg-gradient-radial from-accent/5 via-transparent to-transparent opacity-30 rounded-2xl"></div>
        
        <div className="relative z-10 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">
              Search Any Solana Token
            </h2>
            <p className="text-text-secondary">
              Enter a token name, symbol, or mint address to view detailed information
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="relative">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-accent to-accent-light opacity-20 blur rounded-lg group-hover:opacity-30 transition-opacity duration-300"></div>
              <div className="relative flex items-center">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setError(null);
                  }}
                  placeholder="Search by token name, symbol, or mint address..."
                  className="w-full bg-secondary/50 border border-border-color rounded-lg pl-12 pr-4 py-3 text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all duration-300"
                />
                <MagnifyingGlassIcon className="absolute left-4 w-5 h-5 text-text-secondary" />
                <button
                  type="submit"
                  disabled={isLoading || !searchQuery.trim()}
                  className="absolute right-2 px-4 py-1.5 bg-accent hover:bg-accent-light text-white rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white rounded-full animate-spin border-t-transparent"></div>
                      <span>Searching...</span>
                    </div>
                  ) : (
                    'Search'
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-error/10 border border-error/20 rounded-lg">
                <p className="text-sm text-error text-center">{error}</p>
              </div>
            )}

            {/* Search Tips */}
            <div className="mt-4 flex items-center justify-center space-x-4 text-xs text-text-secondary">
              <span>Try searching:</span>
              <button
                type="button"
                onClick={() => setSearchQuery('SOL')}
                className="px-2 py-1 bg-accent/10 hover:bg-accent/20 text-accent rounded-full transition-colors"
              >
                SOL
              </button>
              <button
                type="button"
                onClick={() => setSearchQuery('BONK')}
                className="px-2 py-1 bg-accent/10 hover:bg-accent/20 text-accent rounded-full transition-colors"
              >
                BONK
              </button>
              <button
                type="button"
                onClick={() => setSearchQuery('RAY')}
                className="px-2 py-1 bg-accent/10 hover:bg-accent/20 text-accent rounded-full transition-colors"
              >
                RAY
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Token Modal */}
      {selectedToken && (
        <TokenModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedToken(null);
          }}
          token={selectedToken}
        />
      )}
    </div>
  );
};

export default TokenSearch; 