import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, X, ChevronDown, ChevronUp, User  } from 'lucide-react';
import type { Employee, Service } from '../types';
import { employeeService } from '../services/employeeService';

const Employees = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await employeeService.getAllEmployees();
        setEmployees(data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };
    fetchEmployees();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    
    if (Object.keys(errors).length === 0) {
      try {
        setLoading(true);
        const newEmployee = await employeeService.createEmployee({
          id: '',
          matricule: formData.matricule,
          nom: formData.nom,
          dateNaissance: formData.dateNaissance,
          lieuNaissance: formData.lieuNaissance,
          sexe: formData.sexe,
          matrimoniale: formData.matrimoniale,
          diplome: formData.diplome,
          contrat: formData.contrat,
          statutPro: formData.statutPro,
          grade: formData.grade || '',
          corpsMetier: formData.corpsMetier || '',
          competences: formData.competences || '',
          infosSupp: formData.infosSupp,
          position: formData.position,
          service: formData.service,
          email: formData.email,
          phone: formData.phone
        });
        
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
        setShowAddModal(false);
      } catch (error) {
        console.error('Error creating employee:', error);
        alert('Failed to create employee. Please try again.');
      }finally {
        setLoading(false);
      }
    } else {
      setFormErrors(errors);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(1);
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

  const matrimoniales = [
    'Marie',
    'Celibataire',
    'Veuf / Veuve',
  ];

  const sexes = [
    'Masculin',
    'Feminin',
  ];

  const statutPros = [
    'Fonctionnaire',
    'Contractuel',
    'Agent Decision',
  ];

  const handleNext = () => {
    const currentStepErrors: Record<string, string> = {};
    
    // Validate only fields for the current step
    if (currentStep === 1) {
      if (!formData.nom.trim()) currentStepErrors.nom = 'Nom est requis';
      if (!formData.dateNaissance.trim()) currentStepErrors.dateNaissance = 'Date de naissance est requise';
      if (!formData.lieuNaissance.trim()) currentStepErrors.lieuNaissance = 'Lieu de naissance est requis';
      if (!formData.sexe.trim()) currentStepErrors.sexe = 'Sexe est requis';
      if (!formData.matrimoniale.trim()) currentStepErrors.situationMatrimoniale = 'Situation matrimoniale est requise';
      if (!formData.email.trim()) {
        currentStepErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        currentStepErrors.email = 'Invalid email format';
      }
      if (!formData.phone.trim()) {
        currentStepErrors.phone = 'Phone number is required';
      } else if (!/^\+\d{2}\s\d{1,2}\s\d{2}\s\d{2}\s\d{2}\s\d{2}$/.test(formData.phone)) {
        currentStepErrors.phone = 'Invalid phone format (e.g., +33 1 23 45 67 89)';
      }
    }
    
    if (Object.keys(currentStepErrors).length === 0) {
      setCurrentStep(2);
      setFormErrors({});
    } else {
      setFormErrors(currentStepErrors);
    }
  };
  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.matricule.trim()) errors.matricule = 'Matricule est requis';
    if (!formData.nom.trim()) errors.nom = 'Nom est requis';
    if (!formData.dateNaissance.trim()) errors.dateNaissance = 'Date de naissance est requise';
    if (!formData.lieuNaissance.trim()) errors.lieuNaissance = 'Lieu de naissance est requis';
    if (!formData.sexe.trim()) errors.sexe = 'Sexe est requis';
    if (!formData.matrimoniale.trim()) errors.situationMatrimoniale = 'Situation matrimoniale est requise';
    if (!formData.diplome.trim()) errors.diplome = 'Diplôme est requis';
    if (!formData.contrat.trim()) errors.contrat = 'Contrat est requis';
    if (!formData.statutPro.trim()) errors.statutProfessionnel = 'Statut professionnel est requis';
    if (!formData.grade.trim()) errors.grade = 'Grade est requis';
    if (!formData.corpsMetier.trim()) errors.corpsMetier = 'Corps de métier est requis';
    if (!formData.competences.trim()) errors.competences = 'Compétences sont requises';
    if (!formData.position) errors.position = 'Position is required';
    if (!formData.service) errors.department = 'Department is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^\+\d{2}\s\d{1,2}\s\d{2}\s\d{2}\s\d{2}\s\d{2}$/.test(formData.phone)) {
      errors.phone = 'Invalid phone format (e.g., +33 1 23 45 67 89)';
    }
    if (!formData.infosSupp.trim()) errors.infosSupp = 'Informations supplémentaires sont requises';
    return errors;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

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

  const formFields = [
    {
      step: 1,
      fields: [
        { name: 'nom', label: 'Nom', type: 'text', placeholder: 'Enter employee nom', required: true },
        { name: 'dateNaissance', label: 'Date de Naissance', type: 'date', required: true },
        { name: 'lieuNaissance', label: 'Lieu de Naissance', type: 'text', required: true },
        { name: 'sexe', label: 'Sexe', type: 'select', options: sexes, required: true },
        { name: 'matrimoniale', label: 'Situation Matrimoniale', type: 'select', options: matrimoniales, required: true },
        { name: 'email', label: 'Email', type: 'email', placeholder: 'Enter email address', required: true },
        { name: 'phone', label: 'Phone', type: 'tel', placeholder: '+33 1 23 45 67 89', required: true }
      ]
    },
    {
      step: 2,
      fields: [
        { name: 'matricule', label: 'Matricule', type: 'text', required: true },
        { name: 'diplome', label: 'Diplôme', type: 'text', required: true },
        { name: 'contrat', label: 'Contrat', type: 'date', required: true },
        { name: 'statutPro', label: 'Statut Professionnel', type: 'select', options: statutPros, required: true },
        { name: 'position', label: 'Position', type: 'select', options: positions, required: true },
        { name: 'department', label: 'Service', type: 'select', options: departments, required: true },
        { name: 'grade', label: 'Grade', type: 'text', required: true },
        { name: 'competences', label: 'Compétences', type: 'text', required: true },
        { name: 'infosSupp', label: 'Informations Supplémentaires', type: 'text', placeholder: 'Ajoutez des informations supplémentaires', required: true }
      ]
    }
  ];

  const FormField = ({
    field,
    value,
    onChange,
    error
  }: {
    field: { name: string; label: string; type: string; placeholder?: string; options?: string[] },
    value: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void,
    error?: string
  }) => {
    const baseClassName = `w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-500' : 'border-gray-300'}`;
  
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {field.label}
        </label>
        {field.type === 'select' ? (
          <select
            id={field.name}
            name={field.name}
            value={value}
            onChange={onChange}
            className={baseClassName}
          >
            <option value="">Select {field.label.toLowerCase()}</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        ) : (
          <input
            id={field.name}
            type={field.type}
            name={field.name}
            value={value}
            onChange={onChange}
            className={baseClassName}
            placeholder={field.placeholder}
          />
        )}
        {error && (
          <p className="text-red-500 text-sm mt-1">{error}</p>
        )}
      </div>
    );
  };
  

  const PersonalInfoStep = () => (
    <div className="space-y-4">
      {formFields[0].fields.map(field => (
        <FormField
          key={field.name}
          field={field}
          value={formData[field.name as keyof typeof formData]}
          onChange={handleInputChange}
          error={formErrors[field.name]}
        />
      ))}
    </div>
  );

  const ProfessionalInfoStep = () => (
    <div className="space-y-4">
      {formFields[1].fields.map(field => (
        <FormField
          key={field.name}
          field={field}
          value={formData[field.name as keyof typeof formData]}
          onChange={handleInputChange}
          error={formErrors[field.name]}
        />
      ))}
    </div>
  );

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
                        // onClick={() => handleDelete(employee.id)}
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
        <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto my-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Ajouter Employe</h2>
            <button 
              onClick={() => setShowAddModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>
  
          {/* Progress indicator */}
          <div className="mb-6">
            <div className="flex items-center justify-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}>
                1
              </div>
              <div className="w-20 h-1 bg-gray-200">
                <div className={`h-full ${currentStep === 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
              </div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}>
                2
              </div>
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-sm">Info Personnel</span>
              <span className="text-sm">Info Professionnel</span>
            </div>
          </div>
  
          <form onSubmit={handleSubmit} className="space-y-4">
            {currentStep === 1 ? <PersonalInfoStep /> : <ProfessionalInfoStep />}
  
            <div className="flex justify-end gap-3 mt-6">
              {currentStep === 2 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Previous
                </button>
              )}
              {currentStep === 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Ajouter
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
      )}
    </div>
  );
};

export default Employees;