import React, { useEffect } from 'react';
import { useLoyalty } from '../hooks/useLoyalty';
import { useAuth } from '../hooks/useAuth';
import { Award, Gift, Clock, Star, TrendingUp } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ProfileLoyalty from '../components/profile/ProfileLoyalty';

const LoyaltyPage = ({ showSuccess }) => {
  const { currentUser } = useAuth();
  const { points, status, privileges, loadLoyaltyData, loading } = useLoyalty();
  
  useEffect(() => {
    loadLoyaltyData();
  }, [loadLoyaltyData]);
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">
        Программа лояльности
      </h1>
      
      {/* User's loyalty stats */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-3">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Award size={24} className="text-yellow-500 mr-2" /> Ваш статус
            </h2>
            
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
              <div className="w-28 h-28 rounded-full bg-gray-700 flex items-center justify-center">
                <Award size={56} className="text-yellow-500" />
              </div>
              
              <div className="flex-grow text-center md:text-left">
                <h3 className="text-2xl font-bold text-yellow-500 mb-1">
                  {status?.name || 'Новичок'}
                </h3>
                <p className="text-gray-400 mb-4">
                  {status?.description || 'Начальный уровень в программе лояльности'}
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
                  <p className="text-gray-400 text-sm">
                    {status.pointsEarned} / {status.pointsRequired} баллов для уровня{' '}
                    <span className="text-yellow-500">{status.nextLevel}</span>
                  </p>
                ) : (
                  <p className="text-gray-400 text-sm">
                    Максимальный уровень достигнут!
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-4 flex flex-col items-center justify-center border border-gray-700">
            <div className="text-4xl font-bold text-yellow-500 mb-2">
              {points}
            </div>
            <div className="text-center text-gray-400">
              Доступных баллов
            </div>
            <div className="text-xs text-center text-gray-500 mt-2">
              1 балл = 1 сом при оплате услуг
            </div>
          </div>
        </div>
      </div>
      
      {/* How it works */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <div className="bg-red-600 bg-opacity-20 p-3 rounded-lg mr-3">
              <Star className="text-red-600" size={24} />
            </div>
            <h3 className="text-lg font-medium text-white">Накапливайте баллы</h3>
          </div>
          <p className="text-gray-400">
            Получайте 5% от суммы каждой услуги на бонусный счет. Баллы начисляются автоматически после оказания услуги.
          </p>
        </div>
        
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <div className="bg-yellow-500 bg-opacity-20 p-3 rounded-lg mr-3">
              <TrendingUp className="text-yellow-500" size={24} />
            </div>
            <h3 className="text-lg font-medium text-white">Повышайте статус</h3>
          </div>
          <p className="text-gray-400">
            Чем больше услуг вы заказываете, тем выше ваш статус и больше привилегий. Переход на новый уровень происходит автоматически.
          </p>
        </div>
        
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <div className="bg-green-600 bg-opacity-20 p-3 rounded-lg mr-3">
              <Gift className="text-green-600" size={24} />
            </div>
            <h3 className="text-lg font-medium text-white">Используйте привилегии</h3>
          </div>
          <p className="text-gray-400">
            Тратьте накопленные баллы на оплату услуг, получайте скидки и приоритетное обслуживание в зависимости от вашего статуса.
          </p>
        </div>
      </div>
      
      {/* Privileges */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
          <Gift size={24} className="text-green-500 mr-2" /> Привилегии
        </h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-900">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Привилегия
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Новичок
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider text-yellow-700">
                  Bronze
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider text-gray-400">
                  Silver
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider text-yellow-500">
                  Gold
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider text-blue-400">
                  Diamond
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  Бонусные баллы за услуги
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">5%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">5%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">7%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">10%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">15%</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  Специальные предложения
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">-</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">✓</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">✓</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">✓</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">✓</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  Приоритетная запись
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">-</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">-</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">✓</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">✓</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">✓</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  Скидка на дополнительные услуги
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">-</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">-</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">5%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">10%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">15%</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  Персональный менеджер
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">-</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">-</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">-</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">-</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">✓</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Levels description */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
          <Award size={24} className="text-yellow-500 mr-2" /> Уровни лояльности
        </h2>
        
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/5 font-bold text-white mb-2 md:mb-0">
              Новичок
            </div>
            <div className="md:w-4/5 text-gray-400">
              <p>Начальный уровень для всех новых клиентов.</p>
              <p className="text-sm mt-1">0 - 9,999 накопленных баллов</p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/5 font-bold text-yellow-700 mb-2 md:mb-0">
              Bronze
            </div>
            <div className="md:w-4/5 text-gray-400">
              <p>Доступ к специальным предложениям и акциям.</p>
              <p className="text-sm mt-1">10,000 - 24,999 накопленных баллов</p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/5 font-bold text-gray-400 mb-2 md:mb-0">
              Silver
            </div>
            <div className="md:w-4/5 text-gray-400">
              <p>Приоритетная запись и увеличенный процент бонусных баллов.</p>
              <p className="text-sm mt-1">25,000 - 49,999 накопленных баллов</p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/5 font-bold text-yellow-500 mb-2 md:mb-0">
              Gold
            </div>
            <div className="md:w-4/5 text-gray-400">
              <p>Значительные скидки и повышенный процент начисления бонусных баллов.</p>
              <p className="text-sm mt-1">50,000 - 99,999 накопленных баллов</p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/5 font-bold text-blue-400 mb-2 md:mb-0">
              Diamond
            </div>
            <div className="md:w-4/5 text-gray-400">
              <p>Максимальные привилегии, персональный подход и эксклюзивное обслуживание.</p>
              <p className="text-sm mt-1">100,000+ накопленных баллов</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoyaltyPage;