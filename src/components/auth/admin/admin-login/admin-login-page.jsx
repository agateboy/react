
import React, { useState, useEffect, useRef } from 'react';
import AdminLoginPresenter from './admin-login-presenter';


import { useNavigate } from 'react-router-dom';

function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const presenter = useRef(new AdminLoginPresenter());
  const navigate = useNavigate(); 

  useEffect(() => {
    presenter.current.setView({
      showErrorMessage: (message) => setErrorMessage(message),
      clearMessages: () => {
        setErrorMessage('');
        setShowSuccessPopup(false);
      },
      showLoading: (loading) => setIsLoading(loading),
      onLoginSuccess: () => {
        setShowSuccessPopup(true);
        setEmail('');
        setPassword('');
        setErrorMessage('');
        setTimeout(() => {
          setShowSuccessPopup(false);
          navigate('/admin/dashboard'); 
        }, 1500);
      },
    });
  }, [navigate]); 

  const handleSubmit = (e) => {
    e.preventDefault();
    presenter.current.handleLoginAttempt(email, password);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Admin Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="emailInput" className="block text-sm font-medium text-gray-700 mb-1">
              Email:
            </label>
            <input
              type="email"
              id="emailInput"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="admin@example.com"
            />
          </div>
          <div className="relative">
            <label htmlFor="passwordInput" className="block text-sm font-medium text-gray-700 mb-1">
              Password:
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="passwordInput"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm pr-10"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500 top-7"
            >
              {showPassword ? (
                <i className="fas fa-eye-slash"></i> 
              ) : (
                <i className="fas fa-eye"></i> 
              )}
            </button>
          </div>

          {errorMessage && <p className="text-red-600 text-sm text-center">{errorMessage}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Logging In...' : 'Login'}
          </button>
        </form>
      
      </div>

      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-semibold text-green-600 mb-2">Login Berhasil!</h3>
            <p className="text-gray-700">Anda akan diarahkan ke dashboard admin...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminLoginPage;
