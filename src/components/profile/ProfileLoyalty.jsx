import React, { useEffect } from 'react';
import { Award, TrendingUp, Clock, Gift } from 'lucide-react';
import { useLoyalty } from '../../hooks/useLoyalty';
import LoadingSpinner from '../common/LoadingSpinner';
import { formatDate } from '../../utils/formatters';

const ProfileLoyalty = () => {
  const { points, status, history, privileges, loading, loadLoyaltyData } = useLoyalty();
  
  useEffect(() => {
    loadLoyaltyData();
  }, [loadLoyaltyData]);
  
  // Helper function to determine status color
  const getStatusColor = (statusName) => {
    const colors = {
      'Bronze': 'text-yellow-700',
      'Silver': 'text-gray-400',
      'Gold': 'text-yellow-500',
      'Platinum': 'text-indigo-400',
      'Diamond': 'text-blue-400'
    };
    return colors[statusName] || 'text-gray-400';
  };
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return (
    <div className="space-y-6">
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <Award size={24} className="text-yellow-500 mr-3" />
          <h2 className="text-xl font-medium text-white">Ваш статус</h2>
        </div>
        
        <div className="flex flex-col md:flex-row items-center md:space-x-6">
          <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center mb-4 md:mb-0">
            <Award size={64} className={getStatusColor(status?.name)} />
          </div>
          
          <div className="flex-grow">
            <h3 className={`text-2xl font-bold ${getStatusColor(status?.name)} mb-2 text-center md:text-left`}>
              {status?.name || 'Новичок'}
            </h3>
            <p className="text-gray-400 mb-4 text-center md:text-left">
              {status?.description || 'Начальный уровень лояльности'}
            </p>
            
            <div className="bg-gray-700 h-2 rounded-full overflow-hidden mb-2">
              <div
                className="bg-red-600 h-full"
                style={{
                  width: `${status?.progress ? Math.min(100, status.progress) : 0}%`
                }}
              ></div>
            </div>
            
            {status?.nextLevel ? (
              <p className="text-gray-400 text-sm text-center md:text-left">
                {status.pointsEarned} / {status.pointsRequired} баллов для уровня{' '}
                <span className={getStatusColor(status.nextLevel)}>{status.nextLevel}</span>
              </p>
            ) : (
              <p className="text-gray-400 text-sm text-center md:text-left">
                Максимальный уровень достигнут!
              </p>
            )}
          </div>
          
          <div className="mt-4 md:mt-0 bg-gray-900 p-6 rounded-lg text-center min-w-[150px]">
            <div className="text-3xl font-bold text-yellow-500 mb-2">
              {points}
            </div>
            <div className="text-gray-400">доступных баллов</div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <TrendingUp size={24} className="text-blue-500 mr-3" />
            <h2 className="text-xl font-medium text-white">История баллов</h2>
          </div>
          
          {history && history.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {history.map((item, index) => (
                <div
                  key={index}
                  className="bg-gray-900 p-3 rounded flex justify-between items-center"
                >
                  <div>
                    <div className="font-medium text-white">{item.description}</div>
                    <div className="text-sm text-gray-400 flex items-center">
                      <Clock size={14} className="mr-1" /> {formatDate(new Date(item.date))}
                    </div>
                  </div>
                  <div
                    className={`text-lg font-bold ${
                      item.type === 'debit' ? 'text-red-500' : 'text-green-500'
                    }`}
                  >
                    {item.type === 'debit' ? '-' : '+'}
                    {item.amount}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-400">
              <p>У вас пока нет истории начислений</p>
            </div>
          )}
        </div>
        
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Gift size={24} className="text-green-500 mr-3" />
            <h2 className="text-xl font-medium text-white">Привилегии</h2>
          </div>
          
          {privileges && privileges.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {privileges.map((privilege, index) => (
                <div
                  key={index}
                  className={`border-l-4 ${
                    privilege.isAvailable ? 'border-green-500' : 'border-gray-500'
                  } bg-gray-900 p-3 rounded-r`}
                >
                  <div className="font-medium text-white">{privilege.name}</div>
                  <div className="text-sm text-gray-400 mt-1">{privilege.description}</div>
                  {!privilege.isAvailable && privilege.requiredStatus && (
                    <div className="mt-2 text-xs">
                      <span className="text-gray-400">Доступно с уровня </span>
                      <span className={getStatusColor(privilege.requiredStatus)}>
                        {privilege.requiredStatus}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-400">
              <p>Информация о привилегиях недоступна</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h2 className="text-xl font-medium text-white mb-4">Как работает программа лояльности</h2>
        
        <div className="space-y-4 text-gray-300">
          <p>
            За каждую услугу вы получаете баллы в размере 5% от суммы заказа. Баллы можно использовать 
            для оплаты услуг из расчета 1 балл = 1 сом.
          </p>
          
          <div>
            <h3 className="text-white font-medium mb-2">Уровни лояльности:</h3>
            <ul className="list-disc list-inside space-y-1 pl-1">
              <li><span className="text-gray-400">Новичок</span> - начальный уровень</li>
              <li><span className="text-yellow-700">Bronze</span> - от 10,000 баллов накопленных</li>
              <li><span className="text-gray-400">Silver</span> - от 25,000 баллов накопленных</li>
              <li><span className="text-yellow-500">Gold</span> - от 50,000 баллов накопленных</li>
              <li><span className="text-indigo-400">Platinum</span> - от 100,000 баллов накопленных</li>
              <li><span className="text-blue-400">Diamond</span> - от 250,000 баллов накопленных</li>
            </ul>
          </div>
          
          <p>
            Чем выше ваш уровень лояльности, тем больше привилегий вы получаете, включая 
            персональные скидки, приоритетную запись и специальные предложения.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileLoyalty;