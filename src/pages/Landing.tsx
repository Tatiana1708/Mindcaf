import { useNavigate } from 'react-router-dom';
import cameroonMap from '../assets/South_Cameroon_divisions.png';
import logo from '../assets/logo.png';

const Landing = () => {
  const navigate = useNavigate();

  const backgroundStyle = {
    backgroundImage: 'url(../assets/cameroon-flag.png)', // Remplacez par l'URL de votre image
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh', // Assurez-vous que l'arrière-plan couvre toute la hauteur de la page
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative" style={backgroundStyle}>
      <div className="max-w-4xl w-full bg-white bg-opacity-90 rounded-lg shadow-lg overflow-hidden">
        <div className="p-8">
          {/* Header Section */}
          <div className="text-center mb-8 flex flex-row items-center justify-center space-x-8">
            <div className="flex justify-center">
              <img
                src={logo}
                alt="Logo"
                className="h-25 w-auto"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                RÉPUBLIQUE DU CAMEROUN
              </h1>
              <p className="text-sm text-gray-600">Paix - Travail - Patrie</p>
              <div className="mt-4">
                <h2 className="text-xl font-semibold text-gray-800">RÉGION DU SUD</h2>
                <h3 className="text-lg font-medium text-gray-700">DÉPARTEMENT DE L'OCÉAN</h3>
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="flex justify-center mb-8">
            <div className="relative w-full max-w-md">
              <img
                src={cameroonMap}
                alt="Carte du Cameroun"
                className="w-full h-auto"
              />
              <div className="absolute bottom-1/4 w-16 h-16 bg-blue-500 bg-opacity-30 rounded-full animate-pulse">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
          {/* Description de la plateforme */}
          <div className="text-center text-gray-700 mb-8">
            <p className="mb-4">
              Cette plateforme est dédiée à la gestion des demandes administratives pour la région du Sud,
              département de l'Océan. Vous pouvez effectuer des démarches en ligne, consulter les documents
              requis, et suivre l'état de vos demandes en temps réel.
            </p>
            <p>
              Pour commencer, connectez-vous ou créez un compte si vous n'en avez pas encore.
            </p>
          </div>

          {/* Boutons de connexion et d'inscription */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => navigate('/login')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
            >
              Se Connecter
            </button>
            <button
              onClick={() => navigate('/register')}
              className="bg-green-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors duration-200"
            >
              Créer un Compte
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 bg-opacity-90 px-8 py-4 text-center">
          <p className="text-sm text-gray-600">
            Ministère des Domaines, du Cadastre et des Affaires Foncières
          </p>
        </div>
      </div>
    </div>
  );
};

export default Landing;