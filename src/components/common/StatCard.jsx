// src/components/common/StatCard.jsx
import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

/**
 * StatCard Component - Displays a statistic with title, value, icon, and change indicator
 * 
 * @param {Object} props Component props
 * @param {string} props.title Card title
 * @param {string|number} props.value Main value to display
 * @param {React.ReactNode} props.icon Icon element
 * @param {number} props.change Change percentage
 * @param {string} props.changeLabel Label for change value
 * @param {string} props.bgColor Background color for icon
 * @param {Function} props.onClick Optional click handler
 */
const StatCard = ({
  title,
  value,
  icon,
  change,
  changeLabel = '',
  bgColor = 'bg-blue-600',
  onClick
}) => {
  // Format change as string with sign
  const changeStr = change > 0 ? `+${change}%` : `${change}%`;
  
  // Determine text color for change value
  const changeColorClass = change > 0 ? 'text-green-500' : change < 0 ? 'text-red-500' : 'text-gray-400';
  
  return (
    <div 
      className={`bg-gray-800 border border-gray-700 rounded-lg p-6 ${onClick ? 'cursor-pointer hover:border-gray-500' : ''} shadow-sm`}
      onClick={onClick}
    >
      <div className="flex items-start">
        <div className={`p-3 rounded-lg ${bgColor} bg-opacity-20 mr-4`}>
          {icon}
        </div>
        
        <div className="flex-grow">
          <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
          <div className="text-xl font-bold text-white mt-1">{value}</div>
          
          {change !== undefined && change !== null && (
            <div className={`flex items-center mt-1 text-sm ${changeColorClass}`}>
              {change > 0 ? (
                <ArrowUpRight size={16} className="mr-1" />
              ) : change < 0 ? (
                <ArrowDownRight size={16} className="mr-1" />
              ) : null}
              
              <span>
                {changeStr} {changeLabel && <span className="text-gray-500">{changeLabel}</span>}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatCard;