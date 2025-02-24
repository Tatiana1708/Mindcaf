import { useState } from 'react';
import { Users, Wrench, FileText, Phone, Mail, MapPin, ChevronLeft, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Service } from '../types';

const Departments = () => {
  const navigate = useNavigate();
  const [selectedDepartment, setSelectedDepartment] = useState<Service | null>(null);
  const [selectedProcedure, setSelectedProcedure] = useState<string | null>(null);

  const departments: Service[] = [
    "Bureau du Courrier",
    "Recette Départementale des Domaines",
    "Conservation Foncière",
    "Service Départemental des Domaines",
    "Service Départemental des Affaires Foncières",
    "Service Départemental du Patrimoine de l'État",
    "Service Départemental du Cadastre",
    "Autres services",
    "Section public"
  ];

  // Department color schemes
  const departmentColors = {
    "Bureau du Courrier": {
      bg: 'bg-blue-50',
      button: 'bg-blue-600 hover:bg-blue-700',
      icon: 'text-blue-600'
    },
    "Recette Départementale des Domaines": {
      bg: 'bg-indigo-50',
      button: 'bg-indigo-600 hover:bg-indigo-700',
      icon: 'text-indigo-600'
    },
    "Conservation Foncière": {
      bg: 'bg-emerald-50',
      button: 'bg-emerald-600 hover:bg-emerald-700',
      icon: 'text-emerald-600'
    },
    "Service Départemental des Domaines": {
      bg: 'bg-amber-50',
      button: 'bg-amber-600 hover:bg-amber-700',
      icon: 'text-amber-600'
    },
    "Service Départemental des Affaires Foncières": {
      bg: 'bg-rose-50',
      button: 'bg-rose-600 hover:bg-rose-700',
      icon: 'text-rose-600'
    },
    "Service Départemental du Patrimoine de l'État": {
      bg: 'bg-cyan-50',
      button: 'bg-cyan-600 hover:bg-cyan-700',
      icon: 'text-cyan-600'
    },
    "Service Départemental du Cadastre": {
      bg: 'bg-violet-50',
      button: 'bg-violet-600 hover:bg-violet-700',
      icon: 'text-violet-600'
    },
    "Autres services": {
      bg: 'bg-orange-50',
      button: 'bg-orange-600 hover:bg-orange-700',
      icon: 'text-orange-600'
    },
    "Section public": {
      bg: 'bg-yellow-50',
      button: 'bg-yellow-600 hover:bg-yellow-700',
      icon: 'text-yellow-600'
    }
  };

  // Mock data for department details
  const getDepartmentDetails = (dept: Service) => {
    switch(dept) {
      case "Bureau du Courrier":
        return {
          head: {
            name: "Thomas Martin",
            title: "Chef de Bureau",
            email: "thomas.martin@domain.com",
            phone: "+33 1 23 45 67 80"
          },
          location: "Bâtiment A, Rez-de-chaussée",
          statistics: {
            employees: 8,
            equipment: 12,
            procedures: 6,
            activeProjects: 4
          },
          recentProcedures: [
            { id: 1, name: "Enregistrement du Courrier", status: "active" },
            { id: 2, name: "Distribution du Courrier", status: "pending" },
            { id: 3, name: "Archivage des Documents", status: "completed" },
          ]
        };
      case "Recette Départementale des Domaines":
        return {
          head: {
            name: "Sophie Bernard",
            title: "Directrice des Recettes",
            email: "sophie.bernard@domain.com",
            phone: "+33 1 23 45 67 81"
          },
          location: "Bâtiment B, 2ème étage",
          statistics: {
            employees: 15,
            equipment: 20,
            procedures: 8,
            activeProjects: 5
          },
          recentProcedures: [
            { id: 1, name: "Gestion des Recettes", status: "active" },
            { id: 2, name: "Audit Financier", status: "pending" },
            { id: 3, name: "Rapport Mensuel", status: "completed" }
          ]
        };
      case "Conservation Foncière":
        return {
          head: {
            name: "Pierre Dubois",
            title: "Conservateur Foncier",
            email: "pierre.dubois@domain.com",
            phone: "+33 1 23 45 67 82"
          },
          location: "Bâtiment C, 1er étage",
          statistics: {
            employees: 20,
            equipment: 25,
            procedures: 10,
            activeProjects: 6
          },
          recentProcedures: [
            { id: 1, name: "Enregistrement Foncier", status: "active" },
            { id: 2, name: "Mise à jour Cadastrale", status: "pending" },
            { id: 3, name: "Vérification des Titres", status: "completed" }
          ]
        };
      case "Service Départemental des Domaines":
        return {
          head: {
            name: "Marie Laurent",
            title: "Chef de Service",
            email: "marie.laurent@domain.com",
            phone: "+33 1 23 45 67 83"
          },
          location: "Bâtiment D, 3ème étage",
          statistics: {
            employees: 18,
            equipment: 15,
            procedures: 7,
            activeProjects: 4
          },
          recentProcedures: [
            { id: 1, name: "Gestion Domaniale", status: "active" },
            { id: 2, name: "Évaluation des Biens", status: "pending" },
            { id: 3, name: "Inventaire", status: "completed" }
          ]
        };
      case "Service Départemental des Affaires Foncières":
        return {
          head: {
            name: "Jean Moreau",
            title: "Directeur des Affaires Foncières",
            email: "jean.moreau@domain.com",
            phone: "+33 1 23 45 67 84"
          },
          location: "Bâtiment E, 2ème étage",
          statistics: {
            employees: 22,
            equipment: 18,
            procedures: 12,
            activeProjects: 7
          },
          recentProcedures: [
            { id: 1, name: "Régularisation Foncière", status: "active" },
            { id: 2, name: "Contentieux Foncier", status: "pending" },
            { id: 3, name: "Médiation", status: "completed" }
          ]
        };
      case "Service Départemental du Patrimoine de l'État":
        return {
          head: {
            name: "Claire Petit",
            title: "Directrice du Patrimoine",
            email: "claire.petit@domain.com",
            phone: "+33 1 23 45 67 85"
          },
          location: "Bâtiment F, 4ème étage",
          statistics: {
            employees: 16,
            equipment: 22,
            procedures: 9,
            activeProjects: 5
          },
          recentProcedures: [
            { id: 1, name: "Inventaire Patrimonial", status: "active" },
            { id: 2, name: "Maintenance des Biens", status: "pending" },
            { id: 3, name: "Valorisation", status: "completed" }
          ]
        };
      case "Service Départemental du Cadastre":
        return {
          head: {
            name: "Philippe Roux",
            title: "Chef du Service Cadastral",
            email: "philippe.roux@domain.com",
            phone: "+33 1 23 45 67 86"
          },
          location: "Bâtiment G, 1er étage",
          statistics: {
            employees: 25,
            equipment: 30,
            procedures: 15,
            activeProjects: 8
          },
          recentProcedures: [
            { id: 1, name: "Mise à jour Cadastrale", status: "active" },
            { id: 2, name: "Levé Topographique", status: "pending" },
            { id: 3, name: "Numérisation", status: "completed" }
          ]
        };
      case "Autres services":
        return {
          head: {
            name: "Isabelle Blanc",
            title: "Coordinatrice",
            email: "isabelle.blanc@domain.com",
            phone: "+33 1 23 45 67 87"
          },
          location: "Bâtiment H, Rez-de-chaussée",
          statistics: {
            employees: 10,
            equipment: 8,
            procedures: 4,
            activeProjects: 2
          },
          recentProcedures: [
            { id: 1, name: "Support Administratif", status: "active" },
            { id: 2, name: "Gestion des Archives", status: "pending" },
            { id: 3, name: "Formation", status: "completed" }
          ]
        };
      case "Section public":
        navigate('/public-dashboard');
        return {
          head: {
            name: "Lucas Girard",
            title: "Responsable Accueil",
            email: "lucas.girard@domain.com",
            phone: "+33 1 23 45 67 88"
          },
          location: "Bâtiment A, Hall d'accueil",
          statistics: {},
          recentProcedures: []
        };
      default:
        return {
          head: {
            name: "Non assigné",
            title: "Non défini",
            email: "contact@domain.com",
            phone: "+33 1 23 45 67 89"
          },
          location: "Non spécifié",
          statistics: {
            employees: 0,
            equipment: 0,
            procedures: 0,
            activeProjects: 0
          },
          recentProcedures: []
        };
    }
  };

  if (selectedDepartment) {
    const details = getDepartmentDetails(selectedDepartment);
    const colors = departmentColors[selectedDepartment];
    
    return (
      <div className="h-full">
        <div className="mb-6 flex items-center gap-4">
          <button 
            onClick={() => setSelectedDepartment(null)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ChevronLeft size={20} />
            Back to Services
          </button>
        </div>

        <div className={`bg-white rounded-lg shadow-md ${colors.bg}`}>
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold text-gray-800">{selectedDepartment}</h1>
            <div className="mt-4 flex items-center gap-3 text-gray-600">
              <MapPin size={20} />
              <span>{details.location}</span>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Department Head Information */}
              <div className="bg-white/80 p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Service Head</h2>
                <div className="space-y-3">
                  <p className="text-gray-800 font-medium">{details.head.name}</p>
                  <p className="text-gray-600">{details.head.title}</p>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail size={16} className={colors.icon} />
                    <span>{details.head.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone size={16} className={colors.icon} />
                    <span>{details.head.phone}</span>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-lg font-semibold mb-4">Statistiques</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-blue-600">
                      <Users size={20} className={colors.icon} />
                      <span className="text-2xl font-bold">{details.statistics.employees}</span>
                    </div>                    <p className="text-gray-600 mt-1">Employes</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-green-600">
                      <Wrench size={20} className={colors.icon} />
                      <span className="text-2xl font-bold">{details.statistics.equipment}</span>
                    </div>
                    <p className="text-gray-600 mt-1">Equipement</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-purple-600">
                      <FileText size={20} className={colors.icon} />
                      <span className="text-2xl font-bold">{details.statistics.procedures}</span>
                    </div>
                    <p className="text-gray-600 mt-1">Procedures</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-orange-600">
                    <FileText size={20} className={colors.icon} />
                      <span className="text-2xl font-bold">{details.statistics.activeProjects}</span>
                    </div>
                    <p className="text-gray-600 mt-1">Procedures Actives</p>
                  </div>
                </div>
              </div>

              {/* Recent Procedures */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-lg font-semibold mb-4">Document de base</h2>
                <div className="space-y-3">
                  {details.recentProcedures.map(procedure => (
                    <div key={procedure.id} className="bg-white p-4 rounded-lg">
                      <p className="font-medium text-gray-800">{procedure.name}</p>
                      <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
                        procedure.status === 'active' ? 'bg-green-100 text-green-800' :
                        procedure.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {procedure.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* List of Procedures */}
            {selectedDepartment === "Bureau du Courrier" && (
              <div className="lg:col-span-3 bg-gray-50 p-6 rounded-lg mt-6">
                <h2 className="text-lg font-semibold mb-4">Liste des procédures</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg cursor-pointer hover:bg-gray-50" onClick={() => navigate(`/procedure/${encodeURIComponent('Concession Provisoire sur une Dépendance du Domaine Nationale')}`)}>                    <h3 className="font-medium text-gray-800 mb-2">Concession Provisoire sur une Dépendance du Domaine Nationale</h3>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h3 className="font-medium text-gray-800 mb-2">Certificat d'Inscription</h3>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h3 className="font-medium text-gray-800 mb-2">Concession Provisoire sur une Dépendance du Domaine Nationale</h3>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h3 className="font-medium text-gray-800 mb-2">Demande en Rectification, Diminution ou Augmentation</h3>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h3 className="font-medium text-gray-800 mb-2">Délivrance du Duplicata du Titre Foncier</h3>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h3 className="font-medium text-gray-800 mb-2">État de Cession : Divers Travaux Planimétriques</h3>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h3 className="font-medium text-gray-800 mb-2">État de Cession : Fiche Signalétique</h3>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h3 className="font-medium text-gray-800 mb-2">État de Cession : Bornes Reconstituées/Rectifiées/ Implantées</h3>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h3 className="font-medium text-gray-800 mb-2">État de Cession du Rattachement et du Duplicata</h3>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h3 className="font-medium text-gray-800 mb-2">Établissement d'un Titre Foncier par Immatriculation du Domaine National</h3>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h3 className="font-medium text-gray-800 mb-2">Établissement de Titre Foncier par Fusion des Titres Fonciers</h3>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h3 className="font-medium text-gray-800 mb-2">Établissement de Titre Foncier par Morcellement des Propriétés Existantes</h3>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h3 className="font-medium text-gray-800 mb-2">Établissement de Titre Foncier par Transformation d'Acte en Titre Foncier</h3>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h3 className="font-medium text-gray-800 mb-2">Expertises Foncières (Avant Descente)</h3>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h3 className="font-medium text-gray-800 mb-2">Expertises Foncières (Après Descente)</h3>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h3 className="font-medium text-gray-800 mb-2">Fusion de Titres Fonciers</h3>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h3 className="font-medium text-gray-800 mb-2">Hypothèques et Privilèges</h3>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h3 className="font-medium text-gray-800 mb-2">Inscription des Baux</h3>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h3 className="font-medium text-gray-800 mb-2">Occupation des Dépendances Publiques à des Fins d'Affichage Publicitaire</h3>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h3 className="font-medium text-gray-800 mb-2">Prénotation Judiciaire</h3>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h3 className="font-medium text-gray-800 mb-2">Radiation d'Hypothèque</h3>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h3 className="font-medium text-gray-800 mb-2">Relevé Immobilier</h3>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h3 className="font-medium text-gray-800 mb-2">Redevance Domaniale</h3>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h3 className="font-medium text-gray-800 mb-2">Retrait d'Indivision</h3>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h3 className="font-medium text-gray-800 mb-2">Travaux Altimétriques</h3>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h3 className="font-medium text-gray-800 mb-2">Travaux Planimétriques : Bornage (Morcellement, Concession, Immatriculation, Délimitation)</h3>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h3 className="font-medium text-gray-800 mb-2">Vérification de l'Inscription ou de l'Examen des Oppositions</h3>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h3 className="font-medium text-gray-800 mb-2">Vérification et Rectification des Limites</h3>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h3 className="font-medium text-gray-800 mb-2">Mutation Totale</h3>
                  </div>
                </div>
              </div>
              )}

            {selectedProcedure && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto py-6">
                <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto my-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">{selectedProcedure}</h2>
                    <button 
                      onClick={() => setSelectedProcedure(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Description</h3>
                      <p className="text-gray-600">Cette procédure permet de traiter les demandes liées à {selectedProcedure.toLowerCase()}.</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Étapes de la procédure</h3>
                      <div className="space-y-3">
                        {details.recentProcedures.map((step, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                              {index + 1}
                            </div>
                            <div className="flex-grow">
                              <p className="text-gray-800">{step.name}</p>
                              <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${
                                step.status === 'active' ? 'bg-green-100 text-green-800' :
                                step.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {step.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Documents requis</h3>
                      <ul className="list-disc list-inside space-y-2 text-gray-600">
                        <li>Formulaire de demande dûment rempli</li>
                        <li>Pièce d'identité valide</li>
                        <li>Justificatifs nécessaires selon le type de procédure</li>
                        <li>Documents supplémentaires peuvent être demandés</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Délais de traitement</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-600">Le délai de traitement standard est de 5 à 10 jours ouvrables, selon la complexité du dossier.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Services</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((department) => {
          const details = getDepartmentDetails(department);
          const colors = departmentColors[department];

          return (
           <div key={department} className={`rounded-lg shadow-md p-6 ${colors.bg} border border-gray-100`}>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">{department}</h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-600">
                  <Users size={20} className={colors.icon} />
                  <span>Employes: {details.statistics.employees}</span>
                </div>
                
                <div className="flex items-center gap-3 text-gray-600">
                  <Wrench size={20} className={colors.icon} />
                  <span>Equipement: {details.statistics.equipment}</span>
                </div>
                
                <div className="flex items-center gap-3 text-gray-600">
                  <FileText size={20} className={colors.icon} />
                  <span>Procedures: {details.statistics.procedures}</span>
                </div>
              </div>
              
              <button 
                className={`mt-6 w-full text-white px-4 py-2 rounded-lg ${colors.button}`}
                onClick={() => setSelectedDepartment(department)}
              >
                Voir details
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Departments;
//Mysql root pwd Admin@25
