import cameroonFlag from '../assets/cameroon-flag.png';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl w-full">
        <div className="flex flex-col items-center mb-8">
          <img
            src={cameroonFlag}
            alt="Cameroon Flag"
            className="w-48 h-auto mb-6 rounded shadow-md"
          />
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">
            MINDCAF
          </h1>
          <p className="text-gray-600 text-center text-lg">
            Ministère des Domaines, du Cadastre et des Affaires Foncières
          </p>
        </div>

        <div className="space-y-4">
          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Location</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 font-medium">Region:</p>
                <p className="text-gray-800">Centre</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Department:</p>
                <p className="text-gray-800">Mfoundi</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">City:</p>
                <p className="text-gray-800">Yaoundé</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Address:</p>
                <p className="text-gray-800">Boulevard du 20 Mai</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Contact</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 font-medium">Phone:</p>
                <p className="text-gray-800">+237 222 221 547</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Email:</p>
                <p className="text-gray-800">contact@mindcaf.cm</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;