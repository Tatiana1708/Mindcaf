import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FormStepper from '../../components/FormStepper';
import { publicFormService } from '../../services/publicFormService';
import NotificationService from '../../services/NotificationService';
import type { LocationState, Procedure, Service } from '../../types';


const PublicSocietyInfo: React.FC = () => {
  const navigate = useNavigate();
  const { procedureName } = useParams();

  // Form step state
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [procedures, setProcedures] = useState<Procedure[]>([]);

  // Requester Info state
  const [formData, setFormData] = useState({
    name: '',
    codeFiscal: '',
    email: '',
    phone: '',
    formeJuridique : '',
    activite : '',
    department: '',
    requestType: '',
    description: '',
    region: '',
    adminDepartment: '',
    arrondissement: '',
    village: '',
    streetType: '',
    streetName: '',
    doorNumber: ''
    // documents: []
  });

  // Checklist state
  const [checklist, setChecklist] = useState({
    identityCard: { checked: false, image: { file: null, preview: '', fileType: '' } },
    proofOfResidence: { checked: false, image: { file: null, preview: '', fileType: '' } },
    birthCertificate: { checked: false, image: { file: null, preview: '', fileType: '' } },
    taxClearance: { checked: false, image: { file: null, preview: '', fileType: '' } },
    propertyDocuments: { checked: false, image: { file: null, preview: '', fileType: '' } },
    applicationLetter: { checked: false, image: { file: null, preview: '', fileType: '' } }
  });

  const services: Service[] = [
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

  // Location types
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
  const [departments, setDepartments] = useState<Department[]>([]);
  const [arrondissements, setArrondissements] = useState<Arrondissement[]>([]);
  const [villages, setVillages] = useState<Village[]>([]);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Location effects
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

  // Form handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setChecklist(prev => ({
      ...prev,
      [name]: { ...prev[name as keyof typeof checklist], checked }
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, documentType: keyof typeof checklist) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileType = file.type;
      if (fileType.startsWith('image/') || fileType === 'application/pdf') {
        if (fileType.startsWith('image/')) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setChecklist(prev => ({
              ...prev,
              [documentType]: {
                ...prev[documentType],
                image: {
                  file,
                  preview: reader.result as string,
                  fileType
                }
              }
            }));
          };
          reader.readAsDataURL(file);
        } else {
          setChecklist(prev => ({
            ...prev,
            [documentType]: {
              ...prev[documentType],
              image: {
                file,
                preview: '',
                fileType
              }
            }
          }));
        }
      } else {
        alert('Please upload an image or PDF file');
      }
    }
  };

  const handleDeleteImage = (documentType: keyof typeof checklist) => {
    setChecklist(prev => ({
      ...prev,
      [documentType]: {
        ...prev[documentType],
        image: { file: null, preview: '', fileType: '' }
      }
    }));
  };

  const handleNextStep = () => {
    setCurrentStep(2);
  };

  const handlePrevStep = () => {
    setCurrentStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    if (currentStep === 1) {
      handleNextStep();
      return;
    }
    setIsLoading(true);

    const procedureTitle = procedureName as Procedure['title'];

    try {
      // Prepare documents for upload
      const documents = Object.entries(checklist)
        .filter(([_, value]) => value.checked && value.image.file)
        .map(([type, value]) => ({
          file: value.image.file!,
          type
        }));

      // Submit form data and documents to database
      // await publicFormService.submitForm({
      //   ...formData,
      //   requestType: procedureTitle
      // });

      // Send notification
      NotificationService.sendNotification({
        type: 'form_submission',
        message: `Checklist submitted for procedure: ${procedureTitle}`,
        description: `Checklist submitted by ${formData.name} ${formData.formeJuridique} for ${procedureTitle}`,
        procedureTitle: procedureTitle,
        requesterName: `${formData.name} ${formData.codeFiscal}`,
        requesterEmail: formData.email
      });


      // Show success message and navigate back
      alert('Form submitted successfully!');
      navigate('/public-checklist')
      // window.history.back();
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit form. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Location data
  const locationData: Region[] = [
    {
      id: '01',
      name: 'Adamaoua',
      departments: [
        {
          id: 'AD-01',
          name: 'Djérem',
          arrondissements: [
            {
              id: 'AD-01-01',
              name: 'Tibati',
              villages: [
                { id: 'AD-01-01-01', name: 'Tibati' },
                { id: 'AD-01-01-02', name: 'Meidjamba' }
              ]
            },
            {
              id: 'AD-01-02',
              name: 'Ngaoundal',
              villages: [
                { id: 'AD-01-02-01', name: 'Ngaoundal' },
                { id: 'AD-01-02-02', name: 'Beka Gotto' }
              ]
            }
          ]
        },
        {
          id: 'AD-02',
          name: 'Faro-et-Déo',
          arrondissements: [
            {
              id: 'AD-02-01',
              name: 'Tignère',
              villages: [
                { id: 'AD-02-01-01', name: 'Tignère' },
                { id: 'AD-02-01-02', name: 'Kontcha' }
              ]
            }
          ]
        }
      ]
    },
    {
      id: '02',
      name: 'Centre',
      departments: [
        {
          id: 'CE-01',
          name: 'Mfoundi',
          arrondissements: [
            {
              id: 'CE-01-01',
              name: 'Yaoundé I',
              villages: [
                { id: 'CE-01-01-01', name: 'Bastos' },
                { id: 'CE-01-01-02', name: 'Nlongkak' }
              ]
            },
            {
              id: 'CE-01-02',
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
              id: 'CE-02-01',
              name: 'Eséka',
              villages: [
                { id: 'CE-02-01-01', name: 'Eséka' },
                { id: 'CE-02-01-02', name: 'Manguen' }
              ]
            }
          ]
        }
      ]
    },
    {
      id: '03',
      name: 'Littoral',
      departments: [
        {
          id: 'LT-01',
          name: 'Wouri',
          arrondissements: [
            {
              id: 'LT-01-01',
              name: 'Douala I',
              villages: [
                { id: 'LT-01-01-01', name: 'Bonanjo' },
                { id: 'LT-01-01-02', name: 'Akwa' }
              ]
            },
            {
              id: 'LT-01-02',
              name: 'Douala II',
              villages: [
                { id: 'LT-01-02-01', name: 'New-Bell' },
                { id: 'LT-01-02-02', name: 'Nkongmondo' }
              ]
            }
          ]
        },
        {
          id: 'LT-02',
          name: 'Sanaga-Maritime',
          arrondissements: [
            {
              id: 'LT-02-01',
              name: 'Édéa',
              villages: [
                { id: 'LT-02-01-01', name: 'Édéa' },
                { id: 'LT-02-01-02', name: 'Dehane' }
              ]
            }
          ]
        }
      ]
    },
    {
      id: '04',
      name: 'Nord',
      departments: [
        {
          id: 'NO-01',
          name: 'Bénoué',
          arrondissements: [
            {
              id: 'NO-01-01',
              name: 'Garoua I',
              villages: [
                { id: 'NO-01-01-01', name: 'Garoua' },
                { id: 'NO-01-01-02', name: 'Lainde' }
              ]
            }
          ]
        }
      ]
    },
    {
      id: '05',
      name: 'Sud',
      departments: [
        {
          id: 'SU-01',
          name: 'Dja et Lobo',
          arrondissements: [
            {
              "id": "SU-01-01",
              "name": "Bengbis",
              "villages": [
                { "id": "SU-01-01-01", "name": "Bengbis" },
                { "id": "SU-01-01-02", "name": "Bengbis Ville" },
                { "id": "SU-01-01-03", "name": "Centre Administratif" },
                { "id": "SU-01-01-04", "name": "Madagascar" },
                { "id": "SU-01-01-05", "name": "Mimbil" },
                { "id": "SU-01-01-06", "name": "Mvom-Bella" },
                { "id": "SU-01-01-07", "name": "Pays-Bas" },
                { "id": "SU-01-01-08", "name": "Bulu-Dja" },
                { "id": "SU-01-01-09", "name": "Akom-Ndong" },
                { "id": "SU-01-01-10", "name": "Bissombo" },
                { "id": "SU-01-01-11", "name": "Biton" },
                { "id": "SU-01-01-12", "name": "Koungoulou" },
                { "id": "SU-01-01-13", "name": "Mbometa'a" },
                { "id": "SU-01-01-14", "name": "Meka'a" },
                { "id": "SU-01-01-15", "name": "Mekas" },
                { "id": "SU-01-01-16", "name": "Mimbil" },
                { "id": "SU-01-01-17", "name": "Nkolembembe" },
                { "id": "SU-01-01-18", "name": "Nkouleze" },
                { "id": "SU-01-01-19", "name": "Nsimalene" },
                { "id": "SU-01-01-20", "name": "Nyabizou" },
                { "id": "SU-01-01-21", "name": "Mbizo'o" },
                { "id": "SU-01-01-22", "name": "Bibinda" }
              ]
            },
            {
              id: 'SU-01-02',
              name: 'Djoum',
              villages: [
                { "id": "SU-01-02-01", "name": "Djoum" },
                { "id": "SU-01-02-02", "name": "Djoum Ville" },
                { "id": "SU-01-02-03", "name": "Accra" },
                { "id": "SU-01-02-04", "name": "Adjap" },
                { "id": "SU-01-02-05", "name": "Bitebiokang" },
                { "id": "SU-01-02-06", "name": "Étoile" },
                { "id": "SU-01-02-07", "name": "Evindissi" },
                { "id": "SU-01-02-08", "name": "Kaka" },
                { "id": "SU-01-02-09", "name": "New-Town" },
                { "id": "SU-01-02-10", "name": "Nkan" },
                { "id": "SU-01-02-11", "name": "Bulu" },
                { "id": "SU-01-02-12", "name": "Aboelone" },
                { "id": "SU-01-02-13", "name": "Akom-Binyeng" },
                { "id": "SU-01-02-14", "name": "Djoum-Village" },
                { "id": "SU-01-02-15", "name": "Djouze" },
                { "id": "SU-01-02-16", "name": "Endengue" },
                { "id": "SU-01-02-17", "name": "Melen-Boulou" },
                { "id": "SU-01-02-18", "name": "Miatta" },
                { "id": "SU-01-02-19", "name": "Mveng" },
                { "id": "SU-01-02-20", "name": "Nko" },
                { "id": "SU-01-02-21", "name": "Nkolafendek" },
                { "id": "SU-01-02-22", "name": "Nyabibete" },
                { "id": "SU-01-02-23", "name": "Fang-Centre" },
                { "id": "SU-01-02-24", "name": "Akontangane" },
                { "id": "SU-01-02-25", "name": "Alat-Makae" },
                { "id": "SU-01-02-26", "name": "Ayene" },
                { "id": "SU-01-02-27", "name": "Bindoumba" },
                { "id": "SU-01-02-28", "name": "Djop" },
                { "id": "SU-01-02-29", "name": "Doum" },
                { "id": "SU-01-02-30", "name": "Essong" },
                { "id": "SU-01-02-31", "name": "Mebane I" },
                { "id": "SU-01-02-32", "name": "Mebane II" },
                { "id": "SU-01-02-33", "name": "Mfem" },
                { "id": "SU-01-02-34", "name": "Minko'o" },
                { "id": "SU-01-02-35", "name": "Nkan" },
                { "id": "SU-01-02-36", "name": "Okpweng" },
                { "id": "SU-01-02-37", "name": "Yen" },
                { "id": "SU-01-02-38", "name": "Zamane" },
                { "id": "SU-01-02-39", "name": "Akak" },
                { "id": "SU-01-02-40", "name": "Akom-Zamane" },
                { "id": "SU-01-02-41", "name": "Akonetye" },
                { "id": "SU-01-02-42", "name": "Alop" },
                { "id": "SU-01-02-43", "name": "Amvam" },
                { "id": "SU-01-02-44", "name": "Avebe" },
                { "id": "SU-01-02-45", "name": "Avobengono" },
                { "id": "SU-01-02-46", "name": "Bebo'o Bella" },
                { "id": "SU-01-02-47", "name": "Efoulan" },
                { "id": "SU-01-02-48", "name": "Elleng" },
                { "id": "SU-01-02-49", "name": "Mbouma" },
                { "id": "SU-01-02-50", "name": "Melen-Zamane" },
                { "id": "SU-01-02-51", "name": "Mendoung" },
                { "id": "SU-01-02-52", "name": "Meyos III" },
                { "id": "SU-01-02-53", "name": "Meyos-Obam" },
                { "id": "SU-01-02-54", "name": "Minko'o Messeng" },
                { "id": "SU-01-02-55", "name": "NkolenYeng" },
                { "id": "SU-01-02-56", "name": "Otong-Mbong" },
                { "id": "SU-01-02-57", "name": "Bilik-Akom" }
              ]
            },
            {
              id: 'SU-01-03',
              name: 'Meyomessala',
              villages: [
                { id: 'SU-01-03-01', name: 'Meyomessala Ville' },
                { id: 'SU-01-03-02', name: 'Ekouk' },
                { id: 'SU-01-03-03', name: 'Ma\'an' },
                { id: 'SU-01-03-04', name: 'Ngat' },
                { id: 'SU-01-03-05', name: 'Messok' },
                { id: 'SU-01-03-06', name: 'Andom' },
                { id: 'SU-01-03-07', name: 'Bibas' },
                { id: 'SU-01-03-08', name: 'Biba-Yezoum' },
                { id: 'SU-01-03-09', name: 'Biboulemam' },
                { id: 'SU-01-03-10', name: 'Bidjong' },
                { id: 'SU-01-03-11', name: 'Ebolakounou' },
                { id: 'SU-01-03-12', name: 'Efoulan 1' },
                { id: 'SU-01-03-13', name: 'Efoulan 2' },
                { id: 'SU-01-03-14', name: 'Ekok' },
                { id: 'SU-01-03-15', name: 'Eton' },
                { id: 'SU-01-03-16', name: 'Mbe\'elon' },
                { id: 'SU-01-03-17', name: 'Mebame' },
                { id: 'SU-01-03-18', name: 'Mekin' },
                { id: 'SU-01-03-19', name: 'Mekomo' },
                { id: 'SU-01-03-20', name: 'Messila' },
                { id: 'SU-01-03-21', name: 'Meyos-Yetyang' },
                { id: 'SU-01-03-22', name: 'Mvomeka\'a' },
                { id: 'SU-01-03-23', name: 'Ndibissong' },
                { id: 'SU-01-03-24', name: 'Nkoldja' },
                { id: 'SU-01-03-25', name: 'Nlobesse\'e' },
                { id: 'SU-01-03-26', name: 'Nnemeyong I' },
                { id: 'SU-01-03-27', name: 'Nnemeyong II' },
                { id: 'SU-01-03-28', name: 'Nye\'ele' },
                { id: 'SU-01-03-29', name: 'Onongo' },
                { id: 'SU-01-03-30', name: 'Zoumeyo' },
                { id: 'SU-01-03-31', name: 'Ndou-Libi' },
                { id: 'SU-01-03-32', name: 'Akok' },
                { id: 'SU-01-03-33', name: 'Akom-Ndong' },
                { id: 'SU-01-03-34', name: 'Anvom' },
                { id: 'SU-01-03-35', name: 'Bitye' },
                { id: 'SU-01-03-36', name: 'Ebang' },
                { id: 'SU-01-03-37', name: 'Edjom' },
                { id: 'SU-01-03-38', name: 'Ellé' },
                { id: 'SU-01-03-39', name: 'Endam-Yembong' },
                { id: 'SU-01-03-40', name: 'Kalle' },
                { id: 'SU-01-03-41', name: 'Kout' },
                { id: 'SU-01-03-42', name: 'Kpwe' },
                { id: 'SU-01-03-43', name: 'Melok' },
                { id: 'SU-01-03-44', name: 'Memvae' },
                { id: 'SU-01-03-45', name: 'Mengon' },
                { id: 'SU-01-03-46', name: 'Meyomakot' },
                { id: 'SU-01-03-47', name: 'Minko' },
                { id: 'SU-01-03-48', name: 'Mintima' },
                { id: 'SU-01-03-49', name: 'Mvan-Bisson' },
                { id: 'SU-01-03-50', name: 'Mvia' },
                { id: 'SU-01-03-51', name: 'Ndjikom' },
                { id: 'SU-01-03-52', name: 'Nkae' },
                { id: 'SU-01-03-53', name: 'Nko' },
                { id: 'SU-01-03-54', name: 'NkolenYeng' },
                { id: 'SU-01-03-55', name: 'Nnemeyong III' },
                { id: 'SU-01-03-56', name: 'Samarie' },
                { id: 'SU-01-03-57', name: 'Tatying I' },
                { id: 'SU-01-03-58', name: 'Yous' }
              ]
            },
            {
              id: 'SU-01-04',
              name: 'Mintom',
              villages: [
                { id: 'SU-01-04-01', name: 'Mintom' },
                { id: 'SU-01-04-02', name: 'Centre Administratif' },
                { id: 'SU-01-04-03', name: 'Esseng' },
                { id: 'SU-01-04-04', name: 'Mbong-Ayok' },
                { id: 'SU-01-04-05', name: 'Meyiboto' },
                { id: 'SU-01-04-06', name: 'Mintom 2' },
                { id: 'SU-01-04-07', name: 'Zeh' },
                { id: 'SU-01-04-08', name: 'Nja-Et-Lele' },
                { id: 'SU-01-04-09', name: 'Akom' },
                { id: 'SU-01-04-10', name: 'Alati' },
                { id: 'SU-01-04-11', name: 'Bi' },
                { id: 'SU-01-04-12', name: 'Bindom' },
                { id: 'SU-01-04-13', name: 'Koungoulou' },
                { id: 'SU-01-04-14', name: 'Lele' },
                { id: 'SU-01-04-15', name: 'Mboutoukong' },
                { id: 'SU-01-04-16', name: 'Mekom' },
                { id: 'SU-01-04-17', name: 'Mekotto' },
                { id: 'SU-01-04-18', name: 'Mintom 1' },
                { id: 'SU-01-04-19', name: 'Nkolmboula' },
                { id: 'SU-01-04-20', name: 'Zoebefam' },
                { id: 'SU-01-04-21', name: 'Zo\'otou II' },
                { id: 'SU-01-04-22', name: 'Zoulabot' },
                { id: 'SU-01-04-23', name: 'Zoulameyong' },
                { id: 'SU-01-04-24', name: 'Zo\'otou I' }
              ]
            },
            {
              id: 'SU-01-05',
              name: 'Oveng',
              villages: [
                { id: 'SU-01-05-01', name: 'Oveng' },
                { id: 'SU-01-05-02', name: 'Fang-Sud' },
                { id: 'SU-01-05-03', name: 'Aboulou' },
                { id: 'SU-01-05-04', name: 'Mebang' },
                { id: 'SU-01-05-05', name: 'Akoabas' },
                { id: 'SU-01-05-06', name: 'Bikougou' },
                { id: 'SU-01-05-07', name: 'Bityé' },
                { id: 'SU-01-05-08', name: 'Ebomane' },
                { id: 'SU-01-05-09', name: 'Endone' },
                { id: 'SU-01-05-10', name: 'Essam' },
                { id: 'SU-01-05-11', name: 'Mvam' },
                { id: 'SU-01-05-12', name: 'Oveng-Village' },
                { id: 'SU-01-05-13', name: 'Ekowong' },
                { id: 'SU-01-05-14', name: 'Mebassa' },
                { id: 'SU-01-05-15', name: 'Ngoudjeng' },
                { id: 'SU-01-05-16', name: 'Akom' },
                { id: 'SU-01-05-17', name: 'Abek' },
                { id: 'SU-01-05-18', name: 'Adjap' },
                { id: 'SU-01-05-19', name: 'Medjeng' },
                { id: 'SU-01-05-20', name: 'Andoung' },
                { id: 'SU-01-05-21', name: 'Bifot' },
                { id: 'SU-01-05-22', name: 'Essamenkou' },
                { id: 'SU-01-05-23', name: 'Ndja' },
                { id: 'SU-01-05-24', name: 'Anyoungom' },
                { id: 'SU-01-05-25', name: 'Nkono' },
                { id: 'SU-01-05-26', name: 'Onon' },
                { id: 'SU-01-05-27', name: 'Ngwassa' },
                { id: 'SU-01-05-28', name: 'Meko\'o' }
              ]
            },
            {
              id: 'SU-01-06',
              name: 'Sangmelima',
              villages: [
                { id: 'SU-01-06-01', name: 'Sangmelima' },
                { id: 'SU-01-06-02', name: 'Avebe' },
                { id: 'SU-01-06-03', name: 'Meyomadjom' },
                { id: 'SU-01-06-04', name: 'Nkpwang' },
                { id: 'SU-01-06-05', name: 'Akon I' },
                { id: 'SU-01-06-06', name: 'Akon II' },
                { id: 'SU-01-06-07', name: 'Akon III' },
                { id: 'SU-01-06-08', name: 'Akon X' },
                { id: 'SU-01-06-09', name: 'Base' },
                { id: 'SU-01-06-10', name: 'Bissono' },
                { id: 'SU-01-06-11', name: 'Centre Administratif' },
                { id: 'SU-01-06-12', name: 'Ebolengbwang' },
                { id: 'SU-01-06-13', name: 'Lobo-Si' },
                { id: 'SU-01-06-14', name: "Mbeli'i" },
                { id: 'SU-01-06-15', name: 'Monavebe' },
                { id: 'SU-01-06-16', name: 'Nkolnguet' },
                { id: 'SU-01-06-17', name: 'Nylon' },
                { id: 'SU-01-06-18', name: 'Quartier Chic' },
                { id: 'SU-01-06-19', name: 'Sangmelima Village' },
                { id: 'SU-01-06-20', name: 'Sources' },
                { id: 'SU-01-06-21', name: 'Otoakam' },
                { id: 'SU-01-06-22', name: 'Afamba-Libi' },
                { id: 'SU-01-06-23', name: 'Kamelon' },
                { id: 'SU-01-06-24', name: 'Ndjantom' },
                { id: 'SU-01-06-25', name: 'Nyazanga' },
                { id: 'SU-01-06-26', name: 'Mepho' },
                { id: 'SU-01-06-27', name: 'Efoulan' },
                { id: 'SU-01-06-28', name: 'Evindissi I' },
                { id: 'SU-01-06-29', name: 'Evindissi II' },
                { id: 'SU-01-06-30', name: 'Kombe' },
                { id: 'SU-01-06-31', name: 'Kondemeyos' },
                { id: 'SU-01-06-32', name: 'Melen' },
                { id: 'SU-01-06-33', name: 'Mendong' },
                { id: 'SU-01-06-34', name: 'Mepho' },
                { id: 'SU-01-06-35', name: 'Meyos' },
                { id: 'SU-01-06-36', name: 'Mfoul-Oveng' },
                { id: 'SU-01-06-37', name: 'Mimbo' },
                { id: 'SU-01-06-38', name: 'Ndjom' },
                { id: 'SU-01-06-39', name: 'Ngam' },
                { id: 'SU-01-06-40', name: 'Ngon' },
                { id: 'SU-01-06-41', name: 'Nkout II' },
                { id: 'SU-01-06-42', name: 'Nkpwag' },
                { id: 'SU-01-06-43', name: 'Nloup' },
                { id: 'SU-01-06-44', name: 'Nsimale I' },
                { id: 'SU-01-06-45', name: 'Nsimale II' },
                { id: 'SU-01-06-46', name: 'Nsimale III' },
                { id: 'SU-01-06-47', name: 'Oveng-Yemvak' },
                { id: 'SU-01-06-48', name: 'Zoum' }
              ]
            },
            {
              id: 'SU-01-07',
              name: 'Zoétélé',
              villages: [
                { id: 'SU-01-07-01', name: 'Zoétélé' },
                { id: 'SU-01-07-02', name: 'Nden' },
                { id: 'SU-01-07-03', name: 'Nkolemveng' },
                { id: 'SU-01-07-04', name: 'Akoa' },
                { id: 'SU-01-07-05', name: 'Lac' },
                { id: 'SU-01-07-06', name: 'Plateau' },
                { id: 'SU-01-07-07', name: 'New Town' },
                { id: 'SU-01-07-08', name: 'Esse Rural' },
                { id: 'SU-01-07-09', name: 'Enamengal' },
                { id: 'SU-01-07-10', name: 'Engoutouk' },
                { id: 'SU-01-07-11', name: 'Kondebiyen' },
                { id: 'SU-01-07-12', name: 'Mbedoumou' },
                { id: 'SU-01-07-13', name: 'Ndele' },
                { id: 'SU-01-07-14', name: 'Nkilzok' },
                { id: 'SU-01-07-15', name: 'Nkolbang' },
                { id: 'SU-01-07-16', name: 'Nnemeyong' },
                { id: 'SU-01-07-17', name: 'Olounou' },
                { id: 'SU-01-07-18', name: 'Mvog Ella' },
                { id: 'SU-01-07-19', name: 'Biboulemam' },
                { id: 'SU-01-07-20', name: 'Biyan' },
                { id: 'SU-01-07-21', name: 'Ngomedjap' },
                { id: 'SU-01-07-22', name: 'Nkolofong' },
                { id: 'SU-01-07-23', name: 'Mvog Mezang' },
                { id: 'SU-01-07-24', name: 'Abangok' },
                { id: 'SU-01-07-25', name: 'Awout' },
                { id: 'SU-01-07-26', name: 'Bibe' },
                { id: 'SU-01-07-27', name: 'Etoto' },
                { id: 'SU-01-07-28', name: 'Mebo' },
                { id: 'SU-01-07-29', name: 'Menibwa' },
                { id: 'SU-01-07-30', name: 'Meyiboto' },
                { id: 'SU-01-07-31', name: 'Zoétélé Village I' },
                { id: 'SU-01-07-32', name: 'Zoétélé Village II' },
                { id: 'SU-01-07-33', name: 'Mvog Zang' },
                { id: 'SU-01-07-34', name: 'Mvog Zomo' }
              ]
            },
            {
              id: 'SU-01-08',
              name: 'Meyomessi',
              villages: [
                { id: 'SU-01-08-01', name: 'Meyomessi' },
                { id: 'SU-01-08-02', name: 'Akoabas' },
                { id: 'SU-01-08-03', name: 'Ngomebae' },
                { id: 'SU-01-08-04', name: 'Meyomessi Ville' },
                { id: 'SU-01-08-05', name: 'Meyomessi Ville' },
                { id: 'SU-01-08-06', name: 'Ndong' },
                { id: 'SU-01-08-07', name: 'Abele' },
                { id: 'SU-01-08-08', name: 'Akom-Ndong' },
                { id: 'SU-01-08-09', name: 'Bikoula' },
                { id: 'SU-01-08-10', name: 'Emvieng I' },
                { id: 'SU-01-08-11', name: 'Emvieng II' },
                { id: 'SU-01-08-12', name: 'Essang Mvout' },
                { id: 'SU-01-08-13', name: 'Essong-Ndong' },
                { id: 'SU-01-08-14', name: 'Kongo' },
                { id: 'SU-01-08-15', name: 'Mbiéleme' },
                { id: 'SU-01-08-16', name: 'Mekok' },
                { id: 'SU-01-08-17', name: 'Melan' },
                { id: 'SU-01-08-18', name: 'Messok' },
                { id: 'SU-01-08-19', name: 'Oding' },
                { id: 'SU-01-08-20', name: 'Yemfek' },
                { id: 'SU-01-08-21', name: 'Azem' },
                { id: 'SU-01-08-22', name: 'Elom' },
                { id: 'SU-01-08-23', name: 'Mbilemvom' },
                { id: 'SU-01-08-24', name: 'Medjounou' },
                { id: 'SU-01-08-25', name: 'Ndjele' },
                { id: 'SU-01-08-26', name: 'Yemveng' },
                { id: 'SU-01-08-27', name: 'Melok' },
                { id: 'SU-01-08-28', name: 'Meyos' },
                { id: 'SU-01-08-29', name: 'Mimbang' },
                { id: 'SU-01-08-30', name: 'Minkang I' },
                { id: 'SU-01-08-31', name: 'Minkang II' },
                { id: 'SU-01-08-32', name: 'Olounou' }
              ]
            }
          ]
        },
        {
          id: 'SU-02',
          name: 'Mvila',
          arrondissements: [
            {
              id: 'SU-02-01',
              name: 'Biwong-Bane',
              villages: [
                { id: 'SU-02-01-01', name: 'Biwong-Bane' },
                { id: 'SU-02-01-02', name: 'Akak' },
                { id: 'SU-02-01-03', name: 'Nkolonyie' },
                { id: 'SU-02-01-04', name: 'Biwong-Bane Ville' },
                { id: 'SU-02-01-05', name: 'Biwong-Ville' },
                { id: 'SU-02-01-06', name: 'Melangue Sud II' },
                { id: 'SU-02-01-07', name: 'Abiete-Bene' },
                { id: 'SU-02-01-08', name: 'Adjap Mvog Eda' },
                { id: 'SU-02-01-09', name: 'Adjap-Fong' },
                { id: 'SU-02-01-10', name: 'Ating-Bane' },
                { id: 'SU-02-01-11', name: 'Efoumoulou Nsele' },
                { id: 'SU-02-01-12', name: 'Engongom' },
                { id: 'SU-02-01-13', name: 'Ma’anemenyin' },
                { id: 'SU-02-01-14', name: 'Melangue I' },
                { id: 'SU-02-01-15', name: 'Melangue II' },
                { id: 'SU-02-01-16', name: 'Nkoémvone' },
                { id: 'SU-02-01-17', name: 'Oveng-Bane' },
                { id: 'SU-02-01-18', name: 'Yem Mvog Mba' },
                { id: 'SU-02-01-19', name: 'Melangue-Nord' },
                { id: 'SU-02-01-20', name: 'Adjap-Menyie' },
                { id: 'SU-02-01-21', name: 'Akiae' },
                { id: 'SU-02-01-22', name: 'Ebemewomen' },
                { id: 'SU-02-01-23', name: 'Ebemewomen 1' },
                { id: 'SU-02-01-24', name: 'Kama' },
                { id: 'SU-02-01-25', name: 'Minkane' },
                { id: 'SU-02-01-26', name: 'Ndzom-Bane' },
                { id: 'SU-02-01-27', name: 'Ngoékélé' },
                { id: 'SU-02-01-28', name: 'Nkol Amougou' },
                { id: 'SU-02-01-29', name: 'Nkolenkeng' },
                { id: 'SU-02-01-30', name: 'Nkolonyié' },
                { id: 'SU-02-01-31', name: 'Nyep-Bane' },
                { id: 'SU-02-01-32', name: 'Obang 1' },
                { id: 'SU-02-01-33', name: 'Ebong-Ayissi' },
                { id: 'SU-02-01-34', name: 'Melangue-Sud 1' },
                { id: 'SU-02-01-35', name: 'Melangue III' },
                { id: 'SU-02-01-36', name: 'Metet' },
                { id: 'SU-02-01-37', name: 'Ngoazip I' },
                { id: 'SU-02-01-38', name: 'Ngoazip II' },
                { id: 'SU-02-01-39', name: 'Nyazo’o 2' },
                { id: 'SU-02-01-40', name: 'Ofoumbi' },
                { id: 'SU-02-01-41', name: 'Oveng Fong' }
              ]
            },
            {
              id: 'SU-02-02',
              name: 'Biwong-Bulu',
              villages: [
                { id: 'SU-02-02-01', name: 'Biwong-Bulu' },
                { id: 'SU-02-02-02', name: 'Melangue' },
                { id: 'SU-02-02-03', name: 'Nkong-Yebae' },
                { id: 'SU-02-02-04', name: 'Biwong-Bulu Ville' },
                { id: 'SU-02-02-05', name: 'Enguep-Anyou' },
                { id: 'SU-02-02-06', name: 'Abiete Yendjok' },
                { id: 'SU-02-02-07', name: 'Akom' },
                { id: 'SU-02-02-08', name: 'Akpwae' },
                { id: 'SU-02-02-09', name: 'Biba' },
                { id: 'SU-02-02-10', name: 'Ebe' },
                { id: 'SU-02-02-11', name: 'Elone' },
                { id: 'SU-02-02-12', name: 'Eminemvom 1' },
                { id: 'SU-02-02-13', name: 'Eminemvom 2' },
                { id: 'SU-02-02-14', name: 'Lobe' },
                { id: 'SU-02-02-15', name: 'Mamenyie' },
                { id: 'SU-02-02-16', name: 'Mang' },
                { id: 'SU-02-02-17', name: 'Melane' },
                { id: 'SU-02-02-18', name: 'Ngomeden' },
                { id: 'SU-02-02-19', name: 'Ngone' },
                { id: 'SU-02-02-20', name: 'Nkolobane' },
                { id: 'SU-02-02-21', name: 'Nkolenyeng' },
                { id: 'SU-02-02-22', name: 'Nkone' },
                { id: 'SU-02-02-23', name: 'Nkongmedzap 1' },
                { id: 'SU-02-02-24', name: 'Nkongmedzap 2' },
                { id: 'SU-02-02-25', name: 'Nkpwaebaé' },
                { id: 'SU-02-02-26', name: 'Ondondo' },
                { id: 'SU-02-02-27', name: 'Ongol' },
                { id: 'SU-02-02-28', name: 'Sonkoe' },
                { id: 'SU-02-02-29', name: 'Obem' },
                { id: 'SU-02-02-30', name: 'Mbilbekon' },
                { id: 'SU-02-02-31', name: 'Akak-Yevol' },
                { id: 'SU-02-02-32', name: 'Biba-Yevol' },
                { id: 'SU-02-02-33', name: 'Biboulemam' },
                { id: 'SU-02-02-34', name: 'Efoulan-Ndong' },
                { id: 'SU-02-02-35', name: 'Essangong' },
                { id: 'SU-02-02-36', name: 'Koungoulou-Ngoé' },
                { id: 'SU-02-02-37', name: 'Mbounezok' },
                { id: 'SU-02-02-38', name: 'Mendoum' },
                { id: 'SU-02-02-39', name: 'Messambe-Ndong' },
                { id: 'SU-02-02-40', name: 'Metyikpwale-Ngoé' },
                { id: 'SU-02-02-41', name: 'Minkpwéle' },
                { id: 'SU-02-02-42', name: 'Momebili' },
                { id: 'SU-02-02-43', name: 'Mvong' },
                { id: 'SU-02-02-44', name: 'Mvoula' },
                { id: 'SU-02-02-45', name: 'Njana' },
                { id: 'SU-02-02-46', name: 'Nkoetye' },
                { id: 'SU-02-02-47', name: 'Nkolbityé' },
                { id: 'SU-02-02-48', name: 'Nkong-Edjom' },
                { id: 'SU-02-02-49', name: 'Nloupessa-Yevol' },
                { id: 'SU-02-02-50', name: 'Nselang' },
                { id: 'SU-02-02-51', name: 'Okpweng' },
                { id: 'SU-02-02-52', name: 'Zoébefam' },
                { id: 'SU-02-02-53', name: 'Zouameyong' }
              ]
            },
            {
              id: 'SU-02-03',
              name: 'Ebolowa I',
              villages: [
                { id: 'SU-02-03-01', name: 'Ebolowa I' },
                { id: 'SU-02-03-02', name: 'Angalé' },
                { id: 'SU-02-03-03', name: 'Nko\'ovos I' },
                { id: 'SU-02-03-04', name: 'Amang 1' },
                { id: 'SU-02-03-05', name: 'Amang 2' },
                { id: 'SU-02-03-06', name: 'Amang 4' },
                { id: 'SU-02-03-07', name: 'Amang 5' },
                { id: 'SU-02-03-08', name: 'Amang 6' },
                { id: 'SU-02-03-09', name: 'Bilon' },
                { id: 'SU-02-03-10', name: 'Ekombité' },
                { id: 'SU-02-03-11', name: 'Elat' },
                { id: 'SU-02-03-12', name: 'Enongal-Bulu' },
                { id: 'SU-02-03-13', name: 'Mekalat-Yevol' },
                { id: 'SU-02-03-14', name: 'Nko\'ovos 2' },
                { id: 'SU-02-03-15', name: 'Bulu-Sud' },
                { id: 'SU-02-03-16', name: 'Alen' },
                { id: 'SU-02-03-17', name: 'Asso\'Osseng' },
                { id: 'SU-02-03-18', name: 'Biba 1' },
                { id: 'SU-02-03-19', name: 'Biba 2' },
                { id: 'SU-02-03-20', name: 'BiyeYem' },
                { id: 'SU-02-03-21', name: 'Djop' },
                { id: 'SU-02-03-22', name: 'Ekoumdoum' },
                { id: 'SU-02-03-23', name: 'Mbout' },
                { id: 'SU-02-03-24', name: 'Mvam-Yetom' },
                { id: 'SU-02-03-25', name: 'Ndengue' },
                { id: 'SU-02-03-26', name: 'Nko\'Emvone' },
                { id: 'SU-02-03-27', name: 'Ebomam 1' },
                { id: 'SU-02-03-28', name: 'Abang' },
                { id: 'SU-02-03-29', name: 'Akom' },
                { id: 'SU-02-03-30', name: 'Bissam' },
                { id: 'SU-02-03-31', name: 'Ebae' },
                { id: 'SU-02-03-32', name: 'Evindissi' },
                { id: 'SU-02-03-33', name: 'Mekomo' },
                { id: 'SU-02-03-34', name: 'Mvoman' },
                { id: 'SU-02-03-35', name: 'Nko\'Adjap1' },
                { id: 'SU-02-03-36', name: 'Nko\'Adjap 2' },
                { id: 'SU-02-03-37', name: 'Nloupessa Yemong' },
                { id: 'SU-02-03-38', name: 'Okpweng' },
                { id: 'SU-02-03-39', name: 'Assok' },
                { id: 'SU-02-03-40', name: 'Mekok 1' },
                { id: 'SU-02-03-41', name: 'Mekok 2' },
                { id: 'SU-02-03-42', name: 'Adjap 2' },
                { id: 'SU-02-03-43', name: 'Mevous' },
                { id: 'SU-02-03-44', name: 'Meyos' },
                { id: 'SU-02-03-45', name: 'Ebomam 2' },
                { id: 'SU-02-03-46', name: 'Adjap 1' },
                { id: 'SU-02-03-47', name: 'Afanengong Yessok' },
                { id: 'SU-02-03-48', name: 'Akok' },
                { id: 'SU-02-03-49', name: 'Ako\'Okas' },
                { id: 'SU-02-03-50', name: 'Bikpwae' },
                { id: 'SU-02-03-51', name: 'Eyek' },
                { id: 'SU-02-03-52', name: 'Ma\'Amezam' },
                { id: 'SU-02-03-53', name: 'Mbilntangan' },
                { id: 'SU-02-03-54', name: 'Minkok' },
                { id: 'SU-02-03-55', name: 'Minto' },
                { id: 'SU-02-03-56', name: 'Nkolandom' },
                { id: 'SU-02-03-57', name: 'Nkolmvone' },
                { id: 'SU-02-03-58', name: 'Nkondongo' },
                { id: 'SU-02-03-59', name: 'Nkpwaebae' },
                { id: 'SU-02-03-60', name: 'Vema' },
                { id: 'SU-02-03-61', name: 'Enguep-Anyou' },
                { id: 'SU-02-03-62', name: 'Bikpwaé' },
                { id: 'SU-02-03-63', name: 'Ebolakoun' },
                { id: 'SU-02-03-64', name: 'Mbako\'O' },
                { id: 'SU-02-03-65', name: 'Metykpwale-Yeminsem' },
                { id: 'SU-02-03-66', name: 'Meyos' },
                { id: 'SU-02-03-67', name: 'Mvam-Essakoe' },
                { id: 'SU-02-03-68', name: 'Ndjafop' },
                { id: 'SU-02-03-69', name: 'Ngalane III' },
                { id: 'SU-02-03-70', name: 'Mbilbekon' },
                { id: 'SU-02-03-71', name: 'Enongal-Bulu' },
                { id: 'SU-02-03-72', name: 'Mvii-Nord 1' },
                { id: 'SU-02-03-73', name: 'About' },
                { id: 'SU-02-03-74', name: 'Bissok' },
                { id: 'SU-02-03-75', name: 'Bityili 1' },
                { id: 'SU-02-03-76', name: 'Bityili 2' },
                { id: 'SU-02-03-77', name: 'Bityili 3' },
                { id: 'SU-02-03-78', name: 'Bous' },
                { id: 'SU-02-03-79', name: 'Essinguili' },
                { id: 'SU-02-03-80', name: 'Mekalat-Biyeng' },
                { id: 'SU-02-03-81', name: 'Mekalat-Yemveng' },
                { id: 'SU-02-03-82', name: 'Minkok' },
                { id: 'SU-02-03-83', name: 'Ngoto 2' },
                { id: 'SU-02-03-84', name: 'Abomvomba' },
                { id: 'SU-02-03-85', name: 'Aloum 1' },
                { id: 'SU-02-03-86', name: 'Aloum 2' },
                { id: 'SU-02-03-87', name: 'Avelezok' },
                { id: 'SU-02-03-88', name: 'Ekowong' },
                { id: 'SU-02-03-89', name: 'Elone' },
                { id: 'SU-02-03-90', name: 'Foulassi' },
                { id: 'SU-02-03-91', name: 'Foulassi 2' },
                { id: 'SU-02-03-92', name: 'Mefo' },
                { id: 'SU-02-03-93', name: 'Mfinda' },
                { id: 'SU-02-03-94', name: 'Nkolenyeng-Yemvang' },
                { id: 'SU-02-03-95', name: 'Nkoloveng' },
                { id: 'SU-02-03-96', name: 'Nkon' },
                { id: 'SU-02-03-97', name: 'Nnelefooup' },
                { id: 'SU-02-03-98', name: 'Onoyong' },
                { id: 'SU-02-03-99', name: 'Sijakon' },
                { id: 'SU-02-03-100', name: 'Ngone' },
                { id: 'SU-02-03-101', name: 'Biton' }
              ]
            },
            {
              id: 'SU-02-04',
              name: 'Ebolowa II',
              villages: [
                { id: 'SU-02-03-01', name: 'Ebolowa I' },
                { id: 'SU-02-03-02', name: 'Angalé' },
                { id: 'SU-02-03-03', name: 'Nko\'ovos I' },
                { id: 'SU-02-03-04', name: 'Amang 1' },
                { id: 'SU-02-03-05', name: 'Amang 2' },
                { id: 'SU-02-03-06', name: 'Amang 4' },
                { id: 'SU-02-03-07', name: 'Amang 5' },
                { id: 'SU-02-03-08', name: 'Amang 6' },
                { id: 'SU-02-03-09', name: 'Bilon' },
                { id: 'SU-02-03-10', name: 'Ekombité' },
                { id: 'SU-02-03-11', name: 'Elat' },
                { id: 'SU-02-03-12', name: 'Enongal-Bulu' },
                { id: 'SU-02-03-13', name: 'Mekalat-Yevol' },
                { id: 'SU-02-03-14', name: 'Nko\'ovos 2' },
                { id: 'SU-02-03-15', name: 'Bulu-Sud' },
                { id: 'SU-02-03-16', name: 'Alen' },
                { id: 'SU-02-03-17', name: 'Asso\'Osseng' },
                { id: 'SU-02-03-18', name: 'Biba 1' },
                { id: 'SU-02-03-19', name: 'Biba 2' },
                { id: 'SU-02-03-20', name: 'BiyeYem' },
                { id: 'SU-02-03-21', name: 'Djop' },
                { id: 'SU-02-03-22', name: 'Ekoumdoum' },
                { id: 'SU-02-03-23', name: 'Mbout' },
                { id: 'SU-02-03-24', name: 'Mvam-Yetom' },
                { id: 'SU-02-03-25', name: 'Ndengue' },
                { id: 'SU-02-03-26', name: 'Nko\'Emvone' },
                { id: 'SU-02-03-27', name: 'Ebomam 1' },
                { id: 'SU-02-03-28', name: 'Abang' },
                { id: 'SU-02-03-29', name: 'Akom' },
                { id: 'SU-02-03-30', name: 'Bissam' },
                { id: 'SU-02-03-31', name: 'Ebae' },
                { id: 'SU-02-03-32', name: 'Evindissi' },
                { id: 'SU-02-03-33', name: 'Mekomo' },
                { id: 'SU-02-03-34', name: 'Mvoman' },
                { id: 'SU-02-03-35', name: 'Nko\'Adjap1' },
                { id: 'SU-02-03-36', name: 'Nko\'Adjap 2' },
                { id: 'SU-02-03-37', name: 'Nloupessa Yemong' },
                { id: 'SU-02-03-38', name: 'Okpweng' },
                { id: 'SU-02-03-39', name: 'Assok' },
                { id: 'SU-02-03-40', name: 'Mekok 1' },
                { id: 'SU-02-03-41', name: 'Mekok 2' },
                { id: 'SU-02-03-42', name: 'Adjap 2' },
                { id: 'SU-02-03-43', name: 'Mevous' },
                { id: 'SU-02-03-44', name: 'Meyos' },
                { id: 'SU-02-03-45', name: 'Ebomam 2' },
                { id: 'SU-02-03-46', name: 'Adjap 1' },
                { id: 'SU-02-03-47', name: 'Afanengong Yessok' },
                { id: 'SU-02-03-48', name: 'Akok' },
                { id: 'SU-02-03-49', name: 'Ako\'Okas' },
                { id: 'SU-02-03-50', name: 'Bikpwae' },
                { id: 'SU-02-03-51', name: 'Eyek' },
                { id: 'SU-02-03-52', name: 'Ma\'Amezam' },
                { id: 'SU-02-03-53', name: 'Mbilntangan' },
                { id: 'SU-02-03-54', name: 'Minkok' },
                { id: 'SU-02-03-55', name: 'Minto' },
                { id: 'SU-02-03-56', name: 'Nkolandom' },
                { id: 'SU-02-03-57', name: 'Nkolmvone' },
                { id: 'SU-02-03-58', name: 'Nkondongo' },
                { id: 'SU-02-03-59', name: 'Nkpwaebae' },
                { id: 'SU-02-03-60', name: 'Vema' },
                { id: 'SU-02-03-61', name: 'Enguep-Anyou' },
                { id: 'SU-02-03-62', name: 'Bikpwaé' },
                { id: 'SU-02-03-63', name: 'Ebolakoun' },
                { id: 'SU-02-03-64', name: 'Mbako\'O' },
                { id: 'SU-02-03-65', name: 'Metykpwale-Yeminsem' },
                { id: 'SU-02-03-66', name: 'Meyos' },
                { id: 'SU-02-03-67', name: 'Mvam-Essakoe' },
                { id: 'SU-02-03-68', name: 'Ndjafop' },
                { id: 'SU-02-03-69', name: 'Ngalane III' },
                { id: 'SU-02-03-70', name: 'Mbilbekon' },
                { id: 'SU-02-03-71', name: 'Enongal-Bulu' },
                { id: 'SU-02-03-72', name: 'Mvii-Nord 1' },
                { id: 'SU-02-03-73', name: 'About' },
                { id: 'SU-02-03-74', name: 'Bissok' },
                { id: 'SU-02-03-75', name: 'Bityili 1' },
                { id: 'SU-02-03-76', name: 'Bityili 2' },
                { id: 'SU-02-03-77', name: 'Bityili 3' },
                { id: 'SU-02-03-78', name: 'Bous' },
                { id: 'SU-02-03-79', name: 'Essinguili' },
                { id: 'SU-02-03-80', name: 'Mekalat-Biyeng' },
                { id: 'SU-02-03-81', name: 'Mekalat-Yemveng' },
                { id: 'SU-02-03-82', name: 'Minkok' },
                { id: 'SU-02-03-83', name: 'Ngoto 2' },
                { id: 'SU-02-03-84', name: 'Abomvomba' },
                { id: 'SU-02-03-85', name: 'Aloum 1' },
                { id: 'SU-02-03-86', name: 'Aloum 2' },
                { id: 'SU-02-03-87', name: 'Avelezok' },
                { id: 'SU-02-03-88', name: 'Ekowong' },
                { id: 'SU-02-03-89', name: 'Elone' },
                { id: 'SU-02-03-90', name: 'Foulassi' },
                { id: 'SU-02-03-91', name: 'Foulassi 2' },
                { id: 'SU-02-03-92', name: 'Mefo' },
                { id: 'SU-02-03-93', name: 'Mfinda' },
                { id: 'SU-02-03-94', name: 'Nkolenyeng-Yemvang' },
                { id: 'SU-02-03-95', name: 'Nkoloveng' },
                { id: 'SU-02-03-96', name: 'Nkon' },
                { id: 'SU-02-03-97', name: 'Nnelefooup' },
                { id: 'SU-02-03-98', name: 'Onoyong' },
                { id: 'SU-02-03-99', name: 'Sijakon' },
                { id: 'SU-02-03-100', name: 'Ngone' },
                { id: 'SU-02-03-101', name: 'Biton' }
              ]
            },
            {
              id: 'SU-02-05',
              name: 'Efoulan',
              villages: [
                { id: 'SU-02-05-01', name: 'Efoulan' },
                { id: 'SU-02-05-02', name: 'Mekalat' },
                { id: 'SU-02-05-03', name: 'Mvi\'ilimengale' },
                { id: 'SU-02-05-04', name: 'Mekoto-Jaman 1' },
                { id: 'SU-02-05-05', name: 'Akom Yévol' },
                { id: 'SU-02-05-06', name: 'Mbong' },
                { id: 'SU-02-05-07', name: 'Mintom' },
                { id: 'SU-02-05-08', name: 'Mvela Yévol' },
                { id: 'SU-02-05-09', name: 'Ndjantom' },
                { id: 'SU-02-05-10', name: 'Ngalane II' },
                { id: 'SU-02-05-11', name: 'Nko\'Adjap' },
                { id: 'SU-02-05-12', name: 'Mekoto-Jaman 2' },
                { id: 'SU-02-05-13', name: 'Aloum-Yemveng' },
                { id: 'SU-02-05-14', name: 'Angbwek' },
                { id: 'SU-02-05-15', name: 'Efoulane' },
                { id: 'SU-02-05-16', name: 'Mebem' },
                { id: 'SU-02-05-17', name: 'Mimbomingeal' },
                { id: 'SU-02-05-18', name: 'Ngat' },
                { id: 'SU-02-05-19', name: 'Tchangue' },
                { id: 'SU-02-05-20', name: 'Minkane' },
                { id: 'SU-02-05-21', name: 'Mekoto-Jaman 3' },
                { id: 'SU-02-05-22', name: 'Bikouba' },
                { id: 'SU-02-05-23', name: 'Bongolo' },
                { id: 'SU-02-05-24', name: 'Elone' },
                { id: 'SU-02-05-25', name: 'Mebandé' },
                { id: 'SU-02-05-26', name: 'Melangue Biyeng' },
                { id: 'SU-02-05-27', name: 'Mengalé' },
                { id: 'SU-02-05-28', name: 'Nyazo\'O' },
                { id: 'SU-02-05-29', name: 'Ondong-Adjap' },
                { id: 'SU-02-05-30', name: 'Ngonebok Abo\'O Ntomba' },
                { id: 'SU-02-05-31', name: 'Abo\'O Ntomba' },
                { id: 'SU-02-05-32', name: 'Adjap-Essawo' },
                { id: 'SU-02-05-33', name: 'Binyina' },
                { id: 'SU-02-05-34', name: 'Ebom-Essawo' },
                { id: 'SU-02-05-35', name: 'Engomba' },
                { id: 'SU-02-05-36', name: 'Kalate-Aba\'A' },
                { id: 'SU-02-05-37', name: 'Ma\'Amenyin-Essawo' },
                { id: 'SU-02-05-38', name: 'Mekalat-Essawo' },
                { id: 'SU-02-05-39', name: 'Melane' },
                { id: 'SU-02-05-40', name: 'Ngonebok' },
                { id: 'SU-02-05-41', name: 'Mekok' },
                { id: 'SU-02-05-42', name: 'Nkoutou' },
                { id: 'SU-02-05-43', name: 'Mengalé' },
                { id: 'SU-02-05-44', name: 'Mfala' },
                { id: 'SU-02-05-45', name: 'Nko\'Ekouk' },
                { id: 'SU-02-05-46', name: 'Koungoulou-Essawo' }
              ]
            },
            {
              id: 'SU-02-06',
              name: 'Mengong',
              villages: [
                { id: 'SU-02-06-01', name: 'Mengong' },
                { id: 'SU-02-06-02', name: 'Mekomo' },
                { id: 'SU-02-06-03', name: 'Nkolemveng' },
                { id: 'SU-02-06-04', name: 'Mengong Ville' },
                { id: 'SU-02-06-05', name: 'Bulu Nord' },
                { id: 'SU-02-06-06', name: 'Abiete' },
                { id: 'SU-02-06-07', name: 'Doum' },
                { id: 'SU-02-06-08', name: 'Ebap' },
                { id: 'SU-02-06-09', name: 'Ebolobola' },
                { id: 'SU-02-06-10', name: 'Efot' },
                { id: 'SU-02-06-11', name: 'Essessana' },
                { id: 'SU-02-06-12', name: 'Esso\'o Bengah' },
                { id: 'SU-02-06-13', name: 'Etondo' },
                { id: 'SU-02-06-14', name: 'Koungoulou' },
                { id: 'SU-02-06-15', name: 'Mekamevom' },
                { id: 'SU-02-06-16', name: 'Ngomessane I' },
                { id: 'SU-02-06-17', name: 'Ngomessane II' },
                { id: 'SU-02-06-18', name: 'Nko\'ovos II' },
                { id: 'SU-02-06-19', name: 'Nnemeyong II' },
                { id: 'SU-02-06-20', name: 'Ondondo' },
                { id: 'SU-02-06-21', name: 'Fale I' },
                { id: 'SU-02-06-22', name: 'Atoui' },
                { id: 'SU-02-06-23', name: 'Doungou' },
                { id: 'SU-02-06-24', name: 'Emanemvam' },
                { id: 'SU-02-06-25', name: 'Endam I' },
                { id: 'SU-02-06-26', name: 'Endam II' },
                { id: 'SU-02-06-27', name: 'Mvangue' },
                { id: 'SU-02-06-28', name: 'Nkolbengue' },
                { id: 'SU-02-06-29', name: 'Nyengue' },
                { id: 'SU-02-06-30', name: 'Fale II' },
                { id: 'SU-02-06-31', name: 'Aba Bita' },
                { id: 'SU-02-06-32', name: 'Ban-Hop' },
                { id: 'SU-02-06-33', name: 'Enyieng' },
                { id: 'SU-02-06-34', name: 'Loum' },
                { id: 'SU-02-06-35', name: 'Mefiep' },
                { id: 'SU-02-06-36', name: 'Ndeng' },
                { id: 'SU-02-06-37', name: 'Nkoléteto' },
                { id: 'SU-02-06-38', name: 'Nkolowon' },
                { id: 'SU-02-06-39', name: 'Nnemeyong III' },
                { id: 'SU-02-06-40', name: 'Yem' },
                { id: 'SU-02-06-41', name: 'MVII Nord' },
                { id: 'SU-02-06-42', name: 'Ando\'o' },
                { id: 'SU-02-06-43', name: 'Ma\'an Menyine' },
                { id: 'SU-02-06-44', name: 'Mboabang I' },
                { id: 'SU-02-06-45', name: 'Mboabang II' },
                { id: 'SU-02-06-46', name: 'Nguet-Yembong' },
                { id: 'SU-02-06-47', name: 'Nkane' },
                { id: 'SU-02-06-48', name: 'MVII' },
                { id: 'SU-02-06-49', name: 'MVII Nord II' },
                { id: 'SU-02-06-50', name: 'Ato\'oveng I' },
                { id: 'SU-02-06-51', name: 'Ato\'oveng II' },
                { id: 'SU-02-06-52', name: 'Ngoulessaman' },
                { id: 'SU-02-06-53', name: 'MVII Sud' },
                { id: 'SU-02-06-54', name: 'Adjap-Yévol' },
                { id: 'SU-02-06-55', name: 'Ekouk' },
                { id: 'SU-02-06-56', name: 'Ke\'eke' },
                { id: 'SU-02-06-57', name: 'Mbondo' },
                { id: 'SU-02-06-58', name: 'Nnemeyong I' }
              ]
            },
            {
              id: 'SU-02-07',
              name: 'Mvangan',
              villages: [
                { id: 'SU-02-07-01', name: 'Mvangan' },
                { id: 'SU-02-07-02', name: 'Alen' },
                { id: 'SU-02-07-03', name: 'Nselang' },
                { id: 'SU-02-07-04', name: 'Mvangan Ville' },
                { id: 'SU-02-07-05', name: 'Bulu Est' },
                { id: 'SU-02-07-06', name: 'Ako\'obete' },
                { id: 'SU-02-07-07', name: 'Nkolenyeng I' },
                { id: 'SU-02-07-08', name: 'Ako\'obete' },
                { id: 'SU-02-07-09', name: 'Assok II' },
                { id: 'SU-02-07-10', name: 'Biboulman' },
                { id: 'SU-02-07-11', name: 'Eboman I' },
                { id: 'SU-02-07-12', name: 'Eboman II' },
                { id: 'SU-02-07-13', name: 'Endameyos' },
                { id: 'SU-02-07-14', name: 'Endengue' },
                { id: 'SU-02-07-15', name: 'Koungoulou' },
                { id: 'SU-02-07-16', name: 'Mebemenko' },
                { id: 'SU-02-07-17', name: 'Mintyene I' },
                { id: 'SU-02-07-18', name: 'Mintyene II' },
                { id: 'SU-02-07-19', name: 'Ngomebae' },
                { id: 'SU-02-07-20', name: 'Nkolenyeng I' },
                { id: 'SU-02-07-21', name: 'Nnezam' },
                { id: 'SU-02-07-22', name: 'Mvaezo' },
                { id: 'SU-02-07-23', name: 'Oyem I' },
                { id: 'SU-02-07-24', name: 'Oyem II' },
                { id: 'SU-02-07-25', name: 'Bulu Fang Sud' },
                { id: 'SU-02-07-26', name: 'Ababedomam' },
                { id: 'SU-02-07-27', name: 'Aboumezok' },
                { id: 'SU-02-07-28', name: 'Adjap' },
                { id: 'SU-02-07-29', name: 'Afan' },
                { id: 'SU-02-07-30', name: 'Akam' },
                { id: 'SU-02-07-31', name: 'Alen-Essaela\'an' },
                { id: 'SU-02-07-32', name: 'Alen-Yemekak' },
                { id: 'SU-02-07-33', name: 'Alombo' },
                { id: 'SU-02-07-34', name: 'Alotom' },
                { id: 'SU-02-07-35', name: 'Amvom' },
                { id: 'SU-02-07-36', name: 'Andjeck' },
                { id: 'SU-02-07-37', name: 'Assok I' },
                { id: 'SU-02-07-38', name: 'Atong' },
                { id: 'SU-02-07-39', name: 'Bikong' },
                { id: 'SU-02-07-40', name: 'Ekowong I' },
                { id: 'SU-02-07-41', name: 'Ekowong II' },
                { id: 'SU-02-07-42', name: 'Essam' },
                { id: 'SU-02-07-43', name: 'Etoubetoubandi' },
                { id: 'SU-02-07-44', name: 'Mbong' },
                { id: 'SU-02-07-45', name: 'Mebo\'o Ngoe' },
                { id: 'SU-02-07-46', name: 'Mebo\'o Yengap' },
                { id: 'SU-02-07-47', name: 'Mebosso' },
                { id: 'SU-02-07-48', name: 'Mengame I' },
                { id: 'SU-02-07-49', name: 'Mengame II' },
                { id: 'SU-02-07-50', name: 'Minkoumou' },
                { id: 'SU-02-07-51', name: 'Ndanga' },
                { id: 'SU-02-07-52', name: 'Ndick' },
                { id: 'SU-02-07-53', name: 'Nkengou' },
                { id: 'SU-02-07-54', name: 'Nkollenyeng II' },
                { id: 'SU-02-07-55', name: 'Nkomo' },
                { id: 'SU-02-07-56', name: 'Nnelefoup' },
                { id: 'SU-02-07-57', name: 'Zoebefam' },
                { id: 'SU-02-07-58', name: 'Aboelone' },
                { id: 'SU-02-07-59', name: 'Zangmeyong' }
              ]
            },
            {
              id: 'SU-02-08',
              name: 'Ngoulemakong',
              villages: [
                { id: 'SU-02-08-01', name: 'Ngoulemakong' },
                { id: 'SU-02-08-02', name: 'Binyina' },
                { id: 'SU-02-08-03', name: 'Mvoutesi' },
                { id: 'SU-02-08-04', name: 'Ngoulemakong Ville' },
                { id: 'SU-02-08-05', name: 'Mbama' },
                { id: 'SU-02-08-06', name: 'Minkongo (Mengong-Yat)' },
                { id: 'SU-02-08-07', name: 'Nkol-Messas' },
                { id: 'SU-02-08-08', name: 'Nkol-Yop' },
                { id: 'SU-02-08-09', name: 'Nnanga-Ezan' },
                { id: 'SU-02-08-10', name: 'Omang-Si' },
                { id: 'SU-02-08-11', name: 'Oyak' },
                { id: 'SU-02-08-12', name: 'Bane Centre' },
                { id: 'SU-02-08-13', name: 'Abiéte' },
                { id: 'SU-02-08-14', name: 'Banga' },
                { id: 'SU-02-08-15', name: 'Binyinyali' },
                { id: 'SU-02-08-16', name: 'Ebae' },
                { id: 'SU-02-08-17', name: 'Enamgal I' },
                { id: 'SU-02-08-18', name: 'Enamgal II' },
                { id: 'SU-02-08-19', name: 'Fone' },
                { id: 'SU-02-08-20', name: 'Mbeka\'a 2' },
                { id: 'SU-02-08-21', name: 'Nkol' },
                { id: 'SU-02-08-22', name: 'Ntoumba' },
                { id: 'SU-02-08-23', name: 'Yop' },
                { id: 'SU-02-08-24', name: 'Bane Ouest' },
                { id: 'SU-02-08-25', name: 'Doumou-Ola' },
                { id: 'SU-02-08-26', name: 'Ekowondo' },
                { id: 'SU-02-08-27', name: 'Essingang' },
                { id: 'SU-02-08-28', name: 'Mbeka\'a 1' },
                { id: 'SU-02-08-29', name: 'Mbeng' },
                { id: 'SU-02-08-30', name: 'Mekom' },
                { id: 'SU-02-08-31', name: 'Mengbwa' },
                { id: 'SU-02-08-32', name: 'Messok 1' },
                { id: 'SU-02-08-33', name: 'Messok 2' },
                { id: 'SU-02-08-34', name: 'Mva\'a Medjap-Bane' },
                { id: 'SU-02-08-35', name: 'Ngock' },
                { id: 'SU-02-08-36', name: 'Nnemeyong' },
                { id: 'SU-02-08-37', name: 'Obang II' },
                { id: 'SU-02-08-38', name: 'Ossofeme' },
                { id: 'SU-02-08-39', name: 'Oveng Otoloa' },
                { id: 'SU-02-08-40', name: 'Soumou' },
                { id: 'SU-02-08-41', name: 'Ekombitie' },
                { id: 'SU-02-08-42', name: 'Fong' },
                { id: 'SU-02-08-43', name: 'Akoa\'Atala' },
                { id: 'SU-02-08-44', name: 'Alom' },
                { id: 'SU-02-08-45', name: 'Assam' },
                { id: 'SU-02-08-46', name: 'Bikop' },
                { id: 'SU-02-08-47', name: 'Bityo\'Omam' },
                { id: 'SU-02-08-48', name: 'Doum Carrefour' },
                { id: 'SU-02-08-49', name: 'Doum Chefferie' },
                { id: 'SU-02-08-50', name: 'Ebolboum' },
                { id: 'SU-02-08-51', name: 'Ebote Nkoul' },
                { id: 'SU-02-08-52', name: 'Elone' },
                { id: 'SU-02-08-53', name: 'Kouma' },
                { id: 'SU-02-08-54', name: 'Minkok' },
                { id: 'SU-02-08-55', name: 'Minlamizibi' },
                { id: 'SU-02-08-56', name: 'Mva\'a Medjap-Fong' },
                { id: 'SU-02-08-57', name: 'Ndzafom' },
                { id: 'SU-02-08-58', name: 'Nkoumadjap 1' },
                { id: 'SU-02-08-59', name: 'Nlang-Yop' },
                { id: 'SU-02-08-60', name: 'Nyamvende' },
                { id: 'SU-02-08-61', name: 'Ongongo' },
                { id: 'SU-02-08-62', name: 'Oyak-Fong' },
                { id: 'SU-02-08-63', name: 'Ebae' }
              ]
            }
          ]
        },
        {
          id: 'SU-03',
          name: 'Ocean',
          arrondissements: [
            {
              id: 'SU-03-01',
              name: 'Akom II',
              villages: [
                { id: 'SU-03-01-01', name: 'Akom II' },
                { id: 'SU-03-01-02', name: 'Bipindi' },
                { id: 'SU-03-01-03', name: 'Efoulan' },
                { id: 'SU-03-01-04', name: 'Akom II Ville' },
                { id: 'SU-03-01-05', name: 'Ekowong' },
                { id: 'SU-03-01-06', name: 'Ndageng' },
                { id: 'SU-03-01-07', name: 'Bulu Centre' },
                { id: 'SU-03-01-08', name: 'Akok' },
                { id: 'SU-03-01-09', name: 'Akom II Village' },
                { id: 'SU-03-01-10', name: 'Assok 1' },
                { id: 'SU-03-01-11', name: 'Biboulemam' },
                { id: 'SU-03-01-12', name: 'Ebemvok' },
                { id: 'SU-03-01-13', name: 'Efoulan I' },
                { id: 'SU-03-01-14', name: 'Efoulan II' },
                { id: 'SU-03-01-15', name: 'Elon' },
                { id: 'SU-03-01-16', name: 'Fenda' },
                { id: 'SU-03-01-17', name: 'Mbanga' },
                { id: 'SU-03-01-18', name: 'Ndjabilobe' },
                { id: 'SU-03-01-19', name: 'Nkong-Mekak' },
                { id: 'SU-03-01-20', name: 'Nko\'o Ngop' },
                { id: 'SU-03-01-21', name: 'Nlomoto' },
                { id: 'SU-03-01-22', name: 'Nnemeyong' },
                { id: 'SU-03-01-23', name: 'Nyabitande' },
                { id: 'SU-03-01-24', name: 'Bulu Nord' },
                { id: 'SU-03-01-25', name: 'Abiete' },
                { id: 'SU-03-01-26', name: 'Bibindi' },
                { id: 'SU-03-01-27', name: 'Bibole' },
                { id: 'SU-03-01-28', name: 'Malomba' },
                { id: 'SU-03-01-29', name: 'Mvie' },
                { id: 'SU-03-01-30', name: 'Nlonkeng' },
                { id: 'SU-03-01-31', name: 'Toko' },
                { id: 'SU-03-01-32', name: 'Tyengue' }
              ]
            },
            {
              id: 'SU-03-02',
              name: 'Niete',
              villages: [
                { id: 'SU-03-02-01', name: 'Niete' },
                { id: 'SU-03-02-02', name: 'Adjap' },
                { id: 'SU-03-02-03', name: 'Bidou III' },
                { id: 'SU-03-02-04', name: 'Niete Ville' },
                { id: 'SU-03-02-05', name: 'Village 1' },
                { id: 'SU-03-02-06', name: 'Village 2' },
                { id: 'SU-03-02-07', name: 'Bulu-Sud' },
                { id: 'SU-03-02-08', name: 'Adjap' },
                { id: 'SU-03-02-09', name: 'Afan Oveng' },
                { id: 'SU-03-02-10', name: 'Akom 1' },
                { id: 'SU-03-02-11', name: 'Bidou 3' },
                { id: 'SU-03-02-12', name: 'Bifa' },
                { id: 'SU-03-02-13', name: 'Nkolembonda' },
                { id: 'SU-03-02-14', name: 'Nko\'olong' },
                { id: 'SU-03-02-15', name: 'Nlozok' },
                { id: 'SU-03-02-16', name: 'Zingui' },
                { id: 'SU-03-02-17', name: 'Hévécam' },
                { id: 'SU-03-02-18', name: 'Ngog' },
                { id: 'SU-03-02-19', name: 'Village 10' },
                { id: 'SU-03-02-20', name: 'Village 11' },
                { id: 'SU-03-02-21', name: 'Village 12' },
                { id: 'SU-03-02-22', name: 'Village 13' },
                { id: 'SU-03-02-23', name: 'Village 14' },
                { id: 'SU-03-02-24', name: 'Village 15' },
                { id: 'SU-03-02-25', name: 'Village 3' },
                { id: 'SU-03-02-26', name: 'Village 4' },
                { id: 'SU-03-02-27', name: 'Village 5' },
                { id: 'SU-03-02-28', name: 'Village 6' },
                { id: 'SU-03-02-29', name: 'Village 7 Est' },
                { id: 'SU-03-02-30', name: 'Village 7 Ouest' },
                { id: 'SU-03-02-31', name: 'Village 8' },
                { id: 'SU-03-02-32', name: 'Village 9' },
                { id: 'SU-03-02-33', name: 'Village Hôpital' },
                { id: 'SU-03-02-34', name: 'Village 16' }
              ]
            },
            {
              id: 'SU-03-03',
              name: 'Bipindi',
              villages: [
                { id: 'SU-03-03-01', name: 'Bipindi' },
                { id: 'SU-03-03-02', name: 'Bidjouka' },
                { id: 'SU-03-03-03', name: 'Lambi' },
                { id: 'SU-03-03-04', name: 'Bipindi Ville' },
                { id: 'SU-03-03-05', name: 'Bipindi-Centre' },
                { id: 'SU-03-03-06', name: 'Madagascar' },
                { id: 'SU-03-03-07', name: 'Bassa' },
                { id: 'SU-03-03-08', name: 'Memel I' },
                { id: 'SU-03-03-09', name: 'Memel II' },
                { id: 'SU-03-03-10', name: 'Moungue' },
                { id: 'SU-03-03-11', name: 'Bipindi-Village' },
                { id: 'SU-03-03-12', name: 'Evouzok' },
                { id: 'SU-03-03-13', name: 'Atog-Boga' },
                { id: 'SU-03-03-14', name: 'Kpwa Nkoutou' },
                { id: 'SU-03-03-15', name: 'Melen' },
                { id: 'SU-03-03-16', name: 'Melondo' },
                { id: 'SU-03-03-17', name: 'Mimbamela' },
                { id: 'SU-03-03-18', name: 'Mvondo' },
                { id: 'SU-03-03-19', name: 'Nsola' },
                { id: 'SU-03-03-20', name: 'Ngoumba Sud' },
                { id: 'SU-03-03-21', name: 'Bidjouka' },
                { id: 'SU-03-03-22', name: 'Bifoum' },
                { id: 'SU-03-03-23', name: 'Lambi' },
                { id: 'SU-03-03-24', name: 'Ngoumba-Fang' },
                { id: 'SU-03-03-25', name: 'Assok' },
                { id: 'SU-03-03-26', name: 'Bongouana' },
                { id: 'SU-03-03-27', name: 'Ebimimbang' },
                { id: 'SU-03-03-28', name: 'Grand-Zambi' },
                { id: 'SU-03-03-29', name: 'Kouambo' },
                { id: 'SU-03-03-30', name: 'Madoungou' },
                { id: 'SU-03-03-31', name: 'Mimfombo' },
                { id: 'SU-03-03-32', name: 'Ndtoua' },
                { id: 'SU-03-03-33', name: 'Nyaminkom' },
                { id: 'SU-03-03-34', name: 'Petit-Zambi' },
                { id: 'SU-03-03-35', name: 'Tyango' },
                { id: 'SU-03-03-36', name: 'Villages Autonomes' },
                { id: 'SU-03-03-37', name: 'Melombo' },
                { id: 'SU-03-03-38', name: 'Song Mahi' }
              ]
            },
            {
              id: 'SU-03-04',
              name: 'Campo',
              villages: [
                { id: 'SU-03-04-01', name: 'Campo' },
                { id: 'SU-03-04-02', name: 'Ipono' },
                { id: 'SU-03-04-03', name: 'Nazareth' },
                { id: 'SU-03-04-04', name: 'Campo Ville' },
                { id: 'SU-03-04-05', name: 'Bekombe' },
                { id: 'SU-03-04-06', name: 'Centre-Ville' },
                { id: 'SU-03-04-07', name: 'Château' },
                { id: 'SU-03-04-08', name: 'Doum-Assi' },
                { id: 'SU-03-04-09', name: 'Mintom-Ville' },
                { id: 'SU-03-04-10', name: 'Paris-Soir' },
                { id: 'SU-03-04-11', name: 'Tondé Fom' },
                { id: 'SU-03-04-12', name: 'Campo-Beach' },
                { id: 'SU-03-04-13', name: 'Mvae' },
                { id: 'SU-03-04-14', name: 'Afan' },
                { id: 'SU-03-04-15', name: 'Akak' },
                { id: 'SU-03-04-16', name: 'Assok' },
                { id: 'SU-03-04-17', name: 'Doum-Essambenga' },
                { id: 'SU-03-04-18', name: 'Doum-Essamendjang' },
                { id: 'SU-03-04-19', name: 'Ebianemeyong' },
                { id: 'SU-03-04-20', name: 'Ipono' },
                { id: 'SU-03-04-21', name: 'Itonde-Fang' },
                { id: 'SU-03-04-22', name: 'MabioGo' },
                { id: 'SU-03-04-23', name: 'Mintom' },
                { id: 'SU-03-04-24', name: 'Nazareth' },
                { id: 'SU-03-04-25', name: 'Nkoadjap' },
                { id: 'SU-03-04-26', name: 'Nkoelon' },
                { id: 'SU-03-04-27', name: 'Malaba' },
                { id: 'SU-03-04-28', name: 'Yassa' },
                { id: 'SU-03-04-29', name: 'Bouandjo' },
                { id: 'SU-03-04-30', name: 'Ebodje' },
                { id: 'SU-03-04-31', name: 'Itonde Yassa' },
                { id: 'SU-03-04-32', name: 'Mbendji' }
              ]
            },
            {
              id: 'SU-03-05',
              name: 'Kribi I',
              villages: [
                { id: 'SU-03-05-01', name: 'Kribi I' },
                { id: 'SU-03-05-02', name: 'Dombe' },
                { id: 'SU-03-05-03', name: 'Mpalla' },
                { id: 'SU-03-05-04', name: 'Kribi Ville' },
                { id: 'SU-03-05-05', name: 'Bongandoue' },
                { id: 'SU-03-05-06', name: 'Mboamanga' },
                { id: 'SU-03-05-07', name: 'Mokolo' },
                { id: 'SU-03-05-08', name: 'Mpoangou' },
                { id: 'SU-03-05-09', name: 'New Town 1' },
                { id: 'SU-03-05-10', name: 'Petit-Paris' },
                { id: 'SU-03-05-11', name: 'Massaka' },
                { id: 'SU-03-05-12', name: 'Talla' },
                { id: 'SU-03-05-13', name: 'Zaire' },
                { id: 'SU-03-05-14', name: 'Batanga Sud' },
                { id: 'SU-03-05-15', name: 'Bwambe' },
                { id: 'SU-03-05-16', name: 'Eboundja I' },
                { id: 'SU-03-05-17', name: 'Eboundja II' },
                { id: 'SU-03-05-18', name: 'Louma' },
                { id: 'SU-03-05-19', name: 'Bongahele' },
                { id: 'SU-03-05-20', name: 'Lobe' },
                { id: 'SU-03-05-21', name: 'Lolabe' },
                { id: 'SU-03-05-22', name: 'Lende Dibe' },
                { id: 'SU-03-05-23', name: 'Mabi Sud' },
                { id: 'SU-03-05-24', name: 'Ebome' },
                { id: 'SU-03-05-25', name: 'Lende Aviation' },
                { id: 'SU-03-05-26', name: 'Mbeka\'a' }
              ]
            },
            {
              id: 'SU-03-06',
              name: 'Kribi II',
              villages: [
                { id: 'SU-03-06-01', name: 'Kribi II' },
                { id: 'SU-03-06-02', name: 'Grand Batanga' },
                { id: 'SU-03-06-03', name: 'Lolabe' },
                { id: 'SU-03-06-04', name: 'Kribi Ville' },
                { id: 'SU-03-06-05', name: 'Afan Mabe' },
                { id: 'SU-03-06-06', name: 'Dombe' },
                { id: 'SU-03-06-07', name: 'Ebouyoe' },
                { id: 'SU-03-06-08', name: 'Elabe' },
                { id: 'SU-03-06-09', name: 'Mpalla' },
                { id: 'SU-03-06-10', name: 'Mpolongwe I' },
                { id: 'SU-03-06-11', name: 'Mpolongwe II' },
                { id: 'SU-03-06-12', name: 'Ngoe' },
                { id: 'SU-03-06-13', name: 'Nziou' },
                { id: 'SU-03-06-14', name: 'Wamie' },
                { id: 'SU-03-06-15', name: 'New Town 2' },
                { id: 'SU-03-06-16', name: 'Batanga Nord' },
                { id: 'SU-03-06-17', name: 'Bebambwe 1' },
                { id: 'SU-03-06-18', name: 'Bebambwe 2' },
                { id: 'SU-03-06-19', name: 'Londji 1' },
                { id: 'SU-03-06-20', name: 'Londji 2' },
                { id: 'SU-03-06-21', name: 'Mabi Nord' },
                { id: 'SU-03-06-22', name: 'Bikondo' },
                { id: 'SU-03-06-23', name: 'Bilolo' }
              ]
            },
            {
              id: 'SU-03-07',
              name: 'Lokoundje',
              villages: [
                { id: 'SU-03-07-01', name: 'Lokoundje' },
                { id: 'SU-03-07-02', name: 'Bipaga' },
                { id: 'SU-03-07-03', name: 'Ngoyang' },
                { id: 'SU-03-07-04', name: 'Bakoko-Bassa' },
                { id: 'SU-03-07-05', name: 'Bella' },
                { id: 'SU-03-07-06', name: 'Bonguen' },
                { id: 'SU-03-07-07', name: 'Dehane' },
                { id: 'SU-03-07-08', name: 'Ebondi' },
                { id: 'SU-03-07-09', name: 'Elogbatindi' },
                { id: 'SU-03-07-10', name: 'Gwap' },
                { id: 'SU-03-07-11', name: 'Mboke' },
                { id: 'SU-03-07-12', name: 'Nkolio' },
                { id: 'SU-03-07-13', name: 'Yalpenda' },
                { id: 'SU-03-07-14', name: 'Batanga Nord' },
                { id: 'SU-03-07-15', name: 'Behondo' },
                { id: 'SU-03-07-16', name: 'Dikoube' },
                { id: 'SU-03-07-17', name: 'Donenda' },
                { id: 'SU-03-07-18', name: 'Evouzok' },
                { id: 'SU-03-07-19', name: 'Bipaga 1' },
                { id: 'SU-03-07-20', name: 'Bipaga 2' },
                { id: 'SU-03-07-21', name: 'Bivouba' },
                { id: 'SU-03-07-22', name: 'Ebea' },
                { id: 'SU-03-07-23', name: 'Fifinda 1' },
                { id: 'SU-03-07-24', name: 'Fifinda 2' },
                { id: 'SU-03-07-25', name: 'Pama' },
                { id: 'SU-03-07-26', name: 'Mbebe' },
                { id: 'SU-03-07-27', name: 'Groupement Fang' },
                { id: 'SU-03-07-28', name: 'Bandevouri' },
                { id: 'SU-03-07-29', name: 'Bidou 1' },
                { id: 'SU-03-07-30', name: 'Bissiang' },
                { id: 'SU-03-07-31', name: 'Makoure 1' },
                { id: 'SU-03-07-32', name: 'Makoure 2' },
                { id: 'SU-03-07-33', name: 'Mabi Sud' },
                { id: 'SU-03-07-34', name: 'Bidou 2' },
                { id: 'SU-03-07-35', name: 'Edoungagomo' },
                { id: 'SU-03-07-36', name: 'Mabenanga' },
                { id: 'SU-03-07-37', name: 'Ndoumale' },
                { id: 'SU-03-07-38', name: 'Poungo' },
                { id: 'SU-03-07-39', name: 'Socapalm' },
                { id: 'SU-03-07-40', name: 'Village I' },
                { id: 'SU-03-07-41', name: 'Village II' },
                { id: 'SU-03-07-42', name: 'Village III' },
                { id: 'SU-03-07-43', name: 'Village 4' },
                { id: 'SU-03-07-44', name: 'Village 5' },
                { id: 'SU-03-07-45', name: 'Camp Sav' },
                { id: 'SU-03-07-46', name: 'Camp-Cadres' },
                { id: 'SU-03-07-47', name: 'Camp-Chinois' },
                { id: 'SU-03-07-48', name: 'Camp-Usine' },
                { id: 'SU-03-07-49', name: 'Kilombo I' },
                { id: 'SU-03-07-50', name: 'Kilombo II' },
                { id: 'SU-03-07-51', name: 'Camp Wijma' }
              ]
            },
            {
              id: 'SU-03-08',
              name: 'Lolodorf',
              villages: [
                { id: 'SU-03-08-01', name: 'Lolodorf' },
                { id: 'SU-03-08-02', name: 'Bikalla' },
                { id: 'SU-03-08-03', name: 'Ngovayang' },
                { id: 'SU-03-08-04', name: 'Administratif' },
                { id: 'SU-03-08-05', name: 'Bamiléké' },
                { id: 'SU-03-08-06', name: 'Beti' },
                { id: 'SU-03-08-07', name: 'Big Bally' },
                { id: 'SU-03-08-08', name: 'Haoussa' },
                { id: 'SU-03-08-09', name: 'Limanzouang' },
                { id: 'SU-03-08-10', name: 'New-Town' },
                { id: 'SU-03-08-11', name: 'Sabally' },
                { id: 'SU-03-08-12', name: 'Fang' },
                { id: 'SU-03-08-13', name: 'Bibia' },
                { id: 'SU-03-08-14', name: 'Mangouma' },
                { id: 'SU-03-08-15', name: 'Ngovayang 1' },
                { id: 'SU-03-08-16', name: 'Ngovayang 2' },
                { id: 'SU-03-08-17', name: 'Ngovayang 3' },
                { id: 'SU-03-08-18', name: 'Ngoué' },
                { id: 'SU-03-08-19', name: 'Bibondi' },
                { id: 'SU-03-08-20', name: 'Bikoka' },
                { id: 'SU-03-08-21', name: 'Ngoumba Centre' },
                { id: 'SU-03-08-22', name: 'Kaba' },
                { id: 'SU-03-08-23', name: 'Koumbizik' },
                { id: 'SU-03-08-24', name: 'Madong 1' },
                { id: 'SU-03-08-25', name: 'Madong 2' },
                { id: 'SU-03-08-26', name: 'Mbango Bitouer' },
                { id: 'SU-03-08-27', name: 'Mbango-Boulou' },
                { id: 'SU-03-08-28', name: 'Mbango-Ngoumba' },
                { id: 'SU-03-08-29', name: 'Melangué' },
                { id: 'SU-03-08-30', name: 'Ngoyang' },
                { id: 'SU-03-08-31', name: 'Nkouambpoer 1' },
                { id: 'SU-03-08-32', name: 'Nkouambpoer 2' },
                { id: 'SU-03-08-33', name: 'Mill' },
                { id: 'SU-03-08-34', name: 'Ngoumba-Sud' },
                { id: 'SU-03-08-35', name: 'Bikalla' },
                { id: 'SU-03-08-36', name: 'Bingambo' },
                { id: 'SU-03-08-37', name: 'Mbikiliki' },
                { id: 'SU-03-08-38', name: 'Mougue' },
                { id: 'SU-03-08-39', name: 'Mville' }

              ]
            },
            {
              id: 'SU-03-09',
              name: 'Mvengue',
              villages: [
                { id: 'SU-03-09-01', name: 'Mvengue' },
                { id: 'SU-03-09-02', name: 'Bella' },
                { id: 'SU-03-09-03', name: 'Nkoutou' },
                { id: 'SU-03-09-04', name: 'Mvengue Ville' },
                { id: 'SU-03-09-05', name: 'Mvengue Centre' },
                { id: 'SU-03-09-06', name: 'Enoah Yanda Centre' },
                { id: 'SU-03-09-07', name: 'Abam' },
                { id: 'SU-03-09-08', name: 'Akié' },
                { id: 'SU-03-09-09', name: 'Ebom Centre' },
                { id: 'SU-03-09-10', name: 'Ebom I' },
                { id: 'SU-03-09-11', name: 'Ebom II' },
                { id: 'SU-03-09-12', name: 'Ka\'an' },
                { id: 'SU-03-09-13', name: 'Koulounganga I' },
                { id: 'SU-03-09-14', name: 'Koulounganga II' },
                { id: 'SU-03-09-15', name: 'Melen' },
                { id: 'SU-03-09-16', name: 'Mvengue II' },
                { id: 'SU-03-09-17', name: 'Mvengue III' },
                { id: 'SU-03-09-18', name: 'Mvengue Medjobobo' },
                { id: 'SU-03-09-19', name: 'Mvengue Nsam' },
                { id: 'SU-03-09-20', name: 'Nkolatom' },
                { id: 'SU-03-09-21', name: 'Nyamfende' },
                { id: 'SU-03-09-22', name: 'Enoah Yanda Nord' },
                { id: 'SU-03-09-23', name: 'Bembe' },
                { id: 'SU-03-09-24', name: 'Okoga' },
                { id: 'SU-03-09-25', name: 'Wom I' },
                { id: 'SU-03-09-26', name: 'Wom II' },
                { id: 'SU-03-09-27', name: 'Enoah Yanda Ouest' },
                { id: 'SU-03-09-28', name: 'Akok Mvog Belinga' },
                { id: 'SU-03-09-29', name: 'Ating-Etom' },
                { id: 'SU-03-09-30', name: 'Atinzam' },
                { id: 'SU-03-09-31', name: 'Bikop' },
                { id: 'SU-03-09-32', name: 'Elon' },
                { id: 'SU-03-09-33', name: 'Mekom' },
                { id: 'SU-03-09-34', name: 'Menganda I' },
                { id: 'SU-03-09-35', name: 'Menganda II' },
                { id: 'SU-03-09-36', name: 'Minkougou' },
                { id: 'SU-03-09-37', name: 'Ndzibetono' },
                { id: 'SU-03-09-38', name: 'Nkoambe' },
                { id: 'SU-03-09-39', name: 'Nkolmendim II' },
                { id: 'SU-03-09-40', name: 'Nkolmending I' },
                { id: 'SU-03-09-41', name: 'Mvog Tsoung Mballa' },
                { id: 'SU-03-09-42', name: 'Adouman' },
                { id: 'SU-03-09-43', name: 'Akom' },
                { id: 'SU-03-09-44', name: 'Awonda' },
                { id: 'SU-03-09-45', name: 'Awonda II' },
                { id: 'SU-03-09-46', name: 'Bikoe 1' },
                { id: 'SU-03-09-47', name: 'Bikoe 2' },
                { id: 'SU-03-09-48', name: 'Bikoe SI' },
                { id: 'SU-03-09-49', name: 'Ebayege' },
                { id: 'SU-03-09-50', name: 'Melondo' },
                { id: 'SU-03-09-51', name: 'Minkan I' },
                { id: 'SU-03-09-52', name: 'Minkan II' },
                { id: 'SU-03-09-53', name: 'Nkoala\'a I' },
                { id: 'SU-03-09-54', name: 'Nkoala\'a II' }
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
                { id: 'SU-04-01-01', name: 'Ambam' },
                { id: 'SU-04-01-02', name: 'Meyo-Centre' },
                { id: 'SU-04-01-03', name: 'Nkong-Meyos' },
                { id: 'SU-04-01-04', name: 'Ambam Ville' },
                { id: 'SU-04-01-05', name: 'Afanéte 1' },
                { id: 'SU-04-01-06', name: 'Afanéte 2' },
                { id: 'SU-04-01-07', name: 'Aviation' },
                { id: 'SU-04-01-08', name: 'Briqueterie' },
                { id: 'SU-04-01-09', name: 'Melen-Si' },
                { id: 'SU-04-01-10', name: 'New-Bell 1' },
                { id: 'SU-04-01-11', name: 'New-Bell 2' },
                { id: 'SU-04-01-12', name: 'Nkol Etam' },
                { id: 'SU-04-01-13', name: 'Nkolambam' },
                { id: 'SU-04-01-14', name: 'Nsolé' },
                { id: 'SU-04-01-15', name: 'Mission Catholique' },
                { id: 'SU-04-01-16', name: 'Akoulezok' },
                { id: 'SU-04-01-17', name: 'Mvae Est' },
                { id: 'SU-04-01-18', name: 'Akam-Messi' },
                { id: 'SU-04-01-19', name: 'Akom-Bikak' },
                { id: 'SU-04-01-20', name: 'Akoulezok 2' },
                { id: 'SU-04-01-21', name: 'Bindameyos' },
                { id: 'SU-04-01-22', name: 'Ebozi 1' },
                { id: 'SU-04-01-23', name: 'Ebozi 2' },
                { id: 'SU-04-01-24', name: 'Mbamessaobam' },
                { id: 'SU-04-01-25', name: 'Medjimi' },
                { id: 'SU-04-01-26', name: 'Medjounou' },
                { id: 'SU-04-01-27', name: 'Minkok' },
                { id: 'SU-04-01-28', name: 'Ngom Essa Obam' },
                { id: 'SU-04-01-29', name: 'Nkolefoulan' },
                { id: 'SU-04-01-30', name: 'Nsakoua' },
                { id: 'SU-04-01-31', name: 'Nselang' },
                { id: 'SU-04-01-32', name: 'Tho I' },
                { id: 'SU-04-01-33', name: 'Yosma\'an' },
                { id: 'SU-04-01-34', name: 'Mvae Nord' },
                { id: 'SU-04-01-35', name: 'Abang Bethel' },
                { id: 'SU-04-01-36', name: 'Elon' },
                { id: 'SU-04-01-37', name: 'Engout-Adjap' },
                { id: 'SU-04-01-38', name: 'Mefoup' },
                { id: 'SU-04-01-39', name: 'Mindi-Mi-Oveng' },
                { id: 'SU-04-01-40', name: 'Nkol-Melen' },
                { id: 'SU-04-01-41', name: 'Nnezam' },
                { id: 'SU-04-01-42', name: 'Nyazanga' },
                { id: 'SU-04-01-43', name: 'Ntoumou Est' },
                { id: 'SU-04-01-44', name: 'Abang Minkok 1' },
                { id: 'SU-04-01-45', name: 'Akam-Bitam' },
                { id: 'SU-04-01-46', name: 'Akam-Bitam 2' },
                { id: 'SU-04-01-47', name: 'Assandjik' },
                { id: 'SU-04-01-48', name: 'Biléossi' },
                { id: 'SU-04-01-49', name: 'Kou\'ou-Si' },
                { id: 'SU-04-01-50', name: 'Mekaman' },
                { id: 'SU-04-01-51', name: 'Mekomo' },
                { id: 'SU-04-01-52', name: 'Mekomo 2' },
                { id: 'SU-04-01-53', name: 'Mengama' },
                { id: 'SU-04-01-54', name: 'Messi-Messi' },
                { id: 'SU-04-01-55', name: 'Minyin' },
                { id: 'SU-04-01-56', name: 'Minyin Chapelle' },
                { id: 'SU-04-01-57', name: 'Nkolekon' },
                { id: 'SU-04-01-58', name: 'Nlonon' },
                { id: 'SU-04-01-59', name: 'Ntoumou Nord' },
                { id: 'SU-04-01-60', name: 'Adjap' },
                { id: 'SU-04-01-61', name: 'Akak-Metom' },
                { id: 'SU-04-01-62', name: 'Akina' },
                { id: 'SU-04-01-63', name: 'Akonetye' },
                { id: 'SU-04-01-64', name: 'Ambam-Ayat' },
                { id: 'SU-04-01-65', name: 'Andom' },
                { id: 'SU-04-01-66', name: 'Biyi Eba' },
                { id: 'SU-04-01-67', name: 'Biyi Efack' },
                { id: 'SU-04-01-68', name: 'Ekoumedoum' },
                { id: 'SU-04-01-69', name: 'Konemekak' },
                { id: 'SU-04-01-70', name: 'Mekoé' },
                { id: 'SU-04-01-71', name: 'Mengomo' },
                { id: 'SU-04-01-72', name: 'Meyo-Centre' },
                { id: 'SU-04-01-73', name: 'Meyo-Elie' },
                { id: 'SU-04-01-74', name: 'Mfenadoum' },
                { id: 'SU-04-01-75', name: 'Ngom' },
                { id: 'SU-04-01-76', name: 'Nkan' },
                { id: 'SU-04-01-77', name: 'Nko\'ombé' },
                { id: 'SU-04-01-78', name: 'Nkotoveng' },
                { id: 'SU-04-01-79', name: 'Npkwa-Evole' },
                { id: 'SU-04-01-80', name: 'Nsessoun' },
                { id: 'SU-04-01-81', name: 'Oveng-Essakoram' },
                { id: 'SU-04-01-82', name: 'Zalom' },
                { id: 'SU-04-01-83', name: 'Ntoumou Sud' },
                { id: 'SU-04-01-84', name: 'Bilik Bi Yama' },
                { id: 'SU-04-01-85', name: 'Bilik Bitho' },
                { id: 'SU-04-01-86', name: 'Memvin' },
                { id: 'SU-04-01-87', name: 'Meyo Nyaka' },
                { id: 'SU-04-01-88', name: 'Minsele' },
                { id: 'SU-04-01-89', name: 'Ngang' },
                { id: 'SU-04-01-90', name: 'Nkoumekeke' },
                { id: 'SU-04-01-91', name: 'Nong' },
                { id: 'SU-04-01-92', name: 'Oveng' },
                { id: 'SU-04-01-93', name: 'Tho 2' },
                { id: 'SU-04-01-94', name: 'Yama' },
                { id: 'SU-04-01-95', name: 'Zaminkam' },
                { id: 'SU-04-01-96', name: 'Mfoul Okok' }
              ]
            },
            {
              id: 'SU-04-02',
              name: 'Ma\'an',
              villages: [
                { id: 'SU-04-02-01', name: 'Ma\'an' },
                { id: 'SU-04-02-02', name: 'Nyabizan' },
                { id: 'SU-04-02-03', name: 'Nnemeyong' },
                { id: 'SU-04-02-04', name: 'Ma\'an Ville' },
                { id: 'SU-04-02-05', name: 'Ma\'an Centre' },
                { id: 'SU-04-02-06', name: 'Boucle du Ntem 1' },
                { id: 'SU-04-02-07', name: 'Aya-Amang' },
                { id: 'SU-04-02-08', name: 'Aloum 1' },
                { id: 'SU-04-02-09', name: 'Evouzok' },
                { id: 'SU-04-02-10', name: 'Mekondom' },
                { id: 'SU-04-02-11', name: 'Melen' },
                { id: 'SU-04-02-12', name: 'Ngo\'o Mbang' },
                { id: 'SU-04-02-13', name: 'Nsengou' },
                { id: 'SU-04-02-14', name: 'Abang' },
                { id: 'SU-04-02-15', name: 'Boucle du Ntem 2' },
                { id: 'SU-04-02-16', name: 'Aloum 2' },
                { id: 'SU-04-02-17', name: 'Meyos 1' },
                { id: 'SU-04-02-18', name: 'Mvae-Ouest' },
                { id: 'SU-04-02-19', name: 'Abem' },
                { id: 'SU-04-02-20', name: 'Akom' },
                { id: 'SU-04-02-21', name: 'Alen 2' },
                { id: 'SU-04-02-22', name: 'Asseng' },
                { id: 'SU-04-02-23', name: 'Melen 2' },
                { id: 'SU-04-02-24', name: 'Nebito' },
                { id: 'SU-04-02-25', name: 'Nnemeyong 2' },
                { id: 'SU-04-02-26', name: 'Ntebe-Zok' },
                { id: 'SU-04-02-27', name: 'Nyabessang' },
                { id: 'SU-04-02-28', name: 'Tom' },
                { id: 'SU-04-02-29', name: 'Ntoumou Centre' },
                { id: 'SU-04-02-30', name: 'Afan' },
                { id: 'SU-04-02-31', name: 'Alen 1' },
                { id: 'SU-04-02-32', name: 'Angalé' },
                { id: 'SU-04-02-33', name: 'Anguiridjang' },
                { id: 'SU-04-02-34', name: 'Assam' },
                { id: 'SU-04-02-35', name: 'Bidjap' },
                { id: 'SU-04-02-36', name: 'Bindem' },
                { id: 'SU-04-02-37', name: 'Bitoto' },
                { id: 'SU-04-02-38', name: 'Biyan' },
                { id: 'SU-04-02-39', name: 'Ebolmbama Centre' },
                { id: 'SU-04-02-40', name: 'Ekéké' },
                { id: 'SU-04-02-41', name: 'Endendem' },
                { id: 'SU-04-02-42', name: 'Eves' },
                { id: 'SU-04-02-43', name: 'Evolé' },
                { id: 'SU-04-02-44', name: 'Evouma' },
                { id: 'SU-04-02-45', name: 'Ma\'an Village' },
                { id: 'SU-04-02-46', name: 'Mbenkomo' },
                { id: 'SU-04-02-47', name: 'Mebang' },
                { id: 'SU-04-02-48', name: 'Mebera' },
                { id: 'SU-04-02-49', name: 'Mekok' },
                { id: 'SU-04-02-50', name: 'Mekok-Mengon' },
                { id: 'SU-04-02-51', name: 'Messama I' },
                { id: 'SU-04-02-52', name: 'Messama II' },
                { id: 'SU-04-02-53', name: 'Messama III' },
                { id: 'SU-04-02-54', name: 'Metondo' },
                { id: 'SU-04-02-55', name: 'Meyo Ntem' },
                { id: 'SU-04-02-56', name: 'Meyos 2' },
                { id: 'SU-04-02-57', name: 'Mfoua' },
                { id: 'SU-04-02-58', name: 'Minkan' },
                { id: 'SU-04-02-59', name: 'Minkan Mengalé' },
                { id: 'SU-04-02-60', name: 'Mviilimengalé' },
                { id: 'SU-04-02-61', name: 'Ndjazeng' },
                { id: 'SU-04-02-62', name: 'Ngbwa Akom' },
                { id: 'SU-04-02-63', name: 'Nko\'ondo\'o' },
                { id: 'SU-04-02-64', name: 'Nsomessok' },
                { id: 'SU-04-02-65', name: 'Nyabibak' },
                { id: 'SU-04-02-66', name: 'Okong' },
                { id: 'SU-04-02-67', name: 'Son' },
                { id: 'SU-04-02-68', name: 'Tya\'assono' },
                { id: 'SU-04-02-69', name: 'Zouameyong' },
                { id: 'SU-04-02-70', name: 'Nnezam' }
              ]
            },
            {
              id: 'SU-04-03',
              name: 'Olamze',
              villages: [
                { id: 'SU-04-03-01', name: 'Olamze' },
                { id: 'SU-04-03-02', name: 'Mengama' },
                { id: 'SU-04-03-03', name: 'Mekomo' },
                { id: 'SU-04-03-04', name: 'Olamze Ville' },
                { id: 'SU-04-03-05', name: 'Mbedoum Si' },
                { id: 'SU-04-03-06', name: 'Olamze Village' },
                { id: 'SU-04-03-07', name: 'Olamze Centre' },
                { id: 'SU-04-03-08', name: 'Ntoumou Sud' },
                { id: 'SU-04-03-09', name: 'Ata\'a Ntem' },
                { id: 'SU-04-03-10', name: 'Bekue' },
                { id: 'SU-04-03-11', name: 'Bindoum' },
                { id: 'SU-04-03-12', name: 'Biyii' },
                { id: 'SU-04-03-13', name: 'Engolzok' },
                { id: 'SU-04-03-14', name: 'Eyinantoum' },
                { id: 'SU-04-03-15', name: 'Mbang' },
                { id: 'SU-04-03-16', name: 'Mbe' },
                { id: 'SU-04-03-17', name: 'Meka\'a Minkoumou' },
                { id: 'SU-04-03-18', name: 'Mekomengona I' },
                { id: 'SU-04-03-19', name: 'Mekomengona II' },
                { id: 'SU-04-03-20', name: 'Meko\'o Si I' },
                { id: 'SU-04-03-21', name: 'Meko\'o Si II' },
                { id: 'SU-04-03-22', name: 'Menguikom' },
                { id: 'SU-04-03-23', name: 'Meyo Carrefour' },
                { id: 'SU-04-03-24', name: 'Meyo Nkol Yat' },
                { id: 'SU-04-03-25', name: 'Meyo Wo' },
                { id: 'SU-04-03-26', name: 'Mindjo Koumou' },
                { id: 'SU-04-03-27', name: 'Obang' },
                { id: 'SU-04-03-28', name: 'Olang Amvila' },
                { id: 'SU-04-03-29', name: 'Olang Centre' },
                { id: 'SU-04-03-30', name: 'Olang Lae' },
                { id: 'SU-04-03-31', name: 'Olang Mfoumou' },
                { id: 'SU-04-03-32', name: 'Yos II' }
              ]
            },
            {
              id: 'SU-04-04',
              name: 'Kye-Ossi',
              villages: [
                { id: 'SU-04-04-01', name: 'Kye-Ossi' },
                { id: 'SU-04-04-02', name: 'Akombang' },
                { id: 'SU-04-04-03', name: 'Nkoetye' },
                { id: 'SU-04-04-04', name: 'Kye-Ossi Ville' },
                { id: 'SU-04-04-05', name: 'Adjou\'ou' },
                { id: 'SU-04-04-06', name: 'Akonangui' },
                { id: 'SU-04-04-07', name: 'Dama' },
                { id: 'SU-04-04-08', name: 'Ebengon I' },
                { id: 'SU-04-04-09', name: 'Ebengon II' },
                { id: 'SU-04-04-10', name: 'Fenete' },
                { id: 'SU-04-04-11', name: 'Kono Fonossi' },
                { id: 'SU-04-04-12', name: 'Mefoup' },
                { id: 'SU-04-04-13', name: 'Mekomo I' },
                { id: 'SU-04-04-14', name: 'Mekomo II' },
                { id: 'SU-04-04-15', name: 'Metet' },
                { id: 'SU-04-04-16', name: 'Meyo Nkoulou' },
                { id: 'SU-04-04-17', name: 'Minkomo' },
                { id: 'SU-04-04-18', name: 'Minyon' },
                { id: 'SU-04-04-19', name: 'Ngoazik' },
                { id: 'SU-04-04-20', name: 'Nkan' },
                { id: 'SU-04-04-21', name: 'Nsana' },
                { id: 'SU-04-04-22', name: 'Nsangbwanga' },
                { id: 'SU-04-04-23', name: 'Ongonzok' }
              ]
            }
          ]
        }
      ]
    }
  ];


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
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-medium text-gray-800">
              Informations sur la société
            </h2>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Previous form fields remain the same */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Dénomination social</label>
                  <input
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Numéro d'enregistrement fiscal</label>
                  <input
                    name="codeFiscal"
                    type="text"
                    value={formData.codeFiscal}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Numero de téléphone</label>
                  <input
                    name="phone"
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
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Forme juridique</label>
                  <input
                    name="formeJuridique"
                    type="text"
                    value={formData.formeJuridique}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Secteur d'activité</label>
                  <input
                    name="activite"
                    type="text"
                    value={formData.activite}
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
                {/* Nouveaux champs d'adressage */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Type de rue</label>
                  <select
                    name="streetType"
                    value={formData.streetType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Sélectionnez un type de voie</option>
                    <option value="Rue">Rue</option>
                    <option value="Avenue">Avenue</option>
                    <option value="Boulevard">Boulevard</option>
                    <option value="Route">Route</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Nom de la rue</label>
                  <input
                    name="streetName"
                    type="text"
                    value={formData.streetName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Entrez le nom de la voie"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Numéro de porte</label>
                  <input
                    name="doorNumber"
                    type="text"
                    value={formData.doorNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Entrez le numéro de porte"
                  />
                </div>
                {/* Procedure Selection */}
                <div className="space-y-2">
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
                      <option key={procedure.id} value={procedure.title}>{procedure.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Veuillez décrire votre demande..."
                />
              </div>
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => window.history.back()}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Retour
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Soumettre
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PublicSocietyInfo;