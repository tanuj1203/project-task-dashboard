import React from 'react';

interface StatCardProps {
  title: string;
  value: number;
  bgColorClass: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, bgColorClass }) => {
  return (
    <div className={`${bgColorClass} rounded-lg p-6 text-white shadow-md transition-transform hover:scale-[1.02] flex flex-col items-center justify-center`}>
      <div className="text-4xl font-bold mb-2">{value}</div>
      <div className="text-sm opacity-90">{title}</div>
    </div>
  );
};

export default StatCard;