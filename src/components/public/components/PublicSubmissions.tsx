import React, { useState, useEffect } from 'react';

interface Document {
  id: string;
  name: string;
  url: string;
  createdAt: string;
}

interface Submission {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  region: string;
  adminDepartment: string;
  arrondissement: string;
  village: string;
  requestType: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  documents: Document[];
}

function PublicSubmissions(): React.ReactElement {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  interface LocationMap {
    [key: string]: string;
  }

  const [locationData, setLocationData] = useState<{
    regions: LocationMap;
    departments: LocationMap;
    arrondissements: LocationMap;
    villages: LocationMap;
  }>({
    regions: {},
    departments: {},
    arrondissements: {},
    villages: {}
  });

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const [regions, departments, arrondissements, villages] = await Promise.all([
          fetch('http://localhost:3001/api/locations/regions').then(res => res.json()),
          fetch('http://localhost:3001/api/locations/departments').then(res => res.json()),
          fetch('http://localhost:3001/api/locations/arrondissements').then(res => res.json()),
          fetch('http://localhost:3001/api/locations/villages').then(res => res.json())
        ]);

        setLocationData({
          regions: regions.reduce((acc: any, r: { id: any; name: any; }) => ({ ...acc, [r.id]: r.name }), {}),
          departments: departments.reduce((acc: any, d: { id: any; name: any; }) => ({ ...acc, [d.id]: d.name }), {}),
          arrondissements: arrondissements.reduce((acc: any, a: { id: any; name: any; }) => ({ ...acc, [a.id]: a.name }), {}),
          villages: villages.reduce((acc: any, v: { id: any; name: any; }) => ({ ...acc, [v.id]: v.name }), {})
        });
      } catch (err) {
        console.error('Error fetching location data:', err);
      }
    };

    fetchLocations();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/public/submissions');
      if (!response.ok) throw new Error('Failed to fetch submissions');
      const data: Submission[] = await response.json();
      setSubmissions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Contact</th>
            <th className="px-4 py-2 text-left">Location</th>
            <th className="px-4 py-2 text-left">Request Details</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Documents</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((submission) => (
            <tr key={submission.id} className="border-t border-gray-300 hover:bg-gray-50">
              <td className="px-4 py-2">
                {submission.firstName} {submission.lastName}
              </td>
              <td className="px-4 py-2">
                <div>{submission.email}</div>
                <div>{submission.phone}</div>
              </td>
              <td className="px-4 py-2">
                <div>Region: {locationData.regions[submission.region] || submission.region}</div>
                <div>Department: {locationData.departments[submission.adminDepartment] || submission.adminDepartment}</div>
                <div>Arrondissement: {locationData.arrondissements[submission.arrondissement] || submission.arrondissement}</div>
                <div>Village: {locationData.villages[submission.village] || submission.village}</div>
              </td>
              <td className="px-4 py-2">
                <div><strong>{submission.requestType}</strong></div>
                <div className="text-sm text-gray-600">{submission.description}</div>
              </td>
              <td className="px-4 py-2">
                <span className={`px-2 py-1 rounded text-sm ${
                  submission.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                  submission.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {submission.status}
                </span>
              </td>
              <td className="px-4 py-2">
                {submission.documents.length > 0 ? (
                  <ul className="list-none">
                    {submission.documents.map((doc) => (
                      <li key={doc.id}>
                        <a 
                          href={doc.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-blue-600 hover:underline"
                        >
                          {doc.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-gray-500">No documents</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PublicSubmissions;