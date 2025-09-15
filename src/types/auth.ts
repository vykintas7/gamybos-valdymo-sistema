export interface User {
  id: string;
  username: string;
  email: string;
  password: string; // In real app, this would be hashed
  firstName: string;
  lastName: string;
  role: 'Admin' | 'R&D' | 'Pardavimai' | 'Saugos vertintojas';
  department: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
  createdBy: string;
}

export interface LoginCredentials {
  usernameOrEmail: string;
  password: string;
}

export interface CreateUserData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'Admin' | 'R&D' | 'Pardavimai' | 'Saugos vertintojas';
  department: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  currentUser: User | null;
  loading: boolean;
  error: string | null;
}