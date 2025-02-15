import { useState } from 'react';
import Layout from '../components/Layout';
import { fetchWalletInfo } from '../utils/api';
import type { WalletResponse } from '../types/api';
import Image from 'next/image';
import { ErrorBoundary } from 'react-error-boundary';

// Solana address validation regex
const SOLANA_ADDRESS_REGEX = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="glass p-6 rounded-lg text-error">
      <p className="text-lg">Something went wrong:</p>
      <pre className="mt-2">{error.message}</pre>
      <button
        onClick={resetErrorBoundary}
        className="mt-4 px-4 py-2 bg-accent hover:bg-accent-light text-white rounded-lg"
      >
        Try again
      </button>
    </div>
  );
}

function TokenImage({ src, alt }: { src: string; alt: string }) {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
        <span className="text-sm text-text-secondary">{alt[0]}</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={48}
      height={48}
      className="rounded-full object-cover"
      onError={() => setError(true)}
    />
  );
}

export default function WalletTracker() {
  const [walletAddress, setWalletAddress] = useState('');
  const [walletData, setWalletData] = useState<WalletResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateWalletAddress = (address: string) => {
    if (!address.trim()) {
      throw new Error('Please enter a wallet address');
    }
    if (!SOLANA_ADDRESS_REGEX.test(address)) {
      throw new Error('Invalid Solana wallet address format');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      validateWalletAddress(walletAddress);
      setLoading(true);
      
      const data = await fetchWalletInfo(walletAddress);
      if (!data || !Array.isArray(data.tokens)) {
        throw new Error('Invalid response from server');
      }
      
      setWalletData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch wallet information');
      setWalletData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={() => {
          setWalletData(null);
          setError(null);
        }}
      >
        <div className="space-y-8">
          {/* Header Section */}
          <div className="relative">
            <div className="absolute top-0 right-1/4 w-64 h-64 bg-accent opacity-10 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <h1 className="text-4xl font-bold">
                <span className="gradient-text">Wallet Tracker</span>
              </h1>
              <p className="mt-4 text-text-secondary text-lg">
                Track any Solana wallet's token holdings, value, and transaction history.
              </p>
            </div>
          </div>

          {/* Search Form */}
          <div className="glass p-6 rounded-xl">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="wallet" className="block text-sm font-medium text-text-secondary mb-2">
                  Wallet Address
                </label>
                <div className="flex gap-4">
                  <input
                    type="text"
                    id="wallet"
                    placeholder="Enter Solana wallet address"
                    value={walletAddress}
                    onChange={(e) => {
                      setError(null);
                      setWalletAddress(e.target.value);
                    }}
                    className="flex-1 bg-secondary/50 border border-border-color rounded-lg px-4 py-2 text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent/50"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-accent hover:bg-accent-light text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white rounded-full animate-spin border-t-transparent"></div>
                        <span>Searching...</span>
                      </div>
                    ) : (
                      'Track'
                    )}
                  </button>
                </div>
                {error && (
                  <p className="mt-2 text-sm text-error">{error}</p>
                )}
              </div>
            </form>
          </div>

          {/* Results */}
          {walletData && walletData.tokens.length > 0 ? (
            <div className="space-y-6">
              {/* Overview Card */}
              <div className="glass p-6 rounded-xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h3 className="text-text-secondary text-sm">Total Value</h3>
                    <p className="text-2xl font-bold gradient-text">
                      ${walletData.total.toLocaleString()}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-text-secondary text-sm">Total SOL Value</h3>
                    <p className="text-2xl font-bold gradient-text">
                      {walletData.totalSol.toLocaleString()} SOL
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-text-secondary text-sm">Last Updated</h3>
                    <p className="text-lg text-text-primary">
                      {new Date(walletData.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tokens List */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold">Token Holdings</h2>
                <div className="grid grid-cols-1 gap-4">
                  {walletData.tokens.map((token) => (
                    <div key={token.token.mint} className="glass p-4 rounded-xl hover-card">
                      <div className="flex items-center space-x-4">
                        <div className="relative w-12 h-12">
                          <TokenImage
                            src={token.token.image || ''}
                            alt={token.token.name}
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-text-primary">
                            {token.token.name}
                          </h3>
                          <p className="text-text-secondary text-sm">
                            {token.token.symbol}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-text-primary">
                            {token.balance.toLocaleString()} {token.token.symbol}
                          </p>
                          <p className="text-text-secondary text-sm">
                            ${token.value.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : walletData ? (
            <div className="glass p-6 rounded-xl text-text-secondary text-center">
              No tokens found in this wallet
            </div>
          ) : null}
        </div>
      </ErrorBoundary>
    </Layout>
  );
} 