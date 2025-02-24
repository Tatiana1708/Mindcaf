import { useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const PublicProcedureDetails = () => {
  const { procedureName } = useParams();
  const navigate = useNavigate();
  console.log('Procedure:', procedureName);
  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
      >
        <ArrowLeft size={20} />
        Retour
      </button>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">{procedureName}</h1>

        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-3">Description</h2>
            <p className="text-gray-600">
              Cette procédure permet de traiter les demandes liées à {procedureName?.toLowerCase()}.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-3">Documents Requis</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Formulaire de demande dûment rempli en cinq exemplaires</li>
              <li>Pièce d'identité certifiée ou un extrait d’acte de naissance du requérant</li>
              <li>Un Titre de Séjour pour les étrangers</li>
              <li>Un croquis du terrain en quatre exemplaires</li>
              <li>Un document officiel authentique attestant de
              son existence légale lorsqu’il s’agit d’une Société</li>
              <li>Une procuration authentique délivrée par le requérant s’il s’agit d’un mandataire</li>
              <li>Le programme de mise en valeur du terrain</li>
              <li>Le devis estimatif et quantitatif du projet signé par un expert</li>
            </ul>
          </section>

          {/* <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-3">Étapes de la Procédure</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold">1</div>
                <div>
                  <h3 className="font-medium text-gray-800">Soumission de la Demande</h3>
                  <p className="text-gray-600">Dépôt du dossier complet auprès du service concerné</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold">2</div>
                <div>
                  <h3 className="font-medium text-gray-800">Vérification du Dossier</h3>
                  <p className="text-gray-600">Examen de la conformité des documents fournis</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold">3</div>
                <div>
                  <h3 className="font-medium text-gray-800">Traitement de la Demande</h3>
                  <p className="text-gray-600">Analyse et traitement du dossier par les services compétents</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold">4</div>
                <div>
                  <h3 className="font-medium text-gray-800">Délivrance du Document</h3>
                  <p className="text-gray-600">Remise du document final au demandeur</p>
                </div>
              </div>
            </div>
          </section> */}

          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-3">Délais et Coûts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-800 mb-2">Délai de Traitement</h3>
                <p className="text-gray-600">10 à 18 jours ouvrables</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-800 mb-2">Coût de la Procédure</h3>
                <p className="text-gray-600">Variable selon la nature de la demande</p>
              </div>
            </div>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-3">Enregistrement</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link to="/public-requester-info">
                <div className="bg-red-50 p-4 rounded-lg cursor-pointer">
                  <h3 className="font-medium text-gray-800 mb-2">
                    Informations sur le demandeur
                  </h3>
                </div>
              </Link>
              <Link to="/public-checklist">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-800 mb-2">Documents requis</h3>
              </div>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PublicProcedureDetails;

// import React, { useState } from 'react';

// const PublicForm = () => {
//   // State to manage form data
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     phone: '',
//     region: '',
//     adminDepartment: '',
//     arrondissement: '',
//     village: '',
//     requestType: '',
//     description: '',
//     documents: [], // Array to store selected document types and files
//   });

//   // Predefined document types
//   const documentTypes = [
//     { id: 'id_proof', label: 'ID Proof' },
//     { id: 'address_proof', label: 'Address Proof' },
//     { id: 'income_certificate', label: 'Income Certificate' },
//     { id: 'other', label: 'Other' },
//   ];

//   // Handle input changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   // Handle document checklist changes
//   const handleDocumentChecklist = (e) => {
//     const { value, checked } = e.target;
//     let updatedDocuments = [...formData.documents];

//     if (checked) {
//       // Add the document type to the list with an empty file
//       updatedDocuments.push({ type: value, file: null });
//     } else {
//       // Remove the document type from the list
//       updatedDocuments = updatedDocuments.filter((doc) => doc.type !== value);
//     }

//     setFormData({
//       ...formData,
//       documents: updatedDocuments,
//     });
//   };

//   // Handle file upload for a specific document type
//   const handleFileUpload = (index, e) => {
//     const file = e.target.files[0];
//     const updatedDocuments = [...formData.documents];
//     updatedDocuments[index].file = file;

//     setFormData({
//       ...formData,
//       documents: updatedDocuments,
//     });
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Create FormData to handle file uploads
//     const formDataToSend = new FormData();
//     formDataToSend.append('firstName', formData.firstName);
//     formDataToSend.append('lastName', formData.lastName);
//     formDataToSend.append('email', formData.email);
//     formDataToSend.append('phone', formData.phone);
//     formDataToSend.append('region', formData.region);
//     formDataToSend.append('adminDepartment', formData.adminDepartment);
//     formDataToSend.append('arrondissement', formData.arrondissement);
//     formDataToSend.append('village', formData.village);
//     formDataToSend.append('requestType', formData.requestType);
//     formDataToSend.append('description', formData.description);

//     // Append each document file
//     formData.documents.forEach((doc, index) => {
//       if (doc.file) {
//         formDataToSend.append(`documents[${index}][type]`, doc.type);
//         formDataToSend.append(`documents[${index}][file]`, doc.file);
//       }
//     });

//     try {
//       const response = await fetch('http://localhost:5000/submit-form', {
//         method: 'POST',
//         body: formDataToSend, // Send FormData for file uploads
//       });

//       if (response.ok) {
//         const result = await response.json();
//         alert('Form submitted successfully!');
//         console.log('Submission Result:', result.submission);
//         // Reset the form after successful submission
//         setFormData({
//           firstName: '',
//           lastName: '',
//           email: '',
//           phone: '',
//           region: '',
//           adminDepartment: '',
//           arrondissement: '',
//           village: '',
//           requestType: '',
//           description: '',
//           documents: [],
//         });
//       } else {
//         alert('Error submitting form');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       alert('Error submitting form');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-8">
//       <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
//         <h2 className="text-2xl font-bold mb-6 text-center">Public Form Submission</h2>
//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Personal Information */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">First Name</label>
//               <input
//                 type="text"
//                 name="firstName"
//                 value={formData.firstName}
//                 onChange={handleInputChange}
//                 required
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Last Name</label>
//               <input
//                 type="text"
//                 name="lastName"
//                 value={formData.lastName}
//                 onChange={handleInputChange}
//                 required
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//           </div>

//           {/* Contact Information */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Email</label>
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleInputChange}
//                 required
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Phone</label>
//               <input
//                 type="text"
//                 name="phone"
//                 value={formData.phone}
//                 onChange={handleInputChange}
//                 required
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//           </div>

//           {/* Location Information */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Region</label>
//               <input
//                 type="text"
//                 name="region"
//                 value={formData.region}
//                 onChange={handleInputChange}
//                 required
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Admin Department</label>
//               <input
//                 type="text"
//                 name="adminDepartment"
//                 value={formData.adminDepartment}
//                 onChange={handleInputChange}
//                 required
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Arrondissement</label>
//               <input
//                 type="text"
//                 name="arrondissement"
//                 value={formData.arrondissement}
//                 onChange={handleInputChange}
//                 required
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Village</label>
//               <input
//                 type="text"
//                 name="village"
//                 value={formData.village}
//                 onChange={handleInputChange}
//                 required
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//           </div>

//           {/* Request Type */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Request Type</label>
//             <input
//               type="text"
//               name="requestType"
//               value={formData.requestType}
//               onChange={handleInputChange}
//               required
//               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           {/* Description */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Description</label>
//             <textarea
//               name="description"
//               value={formData.description}
//               onChange={handleInputChange}
//               rows="4"
//               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Describe your request..."
//             />
//           </div>

//           {/* Document Checklist with File Upload */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Required Documents</label>
//             <div className="space-y-4">
//               {documentTypes.map((doc) => (
//                 <div key={doc.id} className="flex items-center space-x-4">
//                   <input
//                     type="checkbox"
//                     id={doc.id}
//                     value={doc.id}
//                     checked={formData.documents.some((d) => d.type === doc.id)}
//                     onChange={handleDocumentChecklist}
//                     className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                   />
//                   <label htmlFor={doc.id} className="text-sm text-gray-700">
//                     {doc.label}
//                   </label>
//                   {formData.documents.some((d) => d.type === doc.id) && (
//                     <input
//                       type="file"
//                       onChange={(e) =>
//                         handleFileUpload(
//                           formData.documents.findIndex((d) => d.type === doc.id),
//                           e
//                         )
//                       }
//                       className="text-sm text-gray-700"
//                     />
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Submit Button */}
//           <div className="flex justify-end">
//             <button
//               type="submit"
//               className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
//             >
//               Submit
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default PublicForm;