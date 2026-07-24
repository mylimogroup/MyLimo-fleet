/**
 * Supabase database schema types.
 * Regenerate with: npx supabase gen types typescript --project-id <id> > lib/supabase/database.types.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      vehicles: {
        Row: {
          id: string;
          photo_url: string | null;
          license_plate: string;
          brand: string;
          model: string;
          year: number;
          vin: string;
          color: string;
          fuel: string;
          transmission: string;
          seats: number;
          current_mileage: number;
          status: string;
          deadlines: Json;
          maintenance: Json;
          tires: Json;
          notes: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          photo_url?: string | null;
          license_plate: string;
          brand: string;
          model: string;
          year: number;
          vin: string;
          color: string;
          fuel: string;
          transmission: string;
          seats: number;
          current_mileage: number;
          status: string;
          deadlines?: Json;
          maintenance?: Json;
          tires?: Json;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          photo_url?: string | null;
          license_plate?: string;
          brand?: string;
          model?: string;
          year?: number;
          vin?: string;
          color?: string;
          fuel?: string;
          transmission?: string;
          seats?: number;
          current_mileage?: number;
          status?: string;
          deadlines?: Json;
          maintenance?: Json;
          tires?: Json;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      vehicle_documents: {
        Row: {
          id: string;
          vehicle_id: string;
          name: string;
          type: string;
          url: string;
          uploaded_at: string;
        };
        Insert: {
          id?: string;
          vehicle_id: string;
          name: string;
          type: string;
          url: string;
          uploaded_at?: string;
        };
        Update: {
          id?: string;
          vehicle_id?: string;
          name?: string;
          type?: string;
          url?: string;
          uploaded_at?: string;
        };
      };
      vehicle_costs: {
        Row: {
          id: string;
          vehicle_id: string;
          date: string;
          description: string;
          supplier: string;
          cost: number;
        };
        Insert: {
          id?: string;
          vehicle_id: string;
          date: string;
          description: string;
          supplier: string;
          cost: number;
        };
        Update: {
          id?: string;
          vehicle_id?: string;
          date?: string;
          description?: string;
          supplier?: string;
          cost?: number;
        };
      };
      drivers: {
        Row: {
          id: string;
          photo_url: string | null;
          first_name: string;
          last_name: string;
          email: string;
          phone: string;
          date_of_birth: string | null;
          address: string;
          tax_code: string;
          languages: string[];
          driving_license_number: string;
          driving_license_expiration: string | null;
          cqc_expiration: string | null;
          ncc_license_number: string | null;
          ncc_license_expiration: string | null;
          medical_certificate_expiration: string | null;
          status: string;
          assigned_vehicle_id: string | null;
          hire_date: string | null;
          contract_type: string;
          employee_id: string;
          notes: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          photo_url?: string | null;
          first_name: string;
          last_name: string;
          email: string;
          phone: string;
          date_of_birth?: string | null;
          address?: string;
          tax_code?: string;
          languages?: string[];
          driving_license_number?: string;
          driving_license_expiration?: string | null;
          cqc_expiration?: string | null;
          ncc_license_number?: string | null;
          ncc_license_expiration?: string | null;
          medical_certificate_expiration?: string | null;
          status?: string;
          assigned_vehicle_id?: string | null;
          hire_date?: string | null;
          contract_type?: string;
          employee_id?: string;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          photo_url?: string | null;
          first_name?: string;
          last_name?: string;
          email?: string;
          phone?: string;
          date_of_birth?: string | null;
          address?: string;
          tax_code?: string;
          languages?: string[];
          driving_license_number?: string;
          driving_license_expiration?: string | null;
          cqc_expiration?: string | null;
          ncc_license_number?: string | null;
          ncc_license_expiration?: string | null;
          medical_certificate_expiration?: string | null;
          status?: string;
          assigned_vehicle_id?: string | null;
          hire_date?: string | null;
          contract_type?: string;
          employee_id?: string;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      driver_documents: {
        Row: {
          id: string;
          driver_id: string;
          name: string;
          type: string;
          category: string;
          url: string;
          uploaded_at: string;
        };
        Insert: {
          id?: string;
          driver_id: string;
          name: string;
          type: string;
          category: string;
          url: string;
          uploaded_at?: string;
        };
        Update: {
          id?: string;
          driver_id?: string;
          name?: string;
          type?: string;
          category?: string;
          url?: string;
          uploaded_at?: string;
        };
      };
      driver_assignments: {
        Row: {
          id: string;
          driver_id: string;
          vehicle_id: string;
          start_date: string;
          end_date: string | null;
          notes: string;
        };
        Insert: {
          id?: string;
          driver_id: string;
          vehicle_id: string;
          start_date: string;
          end_date?: string | null;
          notes?: string;
        };
        Update: {
          id?: string;
          driver_id?: string;
          vehicle_id?: string;
          start_date?: string;
          end_date?: string | null;
          notes?: string;
        };
      };
      driver_leaves: {
        Row: {
          id: string;
          driver_id: string;
          type: string;
          start_date: string;
          end_date: string;
          status: string;
          notes: string;
        };
        Insert: {
          id?: string;
          driver_id: string;
          type: string;
          start_date: string;
          end_date: string;
          status?: string;
          notes?: string;
        };
        Update: {
          id?: string;
          driver_id?: string;
          type?: string;
          start_date?: string;
          end_date?: string;
          status?: string;
          notes?: string;
        };
      };
      maintenance_records: {
        Row: {
          id: string;
          vehicle_id: string;
          category: string;
          status: string;
          description: string;
          workshop: string;
          invoice_number: string | null;
          scheduled_date: string;
          completed_date: string | null;
          mileage: number;
          labour_cost: number;
          parts_cost: number;
          total_cost: number;
          estimated_cost: number;
          next_service_date: string | null;
          next_service_mileage: number | null;
          notes: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          vehicle_id: string;
          category: string;
          status: string;
          description: string;
          workshop: string;
          invoice_number?: string | null;
          scheduled_date: string;
          completed_date?: string | null;
          mileage: number;
          labour_cost?: number;
          parts_cost?: number;
          total_cost?: number;
          estimated_cost?: number;
          next_service_date?: string | null;
          next_service_mileage?: number | null;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          vehicle_id?: string;
          category?: string;
          status?: string;
          description?: string;
          workshop?: string;
          invoice_number?: string | null;
          scheduled_date?: string;
          completed_date?: string | null;
          mileage?: number;
          labour_cost?: number;
          parts_cost?: number;
          total_cost?: number;
          estimated_cost?: number;
          next_service_date?: string | null;
          next_service_mileage?: number | null;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      maintenance_attachments: {
        Row: {
          id: string;
          maintenance_id: string;
          name: string;
          type: string;
          url: string;
          uploaded_at: string;
        };
        Insert: {
          id?: string;
          maintenance_id: string;
          name: string;
          type: string;
          url: string;
          uploaded_at?: string;
        };
        Update: {
          id?: string;
          maintenance_id?: string;
          name?: string;
          type?: string;
          url?: string;
          uploaded_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
