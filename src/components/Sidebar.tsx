import React from 'react';
import { Building2, Users, Wrench, FileText, Menu, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import NotificationInbox from './NotificationInbox';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = React.useState(true);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const { user } = useAuth();

  const menuItems = user?.role === 'public' ? [
    { icon: FileText, label: 'Public Procedures', path: '/public-procedures' }
  ] : [
    { icon: Building2, label: 'Services', path: '/services' },
    { icon: Users, label: 'Employees', path: '/employees' },
    { icon: Wrench, label: 'Equipment', path: '/equipment' },
    { icon: FileText, label: 'Procedures', path: '/procedures' }
  ];

  return (
    <div className={`fixed top-0 left-0 bg-gray-800 text-white h-screen transition-all duration-300 ease-in-out z-50 ${isOpen ? 'w-64' : 'w-16'} shadow-xl`}>
      <div className="p-4 flex items-center justify-between border-b border-gray-700">
        <h1 className={`font-bold text-lg ${isOpen ? 'opacity-100 block' : 'opacity-0 hidden'} transition-all duration-300`}>{user?.role === 'public' ? 'Public Portal' : 'Admin Portal'}</h1>
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
          <Menu size={20} />
        </button>
      </div>
      <nav className="mt-4 px-2 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center p-3 rounded-lg transition-all ${location.pathname === item.path ? 'bg-gray-700' : 'hover:bg-gray-700/50'}`}
          >
            <item.icon size={20} className="flex-shrink-0" />
            {isOpen && <span className="ml-3 whitespace-nowrap transition-opacity duration-300">{item.label}</span>}
          </Link>
        ))}
      </nav>
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center p-3 text-white hover:bg-gray-700 rounded-lg transition-all"
        >
          <LogOut size={20} className="flex-shrink-0" />
          {isOpen && <span className="ml-3 whitespace-nowrap">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
