import React from 'react';
import { useAnalytics } from '../../providers/AnalyticsProvider';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface VisualizationProps {
  type: 'portfolio' | 'risk' | 'correlation' | 'volume' | 'smart-money' | 'volatility';
  timeframe: string;
}

export const VisualizationPanel: React.FC<VisualizationProps> = ({ type, timeframe }) => {
  const { generateReport } = useAnalytics();
  const [data, setData] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      const report = await generateReport(type, timeframe);
      setData(report.data);
    };
    fetchData();
  }, [type, timeframe]);

  const renderVisualization = () => {
    switch (type) {
      case 'portfolio':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'risk':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="asset" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="risk" fill="#82ca9d" />
              <Bar dataKey="exposure" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'correlation':
        return (
          <div className="grid grid-cols-2 gap-4">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Legend />
                {data[0] && Object.keys(data[0])
                  .filter(key => key !== 'timestamp')
                  .map((asset, index) => (
                    <Line
                      key={asset}
                      type="monotone"
                      dataKey={asset}
                      stroke={`#${Math.floor(Math.random()*16777215).toString(16)}`}
                    />
                  ))}
              </LineChart>
            </ResponsiveContainer>
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <h3 className="text-lg font-medium mb-2">Correlation Matrix</h3>
              {/* Render correlation matrix here */}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium">
          {type.charAt(0).toUpperCase() + type.slice(1)} Analysis
        </h2>
        <div className="space-x-2">
          <button className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-md">
            Export
          </button>
          <button className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-md">
            Refresh
          </button>
        </div>
      </div>
      {renderVisualization()}
    </div>
  );
}; 