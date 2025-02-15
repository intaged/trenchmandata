import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

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

interface PerformanceChartProps {
  data: TopTrader;
}

export default function PerformanceChart({ data }: PerformanceChartProps) {
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Total P&L',
        data: [
          data.summary.total * 0.5,
          data.summary.total * 0.7,
          data.summary.total * 0.6,
          data.summary.total * 0.8,
          data.summary.total * 0.9,
          data.summary.total,
        ],
        borderColor: 'rgb(147, 51, 234)',
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(147, 51, 234, 0.2)',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        type: 'category',
        grid: {
          display: false,
        },
        ticks: {
          color: '#9CA3AF',
        },
      },
      y: {
        type: 'linear',
        grid: {
          color: 'rgba(156, 163, 175, 0.1)',
        },
        ticks: {
          color: '#9CA3AF',
          callback: function(value) {
            if (typeof value === 'number') {
              return `$${value.toLocaleString()}`;
            }
            return value;
          },
        },
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
  };

  return (
    <div className="relative">
      <Line data={chartData} options={options} />
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-background to-transparent pointer-events-none"></div>
    </div>
  );
} 