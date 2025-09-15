import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Package, BarChart3, Settings, Users, FileText, AlertTriangle, Beaker, UserCheck, Factory } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const { currentUser } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Skydelis', icon: BarChart3 },
    { id: 'materials', label: 'Medžiagos', icon: Package },
    { id: 'formulas', label: 'Formulės', icon: Beaker },
    { id: 'production', label: 'Gamyba', icon: Factory },
    { id: 'clients', label: 'Klientai', icon: UserCheck },
    ...(currentUser?.role === 'Admin' ? [{ id: 'users', label: 'Vartotojai', icon: Users }] : []),
    { id: 'analytics', label: 'Analitika', icon: BarChart3 },
    { id: 'suppliers', label: 'Tiekėjai', icon: Users },
    { id: 'reports', label: 'Ataskaitos', icon: FileText },
    { id: 'alerts', label: 'Įspėjimai', icon: AlertTriangle },
    { id: 'settings', label: 'Nustatymai', icon: Settings }
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
            <Package className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Versus Labs</h1>
            <p className="text-xs text-gray-500 font-medium">Laboratorijos valdymo sistema</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow-sm border-r-3 border-blue-600' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                  <span className={`font-medium ${isActive ? 'font-semibold' : ''}`}>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 shadow-sm border border-blue-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center shadow-md">
              <span className="text-white font-semibold text-sm">
                {currentUser?.firstName?.[0]}{currentUser?.lastName?.[0]}
              </span>
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm leading-tight">
                {currentUser?.firstName} {currentUser?.lastName}
              </p>
              <p className="text-blue-600 text-xs font-medium">{currentUser?.role}</p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Sidebar;