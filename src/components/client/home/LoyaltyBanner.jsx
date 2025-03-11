import React from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { Award, Gift, TrendingUp } from 'lucide-react';

const LoyaltyBanner = ({ handleTabChange }) => {
  const { isAuthenticated, currentUser } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg p-6 md:p-8 border border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="mb-6 md:mb-0 md:mr-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 flex items-center">
              <Award size={28} className="text-yellow-500 mr-2" /> Программа лояльности
            </h2>
            <p className="text-gray-300 mb-4 max-w-2xl">
              {isAuthenticated 
                ? 'Накапливайте баллы с каждой услугой и используйте их для оплаты. Чем больше услуг, тем выше статус и больше привилегий.'
                : 'Присоединяйтесь к нашей программе лояльности, чтобы получать баллы за каждую услугу и обменивать их на скидки и бонусы.'}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center">
                <div className="bg-gray-700 p-2 rounded-full mr-2">
                  <TrendingUp size={16} className="text-yellow-500" />
                </div>
                <span className="text-gray-300 text-sm">5% баллами от суммы</span>
              </div>
              <div className="flex items-center">
                <div className="bg-gray-700 p-2 rounded-full mr-2">
                  <Gift size={16} className="text-yellow-500" />
                </div>
                <span className="text-gray-300 text-sm">Оплата баллами</span>
              </div>
              <div className="flex items-center">
                <div className="bg-gray-700 p-2 rounded-full mr-2">
                  <Award size={16} className="text-yellow-500" />
                </div>
                <span className="text-gray-300 text-sm">Статусы и привилегии</span>
              </div>
            </div>
            
            <button
              className="inline-flex items-center px-6 py-2 bg-yellow-500 text-gray-900 font-medium rounded hover:bg-yellow-600 transition-colors duration-200"
              onClick={() => handleTabChange(isAuthenticated ? 'loyalty' : 'login')}
            >
              {isAuthenticated ? 'Мои баллы' : 'Присоединиться'}
            </button>
          </div>
          
          {isAuthenticated && currentUser && (
            <div className="bg-gray-900 rounded-lg p-4 md:p-6 border border-gray-700 md:min-w-[220px] text-center">
              <div className="text-3xl md:text-4xl font-bold text-yellow-500 mb-2">
                {currentUser.loyaltyPoints || 0}
              </div>
              <div className="text-gray-300 font-medium mb-4">доступных баллов</div>
              
              <div className="text-sm text-gray-400">
                Ваш статус: <span className="text-yellow-500">{currentUser.loyaltyStatus || 'Новичок'}</span>
              </div>
              
              <div className="mt-3 text-xs text-gray-500">
                1 балл = 1 сом при оплате услуг
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoyaltyBanner;