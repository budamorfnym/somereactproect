import React from 'react';
import { Clock } from 'lucide-react';

const QueuePreview = ({ queueData, handleTabChange }) => {
  if (!queueData || (!queueData.currentWashing.length && !queueData.waiting.length)) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-4">
          Текущая очередь
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Currently washing */}
          <div>
            <h3 className="text-lg font-medium text-white mb-3 flex items-center">
              <Clock size={20} className="text-red-600 mr-2" /> В работе сейчас
            </h3>
            
            {queueData.currentWashing.length > 0 ? (
              <div className="space-y-3">
                {queueData.currentWashing.map((item, index) => (
                  <div key={index} className="bg-gray-900 rounded-lg p-3 flex justify-between items-center">
                    <div>
                      <div className="text-white font-medium">{item.service}</div>
                      <div className="text-gray-400 text-sm">{item.car}</div>
                    </div>
                    <div className="text-yellow-500 text-sm">
                      {item.estimatedFinish}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-900 rounded-lg p-4 text-center text-gray-400">
                В данный момент нет активных работ
              </div>
            )}
          </div>
          
          {/* Waiting */}
          <div>
            <h3 className="text-lg font-medium text-white mb-3 flex items-center">
              <Clock size={20} className="text-yellow-500 mr-2" /> В ожидании
            </h3>
            
            {queueData.waiting.length > 0 ? (
              <div className="space-y-3">
                {queueData.waiting.map((item, index) => (
                  <div key={index} className="bg-gray-900 rounded-lg p-3 flex justify-between items-center">
                    <div>
                      <div className="text-white font-medium">{item.service}</div>
                      <div className="text-gray-400 text-sm">{item.car}</div>
                    </div>
                    <div className="text-gray-400 text-sm">
                      {item.estimatedStart}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-900 rounded-lg p-4 text-center text-gray-400">
                Нет записей в очереди ожидания
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <button
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200"
            onClick={() => handleTabChange('services')}
          >
            Записаться на услугу
          </button>
        </div>
      </div>
    </div>
  );
};

export default QueuePreview;