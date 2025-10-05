import React from 'react';

interface DonutChartProps {
  data: Array<{ value: number }>;
  colors?: string[];
}

const DonutChart: React.FC<DonutChartProps> = ({ data, colors }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const defaultColors = [
    '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#EF4444'
  ];
  const chartColors = colors || defaultColors;

  if (total === 0) {
    return (
      <div style= {{ 
        width: '100%', 
        height: '300px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: 'var(--text-secondary)'
      }}>
        No data
      </div>
    );
  }

  let currentAngle = -90;
  const paths = data.map((item, index) => {
    const percentage = (item.value / total) * 100;
    const angle = (percentage / 100) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    
    const outerRadius = 45;
    const innerRadius = 25;
    
    const x1 = 50 + outerRadius * Math.cos(startRad);
    const y1 = 50 + outerRadius * Math.sin(startRad);
    const x2 = 50 + outerRadius * Math.cos(endRad);
    const y2 = 50 + outerRadius * Math.sin(endRad);
    
    const x3 = 50 + innerRadius * Math.cos(endRad);
    const y3 = 50 + innerRadius * Math.sin(endRad);
    const x4 = 50 + innerRadius * Math.cos(startRad);
    const y4 = 50 + innerRadius * Math.sin(startRad);
    
    const largeArc = angle > 180 ? 1 : 0;

    return (
      <path
        key={index}
        d={`M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4} Z`}
        fill={chartColors[index % chartColors.length]}
      />
    );
  });

  return (
    <svg viewBox="0 0 100 100" style={{ width: '100%', height: 'auto', maxWidth: '300px' }}>
      {paths}
      <circle cx="50" cy="50" r="25" fill="var(--bg-secondary)" />
    </svg>
  );
};

export default DonutChart;