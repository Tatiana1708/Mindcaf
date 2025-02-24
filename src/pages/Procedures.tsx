import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import type { Procedure } from '../types';
import NotificationService from '../services/NotificationService';

const Procedures = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedProcedure, setExpandedProcedure] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Array<{ message: string; timestamp: Date }>>([]);

  useEffect(() => {
    const handleNotification = (notification: any) => {
      setNotifications(prev => [{ message: notification.message, timestamp: new Date() }, ...prev]);
    };

    NotificationService.subscribe(handleNotification);
    return () => NotificationService.unsubscribe(handleNotification);
  }, []);

  // Mock data - replace with actual API calls
  const procedures: Procedure[] = [
    {
      id: '1',
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
      id: '2',
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
      id: '3',
      title: 'Demande en Rectification',
      service: 'Bureau du Courrier',
      steps: [
        'Réception de la demande de rectification',
        'Vérification de la conformité',
        'Enregistrement de la demande',
        'Transmission au service concerné',
        'Suivi du traitement'
      ],
      lastUpdated: '2024-03-15'
    },
    {
      id: '4',
      title: 'Délivrance du Duplicata',
      service: 'Bureau du Courrier',
      steps: [
        'Réception de la demande de duplicata',
        'Vérification des justificatifs',
        'Enregistrement de la demande',
        'Transmission au service compétent',
        'Suivi et notification'
      ],
      lastUpdated: '2024-03-15'
    },
    {
      id: '5',
      title: 'Traitement des Hypothèques',
      service: 'Bureau du Courrier',
      steps: [
        'Réception des documents d\'hypothèque',
        'Vérification de la complétude',
        'Enregistrement dans le registre',
        'Transmission au service des hypothèques',
        'Suivi du dossier'
      ],
      lastUpdated: '2024-03-15'
    },
    {
      id: '6',
      title: 'Mutation Totale',
      service: 'Bureau du Courrier',
      steps: [
        'Réception du dossier de mutation',
        'Vérification des documents requis',
        'Enregistrement de la demande',
        'Transmission au service foncier',
        'Suivi et notification'
      ],
      lastUpdated: '2024-03-15'
    },
    {
      id: '7',
      title: 'Inscription des Baux',
      service: 'Bureau du Courrier',
      steps: [
        'Réception des documents de bail',
        'Vérification de la conformité',
        'Enregistrement au registre',
        'Transmission pour traitement',
        'Suivi du dossier'
      ],
      lastUpdated: '2024-03-15'
    },
    {
      id: '8',
      title: 'Radiation d\'Hypothèque',
      service: 'Bureau du Courrier',
      steps: [
        'Réception de la demande de radiation',
        'Vérification des justificatifs',
        'Enregistrement de la demande',
        'Transmission au service concerné',
        'Suivi et notification'
      ],
      lastUpdated: '2024-03-15'
    }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Procedures</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              className="bg-gray-100 p-2 rounded-full relative"
              onClick={() => setNotifications([])}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>
            {notifications.length > 0 && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {notifications.map((notification, index) => (
                    <div key={index} className="p-4">
                      <p className="text-sm text-gray-600">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {notification.timestamp.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
            <Plus size={20} />
            Add Procedure
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search procedures..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-4">
          {procedures.map((procedure) => (
            <div key={procedure.id} className="border rounded-lg">
              <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                   onClick={() => setExpandedProcedure(expandedProcedure === procedure.id ? null : procedure.id)}>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{procedure.title}</h3>
                  <p className="text-sm text-gray-500">{procedure.service}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">Last updated: {procedure.lastUpdated}</span>
                  <button className="text-blue-600 hover:text-blue-800">
                    <Edit size={18} />
                  </button>
                  <button className="text-red-600 hover:text-red-800">
                    <Trash2 size={18} />
                  </button>
                  {expandedProcedure === procedure.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>
              {expandedProcedure === procedure.id && (
                <div className="p-4 border-t bg-gray-50">
                  <h4 className="font-medium mb-2">Steps:</h4>
                  <ol className="list-decimal list-inside space-y-2">
                    {procedure.steps.map((step, index) => (
                      <li key={index} className="text-gray-700">{step}</li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Procedures;