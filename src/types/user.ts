export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'R&D' | 'Pardavimai' | 'Saugos vertintojas' | 'Admin';
  avatar?: string;
  createdAt: string;
  status: 'active' | 'inactive';
}

export interface Comment {
  id: string;
  formulaId: string;
  userId: string;
  userName: string;
  userRole: string;
  content: string;
  type: 'general' | 'improvement' | 'safety' | 'sales_feedback';
  createdAt: string;
  updatedAt: string;
  isResolved: boolean;
  resolvedBy?: string;
  resolvedAt?: string;
}

export interface CommentFormData {
  content: string;
  type: 'general' | 'improvement' | 'safety' | 'sales_feedback';
}

export type CommentType = 'general' | 'improvement' | 'safety' | 'sales_feedback';