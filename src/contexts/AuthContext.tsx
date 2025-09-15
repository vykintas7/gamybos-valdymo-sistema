import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginCredentials, CreateUserData } from '../types/auth';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  isAuthenticated: boolean;
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  allUsers: User[];
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  createUser: (userData: CreateUserData) => string | null;
  updateUser: (userId: string, updates: Partial<User>) => boolean;
  deleteUser: (userId: string) => boolean;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'auth_data';

// Mock users for demo - in production, these would be in Supabase
const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@sandelis.lt',
    password: 'admin123',
    firstName: 'Administratorius',
    lastName: 'Sistema',
    role: 'Admin',
    department: 'IT skyrius',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    lastLogin: '2024-12-02T08:30:00Z',
    createdBy: 'system'
  },
  {
    id: '2',
    username: 'jonas.jonaitis',
    email: 'jonas@sandelis.lt',
    password: 'jonas123',
    firstName: 'Jonas',
    lastName: 'Jonaitis',
    role: 'R&D',
    department: 'Tyrimų ir plėtros skyrius',
    isActive: true,
    createdAt: '2024-01-15T00:00:00Z',
    lastLogin: '2024-12-01T16:45:00Z',
    createdBy: '1'
  },
  {
    id: '3',
    username: 'marija.petraitiene',
    email: 'marija@sandelis.lt',
    password: 'marija123',
    firstName: 'Marija',
    lastName: 'Petraitienė',
    role: 'Pardavimai',
    department: 'Pardavimų skyrius',
    isActive: true,
    createdAt: '2024-02-01T00:00:00Z',
    lastLogin: '2024-11-30T14:20:00Z',
    createdBy: '1'
  },
  {
    id: '4',
    username: 'petras.kazlauskas',
    email: 'petras@sandelis.lt',
    password: 'petras123',
    firstName: 'Petras',
    lastName: 'Kazlauskas',
    role: 'Saugos vertintojas',
    department: 'Kokybės ir saugos skyrius',
    isActive: true,
    createdAt: '2024-02-15T00:00:00Z',
    lastLogin: '2024-12-01T11:30:00Z',
    createdBy: '1'
  }
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>(mockUsers);

  // Initialize auth state from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const authData = JSON.parse(saved);
        if (authData.isAuthenticated && authData.currentUser) {
          setIsAuthenticated(true);
          setCurrentUser(authData.currentUser);
        }
      }
    } catch (error) {
      console.error('Error loading auth data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save auth state to localStorage
  const saveAuthState = (authenticated: boolean, user: User | null) => {
    try {
      const authData = {
        isAuthenticated: authenticated,
        currentUser: user
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authData));
    } catch (error) {
      console.error('Error saving auth data:', error);
    }
  };

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      // Find user by username or email
      const user = users.find(u => 
        (u.username === credentials.username || u.email === credentials.username) &&
        u.password === credentials.password &&
        u.isActive
      );

      if (!user) {
        setError('Neteisingas vartotojo vardas arba slaptažodis');
        return false;
      }

      // Update last login in Supabase (if user exists in DB)
      try {
        await supabase
          .from('users')
          .update({ last_login: new Date().toISOString() })
          .eq('email', user.email);
      } catch (dbError) {
        console.log('User not in database yet, using mock data');
      }

      setIsAuthenticated(true);
      setCurrentUser(user);
      saveAuthState(true, user);
      
      return true;
    } catch (err) {
      console.error('Login error:', err);
      setError('Prisijungimo klaida');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    saveAuthState(false, null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const createUser = (userData: CreateUserData): string | null => {
    try {
      // Check if username or email already exists
      const existingUser = users.find(u => 
        u.username === userData.username || u.email === userData.email
      );

      if (existingUser) {
        setError('Vartotojo vardas arba el. paštas jau egzistuoja');
        return null;
      }

      const newUser: User = {
        id: Date.now().toString(),
        username: userData.username,
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
        department: userData.department,
        isActive: true,
        createdAt: new Date().toISOString(),
        lastLogin: null,
        createdBy: currentUser?.id || 'system'
      };

      setUsers(prev => [...prev, newUser]);
      
      // Try to save to Supabase
      supabase
        .from('users')
        .insert([{
          username: newUser.username,
          email: newUser.email,
          password_hash: newUser.password, // In production, this should be hashed
          first_name: newUser.firstName,
          last_name: newUser.lastName,
          role: newUser.role,
          department: newUser.department,
          is_active: newUser.isActive,
          created_by: newUser.createdBy
        }])
        .then(({ error }) => {
          if (error) {
            console.error('Error saving user to Supabase:', error);
          }
        });

      return newUser.id;
    } catch (err) {
      console.error('Error creating user:', err);
      setError('Nepavyko sukurti vartotojo');
      return null;
    }
  };

  const updateUser = (userId: string, updates: Partial<User>): boolean => {
    try {
      setUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, ...updates }
          : user
      ));

      // Try to update in Supabase
      supabase
        .from('users')
        .update({
          username: updates.username,
          email: updates.email,
          first_name: updates.firstName,
          last_name: updates.lastName,
          role: updates.role,
          department: updates.department,
          is_active: updates.isActive
        })
        .eq('id', userId)
        .then(({ error }) => {
          if (error) {
            console.error('Error updating user in Supabase:', error);
          }
        });

      return true;
    } catch (err) {
      console.error('Error updating user:', err);
      setError('Nepavyko atnaujinti vartotojo');
      return false;
    }
  };

  const deleteUser = (userId: string): boolean => {
    try {
      if (userId === currentUser?.id) {
        setError('Negalite ištrinti savo paties paskyros');
        return false;
      }

      setUsers(prev => prev.filter(user => user.id !== userId));

      // Try to delete from Supabase
      supabase
        .from('users')
        .delete()
        .eq('id', userId)
        .then(({ error }) => {
          if (error) {
            console.error('Error deleting user from Supabase:', error);
          }
        });

      return true;
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Nepavyko ištrinti vartotojo');
      return false;
    }
  };

  const clearError = () => setError(null);

  const value: AuthContextType = {
    isAuthenticated,
    currentUser,
    loading,
    error,
    allUsers: users,
    login,
    logout,
    createUser,
    updateUser,
    deleteUser,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

