import React, { useState } from 'react';
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-800 p-4">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Section gauche : Image et description */}
        <div className="w-full md:w-1/2 bg-blue-700 p-8 flex flex-col justify-center items-center text-white">
          <div className="flex items-center space-x-4 mb-8">
            <img src={logo} alt="Logo" className="h-16 w-auto" />
            <img src={sitinfra} alt="SITINFRA" className="h-16 w-auto" />
          </div>
          <h1 className="text-3xl font-bold text-center mb-4">Bienvenue sur MINDCAF</h1>
          <p className="text-center text-lg">
            Ministère des Domaines, du Cadastre et des Affaires Foncières
          </p>
          <p className="text-center text-sm mt-4">
            Connectez-vous pour accéder à votre espace personnel et gérer vos demandes en ligne.
          </p>
        </div>

        {/* Section droite : Formulaire de connexion */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Connexion</h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">{error}</h3>
                  </div>
                </div>
              </div>
            )}

            {/* Sélection du service */}
            <div>
              <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">
                Service
              </label>
              <select
                id="service"
                name="service"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={service}
                onChange={(e) => setService(e.target.value)}
              >
                <option value="">Sélectionnez un service</option>
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

            {/* Champ Nom d'utilisateur */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Nom d'utilisateur
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Entrez votre nom d'utilisateur"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {/* Champ Mot de passe */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Entrez votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Bouton de connexion */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Connexion en cours...' : 'Se connecter'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;