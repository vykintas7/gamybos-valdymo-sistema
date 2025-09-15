import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginCredentials, CreateUserData } from '../types/auth';

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
const USERS_KEY = 'users_data';

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
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem(USERS_KEY);
      return saved ? JSON.parse(saved) : mockUsers;
    } catch {
      return mockUsers;
    }
  });

  // Initialize auth state from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.isAuthenticated && parsed.currentUser && parsed.currentUser.isActive) {
          setIsAuthenticated(true);
          setCurrentUser(parsed.currentUser);
        }
      }
    } catch (error) {
      console.error('Error loading auth state:', error);
    }
    setLoading(false);
  }, []);

  // Save auth state to localStorage
  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          isAuthenticated,
          currentUser
        }));
      } catch (error) {
        console.error('Error saving auth state:', error);
      }
    }
  }, [isAuthenticated, currentUser, loading]);

  // Save users to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch (error) {
      console.error('Error saving users:', error);
    }
  }, [users]);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

     console.log('Attempting login with:', credentials);
     console.log('Available users:', users.map(u => ({ username: u.username, email: u.email, isActive: u.isActive })));

      const user = users.find(u => 
        (u.username.toLowerCase() === credentials.usernameOrEmail.toLowerCase() || 
         u.email.toLowerCase() === credentials.usernameOrEmail.toLowerCase()) &&
        u.password === credentials.password &&
        u.isActive
      );

     console.log('Found user:', user ? { id: user.id, username: user.username, email: user.email } : 'Not found');

      if (user) {
        const updatedUser = { ...user, lastLogin: new Date().toISOString() };
        setUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
        setCurrentUser(updatedUser);
        setIsAuthenticated(true);
        setLoading(false);
        return true;
      } else {
        setError('Neteisingas vartotojo vardas/el. paštas arba slaptažodis');
        setLoading(false);
        return false;
      }
    } catch (error) {
      setError('Prisijungimo klaida. Bandykite dar kartą.');
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error removing auth data:', error);
    }
  };

  const createUser = (userData: CreateUserData): string | null => {
    console.log('Creating user with data:', userData);
    
    if (!currentUser || currentUser.role !== 'Admin') {
      console.log('Access denied: not admin');
      setError('Tik administratoriai gali kurti vartotojus');
      return null;
    }

    const existingUser = users.find(u => 
      u.username === userData.username || u.email === userData.email
    );

    if (existingUser) {
      console.log('User already exists:', existingUser);
      setError('Vartotojas su tokiu vardu arba el. paštu jau egzistuoja');
      return null;
    }

    const newUser: User = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      ...userData,
      isActive: true,
      createdAt: new Date().toISOString(),
      createdBy: currentUser.id
    };

    console.log('New user created:', newUser);
    setUsers(prev => [...prev, newUser]);
    setError(null); // Clear any previous errors
    return newUser.id;
  };

  const updateUser = (userId: string, updates: Partial<User>): boolean => {
    if (!currentUser || currentUser.role !== 'Admin') {
      return false;
    }

    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, ...updates } : user
    ));
    return true;
  };

  const deleteUser = (userId: string): boolean => {
    if (!currentUser || currentUser.role !== 'Admin') {
      return false;
    }

    if (userId === currentUser.id) {
      return false;
    }

    setUsers(prev => prev.filter(user => user.id !== userId));
    return true;
  };


  const clearError = () => {
    setError(null);
  };

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