import { User } from 'lucide-react';
import NotificationInbox from './NotificationInbox';

export function Header() {
  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6 fixed top-0 right-0 left-64 mb-8">
      <div className="flex items-center space-x-4">
        <h2 className="text-xl font-semibold text-gray-800"></h2>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center justify-end px-4 py-3 border-t border-gray-200">
          <div className="flex items-center">
            <NotificationInbox />
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-700">Admin User</span>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <User className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </header>
  );
}