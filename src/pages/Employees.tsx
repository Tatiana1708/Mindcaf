import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, X, ChevronDown, ChevronUp, User } from 'lucide-react';
import type { Employee, Service } from '../types';
import { ref, onValue, remove } from "firebase/database";
import { db } from '../api/firebaseConfig';
import { database } from '../api/firebaseConfig';
import { collection, addDoc, deleteDoc, doc } from 'firebase/firestore';

const Employees = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null);


  const [formData, setFormData] = useState({
    matricule: '',
    nom: '',
    dateNaissance: '',
    lieuNaissance: '',
    sexe: '',
    matrimoniale: '',
    diplome: '',
    contrat: '',
    statutPro: '',
    grade: '',
    corpsMetier: '',
    competences: '',
    infosSupp: '',
    position: '',
    service: '' as Service,
    email: '',
    phone: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Replace mock data with database call
  const [employees, setEmployees] = useState<Employee[]>([]);

  // Add useEffect to fetch data when component mounts
  useEffect(() => {
    // Reference to the "employees" node in Realtime Database
    const employeesRef = ref(database, "employees");

    // Set up a real-time listener
    const unsubscribe = onValue(employeesRef, (snapshot) => {
      const employeesData = snapshot.val();
      if (employeesData) {
        // Convert the data into an array of employees
        const employeesList = Object.keys(employeesData).map((key) => ({
          id: key,
          ...employeesData[key],
        }));
        setEmployees(employeesList);
        console.log('data', employeesList);
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm(currentStep);

    if (Object.keys(errors).length === 0) {
      const docRef = await addDoc(collection(db, 'employees'), formData);
      const newEmployee = {
        id: docRef.id,
        ...formData
      };

      setEmployees([...employees, newEmployee]);
      setFormData({
        matricule: '',
        nom: '',
        dateNaissance: '',
        lieuNaissance: '',
        sexe: '',
        matrimoniale: '',
        diplome: '',
        contrat: '',
        statutPro: '',
        grade: '',
        corpsMetier: '',
        competences: '',
        infosSupp: '',
        position: '',
        service: '' as Service,
        email: '',
        phone: ''
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
      setFormErrors(errors);
      console.error('Error creating employee:', errors);
    }
  };

  // Add delete function
  const handleDelete = async (id: string) => {
    try {
      // Reference to the specific employee node in Realtime Database
      const employeeRef = ref(database, `employees/${id}`);

      // Delete the employee node
      await remove(employeeRef);

      // Update the local state to remove the deleted employee
      setEmployees((prevEmployees) =>
        prevEmployees.filter((employee) => employee.id !== id)
      );
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  const confirmDelete = async () => {
    if (employeeToDelete) {
      try {
        await deleteDoc(doc(db, 'equipments', employeeToDelete));
        setEmployees(employees.filter(item => item.id !== employeeToDelete));
        setShowDeleteModal(false);
        setEmployeeToDelete(null);
      } catch (error) {
        console.error('Error deleting equipment:', error);
      }
    }
  };

  const departments: Service[] = [
    "Bureau du Courrier",
    "Recette Départementale des Domaines",
    "Conservation Foncière",
    "Service Départemental des Domaines",
    "Service Départemental des Affaires Foncières",
    "Service Départemental du Patrimoine de l'État",
    "Service Départemental du Cadastre",
    "Autres services"
  ];

  const positions = [
    'Director',
    'Manager',
    'Supervisor',
    'Administrator',
    'Clerk',
    'Specialist',
    'Analyst',
    'Coordinator'
  ];

  const validateForm = (step: number) => {
    const errors: Record<string, string> = {};
    if (step === 0) {
      if (!formData.matricule.trim()) errors.matricule = 'Matricule est requis';
      if (!formData.nom.trim()) errors.nom = 'Nom est requis';
      if (!formData.dateNaissance.trim()) errors.dateNaissance = 'Date de naissance est requise';
      if (!formData.lieuNaissance.trim()) errors.lieuNaissance = 'Lieu de naissance est requis';
      if (!formData.sexe.trim()) errors.sexe = 'Sexe est requis';
      if (!formData.matrimoniale.trim()) errors.situationMatrimoniale = 'Situation matrimoniale est requise';
      if (!formData.email.trim()) {
        errors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = 'Invalid email format';
      }
      if (!formData.phone.trim()) {
        errors.phone = 'Phone number is required';
      } else if (!/^\+\d{2}\s\d{1,2}\s\d{2}\s\d{2}\s\d{2}\s\d{2}$/.test(formData.phone)) {
        errors.phone = 'Invalid phone format (e.g., +237 697 523 456)';
      }
    } else if (step === 1) {
      if (!formData.diplome.trim()) errors.diplome = 'Diplôme est requis';
      if (!formData.contrat.trim()) errors.contrat = 'Contrat est requis';
      if (!formData.statutPro.trim()) errors.statutProfessionnel = 'Statut professionnel est requis';
      if (!formData.grade.trim()) errors.grade = 'Grade est requis';
      if (!formData.corpsMetier.trim()) errors.corpsMetier = 'Corps de métier est requis';
      if (!formData.competences.trim()) errors.competences = 'Compétences sont requises';
      if (!formData.position) errors.position = 'Position is required';
      if (!formData.service) errors.department = 'Department is required';
      if (!formData.infosSupp.trim()) errors.infosSupp = 'Informations supplémentaires sont requises';
    }
    return errors;
  };

  const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const nextStep = () => {
    if (validateForm(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const steps = [
    {
      title: "Informations personnelles",
      description: "Informations personnelles et formation"
    },
    {
      title: "Informations professionnelles",
      description: "Qualifications et statut professionnel"
    }
  ];


  const filteredEmployees = employees.filter(employee =>
    employee.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [expandedRows, setExpandedRows] = useState(new Set());

  const toggleRow = (id: unknown) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Employees</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus size={20} />
          Ajouter Employe
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search employees..."
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Info</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Employe</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Position</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Contact</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEmployees.map((employee) => (
                <tr key={employee.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{employee.nom}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{employee.position}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{employee.service}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">{employee.email}</div>
                      <div className="text-sm text-gray-500">{employee.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDelete(employee.id)}
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

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto py-6">
          <div className="bg-white rounded-lg  p-6 w-full max-w-md max-h-[90vh] overflow-y-auto my-auto ">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Ajouter un Employe</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={30} />
              </button>
            </div>

            {/* Stepper Header */}
            <div className="mb-8">
              <div className="flex justify-between items-center">
                {steps.map((step, index) => (
                  <div key={index} className="flex flex-col items-center relative">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= index
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                        }`}
                    >
                      {index + 1}
                    </div>
                    <div className="text-xs mt-2 text-center w-24">{step.title}</div>

                    {/* Connector line */}
                    {index < steps.length - 1 && (
                      <div
                        className={`absolute top-5 w-full h-1 left-40 -z-10 ${currentStep > index ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Form Steps */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Step 1: Identification */}
              {currentStep === 0 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">{steps[currentStep].title}</h2>
                  <p className="text-gray-600 mb-4">{steps[currentStep].description}</p>

                  {/* Matricule Field */}
                  <div className="group relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Matricule
                    </label>
                    <div className="hidden group-hover:block absolute z-10 bg-gray-800 text-white text-sm rounded p-2 mt-1 left-0 w-64">
                      Entrez le numéro d'identification unique de l'employé
                    </div>
                    <input
                      type="text"
                      name="matricule"
                      value={formData.matricule}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${formErrors.matricule ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="Entrez le matricule de l'employé"
                      aria-invalid={!!formErrors.matricule}
                      aria-describedby="matricule-error"
                    />
                    {formErrors.matricule && (
                      <p id="matricule-error" className="text-red-500 text-sm mt-1">
                        {formErrors.matricule}
                      </p>
                    )}
                  </div>

                  {/* Nom et Prénoms Field */}
                  <div className="group relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Noms et Prénoms
                    </label>
                    <div className="hidden group-hover:block absolute z-10 bg-gray-800 text-white text-sm rounded p-2 mt-1 left-0 w-64">
                      Entrez le nom de famille de l'employé
                    </div>
                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${formErrors.nom ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="Entrez le nom de l'employé"
                      aria-invalid={!!formErrors.nom}
                      aria-describedby="nom-error"
                    />
                    {formErrors.nom && (
                      <p id="nom-error" className="text-red-500 text-sm mt-1">
                        {formErrors.nom}
                      </p>
                    )}
                  </div>

                  {/* Date de Naissance Field */}
                  <div className="group relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date de Naissance
                    </label>
                    <div className="hidden group-hover:block absolute z-10 bg-gray-800 text-white text-sm rounded p-2 mt-1 left-0 w-64">
                      Sélectionnez la date de naissance de l'employé
                    </div>
                    <input
                      type="date"
                      name="dateNaissance"
                      value={formData.dateNaissance}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${formErrors.dateNaissance ? 'border-red-500' : 'border-gray-300'
                        }`}
                      aria-invalid={!!formErrors.dateNaissance}
                      aria-describedby="dateNaissance-error"
                    />
                    {formErrors.dateNaissance && (
                      <p id="dateNaissance-error" className="text-red-500 text-sm mt-1">
                        {formErrors.dateNaissance}
                      </p>
                    )}
                  </div>

                  {/* Lieu de Naissance Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Lieu de Naissance
                    </label>
                    <input
                      type="text"
                      name="lieuNaissance"
                      value={formData.lieuNaissance}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${formErrors.lieuNaissance ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="Entrez le lieu de naissance"
                      aria-invalid={!!formErrors.lieuNaissance}
                      aria-describedby="lieuNaissance-error"
                    />
                    {formErrors.lieuNaissance && (
                      <p id="lieuNaissance-error" className="text-red-500 text-sm mt-1">
                        {formErrors.lieuNaissance}
                      </p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div className="group relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <div className="hidden group-hover:block absolute z-10 bg-gray-800 text-white text-sm rounded p-2 mt-1 left-0 w-64">
                      Entrez l'adresse email professionnelle de l'employé
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${formErrors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="example@email.com"
                      aria-invalid={!!formErrors.email}
                      aria-describedby="email-error"
                    />
                    {formErrors.email && (
                      <p id="email-error" className="text-red-500 text-sm mt-1">
                        {formErrors.email}
                      </p>
                    )}
                  </div>

                  {/* Téléphone Field */}
                  <div className="group relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Téléphone
                    </label>
                    <div className="hidden group-hover:block absolute z-10 bg-gray-800 text-white text-sm rounded p-2 mt-1 left-0 w-64">
                      Entrez le numéro de téléphone de l'employé
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${formErrors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="+123 456 7890"
                      aria-invalid={!!formErrors.phone}
                      aria-describedby="phone-error"
                    />
                    {formErrors.phone && (
                      <p id="phone-error" className="text-red-500 text-sm mt-1">
                        {formErrors.phone}
                      </p>
                    )}
                  </div>

                  {/* Sexe Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sexe
                    </label>
                    <select
                      name="sexe"
                      value={formData.sexe}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${formErrors.sexe ? 'border-red-500' : 'border-gray-300'
                        }`}
                      aria-invalid={!!formErrors.sexe}
                      aria-describedby="sexe-error"
                    >
                      <option value="">Sélectionnez le sexe</option>
                      <option value="Masculin">Masculin</option>
                      <option value="Feminin">Féminin</option>
                    </select>
                    {formErrors.sexe && (
                      <p id="sexe-error" className="text-red-500 text-sm mt-1">
                        {formErrors.sexe}
                      </p>
                    )}
                  </div>

                  {/* Situation Matrimoniale Field */}
                  <div className="group relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Situation Matrimoniale
                    </label>
                    <div className="hidden group-hover:block absolute z-10 bg-gray-800 text-white text-sm rounded p-2 mt-1 left-0 w-64">
                      Sélectionnez la situation matrimoniale de l'employé
                    </div>
                    <select
                      name="matrimoniale"
                      value={formData.matrimoniale}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${formErrors.matrimoniale ? 'border-red-500' : 'border-gray-300'
                        }`}
                      aria-invalid={!!formErrors.matrimoniale}
                      aria-describedby="matrimoniale-error"
                    >
                      <option value="">Sélectionnez la situation</option>
                      <option value="Célibataire">Célibataire</option>
                      <option value="Marié(e)">Marié(e)</option>
                      <option value="Divorcé(e)">Divorcé(e)</option>
                      <option value="Veuf/Veuve">Veuf/Veuve</option>
                    </select>
                    {formErrors.matrimoniale && (
                      <p id="matrimoniale-error" className="text-red-500 text-sm mt-1">
                        {formErrors.matrimoniale}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Professional Information */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">{steps[currentStep].title}</h2>
                  <p className="text-gray-600 mb-4">{steps[currentStep].description}</p>

                  {/* Diplôme Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Diplôme
                    </label>
                    <input
                      type="text"
                      name="diplome"
                      value={formData.diplome}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${formErrors.diplome ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="Ex: Master en Informatique"
                      aria-invalid={!!formErrors.diplome}
                      aria-describedby="diplome-error"
                    />
                    {formErrors.diplome && (
                      <p id="diplome-error" className="text-red-500 text-sm mt-1">
                        {formErrors.diplome}
                      </p>
                    )}
                  </div>

                  {/* Contrat Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contrat
                    </label>
                    <select
                      name="contrat"
                      value={formData.contrat}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${formErrors.contrat ? 'border-red-500' : 'border-gray-300'
                        }`}
                      aria-invalid={!!formErrors.contrat}
                      aria-describedby="contrat-error"
                    >
                      <option value="">Sélectionnez le type de contrat</option>
                      <option value="CDI">CDI</option>
                      <option value="CDD">CDD</option>
                      <option value="Stage">Stage</option>
                      <option value="Freelance">Freelance</option>
                    </select>
                    {formErrors.contrat && (
                      <p id="contrat-error" className="text-red-500 text-sm mt-1">
                        {formErrors.contrat}
                      </p>
                    )}
                  </div>

                  {/* Position Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Position
                    </label>
                    <select
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${formErrors.position ? 'border-red-500' : 'border-gray-300'
                        }`}
                      aria-invalid={!!formErrors.position}
                      aria-describedby="position-error"
                    >
                      <option value="">Sélectionnez la position</option>
                      {positions.map((position) => (
                        <option key={position} value={position}>
                          {position}
                        </option>
                      ))}
                    </select>
                    {formErrors.position && (
                      <p id="position-error" className="text-red-500 text-sm mt-1">
                        {formErrors.position}
                      </p>
                    )}
                  </div>

                  {/* Service Field */}
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
                      aria-invalid={!!formErrors.service}
                      aria-describedby="service-error"
                    >
                      <option value="">Sélectionnez le service</option>
                      {departments.map((service) => (
                        <option key={service} value={service}>
                          {service}
                        </option>
                      ))}
                    </select>
                    {formErrors.service && (
                      <p id="service-error" className="text-red-500 text-sm mt-1">
                        {formErrors.service}
                      </p>
                    )}
                  </div>

                  {/* Statut Professionnel Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Statut Professionnel
                    </label>
                    <select
                      name="statutPro"
                      value={formData.statutPro}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${formErrors.statutPro ? 'border-red-500' : 'border-gray-300'
                        }`}
                      aria-invalid={!!formErrors.statutPro}
                      aria-describedby="statutPro-error"
                    >
                      <option value="">Sélectionnez le type de contrat</option>
                      <option value="Fonctionnaire">Fonctionnaire</option>
                      <option value="Contractuel">Contractuel</option>
                      <option value="Agent_Decision">Agent Décision</option>
                    </select>
                    {formErrors.statutPro && (
                      <p id="statutPro-error" className="text-red-500 text-sm mt-1">
                        {formErrors.statutPro}
                      </p>
                    )}
                  </div>

                  {/* Grade Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Grade
                    </label>
                    <input
                      type="text"
                      name="grade"
                      value={formData.grade}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${formErrors.grade ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="Ex: Senior, Junior..."
                      aria-invalid={!!formErrors.grade}
                      aria-describedby="grade-error"
                    />
                    {formErrors.grade && (
                      <p id="grade-error" className="text-red-500 text-sm mt-1">
                        {formErrors.grade}
                      </p>
                    )}
                  </div>

                  {/* Corps de Métier Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Corps de Métier
                    </label>
                    <input
                      type="text"
                      name="corpsMetier"
                      value={formData.corpsMetier}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${formErrors.corpsMetier ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="Ex: Informatique, Administration..."
                      aria-invalid={!!formErrors.corpsMetier}
                      aria-describedby="corpsMetier-error"
                    />
                    {formErrors.corpsMetier && (
                      <p id="corpsMetier-error" className="text-red-500 text-sm mt-1">
                        {formErrors.corpsMetier}
                      </p>
                    )}
                  </div>

                  {/* Compétences Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Compétences
                    </label>
                    <input
                      type="text"
                      name="competences"
                      value={formData.competences}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${formErrors.competences ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="Listez vos compétences, séparées par des virgules"
                      aria-invalid={!!formErrors.competences}
                      aria-describedby="competences-error"
                    />
                    {formErrors.competences && (
                      <p id="competences-error" className="text-red-500 text-sm mt-1">
                        {formErrors.competences}
                      </p>
                    )}
                  </div>

                  {/* Informations Supplémentaires Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Informations Supplémentaires
                    </label>
                    <textarea
                      name="infosSupp"
                      value={formData.infosSupp}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${formErrors.infosSupp ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="Ajoutez des informations supplémentaires ici"
                      rows={4}
                      aria-invalid={!!formErrors.infosSupp}
                      aria-describedby="infosSupp-error"
                    />
                    {formErrors.infosSupp && (
                      <p id="infosSupp-error" className="text-red-500 text-sm mt-1">
                        {formErrors.infosSupp}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={prevStep}
                  className={`px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 ${currentStep === 0 ? 'invisible' : 'visible'
                    }`}
                >
                  Précédent
                </button>

                {currentStep < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Suivant
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Ajouter employé
                  </button>
                )}
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
                L'employé a été ajouté avec succès.
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

export default Employees;