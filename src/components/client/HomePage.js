// components/client/HomePage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../App';

const HomePage = () => {
  const { 
    setActiveTab, 
    api, 
    isAuthenticated, 
    companyInfo 
  } = useAppContext();
  
  const [categories, setCategories] = useState([]);
  const [queueData, setQueueData] = useState({ currentWashing: [], waiting: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [reviews, setReviews] = useState([]);

  // Fetch initial data
  useEffect(() => {
    const fetchHomeData = async () => {
      setIsLoading(true);
      try {
        // Fetch categories
        const categoriesRes = await api.get('/categories');
        setCategories(categoriesRes.data.filter(cat => cat.id !== 'all'));
        
        // Fetch queue data
        const queueRes = await api.get('/queue');
        setQueueData(queueRes.data);
        
        // Example reviews (in a real app, would come from API)
        setReviews([
          {
            name: "Бакыт А.",
            text: "Абдан жакшы кызмат! Машинаны тааныган жокмун химчисткадан кийин. Кесипкөйлүгүңүз үчүн рахмат!",
            rating: 5,
          },
          {
            name: "Мария И.",
            text: "Быстро и качественно. Пользуюсь услугами уже более года и всегда довольна результатом.",
            rating: 5,
          },
          {
            name: "Тимур К.",
            text: "Ыңгайлуу онлайн жазылуу, эч кандай кезектер жок. Баары мен күткөндөн дагы жакшы болду.",
            rating: 4,
          }
        ]);
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomeData();
  }, [api]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-12 py-8">
      {/* Hero section */}
      <div className="bg-gradient-to-r from-black via-red-900 to-black py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white">
            Профессиональный детейлинг вашего автомобиля
          </h1>
          <p className="mt-6 text-base md:text-xl text-gray-300 max-w-3xl">
            Качественные услуги с заботой о каждой детали. Доверьте свой
            автомобиль профессионалам!
          </p>
          <div className="mt-8 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <Link
              to="/services"
              className="bg-red-600 border border-red-600 px-6 py-3 text-base font-medium text-white hover:bg-red-700 text-center"
              onClick={() => handleTabChange("services")}
            >
              Записаться сейчас
            </Link>
            <Link
              to="/queue"
              className="bg-transparent border border-white px-6 py-3 text-base font-medium text-white hover:bg-gray-800 text-center"
              onClick={() => handleTabChange("queue")}
            >
              Посмотреть очередь
            </Link>
          </div>
        </div>
      </div>

      {/* Service categories */}
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-6">
          Наши услуги
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link
              to="/services"
              key={category.id}
              className="bg-gray-800 border border-gray-700 rounded-lg p-4 md:p-6 flex flex-col items-center cursor-pointer hover:border-red-600 transition"
              onClick={() => {
                setActiveTab("services");
                localStorage.setItem("selectedCategory", category.id);
              }}
            >
              <span className="text-2xl md:text-3xl mb-2 md:mb-3">
                {category.icon}
              </span>
              <h3 className="text-sm md:text-lg font-medium text-white text-center">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>

      {/* Queue status */}
      <div className="bg-gray-800 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3 md:mb-0">
              Текущая очередь
            </h2>
            <Link
              to="/queue"
              className="bg-red-600 px-4 py-2 rounded text-white font-medium hover:bg-red-700"
              onClick={() => handleTabChange("queue")}
            >
              Посмотреть подробнее
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Current washing */}
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
              <h3 className="text-xl font-medium text-white mb-4">
                Сейчас на мойке
              </h3>
              {queueData.currentWashing.length === 0 ? (
                <div className="bg-gray-800 p-3 rounded text-gray-400 text-center">
                  Нет автомобилей на мойке
                </div>
              ) : (
                queueData.currentWashing.slice(0, 2).map((item, index) => (
                  <div
                    key={index}
                    className={`mb-4 p-3 rounded-lg ${
                      item.isMine
                        ? "bg-red-900 bg-opacity-50 border border-red-600"
                        : "bg-gray-800"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="flex items-center">
                          <span className="bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center mr-2">
                            {item.position}
                          </span>
                          <span className="font-medium text-white">
                            {item.car}
                          </span>
                          {item.isMine && (
                            <span className="ml-2 bg-red-600 text-xs px-2 py-0.5 rounded-full text-white">
                              Моя машина
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-400 ml-8">
                          #{item.plateNumber}
                        </div>
                      </div>
                      <span className="text-sm text-gray-400">
                        до {item.estimatedEndTime}
                      </span>
                    </div>
                    <div className="ml-8">
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Прогресс:</span>
                        <span>{item.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-red-600 h-2 rounded-full"
                          style={{ width: `${item.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))
              )}
              {queueData.currentWashing.length > 2 && (
                <Link
                  to="/queue"
                  className="text-sm text-gray-400 hover:text-white mt-2 flex items-center"
                  onClick={() => handleTabChange("queue")}
                >
                  Показать больше
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              )}
            </div>

            {/* Waiting */}
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
              <h3 className="text-xl font-medium text-white mb-4">
                Ожидают
              </h3>
              {queueData.waiting.length === 0 ? (
                <div className="bg-gray-800 p-3 rounded text-gray-400 text-center">
                  Нет ожидающих автомобилей
                </div>
              ) : (
                queueData.waiting.slice(0, 3).map((item, index) => (
                  <div
                    key={index}
                    className={`mb-3 p-3 rounded-lg ${
                      item.isMine
                        ? "bg-red-900 bg-opacity-50 border border-red-600"
                        : "bg-gray-800"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <span className="bg-gray-700 text-white w-6 h-6 rounded-full flex items-center justify-center mr-2">
                          {item.position}
                        </span>
                        <div>
                          <div className="font-medium text-white flex items-center">
                            {item.car}
                            {item.isMine && (
                              <span className="ml-2 bg-red-600 text-xs px-2 py-0.5 rounded-full text-white">
                                Моя машина
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-400">
                            #{item.plateNumber}
                          </div>
                        </div>
                      </div>
                      <span className="text-sm text-gray-400">
                        {item.estimatedStartTime}
                      </span>
                    </div>
                  </div>
                ))
              )}
              {queueData.waiting.length > 3 && (
                <Link
                  to="/queue"
                  className="text-sm text-gray-400 hover:text-white mt-2 flex items-center"
                  onClick={() => handleTabChange("queue")}
                >
                  Показать больше
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Loyalty banner */}
      <div className="bg-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white">
                Присоединяйтесь к программе лояльности
              </h2>
              <p className="mt-4 text-base md:text-lg text-gray-300">
                Получайте баллы за каждую услугу и обменивайте их на
                скидки и бесплатные услуги. Становитесь серебряным,
                золотым или платиновым клиентом и получайте привилегии.
              </p>
              <div className="mt-6">
                <Link
                  to="/loyalty"
                  className="bg-red-600 px-5 py-3 rounded-md text-base font-medium text-white hover:bg-red-700 inline-block"
                  onClick={() => handleTabChange("loyalty")}
                >
                  Узнать больше
                </Link>
              </div>
            </div>
            <div className="mt-8 lg:mt-0">
              <div className="bg-gray-900 p-4 md:p-6 rounded-lg border border-gray-700">
                <div className="text-lg font-medium text-white mb-4">
                  Статусы клиентов
                </div>
                <div className="space-y-4">
                  <div className="border border-gray-700 rounded p-3">
                    <div className="font-semibold text-yellow-500">
                      Серебряный
                    </div>
                    <div className="text-sm text-gray-400 mt-2">
                      <div className="flex items-center">
                        <span className="text-red-500 mr-2">✓</span>{" "}
                        Скидка 5%
                      </div>
                      <div className="flex items-center">
                        <span className="text-red-500 mr-2">✓</span>{" "}
                        Приоритет в очереди
                      </div>
                    </div>
                  </div>
                  <div className="border border-gray-700 rounded p-3">
                    <div className="font-semibold text-yellow-500">
                      Золотой
                    </div>
                    <div className="text-sm text-gray-400 mt-2">
                      <div className="flex items-center">
                        <span className="text-red-500 mr-2">✓</span>{" "}
                        Скидка 10%
                      </div>
                      <div className="flex items-center">
                        <span className="text-red-500 mr-2">✓</span>{" "}
                        Высокий приоритет
                      </div>
                      <div className="flex items-center">
                        <span className="text-red-500 mr-2">✓</span>{" "}
                        Бесплатная мойка
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-6">
          Отзывы клиентов
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((review, idx) => (
            <div
              key={idx}
              className="bg-gray-800 border border-gray-700 rounded-lg p-6"
            >
              <div className="text-yellow-500 flex mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star}>
                    {star <= review.rating ? "★" : "☆"}
                  </span>
                ))}
              </div>
              <p className="text-gray-300 mb-4">"{review.text}"</p>
              <p className="text-white font-medium">{review.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;