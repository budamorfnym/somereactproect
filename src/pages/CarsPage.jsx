import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCars } from '../hooks/useCars';
import { useNotification } from '../hooks/useNotification';
import { Car, Plus, Edit, Trash2, AlertTriangle } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';

const CarsPage = ({ showSuccess }) => {
  const { cars, loadUserCars, deleteCar, loading } = useCars();
  const { success, error } = useNotification();
  const navigate = useNavigate();
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [carToDelete, setCarToDelete] = useState(null);
  
  // Load cars when component mounts
  useEffect(() => {
    loadUserCars();
  }, [loadUserCars]);
  
  // Handle car deletion
  const handleDeleteCar = async () => {
    if (!carToDelete) return;
    
    try {
      await deleteCar(carToDelete.id);
      success('Автомобиль успешно удален');
      if (showSuccess) {
        showSuccess('Автомобиль успешно удален');
      }
      setShowDeleteModal(false);
      setCarToDelete(null);
    } catch (err) {
      error('Не удалось удалить автомобиль');
    }
  };
  
  // Open delete confirmation modal
  const confirmDelete = (car) => {
    setCarToDelete(car);
    setShowDeleteModal(true);
  };
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          Мои автомобили
        </h1>
        <Link
          to="/cars/add"
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors duration-200 flex items-center"
        >
          <Plus size={20} className="mr-2" /> Добавить автомобиль
        </Link>
      </div>
      
      {cars.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map(car => (
            <div 
              key={car.id}
              className="bg-gray-800 border border-gray-700 rounded-lg p-5 hover:border-gray-600 transition-colors duration-200"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <div className="bg-gray-700 p-3 rounded-full mr-3">
                    <Car size={24} className="text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white">{car.model}</h3>
                    <div className="text-gray-400 text-sm">{car.year}</div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => navigate(`/cars/${car.id}/edit`)}
                    className="bg-gray-700 p-2 rounded-full text-gray-400 hover:bg-gray-600 hover:text-white transition-colors duration-200"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => confirmDelete(car)}
                    className="bg-gray-700 p-2 rounded-full text-gray-400 hover:bg-red-600 hover:text-white transition-colors duration-200"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Гос. номер:</span>
                  <span className="text-white">{car.plateNumber}</span>
                </div>
                {car.color && (
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-gray-400">Цвет:</span>
                    <span className="text-white">{car.color}</span>
                  </div>
                )}
                {car.vin && (
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-gray-400">VIN:</span>
                    <span className="text-white">{car.vin}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center">
          <AlertTriangle size={48} className="mx-auto mb-4 text-yellow-500" />
          <h2 className="text-xl font-medium text-white mb-2">У вас пока нет добавленных автомобилей</h2>
          <p className="text-gray-400 mb-6">
            Для записи на услуги вам необходимо добавить хотя бы один автомобиль
          </p>
          <Link
            to="/cars/add"
            className="bg-red-600 text-white px-6 py-3 rounded hover:bg-red-700 transition-colors duration-200 inline-flex items-center"
          >
            <Plus size={20} className="mr-2" /> Добавить автомобиль
          </Link>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-medium text-white mb-4">Удаление автомобиля</h3>
            <p className="text-gray-300 mb-6">
              Вы уверены, что хотите удалить автомобиль {carToDelete?.model} (#{carToDelete?.plateNumber})?
              Это действие нельзя будет отменить.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors duration-200"
              >
                Отмена
              </button>
              <button
                onClick={handleDeleteCar}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarsPage;