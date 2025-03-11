import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Car, User, Phone, Mail, CheckCircle, XCircle, Clock as ClockIcon, MessageSquare, Award } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import { formatDate, formatTime, formatCurrency } from '../../utils/formatters';
import LoadingSpinner from '../common/LoadingSpinner';
import { useNotification } from '../../hooks/useNotification';

const AdminBookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { api } = useAppContext();
  const { success, error } = useNotification();
  
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusForm, setStatusForm] = useState({
    status: '',
    comment: ''
  });
  
  // Load booking details
  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        
        // In a real application, this would fetch actual data from the API
        // For now, we'll simulate a response with mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data for the example
        const mockBooking = {
          id,
          service: {
            id: 's1',
            name: 'Комплексная мойка',
            price: 2500,
            description: 'Полная очистка кузова, салона и дисков автомобиля'
          },
          options: [
            { id: 'o1', name: 'Чернение резины', price: 300 },
            { id: 'o2', name: 'Полироль пластика', price: 450 }
          ],
          user: {
            id: 'u1',
            name: 'Алексей Петров',
            phone: '+996550123456',
            email: 'aleksey@example.com',
            loyaltyPoints: 320
          },
          carModel: 'Toyota Camry',
          carNumber: 'B123ABC',
          date: '2023-08-16',
          time: '14:30',
          status: 'confirmed',
          totalPrice: 3250,
          pointsUsed: 0,
          comment: 'Особое внимание подкапотному пространству',
          createdAt: '2023-08-14T10:23:45Z',
          statusHistory: [
            { status: 'pending', date: '2023-08-14T10:23:45Z', comment: 'Запись создана клиентом' },
            { status: 'confirmed', date: '2023-08-14T11:05:12Z', comment: 'Запись подтверждена администратором' }
          ]
        };
        
        setBooking(mockBooking);
        setStatusForm({ status: mockBooking.status, comment: '' });
        
      } catch (err) {
        console.error('Error fetching booking details:', err);
        error('Не удалось загрузить детали записи');
        navigate('/admin/bookings');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookingDetails();
  }, [id, api, navigate, error]);
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStatusForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle status update
  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    
    if (!statusForm.status) {
      error('Выберите статус');
      return;
    }
    
    try {
      setLoading(true);
      
      // In a real application, this would be an API call to update the booking status
      // For now, we'll simulate a successful update
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state to reflect the change
      setBooking(prev => ({
        ...prev,
        status: statusForm.status,
        statusHistory: [
          ...prev.statusHistory,
          {
            status: statusForm.status,
            date: new Date().toISOString(),
            comment: statusForm.comment || 'Статус обновлен администратором'
          }
        ]
      }));
      
      success('Статус успешно обновлен');
      setStatusForm(prev => ({ ...prev, comment: '' }));
      
    } catch (err) {
      console.error('Error updating booking status:', err);
      error('Не удалось обновить статус');
    } finally {
      setLoading(false);
    }
  };
  
  // Get color and label for status display
  const getStatusInfo = (status) => {
    const statusMap = {
      'pending': { color: 'bg-yellow-500', label: 'Ожидает подтверждения', icon: <ClockIcon size={20} /> },
      'confirmed': { color: 'bg-green-500', label: 'Подтверждена', icon: <CheckCircle size={20} /> },
      'in-progress': { color: 'bg-blue-500', label: 'В процессе', icon: <ClockIcon size={20} /> },
      'completed': { color: 'bg-green-500', label: 'Завершена', icon: <CheckCircle size={20} /> },
      'cancelled': { color: 'bg-red-500', label: 'Отменена', icon: <XCircle size={20} /> }
    };
    
    return statusMap[status] || { color: 'bg-gray-500', label: 'Неизвестный статус', icon: <ClockIcon size={20} /> };
  };
  
  if (loading || !booking) {
    return <LoadingSpinner />;
  }
  
  const statusInfo = getStatusInfo(booking.status);
  
  return (
    <div>
      <div className="flex items-center mb-6">
        <button
          className="mr-4 text-gray-400 hover:text-white transition-colors duration-200"
          onClick={() => navigate('/admin/bookings')}
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-white">
          Запись #{booking.id}
        </h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column - Booking details */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-medium text-white mb-1">
                  {booking.service.name}
                </h2>
                <div className="text-gray-400">{booking.service.description}</div>
              </div>
              
              <div className="flex items-center px-3 py-1 rounded-full text-white text-sm ${statusInfo.color}">
                <div className={`${statusInfo.color} text-white px-3 py-1 rounded-full flex items-center`}>
                  {statusInfo.icon}
                  <span className="ml-1">{statusInfo.label}</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start">
                  <Calendar className="text-gray-400 mr-3 mt-0.5" size={18} />
                  <div>
                    <div className="text-gray-400 text-sm">Дата</div>
                    <div className="text-white">{formatDate(new Date(booking.date))}</div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="text-gray-400 mr-3 mt-0.5" size={18} />
                  <div>
                    <div className="text-gray-400 text-sm">Время</div>
                    <div className="text-white">{formatTime(booking.time)}</div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Car className="text-gray-400 mr-3 mt-0.5" size={18} />
                  <div>
                    <div className="text-gray-400 text-sm">Автомобиль</div>
                    <div className="text-white">{booking.carModel}</div>
                    <div className="text-gray-400 text-sm">#{booking.carNumber}</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start">
                  <User className="text-gray-400 mr-3 mt-0.5" size={18} />
                  <div>
                    <div className="text-gray-400 text-sm">Клиент</div>
                    <div className="text-white">{booking.user.name}</div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="text-gray-400 mr-3 mt-0.5" size={18} />
                  <div>
                    <div className="text-gray-400 text-sm">Телефон</div>
                    <div className="text-white">{booking.user.phone}</div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail className="text-gray-400 mr-3 mt-0.5" size={18} />
                  <div>
                    <div className="text-gray-400 text-sm">Email</div>
                    <div className="text-white">{booking.user.email}</div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Award className="text-yellow-500 mr-3 mt-0.5" size={18} />
                  <div>
                    <div className="text-gray-400 text-sm">Бонусные баллы</div>
                    <div className="text-white">{booking.user.loyaltyPoints}</div>
                  </div>
                </div>
              </div>
            </div>
            
            {booking.comment && (
              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="flex items-start">
                  <MessageSquare className="text-gray-400 mr-3 mt-0.5" size={18} />
                  <div>
                    <div className="text-gray-400 text-sm">Комментарий клиента</div>
                    <div className="text-white">{booking.comment}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h2 className="text-lg font-medium text-white mb-4">Детали заказа</h2>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Основная услуга:</span>
                <span className="text-white">{formatCurrency(booking.service.price)}</span>
              </div>
              
              {booking.options.length > 0 && (
                <div>
                  {booking.options.map(option => (
                    <div key={option.id} className="flex justify-between pl-4">
                      <span className="text-gray-400">- {option.name}</span>
                      <span className="text-white">{formatCurrency(option.price)}</span>
                    </div>
                  ))}
                </div>
              )}
              
              {booking.pointsUsed > 0 && (
                <div className="flex justify-between text-yellow-500">
                  <span>Использовано баллов:</span>
                  <span>-{formatCurrency(booking.pointsUsed)}</span>
                </div>
              )}
              
              <div className="border-t border-gray-700 pt-2 mt-2">
                <div className="flex justify-between font-medium">
                  <span className="text-gray-400">Итого:</span>
                  <span className="text-yellow-500 text-lg">{formatCurrency(booking.totalPrice)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h2 className="text-lg font-medium text-white mb-4">История статусов</h2>
            
            <div className="relative pl-6 before:content-[''] before:absolute before:top-2 before:left-2.5 before:w-px before:h-full before:bg-gray-700">
              {booking.statusHistory.map((item, index) => {
                const itemStatus = getStatusInfo(item.status);
                
                return (
                  <div key={index} className="mb-4 relative">
                    <div className={`absolute left-[-20px] top-0.5 w-3 h-3 rounded-full ${itemStatus.color}`}></div>
                    <div>
                      <div className="text-white font-medium flex items-center">
                        {itemStatus.icon}
                        <span className="ml-2">{itemStatus.label}</span>
                      </div>
                      <div className="text-gray-400 text-sm">{formatDate(new Date(item.date))}, {new Date(item.date).toLocaleTimeString()}</div>
                      {item.comment && (
                        <div className="text-gray-300 mt-1">{item.comment}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Right column - Actions */}
        <div className="space-y-6">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h2 className="text-lg font-medium text-white mb-4">Обновить статус</h2>
            
            <form onSubmit={handleUpdateStatus} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Статус
                </label>
                <select
                  name="status"
                  value={statusForm.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-900 text-white"
                  required
                >
                  <option value="">Выберите статус</option>
                  <option value="pending">Ожидает подтверждения</option>
                  <option value="confirmed">Подтверждена</option>
                  <option value="in-progress">В процессе</option>
                  <option value="completed">Завершена</option>
                  <option value="cancelled">Отменена</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Комментарий
                </label>
                <textarea
                  name="comment"
                  value={statusForm.comment}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-900 text-white"
                  rows="3"
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center"
                disabled={loading}
              >
                {loading ? <LoadingSpinner /> : 'Обновить статус'}
              </button>
            </form>
          </div>
          
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h2 className="text-lg font-medium text-white mb-4">Действия</h2>
            
            <div className="space-y-3">
              <button
                className="w-full bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors duration-200"
                onClick={() => {
                  // In a real app, this would open a modal or navigate to a page for sending notifications
                  alert('Уведомление отправлено клиенту');
                }}
              >
                Отправить напоминание
              </button>
              
              <button
                className="w-full bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors duration-200"
                onClick={() => {
                  window.print();
                }}
              >
                Распечатать детали
              </button>
              
              <button
                className="w-full bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors duration-200"
                onClick={() => {
                  navigate(`/admin/users/${booking.user.id}`);
                }}
              >
                Профиль клиента
              </button>
            </div>
          </div>
          
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h2 className="text-lg font-medium text-white mb-4">Информация о записи</h2>
            
            <div className="space-y-3">
              <div>
                <div className="text-gray-400 text-sm">ID записи</div>
                <div className="text-white">{booking.id}</div>
              </div>
              
              <div>
                <div className="text-gray-400 text-sm">Создана</div>
                <div className="text-white">{formatDate(new Date(booking.createdAt))}, {new Date(booking.createdAt).toLocaleTimeString()}</div>
              </div>
              
              <div>
                <div className="text-gray-400 text-sm">Источник</div>
                <div className="text-white">Веб-сайт</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBookingDetails;