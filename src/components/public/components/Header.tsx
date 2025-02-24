import React from 'react';
import { Mail, BarChart3, Users } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-indigo-600 text-white p-4 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Mail className="h-8 w-8" />
          <h1 className="text-2xl font-bold">Gestion des Courriers</h1>
        </div>
        <nav className="flex space-x-6">
          <a href="#" className="flex items-center space-x-1 hover:text-indigo-200">
            <Mail className="h-5 w-5" />
            <span>Courriers</span>
          </a>
          <a href="#" className="flex items-center space-x-1 hover:text-indigo-200">
            <Users className="h-5 w-5" />
            <span>Employés</span>
          </a>
          <a href="#" className="flex items-center space-x-1 hover:text-indigo-200">
            <BarChart3 className="h-5 w-5" />
            <span>Rapports</span>
          </a>
        </nav>
      </div>
    </header>
  );
}