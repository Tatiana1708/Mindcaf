import React from 'react';
import { Mail as MailIcon, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import type { LocationState, Mail } from '../../../types';

interface MailListProps {
  mails: LocationState[];
}

export function  MailList({ mails }: MailListProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sujet</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigné à</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mails.map((mail) => (
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  {mail.formData.requestType === 'INCOMING' ? (
                    <ArrowDownLeft className="h-5 w-5 text-green-500" />
                  ) : (
                    <ArrowUpRight className="h-5 w-5 text-blue-500" />
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{mail.formData.firstName} {mail.formData.lastName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {/* <div className="text-sm text-gray-500">{new Date(mail.formData.).toLocaleDateString()}</div> */}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                  {mail.formData.phone}
                    {/* {mail.type === 'INCOMING' ? mail.sender : mail.recipient} */}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{mail.formData.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full`}>
                    {mail.formData.adminDepartment}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// import React from 'react';
// import { Mail as MailIcon, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
// import type { Mail } from '../../../types';

// interface MailListProps {
//   mails: Mail[];
// }

// export function  MailList({ mails }: MailListProps) {
//   return (
//     <div className="bg-white rounded-lg shadow-md overflow-hidden">
//       <div className="overflow-x-auto">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sujet</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigné à</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {mails.map((mail) => (
//               <tr key={mail.id} className="hover:bg-gray-50">
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   {mail.type === 'INCOMING' ? (
//                     <ArrowDownLeft className="h-5 w-5 text-green-500" />
//                   ) : (
//                     <ArrowUpRight className="h-5 w-5 text-blue-500" />
//                   )}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="text-sm font-medium text-gray-900">{mail.subject}</div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="text-sm text-gray-500">{new Date(mail.date).toLocaleDateString()}</div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="text-sm text-gray-500">
//                     {mail.type === 'INCOMING' ? mail.sender : mail.recipient}
//                   </div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="text-sm text-gray-500">{mail.assignedTo}</div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
//                     ${mail.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 
//                       mail.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-800' : 
//                       'bg-gray-100 text-gray-800'}`}>
//                     {mail.status}
//                   </span>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }