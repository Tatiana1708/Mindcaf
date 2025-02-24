import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import NotificationService from '../services/NotificationService';

interface LocationState {
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
}

interface DocumentImage {
  file: File | null;
  preview: string;
  fileType: string;
  name?: string;
}

interface ChecklistItem {
  checked: boolean;
  image: DocumentImage;
}

const ChecklistForm: React.FC = () => {
  const location = useLocation();
  const { formData } = location.state as LocationState;

  const [checklist, setChecklist] = useState({
    identityCard: { checked: false, image: { file: null, preview: '', fileType: '' } },
    proofOfResidence: { checked: false, image: { file: null, preview: '', fileType: '' } },
    birthCertificate: { checked: false, image: { file: null, preview: '', fileType: '' } },
    taxClearance: { checked: false, image: { file: null, preview: '', fileType: '' } },
    propertyDocuments: { checked: false, image: { file: null, preview: '', fileType: '' } },
    applicationLetter: { checked: false, image: { file: null, preview: '', fileType: '' } }
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Checklist submitted:', checklist);
    console.log('Previous form data:', formData);

    // Send notification to admin service
    NotificationService.sendNotification({
      type: 'form_submission',
      message: `New checklist submission from ${formData.firstName} ${formData.lastName}`,
      description: `Request Type: ${formData.requestType}\nDepartment: ${formData.department}\nRegion: ${formData.region}`
    });
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

  const renderDocumentInput = (documentType: keyof typeof checklist, label: string) => (
    <div className="space-y-4 border-b border-gray-200 pb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            type="checkbox"
            id={documentType}
            name={documentType}
            checked={checklist[documentType].checked}
            onChange={handleCheckboxChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor={documentType} className="ml-3 block text-sm font-medium text-gray-700">
            {label}
          </label>
        </div>
        <div className="flex items-center space-x-4">
          <input
            type="file"
            id={`${documentType}-image`}
            accept="image/*,application/pdf"
            onChange={(e) => handleImageChange(e, documentType)}
            className="hidden"
          />
          <label
            htmlFor={`${documentType}-image`}
            className="cursor-pointer px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 transition-colors"
          >
            Ajouter une image
          </label>
        </div>
      </div>
      {checklist[documentType].image.preview ? (
        <div className="mt-2 relative">
          {checklist[documentType].image.fileType?.startsWith('image/') ? (
            <img
              src={checklist[documentType].image.preview}
              alt={`Preview of ${label}`}
              className="max-w-xs h-32 object-cover rounded-md"
            />
          ) : (
            <div className="max-w-xs h-32 flex items-center justify-center bg-gray-100 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
              <span className="ml-2 text-sm text-gray-600">{checklist[documentType].image.file || ''}</span>
            </div>
          )}
          <button
            type="button"
            onClick={() => handleDeleteImage(documentType)}
            className="absolute top-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      ) : null}
    </div>
  );

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
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-medium text-gray-800">
            Documents Requis
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Veuillez cocher les documents fournis et ajouter les images correspondantes
          </p>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {renderDocumentInput('identityCard', 'Carte d\'identité')}
              {renderDocumentInput('proofOfResidence', 'Justificatif de domicile')}
              {renderDocumentInput('birthCertificate', 'Acte de naissance')}
              {renderDocumentInput('taxClearance', 'Attestation de situation fiscale')}
              {renderDocumentInput('propertyDocuments', 'Documents de propriété')}
              {renderDocumentInput('applicationLetter', 'Lettre de demande')}
            </div>

            <div className="flex justify-end space-x-4">
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
  );
};

export default ChecklistForm;