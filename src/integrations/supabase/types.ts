export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      academic_records: {
        Row: {
          academic_year: string
          created_at: string | null
          grade: string | null
          id: string
          score: number | null
          semester: number
          student_id: string
          subject: string
        }
        Insert: {
          academic_year: string
          created_at?: string | null
          grade?: string | null
          id?: string
          score?: number | null
          semester: number
          student_id: string
          subject: string
        }
        Update: {
          academic_year?: string
          created_at?: string | null
          grade?: string | null
          id?: string
          score?: number | null
          semester?: number
          student_id?: string
          subject?: string
        }
        Relationships: [
          {
            foreignKeyName: "academic_records_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_messages: {
        Row: {
          created_at: string | null
          email: string
          id: string
          is_read: boolean | null
          message: string
          name: string
          phone: string | null
          subject: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          is_read?: boolean | null
          message: string
          name: string
          phone?: string | null
          subject?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          is_read?: boolean | null
          message?: string
          name?: string
          phone?: string | null
          subject?: string | null
        }
        Relationships: []
      }
      gallery: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          institution_id: string | null
          media_type: string | null
          media_url: string
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          institution_id?: string | null
          media_type?: string | null
          media_url: string
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          institution_id?: string | null
          media_type?: string | null
          media_url?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "gallery_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      hafalan_progress: {
        Row: {
          created_at: string | null
          id: string
          juz: number | null
          memorized_date: string | null
          status: string | null
          student_id: string
          surah_name: string
          teacher_notes: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          juz?: number | null
          memorized_date?: string | null
          status?: string | null
          student_id: string
          surah_name: string
          teacher_notes?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          juz?: number | null
          memorized_date?: string | null
          status?: string | null
          student_id?: string
          surah_name?: string
          teacher_notes?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hafalan_progress_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      institutions: {
        Row: {
          annual_fee: number | null
          created_at: string | null
          curriculum: string | null
          description: string | null
          facilities: string[] | null
          id: string
          image_url: string | null
          monthly_fee: number | null
          name: string
          registration_fee: number | null
          type: Database["public"]["Enums"]["institution_type"]
        }
        Insert: {
          annual_fee?: number | null
          created_at?: string | null
          curriculum?: string | null
          description?: string | null
          facilities?: string[] | null
          id?: string
          image_url?: string | null
          monthly_fee?: number | null
          name: string
          registration_fee?: number | null
          type: Database["public"]["Enums"]["institution_type"]
        }
        Update: {
          annual_fee?: number | null
          created_at?: string | null
          curriculum?: string | null
          description?: string | null
          facilities?: string[] | null
          id?: string
          image_url?: string | null
          monthly_fee?: number | null
          name?: string
          registration_fee?: number | null
          type?: Database["public"]["Enums"]["institution_type"]
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          created_at: string | null
          full_name: string
          id: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          full_name: string
          id: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          full_name?: string
          id?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      registrations: {
        Row: {
          created_at: string | null
          documents: Json | null
          id: string
          institution_id: string
          notes: string | null
          status: Database["public"]["Enums"]["registration_status"] | null
          student_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          documents?: Json | null
          id?: string
          institution_id: string
          notes?: string | null
          status?: Database["public"]["Enums"]["registration_status"] | null
          student_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          documents?: Json | null
          id?: string
          institution_id?: string
          notes?: string | null
          status?: Database["public"]["Enums"]["registration_status"] | null
          student_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "registrations_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registrations_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          birth_date: string | null
          birth_place: string | null
          created_at: string | null
          full_name: string
          gender: string | null
          id: string
          institution_id: string | null
          parent_id: string
          previous_school: string | null
          updated_at: string | null
        }
        Insert: {
          birth_date?: string | null
          birth_place?: string | null
          created_at?: string | null
          full_name: string
          gender?: string | null
          id?: string
          institution_id?: string | null
          parent_id: string
          previous_school?: string | null
          updated_at?: string | null
        }
        Update: {
          birth_date?: string | null
          birth_place?: string | null
          created_at?: string | null
          full_name?: string
          gender?: string | null
          id?: string
          institution_id?: string | null
          parent_id?: string
          previous_school?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "students_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "parent" | "teacher"
      institution_type: "dta" | "smp" | "sma" | "pesantren"
      registration_status:
        | "pending"
        | "document_review"
        | "interview"
        | "accepted"
        | "rejected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "parent", "teacher"],
      institution_type: ["dta", "smp", "sma", "pesantren"],
      registration_status: [
        "pending",
        "document_review",
        "interview",
        "accepted",
        "rejected",
      ],
    },
  },
} as const
