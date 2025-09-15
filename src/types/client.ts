export interface Client {
  id: string;
  name: string;
  code: string;
  email: string;
  phone: string;
  address: string;
  contactPerson: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'inactive';
}

export interface ClientFormData {
  name: string;
  code: string;
  email: string;
  phone: string;
  address: string;
  contactPerson: string;
  notes: string;
  status: 'active' | 'inactive';
}

export type ClientSortField = 'name' | 'code' | 'contactPerson' | 'createdAt';
export type ClientSortDirection = 'asc' | 'desc';

export interface ClientFilterOptions {
  status: string[];
}