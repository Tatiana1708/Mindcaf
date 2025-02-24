import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Services } from '../types';

const services: Services[] = [
  {
    name: "Secrétariat du Délégué",
    activities: [
      "Gestion et enregistrement des courriers",
      "Transmission des dossiers aux services concernés"
    ],
    modules: [
      "Module d'enregistrement et de suivi des courriers",
      "Module de gestion des transmissions"
    ],
    results: [
      "Différentes statistiques sur les courriers traités",
      "Suivi précis des transferts et délais réduits"
    ]
  },
  {
    name: "Service Départemental du Cadastre",
    activities: [
      "Enregistrement des dossiers cadastraux",
      "Gestion des registres des CCP",
      "Constitution des dossiers techniques",
      "Immatriculation directe"
    ],
    modules: [
      "Système d'enregistrement des parcelles",
      "Module de mise à jour cartographique",
      "Module de gestion des dossiers techniques",
      "Module dédié à l'immatriculation"
    ],
    results: [
      "Différentes statistiques cadastrales",
      "Mise à jour des parcelles sur la mappe foncière",
      "Production des extraits",
      "Suivi des étapes administratives"
    ]
  },
  {
    name: "Service Départemental des Affaires Foncières",
    activities: [
      "Suivi des immatriculations directes",
      "Gestion des conflits et oppositions liés aux biens fonciers"
    ],
    modules: [
      "Outil de gestion des étapes d'immatriculation",
      "Module de gestion des contentieux"
    ],
    results: [
      "Production des pièces nécessaires",
      "Délivrance des extraits",
      "Résolution rapide des oppositions",
      "Harmonisation des données foncières"
    ]
  },
  {
    name: "Conservation Foncière",
    activities: [
      "Enregistrement des titres fonciers",
      "Gestion des oppositions",
      "Délivrance de certificats et de documents fonciers"
    ],
    modules: [
      "Module d'enregistrement des titres",
      "Module de gestion des oppositions",
      "Module de gestion documentaire"
    ],
    results: [
      "Différentes statistiques et suivi des propriétés",
      "Suspension des dossiers en cas de litige",
      "Certificats de propriété",
      "Relevés des transactions",
      "Historique des biens délivrés"
    ]
  },
  {
    name: "Service de la Recette des Domaines",
    activities: [
      "Émission des ordres de recettes",
      "Enregistrement des paiements"
    ],
    modules: [
      "Module de gestion des ordres de paiement",
      "Outil de suivi et de gestion comptable"
    ],
    results: [
      "Comptabilisation précise des paiements électroniques",
      "Différentes statistiques sur les recettes"
    ]
  },
  {
    name: "Service Départemental des Domaines",
    activities: [
      "Enregistrement des lotissements domaniaux",
      "Gestion des attributions des lots aux tiers"
    ],
    modules: [
      "Module de gestion des lotissements",
      "Module de gestion des demandes"
    ],
    results: [
      "Gestion optimisée des lots disponibles",
      "Délivrance des certificats de disponibilité",
      "Transparence et rapidité dans les processus d'attribution"
    ]
  },
  {
    name: "Service Départemental du Patrimoine",
    activities: [
      "Enregistrement des dossiers relatifs au patrimoine"
    ],
    modules: [
      "Outil de gestion des biens publics"
    ],
    results: [
      "Différentes statistiques patrimoniales"
    ]
  },
  {
    name: "Commissions Consultatives",
    activities: [
      "Organisation des descentes sur le terrain",
      "Production des procès-verbaux et des rapports"
    ],
    modules: [
      "Module de planification et de coordination",
      "Module de rédaction et gestion documentaire"
    ],
    results: [
      "Respect des délais",
      "Conformité des travaux de bornage et autres enquêtes",
      "PV précis, contenant toutes les observations et décisions"
    ]
  }
];

interface ServiceCardProps {
    service: Services;
  }

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border rounded-lg mb-4 shadow-sm">
      <div 
        className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="text-lg font-semibold">{service.name}</h2>
        {isExpanded ? <ChevronDown /> : <ChevronRight />}
      </div>
      
      {isExpanded && (
        <div className="p-4 grid md:grid-cols-3 gap-4 bg-gray-50">
          <div>
            <h3 className="font-bold mb-2">Devoirs/Activités</h3>
            <ul className="list-disc pl-5">
              {service.activities.map((activity, index) => (
                <li key={index} className="text-sm">{activity}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-2">Modules/Processus</h3>
            <ul className="list-disc pl-5">
              {service.modules.map((module, index) => (
                <li key={index} className="text-sm">{module}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-2">Résultats Attendus</h3>
            <ul className="list-disc pl-5">
              {service.results.map((result, index) => (
                <li key={index} className="text-sm">{result}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

const ServicesView = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Services Départementaux</h1>
      {services.map((service, index) => (
        <ServiceCard key={index} service={service} />
      ))}
    </div>
  );
};

export default ServicesView;