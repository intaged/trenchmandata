import React, { useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface AlertsBreakdownProps {
  data: {
    whaleAlerts: number;
    marketShifts: number;
    tokenLaunches: number;
  };
}

const AlertsBreakdown: React.FC<AlertsBreakdownProps> = ({ data }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isChartHovered, setIsChartHovered] = useState(false);

  const chartData = {
    labels: ['Whale Alerts', 'Market Shifts', 'Token Launches'],
    datasets: [
      {
        data: [data.whaleAlerts, data.marketShifts, data.tokenLaunches],
        backgroundColor: [
          'rgba(139, 92, 246, 0.9)',  // accent color
          'rgba(167, 139, 250, 0.9)', // accent-light color
          'rgba(192, 132, 252, 0.9)', // lighter purple
        ],
        borderColor: [
          'rgba(139, 92, 246, 1)',
          'rgba(167, 139, 250, 1)',
          'rgba(192, 132, 252, 1)',
        ],
        borderWidth: hoveredIndex !== null ? 2 : 1,
        hoverBorderWidth: 4,
        hoverBorderColor: 'rgba(255, 255, 255, 0.3)',
        hoverBackgroundColor: [
          'rgba(139, 92, 246, 1)',
          'rgba(167, 139, 250, 1)',
          'rgba(192, 132, 252, 1)',
        ],
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(20, 22, 31, 0.95)',
        titleColor: '#F9FAFB',
        bodyColor: '#F9FAFB',
        borderColor: 'rgba(139, 92, 246, 0.3)',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        titleFont: {
          size: 14,
          weight: 'bold' as const,
          family: 'Inter, system-ui, sans-serif',
        },
        bodyFont: {
          size: 13,
          family: 'Inter, system-ui, sans-serif',
        },
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return [
              `${label}: ${value} alerts`,
              `${percentage}% of total alerts`
            ];
          },
          labelTextColor: () => '#F9FAFB',
        },
        animation: {
          duration: 150
        },
      },
    },
    cutout: '75%',
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 800,
      easing: 'easeOutQuart' as const,
    },
    hover: {
      mode: 'point' as const,
      intersect: true,
      animationDuration: 150,
    },
    onHover: (event: any, elements: any[]) => {
      setHoveredIndex(elements.length > 0 ? elements[0].index : null);
      setIsChartHovered(elements.length > 0);
    },
  };

  const totalAlerts = data.whaleAlerts + data.marketShifts + data.tokenLaunches;
  const alertTypes = [
    { label: 'Whale Alerts', value: data.whaleAlerts, color: 'bg-accent', icon: '🐋' },
    { label: 'Market Shifts', value: data.marketShifts, color: 'bg-accent-light', icon: '📊' },
    { label: 'Token Launches', value: data.tokenLaunches, color: 'bg-[rgb(192,132,252)]', icon: '🚀' }
  ];

  return (
    <div className="glass p-6 rounded-xl relative overflow-hidden group h-full">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent-light/5 opacity-50"></div>
      <div className="absolute inset-0 bg-gradient-radial from-accent/5 via-transparent to-transparent opacity-30"></div>
      
      <div className="relative z-10 space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-xl font-bold bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">
              Alerts Breakdown
            </h2>
            <p className="text-xs text-text-secondary">Last 24 hours</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-text-secondary">Live</span>
            <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Chart */}
          <div className="relative w-full aspect-square max-w-[280px] mx-auto group">
            {/* Chart Background Effects */}
            <div className={`absolute inset-0 bg-gradient-radial from-accent/5 via-transparent to-transparent rounded-full scale-[1.02] transition-transform duration-500 ${
              isChartHovered ? 'scale-110 opacity-70' : 'opacity-30'
            }`}></div>
            
            <Pie data={chartData} options={options} />
            
            {/* Center Content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`text-center transform transition-all duration-500 ${
                isChartHovered ? 'scale-110' : ''
              }`}>
                <div className="relative">
                  <div className="text-3xl font-bold bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">
                    {totalAlerts}
                  </div>
                  <div className="text-xs text-text-secondary">
                    Total Alerts
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-4">
            {alertTypes.map((type, index) => (
              <div
                key={type.label}
                className={`flex items-center justify-between p-4 bg-secondary/30 hover:bg-secondary/50 rounded-lg transition-all duration-300 cursor-pointer transform ${
                  hoveredIndex === index ? 'scale-[1.02] shadow-lg shadow-accent/10 bg-secondary/40' : ''
                }`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg ${type.color} flex items-center justify-center ${
                    hoveredIndex === index ? 'animate-pulse' : ''
                  }`}>
                    <span className="text-base">{type.icon}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium">{type.label}</span>
                    <div className="text-xs text-text-secondary mt-1">
                      {((type.value / totalAlerts) * 100).toFixed(1)}% of total
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-lg font-medium">{type.value}</span>
                  <span className="text-xs text-text-secondary mt-0.5">alerts</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button className="w-full px-4 py-3 bg-accent/10 hover:bg-accent/20 text-accent rounded-lg text-sm font-medium transition-all duration-300 hover:shadow-lg hover:shadow-accent/10 transform hover:-translate-y-0.5 relative overflow-hidden group">
          <span className="relative z-10">View All Alerts</span>
          <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-accent-light/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
      </div>
    </div>
  );
};

export default AlertsBreakdown; 