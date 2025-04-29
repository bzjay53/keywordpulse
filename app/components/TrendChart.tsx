'use client';

import React, { useState, useMemo } from 'react';
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
  ChartOptions,
  TooltipItem,
  Filler,
} from 'chart.js';

// Chart.js 등록
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

// 트렌드 데이터 타입 정의
interface TrendData {
  date: string;
  value: number;
}

// 컴포넌트 Props 타입 정의
interface TrendChartProps {
  keyword: string;
  trendData: TrendData[];
  className?: string;
  height?: number;
  width?: number;
  showLegend?: boolean;
  isLoading?: boolean;
  colorScheme?: 'blue' | 'green' | 'purple' | 'orange';
}

// 기간 필터 타입
type TimeRange = 'day' | 'week' | 'month';

/**
 * 키워드 트렌드 차트 컴포넌트
 * 트렌드 API의 데이터를 사용하여 시간에 따른 키워드 인기도를 시각화합니다.
 */
const TrendChart: React.FC<TrendChartProps> = ({
  keyword,
  trendData,
  className = '',
  height = 300,
  width = 600,
  showLegend = true,
  isLoading = false,
  colorScheme = 'blue',
}) => {
  // 시간 범위 상태
  const [timeRange, setTimeRange] = useState<TimeRange>('week');

  // 컬러 스키마 설정
  const colors = useMemo(() => {
    switch (colorScheme) {
      case 'green':
        return {
          border: 'rgb(34, 197, 94)',
          background: 'rgba(34, 197, 94, 0.5)',
        };
      case 'purple':
        return {
          border: 'rgb(168, 85, 247)', 
          background: 'rgba(168, 85, 247, 0.5)',
        };
      case 'orange':
        return {
          border: 'rgb(249, 115, 22)',
          background: 'rgba(249, 115, 22, 0.5)',
        };
      case 'blue':
      default:
        return {
          border: 'rgb(59, 130, 246)',
          background: 'rgba(59, 130, 246, 0.5)',
        };
    }
  }, [colorScheme]);

  // 시간 범위에 따라 데이터 필터링
  const filteredData = useMemo(() => {
    if (isLoading || !trendData || trendData.length === 0) {
      return [];
    }

    const now = new Date();
    let filterDate = new Date();

    switch (timeRange) {
      case 'day':
        filterDate.setDate(now.getDate() - 1);
        break;
      case 'week':
        filterDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        filterDate.setMonth(now.getMonth() - 1);
        break;
      default:
        filterDate.setDate(now.getDate() - 7);
    }

    return trendData.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= filterDate;
    });
  }, [trendData, timeRange, isLoading]);

  // 차트 데이터 구성
  const chartData = useMemo(() => {
    const labels = filteredData.map(item => {
      const date = new Date(item.date);
      return date.toLocaleDateString('ko-KR', { 
        month: 'short', 
        day: 'numeric'
      });
    });
    const values = filteredData.map(item => item.value);

    return {
      labels,
      datasets: [
        {
          label: `'${keyword}' 인기도`,
          data: values,
          borderColor: colors.border,
          backgroundColor: colors.background,
          tension: 0.3,
          pointRadius: 3,
          pointHoverRadius: 5,
          fill: true,
        },
      ],
    };
  }, [filteredData, keyword, colors]);

  // 차트 옵션 구성
  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: showLegend,
        position: 'top' as const,
        labels: {
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<'line'>) => `인기도: ${context.parsed.y}`,
        },
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: 10,
        cornerRadius: 6,
      },
      title: {
        display: true,
        text: `'${keyword}' 트렌드 분석`,
        font: {
          size: 16,
          weight: 'bold',
        },
        color: '#333',
        padding: {
          top: 10,
          bottom: 20,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: '날짜',
          font: {
            size: 12,
          },
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          font: {
            size: 11,
          },
        },
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: '인기도',
          font: {
            size: 12,
          },
        },
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
    },
    animation: {
      duration: 1000,
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    elements: {
      line: {
        borderWidth: 2,
      },
      point: {
        hitRadius: 8,
      },
    },
  };

  // 로딩 상태 UI
  if (isLoading) {
    return (
      <div 
        className={`flex flex-col items-center justify-center bg-gray-50 rounded-lg p-6 ${className}`}
        style={{ height, width: width === 600 ? '100%' : width }}
        aria-label="트렌드 데이터 로딩 중"
      >
        <div className="animate-pulse space-y-4 w-full">
          <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="flex justify-center space-x-2">
            <div className="h-8 bg-gray-200 rounded w-16"></div>
            <div className="h-8 bg-gray-200 rounded w-16"></div>
            <div className="h-8 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
      </div>
    );
  }

  // 데이터가 없는 경우 대체 UI
  if (!trendData || trendData.length === 0) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-50 rounded-lg ${className}`}
        style={{ height, width: width === 600 ? '100%' : width }}
        aria-label="트렌드 데이터가 없습니다"
      >
        <div className="text-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-12 w-12 mx-auto text-gray-400 mb-2"
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
            />
          </svg>
          <p className="text-gray-500 text-lg">이 키워드에 대한 트렌드 데이터가 없습니다.</p>
          <p className="text-gray-400 text-sm mt-2">다른 키워드를 선택하거나 나중에 다시 시도해보세요.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`trend-chart-container ${className}`}>
      {/* 필터 컨트롤 */}
      <div className="flex flex-wrap justify-end mb-4 space-x-2" role="group" aria-label="트렌드 기간 필터">
        <button
          className={`px-3 py-1 text-sm rounded-md transition-colors ${
            timeRange === 'day' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => setTimeRange('day')}
          aria-pressed={timeRange === 'day'}
        >
          일간
        </button>
        <button
          className={`px-3 py-1 text-sm rounded-md transition-colors ${
            timeRange === 'week' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => setTimeRange('week')}
          aria-pressed={timeRange === 'week'}
        >
          주간
        </button>
        <button
          className={`px-3 py-1 text-sm rounded-md transition-colors ${
            timeRange === 'month' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => setTimeRange('month')}
          aria-pressed={timeRange === 'month'}
        >
          월간
        </button>
      </div>

      {/* 차트 영역 */}
      <div 
        className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
        style={{ height, width: width === 600 ? '100%' : width }}
        aria-label={`${keyword} 키워드의 ${timeRange === 'day' ? '일간' : timeRange === 'week' ? '주간' : '월간'} 트렌드 차트`}
      >
        <Line data={chartData} options={options} />
      </div>

      {/* 요약 정보 */}
      <div className="mt-4 text-sm text-gray-600">
        {filteredData.length > 0 && (
          <div className="flex flex-wrap justify-between gap-2 bg-gray-50 p-3 rounded-md">
            <span className="font-medium">
              기간: {new Date(filteredData[0].date).toLocaleDateString('ko-KR')} ~ 
              {new Date(filteredData[filteredData.length - 1].date).toLocaleDateString('ko-KR')}
            </span>
            <span className="font-medium">
              최고값: {Math.max(...filteredData.map(item => item.value))}
              {' | '}
              평균값: {Math.round(filteredData.reduce((sum, item) => sum + item.value, 0) / filteredData.length)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendChart; 