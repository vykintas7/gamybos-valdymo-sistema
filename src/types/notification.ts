export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  category: 'system' | 'formula' | 'material' | 'comment' | 'user';
  isRead: boolean;
  createdAt: string;
  userId: string;
  relatedId?: string; // ID of related formula, material, etc.
  actionUrl?: string; // URL to navigate when clicked
}

export interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  lowStockAlerts: boolean;
  formulaUpdates: boolean;
  commentNotifications: boolean;
  systemUpdates: boolean;
  weeklyReports: boolean;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'auto';
  language: 'lt' | 'en';
  dateFormat: 'dd/mm/yyyy' | 'mm/dd/yyyy' | 'yyyy-mm-dd';
  currency: 'EUR' | 'USD' | 'GBP';
  timezone: string;
  notifications: NotificationSettings;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'R&D' | 'Pardavimai' | 'Saugos vertintojas' | 'Admin';
  avatar?: string;
  phone?: string;
  department: string;
  joinedAt: string;
  lastLogin: string;
  settings: UserSettings;
}