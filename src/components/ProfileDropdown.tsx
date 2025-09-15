import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../hooks/useSettings';
import { 
  User, 
  Settings, 
  LogOut, 
  ChevronDown,
  Mail,
  Phone,
  Calendar,
  Clock
} from 'lucide-react';

interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ isOpen, onClose, onOpenSettings }) => {
  const { currentUser, logout } = useAuth();
  const { userProfile } = useSettings();

  if (!userProfile) return null;

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'R&D': return 'text-purple-600 bg-purple-100';
      case 'Pardavimai': return 'text-green-600 bg-green-100';
      case 'Saugos vertintojas': return 'text-red-600 bg-red-100';
      case 'Admin': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('lt-LT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('lt-LT', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div className="absolute top-16 right-4 w-80 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Profile Header */}
        <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">
                {userProfile.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">{userProfile.name}</h3>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(userProfile.role)}`}>
                {userProfile.role}
              </span>
              <p className="text-sm text-gray-600 mt-1">{userProfile.department}</p>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="p-4 space-y-3">
          <div className="flex items-center space-x-3 text-sm text-gray-600">
            <Mail className="w-4 h-4" />
            <span>{userProfile.email}</span>
          </div>
          {userProfile.phone && (
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <Phone className="w-4 h-4" />
              <span>{userProfile.phone}</span>
            </div>
          )}
          <div className="flex items-center space-x-3 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>Prisijungė: {formatDate(userProfile.joinedAt)}</span>
          </div>
          <div className="flex items-center space-x-3 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>Paskutinį kartą: {formatDateTime(userProfile.lastLogin)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="border-t border-gray-200">
          <button
            onClick={() => {
              onOpenSettings();
              onClose();
            }}
            className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
          >
            <Settings className="w-4 h-4" />
            <span>Nustatymai</span>
          </button>
          <button
            onClick={() => {
              logout();
              onClose();
            }}
            className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
          >
            <LogOut className="w-4 h-4" />
            <span>Atsijungti</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileDropdown;