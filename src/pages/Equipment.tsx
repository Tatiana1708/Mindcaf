import React, { useEffect, useState } from 'react';
import { Plus, Search, Edit, Trash2, X } from 'lucide-react';
import type { Equipment } from '../types';
import { equipmentService } from '../services/equipmentService';
import { Service } from '@prisma/client';


const EquipmentPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    code:'',
    name: '',
    type: '',
    service: '' as Service,
    status: 'available' as Equipment['status'],
    assignedTo: '',
    nombre:'',
    dateInstall: '', // ou null si la date n'est pas encore définie
    etatBien: 'neuf'as Equipment['etatBien']
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [equipment, setEquipment] = useState<Equipment[]>([]);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const data = await equipmentService.getAllEquipment();
        setEquipment(data);
      } catch (error) {
        console.error('Failed to fetch equipment:', error);
      }
    };
    fetchEquipment();
  }, []);

 // Create the mapping using the actual Service enum
 const serviceMapping = {
  BUREAU_DU_COURRIER: "Bureau du Courrier",
  RECETTE_DEPARTEMENTALE_DES_DOMAINES: "Recette Départementale des Domaines",
  CONSERVATION_FONCIERE: "Conservation Foncière",
  SERVICE_DEPARTEMENTAL_DES_DOMAINES: "Service Départemental des Domaines",
  SERVICE_DEPARTEMENTAL_DES_AFFAIRES_FONCIERES: "Service Départemental des Affaires Foncières",
  SERVICE_DEPARTEMENTAL_DU_PATRIMOINE_DE_L_ETAT: "Service Départemental du Patrimoine de l'État",
  SERVICE_DEPARTEMENTAL_DU_CADASTRE: "Service Départemental du Cadastre",
  AUTRES_SERVICES: "Autres services",
  SECTION_PUBLIC: "Section public"
};


  const equipmentTypes = [
    'Bureau',
    'Table',
    'Chaise',
    'Fauteuil',
    'Registre',
    'Ordinateur',
    'Écran',
    'Imprimante',
    'Photocopieur',
    'Scanner',
    'Traceur',
    'GPS',
    'Station Totale',
    'Niveau',
    'Réfrigérateur',
    'Climatisation',
    'Véhicule de Ville',
    'Véhicule 4x4',
    'Camion',
    'Engin',
    'Other'
  ];

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.code.trim()) errors.code = 'Code is required';
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.type) errors.type = 'Type is required';
    if (!formData.service) errors.service = 'Service is required';
    if (!formData.status) errors.status = 'Status is required';
    if (formData.status === 'in-use' && !formData.assignedTo.trim()) {
      errors.assignedTo = 'Assigned user is required when status is in-use';
    };
    if (!formData.nombre.trim()) errors.nombre = 'Nombre is required';
    if (!formData.dateInstall.trim()) errors.dateInstall = 'DateInstall is required';
    if (!formData.etatBien.trim()) errors.etatBien = 'EtatBien is required'
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    
    if (Object.keys(errors).length === 0) {
      try {
        const newEquipment = await equipmentService.createEquipment(formData);
        setEquipment([...equipment, newEquipment]);
        setFormData({
          code:'',
          name: '',
          type: '',
          service: '' as Service,
          status: 'available',
          assignedTo: '',
          nombre: '',
          dateInstall: '', 
          etatBien: 'neuf'
        });
        setShowAddModal(false);
      } catch (error) {
        console.error('Failed to create equipment:', error);
        setFormErrors({ submit: 'Failed to create equipment. Please try again.' });
      }
    } else {
      setFormErrors(errors);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'service') {
      // Convert display name to enum value
      const enumValue = serviceMapping[value as keyof typeof serviceMapping];
      setFormData(prev => ({
        ...prev,
        [name]: enumValue // Store the enum value, not the display name
      }));
    } 
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const filteredEquipment = equipment.filter(item =>
    item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.service.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Equipment</h1>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus size={20} />
          Add Equipment
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search equipment..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Code</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Service</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Assigned To</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Nombre</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Date Installation</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Etat Bien</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEquipment.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{item.code}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.service}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.assignedTo}</td>
                   <td className="px-6 py-4 whitespace-nowrap">{item.nombre}</td>
                   <td className="px-6 py-4 whitespace-nowrap">{item.dateInstall}</td>
                   <td className="px-6 py-4 whitespace-nowrap">{item.etatBien}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${item.status === 'available' ? 'bg-green-100 text-green-800' : 
                        item.status === 'in-use' ? 'bg-blue-100 text-blue-800' : 
                        'bg-yellow-100 text-yellow-800'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        <Edit size={18} />
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Equipment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto py-6">
          <div className="bg-white rounded-lg p-6 w-full max-w-md overflow-y-auto my-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Ajouter un équipement</h2>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Code
                </label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    formErrors.code ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter equipment code"
                />
                {formErrors.code && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.code}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    formErrors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter equipment name"
                />
                {formErrors.name && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    formErrors.type ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select type</option>
                  {equipmentTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {formErrors.type && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.type}</p>
                )}
              </div>

              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service
                </label>
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    formErrors.service ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select service</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                {formErrors.service && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.service}</p>
                )}
              </div> */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service
                </label>
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${formErrors.service ? 'border-red-500' : 'border-gray-300'
                    }`}
                >
                  <option value="">Select service</option>
                  {Object.entries(serviceMapping).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </select>
                {formErrors.service && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.service}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    formErrors.status ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select status</option>
                  <option value="in-use">En Service</option>
                  <option value="maintenance">En Maintenance</option>
                  <option value="in-repair">En Réparation</option>
                </select>
                {formErrors.status && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.status}</p>
                )}
              </div>

              {formData.status === 'in-use' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assigned To
                  </label>
                  <input
                    type="text"
                    name="assignedTo"
                    value={formData.assignedTo}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      formErrors.assignedTo ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter user name"
                  />
                  {formErrors.assignedTo && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.assignedTo}</p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  type="number"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    formErrors.nombre ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter equipment nombre"
                />
                {formErrors.nombre && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.nombre}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date Installation
                </label>
                <input
                  type="date"
                  name="dateInstall"
                  value={formData.dateInstall}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    formErrors.dateInstall ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter equipment date installation"
                />
                {formErrors.dateInstall && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.dateInstall}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                Etat des biens
                </label>
                <select
                  name="etatBien"
                  value={formData.etatBien}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    formErrors.etatBien ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select etat des biens</option>
                  <option value="available">Neuf</option>
                  <option value="in-use">Vieux</option>
                  <option value="maintenance">Maintenance</option>
                </select>
                {formErrors.etatBien && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.etatBien}</p>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Equipment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EquipmentPage;