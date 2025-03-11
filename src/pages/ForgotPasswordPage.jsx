import React from 'react';
import ForgotPasswordForm from '../components/auth/ForgotPasswordForm';

const ForgotPasswordPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white">Восстановление пароля</h1>
        <p className="text-gray-400 mt-2">
          Введите ваш email для получения инструкций по сбросу пароля
        </p>
      </div>
      
      <ForgotPasswordForm />
    </div>
  );
};

export default ForgotPasswordPage;