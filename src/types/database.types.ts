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
      appointments: {
        Row: {
          id: number;
          created_at: string;
          name: string;
          email: string;
          phone: string;
          appointment_time: string;
          notes: string | null;
        };
        Insert: {
          name: string;
          email: string;
          phone: string;
          appointment_time: string;
          notes?: string | null;
        };
        Update: {
          name?: string;
          email?: string;
          phone?: string;
          appointment_time?: string;
          notes?: string | null;
        };
      };
    };
  };
  Views: {
    [_ in never]: never;
  };
  Functions: {
    [_ in never]: never;
  };
  Enums: {
    [_ in never]: never;
  };
}
