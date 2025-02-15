import { useState } from 'react';
import Image from 'next/image';
import { TokenResponse } from '../types/api';
import TokenModal from './TokenModal';

interface TokenCardProps {
  token: TokenResponse;
}

const TokenCard: React.FC<TokenCardProps> = ({ token }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const priceChange = token.events?.['24h']?.priceChangePercentage || 0;
  const isBullish = priceChange >= 0;

  const handleImageError = () => {
    setImageError(true);
  };

  const renderTokenImage = () => {
    if (imageError || !token.token?.image) {
      return (
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent/20 to-accent-light/20 flex items-center justify-center">
          <span className="text-lg font-bold text-accent">
            {token.token?.symbol?.charAt(0) || '?'}
          </span>
        </div>
      );
    }

    return (
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 bg-gradient-primary rounded-full opacity-20 group-hover:animate-pulse-slow"></div>
        <div className="relative w-12 h-12 rounded-full overflow-hidden">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent/20 to-accent-light/20 flex items-center justify-center">
            <Image
              src={token.token.image}
              alt={token.token.name || 'Token'}
              width={48}
              height={48}
              className="rounded-full object-cover w-full h-full"
              onError={handleImageError}
              loading="lazy"
              unoptimized={true}
              style={{ opacity: imageError ? 0 : 1 }}
            />
          </div>
        </div>
      </div>
    );
  };
  
  // Guard against undefined token data
  if (!token?.token) {
    return null;
  }

  return (
    <>
      <div 
        onClick={() => setIsModalOpen(true)}
        className="group relative overflow-hidden"
      >
        {/* Card Container */}
        <div className="bg-gradient-card backdrop-blur-md border border-border-color rounded-xl p-6 hover:scale-[1.02] transition-all duration-300 cursor-pointer">
          {/* Purple Glow Effect */}
          <div className="absolute -inset-1 bg-accent/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Content */}
          <div className="relative z-10">
            {/* Card Header */}
            <div className="flex items-center space-x-4">
              {renderTokenImage()}
              
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold text-text-primary truncate group-hover:text-accent transition-colors">
                  {token.token.name || 'Unknown Token'}
                </h2>
                <p className="text-text-secondary text-sm truncate">
                  {token.token.symbol || 'N/A'}
                </p>
              </div>

              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                isBullish 
                  ? 'bg-success/10 text-success' 
                  : 'bg-error/10 text-error'
              }`}>
                {isBullish ? '+' : ''}{priceChange.toFixed(2)}%
              </div>
            </div>

            {/* Card Content */}
            {token.pools?.[0] && (
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-text-secondary text-xs">Price</p>
                  <p className="font-medium text-text-primary">
                    ${token.pools[0].price?.usd?.toFixed(6) || '0.00'}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-text-secondary text-xs">Market Cap</p>
                  <p className="font-medium text-text-primary">
                    ${((token.pools[0].marketCap?.usd || 0) / 1000000).toFixed(2)}M
                  </p>
                </div>
              </div>
            )}

            {/* Risk Score */}
            <div className="mt-4 flex items-center justify-between pt-4 border-t border-border-color">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  token.risk?.score < 3 ? 'bg-success' : 
                  token.risk?.score < 7 ? 'bg-yellow-500' : 'bg-error'
                } animate-pulse`}></div>
                <span className="text-xs text-text-secondary">
                  Risk Score: {token.risk?.score || 'N/A'}
                </span>
              </div>
              <button className="text-accent text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                View Details →
              </button>
            </div>
          </div>
        </div>
      </div>

      <TokenModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        token={token}
      />
    </>
  );
};

export default TokenCard; 