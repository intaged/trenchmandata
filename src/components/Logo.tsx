import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative group ${className}`}>
      {/* Main Logo Container */}
      <div className="relative w-12 h-12 bg-gradient-to-br from-accent via-accent-light to-accent rounded-xl overflow-hidden animate-glow shadow-lg">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/90 via-accent-light/80 to-accent/90 opacity-90"></div>
        
        {/* Glass Effect Layer */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
        
        {/* Logo Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {/* DT Text */}
            <div className="relative transform hover:scale-105 transition-transform duration-300">
              <span className="text-xl font-bold text-white tracking-tight" style={{ 
                letterSpacing: '-0.05em',
                textShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}>DT</span>
              
              {/* Underline Effect */}
              <div className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-gradient-to-r from-white/0 via-white/80 to-white/0"></div>
            </div>
          </div>
        </div>

        {/* Premium Design Elements */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-45"></div>
        <div className="absolute bottom-0 right-0 w-1.5 h-full bg-gradient-to-b from-white/0 via-white/20 to-white/0 transform -skew-y-45"></div>
        
        {/* Corner Accents */}
        <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-white/30 rounded-full blur-[1px]"></div>
        <div className="absolute bottom-1.5 left-1.5 w-2 h-2 bg-white/30 rounded-full blur-[1px]"></div>
        
        {/* Animated Shine Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          <div className="absolute inset-0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        </div>
      </div>

      {/* Enhanced Glow Effects */}
      <div className="absolute -inset-3 bg-accent opacity-20 blur-2xl rounded-full group-hover:opacity-30 transition-opacity duration-500"></div>
      <div className="absolute -inset-2 bg-gradient-to-r from-accent/40 to-accent-light/40 opacity-0 group-hover:opacity-100 blur-xl rounded-full transition-all duration-500 scale-90 group-hover:scale-100"></div>
      
      {/* Pulsing Accent */}
      <div className="absolute -inset-2 bg-gradient-to-br from-accent via-accent-light to-accent opacity-0 group-hover:opacity-20 blur-xl rounded-full animate-pulse-slow"></div>
    </div>
  );
};

export default Logo; 