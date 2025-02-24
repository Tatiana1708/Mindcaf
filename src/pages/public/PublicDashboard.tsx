import React from 'react';
import { Header } from '../../components/public/components/Header';
import { Dashboard } from '../../components/public/components/Dashboard';
import { MailList } from '../../components/public/components//MailList';
import type { Mail } from '../../types';
import PublicSubmissions from '../../components/public/components/PublicSubmissions';

const mockMails: Mail[] = [
  {
    id: '1',
    type: 'INCOMING',
    subject: 'Demande de partenariat',
    date: '2024-03-15',
    sender: 'Entreprise ABC',
    assignedTo: 'Marie Dubois',
    department: 'Commercial',
    status: 'PENDING'
  },
  {
    id: '2',
    type: 'OUTGOING',
    subject: 'Réponse à l\'appel d\'offres',
    date: '2024-03-14',
    recipient: 'Société XYZ',
    assignedTo: 'Jean Martin',
    department: 'Commercial',
    status: 'COMPLETED'
  },
  {
    id: '3',
    type: 'INCOMING',
    subject: 'Facture Mars 2024',
    date: '2024-03-13',
    sender: 'Fournisseur Principal',
    assignedTo: 'Sophie Bernard',
    department: 'Comptabilité',
    status: 'IN_PROGRESS'
  }
];

function PublicDashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* <Header /> */}
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Tableau de Bord</h2>
        <Dashboard />
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Courriers Récents</h2>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
            Nouveau Courrier
          </button>
        </div>
        {/* <MailList mails={mockMails} /> */}
        <PublicSubmissions />
      </main>
    </div>
  );
}

export default PublicDashboard;