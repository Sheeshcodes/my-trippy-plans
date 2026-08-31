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
    PostgrestVersion: "14.17"
  }
  public: {
    Tables: {
      groups: {
        Row: {
          admin_key: string
          allow_lurking: boolean
          allow_plus_one: boolean
          budget_rule: string
          budget_tiers: Json | null
          created_at: string
          currency: string
          holiday_ids: string[]
          id: string
          name: string
          organiser_name: string | null
          recs: Json | null
          recs_run_at: string | null
          recs_updated_at: string | null
          region: string
          states: string[]
          trip_len_max: number | null
          trip_len_min: number | null
          vote_by: string | null
          window_end: string | null
          window_start: string | null
        }
        Insert: {
          admin_key: string
          allow_lurking?: boolean
          allow_plus_one?: boolean
          budget_rule?: string
          budget_tiers?: Json | null
          created_at?: string
          currency?: string
          holiday_ids?: string[]
          id: string
          name?: string
          organiser_name?: string | null
          recs?: Json | null
          recs_run_at?: string | null
          recs_updated_at?: string | null
          region?: string
          states?: string[]
          trip_len_max?: number | null
          trip_len_min?: number | null
          vote_by?: string | null
          window_end?: string | null
          window_start?: string | null
        }
        Update: {
          admin_key?: string
          allow_lurking?: boolean
          allow_plus_one?: boolean
          budget_rule?: string
          budget_tiers?: Json | null
          created_at?: string
          currency?: string
          holiday_ids?: string[]
          id?: string
          name?: string
          organiser_name?: string | null
          recs?: Json | null
          recs_run_at?: string | null
          recs_updated_at?: string | null
          region?: string
          states?: string[]
          trip_len_max?: number | null
          trip_len_min?: number | null
          vote_by?: string | null
          window_end?: string | null
          window_start?: string | null
        }
        Relationships: []
      }
      responses: {
        Row: {
          begin: number | null
          device: string | null
          doodle: string | null
          end: number | null
          group_id: string
          id: number
          key: string
          lat: number | null
          leave: string | null
          lng: number | null
          name: string | null
          need: string | null
          place: string | null
          plus: string | null
          rec: string | null
          recText: string | null
          spend: string | null
          sure: string | null
          ts: number | null
          types: string | null
          updated: string
          vibe: string | null
        }
        Insert: {
          begin?: number | null
          device?: string | null
          doodle?: string | null
          end?: number | null
          group_id?: string
          id?: number
          key: string
          lat?: number | null
          leave?: string | null
          lng?: number | null
          name?: string | null
          need?: string | null
          place?: string | null
          plus?: string | null
          rec?: string | null
          recText?: string | null
          spend?: string | null
          sure?: string | null
          ts?: number | null
          types?: string | null
          updated?: string
          vibe?: string | null
        }
        Update: {
          begin?: number | null
          device?: string | null
          doodle?: string | null
          end?: number | null
          group_id?: string
          id?: number
          key?: string
          lat?: number | null
          leave?: string | null
          lng?: number | null
          name?: string | null
          need?: string | null
          place?: string | null
          plus?: string | null
          rec?: string | null
          recText?: string | null
          spend?: string | null
          sure?: string | null
          ts?: number | null
          types?: string | null
          updated?: string
          vibe?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "responses_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
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
      [_ in never]: never
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
    Enums: {},
  },
} as const
