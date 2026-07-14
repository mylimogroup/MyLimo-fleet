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
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
