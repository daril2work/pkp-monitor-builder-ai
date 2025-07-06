export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      assessments: {
        Row: {
          actual_achievement: number | null
          bukti_dukung: string | null
          bundle_id: string
          calculated_percentage: number | null
          calculated_score: number | null
          created_at: string
          id: string
          indicator_id: string
          keterangan: string | null
          periode_triwulan: number
          puskesmas_id: string
          selected_score: number | null
          tahun: number
          updated_at: string
          user_id: string
          verification_comment: string | null
          verification_status: Database["public"]["Enums"]["verification_status"]
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          actual_achievement?: number | null
          bukti_dukung?: string | null
          bundle_id: string
          calculated_percentage?: number | null
          calculated_score?: number | null
          created_at?: string
          id?: string
          indicator_id: string
          keterangan?: string | null
          periode_triwulan: number
          puskesmas_id: string
          selected_score?: number | null
          tahun: number
          updated_at?: string
          user_id: string
          verification_comment?: string | null
          verification_status?: Database["public"]["Enums"]["verification_status"]
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          actual_achievement?: number | null
          bukti_dukung?: string | null
          bundle_id?: string
          calculated_percentage?: number | null
          calculated_score?: number | null
          created_at?: string
          id?: string
          indicator_id?: string
          keterangan?: string | null
          periode_triwulan?: number
          puskesmas_id?: string
          selected_score?: number | null
          tahun?: number
          updated_at?: string
          user_id?: string
          verification_comment?: string | null
          verification_status?: Database["public"]["Enums"]["verification_status"]
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assessments_bundle_id_fkey"
            columns: ["bundle_id"]
            isOneToOne: false
            referencedRelation: "bundles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessments_indicator_id_fkey"
            columns: ["indicator_id"]
            isOneToOne: false
            referencedRelation: "indicators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessments_puskesmas_id_fkey"
            columns: ["puskesmas_id"]
            isOneToOne: false
            referencedRelation: "puskesmas"
            referencedColumns: ["id"]
          },
        ]
      }
      bundles: {
        Row: {
          created_at: string
          id: string
          judul: string
          status: Database["public"]["Enums"]["bundle_status"]
          tahun: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          judul: string
          status?: Database["public"]["Enums"]["bundle_status"]
          tahun: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          judul?: string
          status?: Database["public"]["Enums"]["bundle_status"]
          tahun?: number
          updated_at?: string
        }
        Relationships: []
      }
      clusters: {
        Row: {
          bundle_id: string
          created_at: string
          id: string
          nama_klaster: string
          updated_at: string
          urutan: number
        }
        Insert: {
          bundle_id: string
          created_at?: string
          id?: string
          nama_klaster: string
          updated_at?: string
          urutan: number
        }
        Update: {
          bundle_id?: string
          created_at?: string
          id?: string
          nama_klaster?: string
          updated_at?: string
          urutan?: number
        }
        Relationships: [
          {
            foreignKeyName: "clusters_bundle_id_fkey"
            columns: ["bundle_id"]
            isOneToOne: false
            referencedRelation: "bundles"
            referencedColumns: ["id"]
          },
        ]
      }
      indicators: {
        Row: {
          cluster_id: string
          created_at: string
          definisi_operasional: string | null
          id: string
          nama_indikator: string
          periodicity: Database["public"]["Enums"]["periodicity"] | null
          satuan: string | null
          scoring_criteria: Json | null
          target_percentage: number | null
          total_sasaran: number | null
          type: Database["public"]["Enums"]["indicator_type"]
          updated_at: string
          urutan: number
        }
        Insert: {
          cluster_id: string
          created_at?: string
          definisi_operasional?: string | null
          id?: string
          nama_indikator: string
          periodicity?: Database["public"]["Enums"]["periodicity"] | null
          satuan?: string | null
          scoring_criteria?: Json | null
          target_percentage?: number | null
          total_sasaran?: number | null
          type: Database["public"]["Enums"]["indicator_type"]
          updated_at?: string
          urutan: number
        }
        Update: {
          cluster_id?: string
          created_at?: string
          definisi_operasional?: string | null
          id?: string
          nama_indikator?: string
          periodicity?: Database["public"]["Enums"]["periodicity"] | null
          satuan?: string | null
          scoring_criteria?: Json | null
          target_percentage?: number | null
          total_sasaran?: number | null
          type?: Database["public"]["Enums"]["indicator_type"]
          updated_at?: string
          urutan?: number
        }
        Relationships: [
          {
            foreignKeyName: "indicators_cluster_id_fkey"
            columns: ["cluster_id"]
            isOneToOne: false
            referencedRelation: "clusters"
            referencedColumns: ["id"]
          },
        ]
      }
      puskesmas: {
        Row: {
          alamat: string | null
          created_at: string
          id: string
          kabupaten: string | null
          kecamatan: string | null
          kode_puskesmas: string
          nama_puskesmas: string
          status: Database["public"]["Enums"]["puskesmas_status"]
          telepon: string | null
          updated_at: string
        }
        Insert: {
          alamat?: string | null
          created_at?: string
          id?: string
          kabupaten?: string | null
          kecamatan?: string | null
          kode_puskesmas: string
          nama_puskesmas: string
          status?: Database["public"]["Enums"]["puskesmas_status"]
          telepon?: string | null
          updated_at?: string
        }
        Update: {
          alamat?: string | null
          created_at?: string
          id?: string
          kabupaten?: string | null
          kecamatan?: string | null
          kode_puskesmas?: string
          nama_puskesmas?: string
          status?: Database["public"]["Enums"]["puskesmas_status"]
          telepon?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      quarterly_evaluations: {
        Row: {
          analisis_pencapaian: string | null
          bundle_id: string
          created_at: string
          hambatan_kendala: string | null
          id: string
          periode_triwulan: number
          puskesmas_id: string
          rencana_tindak_lanjut: string | null
          tahun: number
          updated_at: string
          user_id: string
          verification_comment: string | null
          verification_status: Database["public"]["Enums"]["verification_status"]
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          analisis_pencapaian?: string | null
          bundle_id: string
          created_at?: string
          hambatan_kendala?: string | null
          id?: string
          periode_triwulan: number
          puskesmas_id: string
          rencana_tindak_lanjut?: string | null
          tahun: number
          updated_at?: string
          user_id: string
          verification_comment?: string | null
          verification_status?: Database["public"]["Enums"]["verification_status"]
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          analisis_pencapaian?: string | null
          bundle_id?: string
          created_at?: string
          hambatan_kendala?: string | null
          id?: string
          periode_triwulan?: number
          puskesmas_id?: string
          rencana_tindak_lanjut?: string | null
          tahun?: number
          updated_at?: string
          user_id?: string
          verification_comment?: string | null
          verification_status?: Database["public"]["Enums"]["verification_status"]
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quarterly_evaluations_bundle_id_fkey"
            columns: ["bundle_id"]
            isOneToOne: false
            referencedRelation: "bundles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quarterly_evaluations_puskesmas_id_fkey"
            columns: ["puskesmas_id"]
            isOneToOne: false
            referencedRelation: "puskesmas"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          created_at: string
          id: string
          jabatan: string | null
          nama_lengkap: string
          nip: string | null
          puskesmas_id: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          jabatan?: string | null
          nama_lengkap: string
          nip?: string | null
          puskesmas_id?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          jabatan?: string | null
          nama_lengkap?: string
          nip?: string | null
          puskesmas_id?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_puskesmas_id_fkey"
            columns: ["puskesmas_id"]
            isOneToOne: false
            referencedRelation: "puskesmas"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      bundle_status: "draft" | "aktif" | "selesai"
      indicator_type: "scoring" | "target_achievement"
      periodicity: "annual" | "monthly"
      puskesmas_status: "aktif" | "nonaktif"
      user_role: "admin_dinkes" | "petugas_puskesmas" | "verifikator"
      verification_status: "pending" | "approved" | "revision"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      bundle_status: ["draft", "aktif", "selesai"],
      indicator_type: ["scoring", "target_achievement"],
      periodicity: ["annual", "monthly"],
      puskesmas_status: ["aktif", "nonaktif"],
      user_role: ["admin_dinkes", "petugas_puskesmas", "verifikator"],
      verification_status: ["pending", "approved", "revision"],
    },
  },
} as const
