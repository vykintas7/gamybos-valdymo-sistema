import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          username: string;
          email: string;
          first_name: string;
          last_name: string;
          role: string;
          department: string;
          is_active: boolean;
          created_at: string;
          last_login: string | null;
          created_by: string;
        };
        Insert: {
          id?: string;
          username: string;
          email: string;
          first_name: string;
          last_name: string;
          role: string;
          department: string;
          is_active?: boolean;
          created_at?: string;
          last_login?: string | null;
          created_by: string;
        };
        Update: {
          id?: string;
          username?: string;
          email?: string;
          first_name?: string;
          last_name?: string;
          role?: string;
          department?: string;
          is_active?: boolean;
          created_at?: string;
          last_login?: string | null;
          created_by?: string;
        };
      };
      materials: {
        Row: {
          id: string;
          name: string;
          sku: string;
          description: string;
          category: string;
          supplier: string;
          current_stock: number;
          unit: string;
          cost_per_unit: number;
          reorder_level: number;
          storage_location: string;
          expiry_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          sku: string;
          description: string;
          category: string;
          supplier: string;
          current_stock: number;
          unit: string;
          cost_per_unit: number;
          reorder_level: number;
          storage_location: string;
          expiry_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          sku?: string;
          description?: string;
          category?: string;
          supplier?: string;
          current_stock?: number;
          unit?: string;
          cost_per_unit?: number;
          reorder_level?: number;
          storage_location?: string;
          expiry_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      clients: {
        Row: {
          id: string;
          name: string;
          code: string;
          email: string;
          phone: string;
          address: string;
          contact_person: string;
          notes: string;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          code: string;
          email: string;
          phone: string;
          address: string;
          contact_person: string;
          notes?: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          code?: string;
          email?: string;
          phone?: string;
          address?: string;
          contact_person?: string;
          notes?: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      formulas: {
        Row: {
          id: string;
          name: string;
          code: string;
          description: string;
          client_id: string;
          category: string;
          version: string;
          status: string;
          created_at: string;
          updated_at: string;
          created_by: string;
        };
        Insert: {
          id?: string;
          name: string;
          code: string;
          description: string;
          client_id: string;
          category: string;
          version?: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
          created_by: string;
        };
        Update: {
          id?: string;
          name?: string;
          code?: string;
          description?: string;
          client_id?: string;
          category?: string;
          version?: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
          created_by?: string;
        };
      };
      formula_ingredients: {
        Row: {
          id: string;
          formula_id: string;
          material_id: string;
          percentage: number;
          notes: string | null;
        };
        Insert: {
          id?: string;
          formula_id: string;
          material_id: string;
          percentage: number;
          notes?: string | null;
        };
        Update: {
          id?: string;
          formula_id?: string;
          material_id?: string;
          percentage?: number;
          notes?: string | null;
        };
      };
      production_batches: {
        Row: {
          id: string;
          batch_number: string;
          formula_id: string;
          client_id: string;
          quantity: number;
          unit: string;
          status: string;
          start_date: string;
          end_date: string | null;
          notes: string;
          created_at: string;
          updated_at: string;
          created_by: string;
        };
        Insert: {
          id?: string;
          batch_number: string;
          formula_id: string;
          client_id: string;
          quantity: number;
          unit: string;
          status?: string;
          start_date: string;
          end_date?: string | null;
          notes?: string;
          created_at?: string;
          updated_at?: string;
          created_by: string;
        };
        Update: {
          id?: string;
          batch_number?: string;
          formula_id?: string;
          client_id?: string;
          quantity?: number;
          unit?: string;
          status?: string;
          start_date?: string;
          end_date?: string | null;
          notes?: string;
          created_at?: string;
          updated_at?: string;
          created_by?: string;
        };
      };
    };
  };
}

