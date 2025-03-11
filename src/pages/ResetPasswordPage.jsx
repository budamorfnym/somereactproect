import React from 'react';
import ResetPasswordForm from '../components/auth/ResetPasswordForm';

const ResetPasswordPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white">Сброс пароля</h1>
        <p className="text-gray-400 mt-2">
          Создайте новый пароль для вашего аккаунта
        </p>
      </div>
      
      <ResetPasswordForm />
    </div>
  );
};

export default ResetPasswordPage;