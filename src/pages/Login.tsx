import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import logo from '../assets/logo.png';
import sitinfra from '../assets/sintinfraCam.png';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [service, setService] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!username || !password) {
        throw new Error('Username and password are required');
      }

      await login(username, password);

      if (username === 'public' && password === 'public') {
        navigate('/public-service');
      } else {
        navigate('/services');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
       {/* <div className="flex items-start space-x-8 p-6">
      <img
          src={logo}
          alt="Drapeau du Cameroun"
          className="h-20 w-auto"
        />
        <img
          src={sitinfra}
          alt="Drapeau du Cameroun"
          className="h-20 w-auto"
        />
      </div> */}
      <div className="max-w-md w-full space-y-8">
        
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">MINDCAF</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ministère des Domaines, du Cadastre et des Affaires Foncières
          </p>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px space-y-4">
            <div className='mb-4'>
              <label htmlFor="service" className="sr-only">Service</label>
              <select
                id="service"
                name="service"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                value={service}
                onChange={(e) => setService(e.target.value)}
              >
                <option value="">Select a service</option>
                <option value="BUREAU_DU_COURRIER">Bureau du Courrier</option>
                <option value="RECETTE_DEPARTEMENTALE_DES_DOMAINES">Recette Départementale des Domaines</option>
                <option value="CONSERVATION_FONCIERE">Conservation Foncière</option>
                <option value="SERVICE_DEPARTEMENTAL_DES_DOMAINES">Service Départemental des Domaines</option>
                <option value="SERVICE_DEPARTEMENTAL_DES_AFFAIRES_FONCIERES">Service Départemental des Affaires Foncières</option>
                <option value="SERVICE_DEPARTEMENTAL_DU_PATRIMOINE_DE_L_ETAT">Service Départemental du Patrimoine de l'État</option>
                <option value="SERVICE_DEPARTEMENTAL_DU_CADASTRE">Service Départemental du Cadastre</option>
                <option value="SERVICE_PUBLIC">Service public</option>
              </select>
            </div>
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="username" className="sr-only">Username</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

