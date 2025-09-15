import React, { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import LoginForm from './components/LoginForm';
import UserManagement from './components/UserManagement';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import MaterialsView from './components/MaterialsView';
import FormulaView from './components/FormulaView';
import ClientsView from './components/ClientsView';
import ProductionView from './components/ProductionView';
import NotificationDropdown from './components/NotificationDropdown';
import ProfileDropdown from './components/ProfileDropdown';
import SettingsModal from './components/SettingsModal';
import { useNotifications } from './hooks/useNotifications';
import { useSettings } from './hooks/useSettings';
import { Bell } from 'lucide-react';

function App() {
  const { isAuthenticated, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const { unreadCount } = useNotifications();
  const { userProfile } = useSettings();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'materials':
        return <MaterialsView />;
      case 'formulas':
        return <FormulaView />;
      case 'clients':
        return <ClientsView />;
      case 'production':
        return <ProductionView />;
      case 'users':
        return <UserManagement />;
      case 'analytics':
        return (
          <div className="flex-1 bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Analitikos skydelis</h2>
              <p className="text-gray-600">Netrukus - Išplėstinės analitikos ir ataskaitų funkcijos</p>
            </div>
          </div>
        );
      case 'suppliers':
        return (
          <div className="flex-1 bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Tiekėjų valdymas</h2>
              <p className="text-gray-600">Netrukus - Valdykite savo tiekėjų santykius</p>
            </div>
          </div>
        );
      case 'reports':
        return (
          <div className="flex-1 bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Ataskaitos ir dokumentacija</h2>
              <p className="text-gray-600">Netrukus - Generuokite išsamias ataskaitas ir dokumentaciją</p>
            </div>
          </div>
        );
      case 'alerts':
        return (
          <div className="flex-1 bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Įspėjimų valdymas</h2>
              <p className="text-gray-600">Netrukus - Konfigūruokite ir valdykite atsargų įspėjimus</p>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="flex-1 bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Sistemos nustatymai</h2>
              <p className="text-gray-600">Netrukus - Konfigūruokite sistemos nuostatas ir nustatymus</p>
            </div>
          </div>
        );
      default:
        return <MaterialsView />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b border-gray-200 px-6 py-3 flex justify-end items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-medium px-1.5 py-0.5 rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>
          </div>
          
          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center space-x-2 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              {userProfile && (
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {userProfile.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
              )}
            </button>
          </div>
        </div>
        {renderContent()}
        
        {/* Dropdowns and Modals */}
        <NotificationDropdown 
          isOpen={showNotifications} 
          onClose={() => setShowNotifications(false)} 
        />
        <ProfileDropdown 
          isOpen={showProfile} 
          onClose={() => setShowProfile(false)}
          onOpenSettings={() => setShowSettings(true)}
        />
        <SettingsModal 
          isOpen={showSettings} 
          onClose={() => setShowSettings(false)} 
        />
      </div>
    </div>
  );
}

export default App;