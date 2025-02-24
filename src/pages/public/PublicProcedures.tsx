import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import type { Procedure } from '../../types';
import { useNavigate } from 'react-router-dom';
import NotificationService from '../../services/NotificationService';

const PublicProcedures = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedProcedure, setExpandedProcedure] = useState<string | null>(null);

  const handleProcedureClick = (procedure: Procedure) => {
    NotificationService.sendNotification({
      type: 'info',
      message: `Accessing procedure: ${procedure.title}`,
      description: `User accessed procedure details for ${procedure.title}`
    });
    navigate(`/public-procedure/${encodeURIComponent(procedure.title)}`);
  };

  // Mock data - replace with actual API calls
  const procedures: Procedure[] = [
    {
      id: '1',
      title: 'Concession Provisoire sur une Dépendance du Domaine Nationale',
      service: 'Bureau du Courrier',
      steps: [
        'Réception et enregistrement de la demande',
        'Vérification initiale des documents',
        'Transmission au service concerné',
        'Suivi du traitement',
        'Notification au demandeur'
      ],
      lastUpdated: '2025-01-15'
    },
    {
      id: '2',
      title: 'Certificat de Propriété',
      service: 'Bureau du Courrier',
      steps: [
        'Réception et enregistrement de la demande',
        'Vérification initiale des documents',
        'Transmission au service concerné',
        'Suivi du traitement',
        'Notification au demandeur'
      ],
      lastUpdated: '2024-03-15'
    },
    {
      id: '3',
      title: "Certificat d'Inscription",
      service: 'Bureau du Courrier',
      steps: [
        'Réception de la demande d\'inscription',
        'Vérification des pièces justificatives',
        'Enregistrement dans le système',
        'Transmission au service compétent',
        'Suivi du dossier'
      ],
      lastUpdated: '2024-03-15'
    },
    {
      id: '4',
      title: "Établissement d'un Titre Foncier par Immatriculation du Domaine National",
      service: 'Bureau du Courrier',
      steps: [
        'Réception de la demande d\'inscription',
        'Vérification des pièces justificatives',
        'Enregistrement dans le système',
        'Transmission au service compétent',
        'Suivi du dossier'
      ],
      lastUpdated: '2024-03-15'
    },
    {
      id: '4',
      title: "Fusion de Titres Fonciers",
      service: 'Bureau du Courrier',
      steps: [
        'Réception de la demande d\'inscription',
        'Vérification des pièces justificatives',
        'Enregistrement dans le système',
        'Transmission au service compétent',
        'Suivi du dossier'
      ],
      lastUpdated: '2024-03-15'
    },
    // ... other procedures
  ];

  const filteredProcedures = procedures.filter(procedure =>
    procedure.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    procedure.service.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Procédures Publiques</h1>
          <p className="text-gray-600">Liste des procédures disponibles au public</p>
        </div>

        <div className="mb-6 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Rechercher une procédure..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredProcedures.map((procedure) => (
              <li key={procedure.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <button
                      className="text-left flex-1"
                      onClick={() => setExpandedProcedure(expandedProcedure === procedure.id ? null : procedure.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div onClick={() => handleProcedureClick(procedure)}>
                          <h3 className="text-lg font-medium text-blue-600">{procedure.title}</h3>
                          <p className="mt-1 text-sm text-gray-500">{procedure.service}</p>
                        </div>
                        {expandedProcedure === procedure.id ? (
                          <ChevronUp className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </button>
                  </div>
                  {expandedProcedure === procedure.id && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Étapes de la procédure:</h4>
                      <ol className="list-decimal list-inside space-y-2">
                        {procedure.steps.map((step, index) => (
                          <li key={index} className="text-sm text-gray-600">{step}</li>
                        ))}
                      </ol>
                      <p className="mt-3 text-xs text-gray-500">Dernière mise à jour: {procedure.lastUpdated}</p>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PublicProcedures;