import { useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const ProcedureDetails = () => {
  const { procedureName } = useParams();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
      >
        <ArrowLeft size={20} />
        Retour
      </button>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">{procedureName}</h1>

        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-3">Description</h2>
            <p className="text-gray-600">
              Cette procédure permet de traiter les demandes liées à {procedureName?.toLowerCase()}.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-3">Documents Requis</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Formulaire de demande dûment rempli en cinq exemplaires</li>
              <li>Pièce d'identité certifiée ou un extrait d’acte de naissance du requérant</li>
              <li>Un Titre de Séjour pour les étrangers</li>
              <li>Un croquis du terrain en quatre exemplaires</li>
              <li>Un document officiel authentique attestant de
              son existence légale lorsqu’il s’agit d’une Société</li>
              <li>Une procuration authentique délivrée par le requérant s’il s’agit d’un mandataire</li>
              <li>Le programme de mise en valeur du terrain</li>
              <li>Le devis estimatif et quantitatif du projet signé par un expert</li>
            </ul>
          </section>

          {/* <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-3">Étapes de la Procédure</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold">1</div>
                <div>
                  <h3 className="font-medium text-gray-800">Soumission de la Demande</h3>
                  <p className="text-gray-600">Dépôt du dossier complet auprès du service concerné</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold">2</div>
                <div>
                  <h3 className="font-medium text-gray-800">Vérification du Dossier</h3>
                  <p className="text-gray-600">Examen de la conformité des documents fournis</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold">3</div>
                <div>
                  <h3 className="font-medium text-gray-800">Traitement de la Demande</h3>
                  <p className="text-gray-600">Analyse et traitement du dossier par les services compétents</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold">4</div>
                <div>
                  <h3 className="font-medium text-gray-800">Délivrance du Document</h3>
                  <p className="text-gray-600">Remise du document final au demandeur</p>
                </div>
              </div>
            </div>
          </section> */}

          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-3">Délais et Coûts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-800 mb-2">Délai de Traitement</h3>
                <p className="text-gray-600">10 à 18 jours ouvrables</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-800 mb-2">Coût de la Procédure</h3>
                <p className="text-gray-600">Variable selon la nature de la demande</p>
              </div>
            </div>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-3">Enregistrement</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link to="/requester-info">
                <div className="bg-red-50 p-4 rounded-lg cursor-pointer">
                  <h3 className="font-medium text-gray-800 mb-2">
                    Informations sur le demandeur
                  </h3>
                </div>
              </Link>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-800 mb-2">Documents requis</h3>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProcedureDetails;