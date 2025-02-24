const API_URL = 'http://localhost:3001/api';

// Base URL for public form API endpoints
const PUBLIC_API_URL = `${API_URL}/api`;

interface DocumentUpload {
  file: File;
  type: string;
}

export const publicFormService = {
  async uploadDocument(file: File, type: string): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    try {
      const response = await fetch('http://localhost:3001/api/public/upload-document', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to upload document ${response.status}`);
      }

      const data = await response.json();
      return data.fileUrl;
    } catch (error) {
      console.error('Error uploading document:', error);
      throw new Error('Failed to upload document. Please try again.');
    }
  },

  async submitForm(formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    region: string;
    adminDepartment: string;
    arrondissement: string;
    village: string;
    requestType?: string;
    description?: string;
    documents?: { fileUrl: string; type: string; }[];
  }) {
    try {
      // Then submit the form with document references
      const response = await fetch(`${API_URL}/public/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          region: formData.region,
          adminDepartment: formData.adminDepartment,
          arrondissement: formData.arrondissement,
          village: formData.village,
          requestType: formData.requestType || '',
          description: formData.description || '',
          documents: formData.documents || []
        }),
      });

      if (!response.ok) {
        console.log('data', formData);
        throw new Error('Network response was not ok');
      }

      return await response.json();
    } catch (error) {
      console.error('Error submitting public form:', error);
      throw new Error('Failed to submit form. Please try again.');
    }
  }
};