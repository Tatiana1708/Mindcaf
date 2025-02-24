export interface Employee {
  id: string;
  matricule: string;
  nom: string;
  dateNaissance: string;
  lieuNaissance: string;
  sexe: string;
  matrimoniale: string;
  diplome: string;
  contrat: string;
  statutPro: string;
  grade: string;
  corpsMetier: string;
  competences: string;
  infosSupp: string;
  position: string;
  service: Service;
  email: string;
  phone: string;
}

export interface Equipment {
  id: string;
  code:string;
  name: string;
  type: string;
  service: Service;
  status: 'available' | 'in-use' | 'maintenance';
  assignedTo?: string;
  nombre: string;
  dateInstall: string;
  etatBien: 'neuf'| 'vieux';
}

export interface Procedure {
  id: string;
  title: string;
  service: Service;
  steps: string[];
  lastUpdated: string;
}

export type Service = 
  | "Bureau du Courrier"
  | "Recette Départementale des Domaines"
  | "Conservation Foncière"
  | "Service Départemental des Domaines"
  | "Service Départemental des Affaires Foncières"
  | "Service Départemental du Patrimoine de l'État"
  | "Service Départemental du Cadastre"
  | "Autres services"
  | "Section public";

  enum ServiceMap {
    BUREAU_DU_COURRIER = "BUREAU_DU_COURRIER",
    RECETTE_DEPARTEMENTALE_DES_DOMAINES = "RECETTE_DEPARTEMENTALE_DES_DOMAINES",
    CONSERVATION_FONCIERE = "CONSERVATION_FONCIERE",
    SERVICE_DEPARTEMENTAL_DES_DOMAINES = "SERVICE_DEPARTEMENTAL_DES_DOMAINES",
    SERVICE_DEPARTEMENTAL_DES_AFFAIRES_FONCIERES = "SERVICE_DEPARTEMENTAL_DES_AFFAIRES_FONCIERES",
    SERVICE_DEPARTEMENTAL_DU_PATRIMOINE_DE_L_ETAT = "SERVICE_DEPARTEMENTAL_DU_PATRIMOINE_DE_L_ETAT",
    SERVICE_DEPARTEMENTAL_DU_CADASTRE = "SERVICE_DEPARTEMENTAL_DU_CADASTRE",
    AUTRES_SERVICES = "AUTRES_SERVICES",
    SECTION_PUBLIC = "SECTION_PUBLIC"
  }
  export interface User {
    id: string;
    username: string;
    email: string;
    password: string;
    role: string;
  }
  export type MailType = 'INCOMING' | 'OUTGOING';
  
  export interface Mail {
    id: string;
    type: MailType;
    subject: string;
    date: string;
    sender?: string;
    recipient?: string;
    assignedTo: string;
    department: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  }

  export interface AuthContextType {
    isAuthenticated: boolean;
    login: (token: string) => void;
    logout: () => void;
  }

  export interface Services {
    name: string;
    activities: string[];
    modules: string[];
    results: string[];
  }

  export interface LocationState {
    formData: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      department: string;
      requestType: string;
      description: string;
      region: string;
      adminDepartment: string;
      arrondissement: string;
      village: string;
    };
    procedure: Procedure;
  }
  
  export interface DocumentImage {
    file: File | null;
    preview: string;
    fileType: string;
    name?: string;
  }
  
  export interface ChecklistItem {
    checked: boolean;
    image: DocumentImage;
  }