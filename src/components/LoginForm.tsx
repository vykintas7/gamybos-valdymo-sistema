import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LoginCredentials } from '../types/auth';
import { Package, Eye, EyeOff, User, Lock, AlertCircle } from 'lucide-react';

const LoginForm: React.FC = () => {
  const { login, loading, error, clearError } = useAuth();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    usernameOrEmail: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    // Clear error when component mounts or credentials change
    if (error) {
      const timer = setTimeout(clearError, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with credentials:', credentials);
    clearError(); // Clear any previous errors
    if (credentials.usernameOrEmail.trim() && credentials.password.trim()) {
      const success = await login(credentials);
      console.log('Login result:', success);
      if (success) {
        console.log('Login successful');
      } else {
        console.log('Login failed');
      }
      // Login successful, the App component will handle the redirect
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
    if (error) clearError();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl mb-4 shadow-lg">
            <Package className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Versus Labs</h1>
          <p className="text-gray-600 text-lg">Laboratorijos valdymo sistema</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2 tracking-tight">Prisijungimas</h2>
            <p className="text-gray-600 text-sm">Įveskite savo prisijungimo duomenis</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl flex items-start space-x-3 shadow-sm">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-red-800 text-sm font-medium">Prisijungimo klaida</p>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Vartotojo vardas arba el. paštas
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="usernameOrEmail"
                  value={credentials.usernameOrEmail}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm focus:shadow-md"
                  placeholder="Įveskite vartotojo vardą arba el. paštą"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Slaptažodis
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm focus:shadow-md"
                  placeholder="Įveskite slaptažodį"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  disabled={loading}
                />
                <label htmlFor="remember-me" className="ml-2 text-sm text-gray-700">
                  Prisiminti mane
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !credentials.usernameOrEmail.trim() || !credentials.password.trim()}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Prisijungiama...
                </>
              ) : (
                'Prisijungti'
              )}
            </button>
          </form>

        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>© 2024 Versus Labs. Visos teisės saugomos.</p>
          <p className="mt-1">Laboratorijos valdymo sistema</p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;