import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Services, Procedure } from '../types';


const RequesterInfo: React.FC = () => {
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    requestType: '',
    description: '',
    region: '',
    adminDepartment: '',
    arrondissement: '',
    village: ''
  });

  useEffect(() => {
    // Fetch procedures from the mock data for now
    // This should be replaced with an actual API call
    const mockProcedures: Procedure[] = [
      {
        id: '1',
        title: 'Certificat de Propriété',
        service: 'Bureau du Courrier',
        steps: [],
        lastUpdated: new Date().toISOString()
      },
      {
        id: '2',
        title: "Certificat d'Inscription",
        service: 'Bureau du Courrier',
        steps: [],
        lastUpdated: new Date().toISOString()
      },
      {
        id: '3',
        title: 'Demande en Rectification',
        service: 'Bureau du Courrier',
        steps: [],
        lastUpdated: new Date().toISOString()
      }
    ];
    setProcedures(mockProcedures);
  }, []);

  type Location = {
    id: string;
    name: string;
  };
  
  type Region = Location & {
    departments: Department[];
  };
  
  type Department = Location & {
    arrondissements: Arrondissement[];
  };
  
  type Arrondissement = Location & {
    villages: Village[];
  };
  
  type Village = Location;

  // Location state
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [selectedArrondissement, setSelectedArrondissement] = useState<Arrondissement | null>(null);

  // Available options based on selections
  const [departments, setDepartments] = useState<Department[]>([]);
  const [arrondissements, setArrondissements] = useState<Arrondissement[]>([]);
  const [villages, setVillages] = useState<Village[]>([]);

  useEffect(() => {
    if (formData.region) {
      const region = locationData.find(r => r.id === formData.region);
      setSelectedRegion(region || null);
      setDepartments(region?.departments || []);
      setFormData(prev => ({
        ...prev,
        adminDepartment: '',
        arrondissement: '',
        village: ''
      }));
    }
  }, [formData.region]);

  useEffect(() => {
    if (formData.adminDepartment && selectedRegion) {
      const department = selectedRegion.departments.find(d => d.id === formData.adminDepartment);
      setSelectedDepartment(department || null);
      setArrondissements(department?.arrondissements || []);
      setFormData(prev => ({
        ...prev,
        arrondissement: '',
        village: ''
      }));
    }
  }, [formData.adminDepartment, selectedRegion]);

  useEffect(() => {
    if (formData.arrondissement && selectedDepartment) {
      const arrondissement = selectedDepartment.arrondissements.find(a => a.id === formData.arrondissement);
      setSelectedArrondissement(arrondissement || null);
      setVillages(arrondissement?.villages || []);
      setFormData(prev => ({
        ...prev,
        village: ''
      }));
    }
  }, [formData.arrondissement, selectedDepartment]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const locationData: Region[] = [
    {
      id: '1',
      name: 'Adamaoua',
      departments: [
        {
          id: 'AD-01',
          name: 'Djérem',
          arrondissements: [
            {
              id: 'AD-01-1',
              name: 'Tibati',
              villages: [
                { id: 'AD-01-1-1', name: 'Tibati' },
                { id: 'AD-01-1-2', name: 'Meidjamba' }
              ]
            },
            {
              id: 'AD-01-2',
              name: 'Ngaoundal',
              villages: [
                { id: 'AD-01-2-1', name: 'Ngaoundal' },
                { id: 'AD-01-2-2', name: 'Beka Gotto' }
              ]
            }
          ]
        },
        {
          id: 'AD-02',
          name: 'Faro-et-Déo',
          arrondissements: [
            {
              id: 'AD-02-1',
              name: 'Tignère',
              villages: [
                { id: 'AD-02-1-1', name: 'Tignère' },
                { id: 'AD-02-1-2', name: 'Kontcha' }
              ]
            }
          ]
        }
      ]
    },
    {
      id: '2',
      name: 'Centre',
      departments: [
        {
          id: 'CE-01',
          name: 'Mfoundi',
          arrondissements: [
            {
              id: 'CE-01-1',
              name: 'Yaoundé I',
              villages: [
                { id: 'CE-01-1-1', name: 'Bastos' },
                { id: 'CE-01-1-2', name: 'Nlongkak' }
              ]
            },
            {
              id: 'CE-01-2',
              name: 'Yaoundé II',
              villages: [
                { id: 'CE-01-2-1', name: 'Tsinga' },
                { id: 'CE-01-2-2', name: 'Nkomkana' }
              ]
            }
          ]
        },
        {
          id: 'CE-02',
          name: 'Nyong-et-Kellé',
          arrondissements: [
            {
              id: 'CE-02-1',
              name: 'Eséka',
              villages: [
                { id: 'CE-02-1-1', name: 'Eséka' },
                { id: 'CE-02-1-2', name: 'Manguen' }
              ]
            }
          ]
        }
      ]
    },
    {
      id: '3',
      name: 'Littoral',
      departments: [
        {
          id: 'LT-01',
          name: 'Wouri',
          arrondissements: [
            {
              id: 'LT-01-1',
              name: 'Douala I',
              villages: [
                { id: 'LT-01-1-1', name: 'Bonanjo' },
                { id: 'LT-01-1-2', name: 'Akwa' }
              ]
            },
            {
              id: 'LT-01-2',
              name: 'Douala II',
              villages: [
                { id: 'LT-01-2-1', name: 'New-Bell' },
                { id: 'LT-01-2-2', name: 'Nkongmondo' }
              ]
            }
          ]
        },
        {
          id: 'LT-02',
          name: 'Sanaga-Maritime',
          arrondissements: [
            {
              id: 'LT-02-1',
              name: 'Édéa',
              villages: [
                { id: 'LT-02-1-1', name: 'Édéa' },
                { id: 'LT-02-1-2', name: 'Dehane' }
              ]
            }
          ]
        }
      ]
    },
    {
      id: '4',
      name: 'Nord',
      departments: [
        {
          id: 'NO-01',
          name: 'Bénoué',
          arrondissements: [
            {
              id: 'NO-01-1',
              name: 'Garoua I',
              villages: [
                { id: 'NO-01-1-1', name: 'Garoua' },
                { id: 'NO-01-1-2', name: 'Lainde' }
              ]
            }
          ]
        }
      ]
    },
    {
      id: '5',
      name: 'Sud',
      departments: [
        {
          id: 'SU-01',
          name: 'Dja et Lobo',
          arrondissements: [
            {
              id: 'SU-01-01',
              name: 'Bengbis',
              villages: [
                { id: 'SU-01-01-01', name: 'Bengbis ville' },
                { id: 'SU-01-01-02', name: 'Bulu-Dja' }
              ]
            },
            {
              id: 'SU-01-02',
              name: 'Djoum',
              villages: [
                { id: 'SU-01-02-01', name: 'Djoum ville' },
                { id: 'SU-01-02-02', name: 'Fang-Centre' }
              ]
            }
          ]
        },
        {
            id: 'SU-02',
            name: 'La Mvila',
            arrondissements: [
              {
                id: 'SU-02-03',
                name: 'Ebolowa I',
                villages: [
                  { id: 'SU-01-03-01', name: 'Ebolowa I ville' },
                  { id: 'SU-01-03-02', name: 'Ngoto 1' }
                ]
              },
              {
                id: 'SU-02-06',
                name: 'Mengong',
                villages: [
                  { id: 'SU-02-06-01', name: 'Mengong ville' },
                  { id: 'SU-02-06-02', name: 'Bulu Nord' }
                ]
              }
            ]
          },
          {
            id: 'SU-03',
            name: 'Océan',
            arrondissements: [
              {
                id: 'SU-03-01',
                name: 'Akom II',
                villages: [
                  { id: 'SU-03-01-01', name: 'akom II Ville' },
                  { id: 'SU-03-01-02', name: 'Bulu Centre' }
                ]
              },
              {
                id: 'SU-03-02',
                name: 'Niete',
                villages: [
                  { id: 'SU-03-02-01', name: 'Niete Ville' },
                  { id: 'SU-03-02-02', name: 'Bulu Sud' }
                ]
              },
              {
                id: 'SU-03-03',
                name: 'Bipindi',
                villages: [
                  { id: 'SU-03-03-01', name: 'Bipindi Ville' },
                  { id: 'SU-03-03-03', name: 'Evouzok' }
                ]
              },
              {
                id: 'SU-03-04',
                name: 'Campo',
                villages: [
                  { id: 'SU-03-04-01', name: 'Campo Ville' },
                  { id: 'SU-03-04-02', name: 'Mvae' }
                ]
              },
              {
                id: 'SU-03-05',
                name: 'Kribi I',
                villages: [
                  { id: 'SU-03-05-01', name: 'Kribi Ville' },
                  { id: 'SU-03-05-02', name: 'Batanga Sud' }
                ]
              },
              {
                id: 'SU-03-06',
                name: 'Kribi II',
                villages: [
                  { id: 'SU-03-06-01', name: 'Kribi Ville' },
                  { id: 'SU-03-06-02', name: 'Batanga Nord' }
                ]
              },
              {
                id: 'SU-03-07',
                name: 'Lokoundjé',
                villages: [
                  { id: 'SU-03-07-01', name: 'Bakoko-Bassa' },
                  { id: 'SU-03-07-02', name: 'Batanga Nord' }
                ]
              },
              {
                id: 'SU-03-08',
                name: 'Lolodorf',
                villages: [
                  { id: 'SU-03-08-01', name: 'Lolodorf Ville' },
                  { id: 'SU-03-08-02', name: 'Fang' }
                ]
              },
              {
                id: 'SU-03-09',
                name: 'Mvengue',
                villages: [
                  { id: 'SU-03-09-01', name: 'Mvengue Ville' },
                  { id: 'SU-03-09-02', name: 'Enoah Yanda Centre' }
                ]
              }
            ]
          },
          {
            id: 'SU-04',
            name: 'Vallee du Ntem',
            arrondissements: [
              {
                id: 'SU-04-01',
                name: 'Ambam',
                villages: [
                  { id: 'SU-04-01-01', name: 'Ambam Ville' },
                  { id: 'SU-04-01-02', name: 'Mvae Est' }
                ]
              }
            ]
          }
      ]
    }
  ];

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/checklist', { state: { formData } });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
        <div className="py-2">
            <button
                onClick={() => window.history.back()}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200 flex items-center"
            >
                <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
                >
                <path
                    fillRule="evenodd"
                    d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                    clipRule="evenodd"
                />
                </svg>
                Retour
            </button>
        </div>
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-medium text-gray-800">
            Informations sur le demandeur
          </h2>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Previous form fields remain the same */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Prénom</label>
                <input
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Nom</label>
                <input
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Numero de téléphone</label>
                <input
                  name="phoneNumber"
                  type="text"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  name="email"
                  type="text"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Location Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Région</label>
                <select
                  name="region"
                  value={formData.region}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Sélectionnez une région</option>
                  {locationData.map(region => (
                    <option key={region.id} value={region.id}>{region.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Département</label>
                <select
                  name="adminDepartment"
                  value={formData.adminDepartment}
                  onChange={handleInputChange}
                  disabled={!formData.region}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Sélectionnez un département</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Arrondissement</label>
                <select
                  name="arrondissement"
                  value={formData.arrondissement}
                  onChange={handleInputChange}
                  disabled={!formData.adminDepartment}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Sélectionnez un arrondissement</option>
                  {arrondissements.map(arr => (
                    <option key={arr.id} value={arr.id}>{arr.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Village/Ville</label>
                <select
                  name="village"
                  value={formData.village}
                  onChange={handleInputChange}
                  disabled={!formData.arrondissement}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Sélectionnez un village/ville</option>
                  {villages.map(village => (
                    <option key={village.id} value={village.id}>{village.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Procedure Selection */}
            {/* <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Type de demande</label>
              <select
                name="requestType"
                value={formData.requestType}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Sélectionnez une procédure</option>
                {procedures.map((procedure) => (
                  <option key={procedure.id} value={procedure.id}>{procedure.title}</option>
                ))}
              </select>
            </div> */}

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Décrivez votre demande..."
                />
              </div>
          </form>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Annuler
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Continuer
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequesterInfo;