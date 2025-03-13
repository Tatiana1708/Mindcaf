import React, { useEffect, useState } from 'react';
import { Plus, Search, Edit, Trash2, X } from 'lucide-react';
import type { Equipment, Service } from '../types';
import { ref, onValue, remove } from "firebase/database";
import { db } from '../api/firebaseConfig';
import { database } from '../api/firebaseConfig';
import { collection, addDoc, deleteDoc, doc } from 'firebase/firestore';


const EquipmentPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [equipmentToDelete, setEquipmentToDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    type: '',
    service: '' as Service,
    status: 'available' as Equipment['status'],
    assignedTo: '',
    nombre: '',
    dateInstall: '', // ou null si la date n'est pas encore définie
    etatBien: 'neuf' as Equipment['etatBien']
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [equipment, setEquipment] = useState<Equipment[]>([]);

  // Add useEffect to fetch data when component mounts
  useEffect(() => {
    // Reference to the "equipments" node in Realtime Database
    const equipmentsRef = ref(database, "equipments");

    // Set up a real-time listener
    const unsubscribe = onValue(equipmentsRef, (snapshot) => {
      const equipmentsData = snapshot.val();
      if (equipmentsData) {
        // Convert the data into an array of equipments
        const equipmentsList = Object.keys(equipmentsData).map((key) => ({
          id: key,
          ...equipmentsData[key],
        }));
        setEquipment(equipmentsList);
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
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
      const docRef = await addDoc(collection(db, 'equipments'), formData);
      const newEquipment = {
        id: docRef.id,
        ...formData
      };

      setEquipment([...equipment, newEquipment]);
      setFormData({
        code: '',
        name: '',
        type: '',
        service: '' as Service,
        status: 'available',
        assignedTo: '',
        nombre: '',
        dateInstall: '',
        etatBien: 'neuf'
      });

      // Close the form modal and show success modal
      setShowAddModal(false);
      // Show success modal with a slight delay
      setTimeout(() => {
        setShowSuccessModal(true);
      }, 100);

      // Automatically close success modal after 3 seconds
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 3000);
    } else {
      console.error('Failed to create equipment:', errors);
      setFormErrors(errors);
    }
  };

  // Add delete function
  const handleDelete = async (id: string) => {
    try {
      // Reference to the specific equipment node in Realtime Database
      const equipmentRef = ref(database, `equipments/${id}`);

      // Delete the equipment node
      await remove(equipmentRef);
      setShowDeleteModal(true);

      // Update the local state to remove the deleted equipment
      setEquipment((prevEquipments) =>
        prevEquipments.filter((equipment) => equipment.id !== id)
      );
    } catch (error) {
      console.error("Error deleting equipment:", error);
    }
  };

  const confirmDelete = async () => {
    if (equipmentToDelete) {
      try {
        await deleteDoc(doc(db, 'equipments', equipmentToDelete));
        setEquipment(equipment.filter(item => item.id !== equipmentToDelete));
        setShowDeleteModal(false);
        setEquipmentToDelete(null);
      } catch (error) {
        console.error('Error deleting equipment:', error);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
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
                      <button className="text-red-600 hover:text-red-800"
                        // onClick={() => handleDelete(equipment.id)}
                      >
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
                  className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${formErrors.code ? 'border-red-500' : 'border-gray-300'
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
                  className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${formErrors.name ? 'border-red-500' : 'border-gray-300'
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
                  className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${formErrors.type ? 'border-red-500' : 'border-gray-300'
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
                  className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${formErrors.status ? 'border-red-500' : 'border-gray-300'
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
                    className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${formErrors.assignedTo ? 'border-red-500' : 'border-gray-300'
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
                  className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${formErrors.nombre ? 'border-red-500' : 'border-gray-300'
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
                  className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${formErrors.dateInstall ? 'border-red-500' : 'border-gray-300'
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
                  className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${formErrors.etatBien ? 'border-red-500' : 'border-gray-300'
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

      {/* Add this success modal component just before the closing div of your return statement*/}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="mt-3 text-lg font-medium text-gray-900">Ajout réussi!</h3>
              <p className="mt-2 text-sm text-gray-500">
                L'équipement a été ajouté avec succès.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Add this delete confirmation modal just before the closing div of your return statement*/}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Confirm Deletion</h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to delete this equipment? This action cannot be undone.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default EquipmentPage;