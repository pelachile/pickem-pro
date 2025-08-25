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
      games: {
        Row: {
          away_score: number | null
          away_team_id: number | null
          created_at: string | null
          espn_id: string
          game_date: string
          game_status_detail: string | null
          home_score: number | null
          home_team_id: number | null
          id: number
          season_type: string
          season_year: number
          status: string
          updated_at: string | null
          week: number
        }
        Insert: {
          away_score?: number | null
          away_team_id?: number | null
          created_at?: string | null
          espn_id: string
          game_date: string
          game_status_detail?: string | null
          home_score?: number | null
          home_team_id?: number | null
          id?: never
          season_type?: string
          season_year: number
          status?: string
          updated_at?: string | null
          week: number
        }
        Update: {
          away_score?: number | null
          away_team_id?: number | null
          created_at?: string | null
          espn_id?: string
          game_date?: string
          game_status_detail?: string | null
          home_score?: number | null
          home_team_id?: number | null
          id?: never
          season_type?: string
          season_year?: number
          status?: string
          updated_at?: string | null
          week?: number
        }
        Relationships: [
          {
            foreignKeyName: "games_away_team_id_fkey"
            columns: ["away_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "games_home_team_id_fkey"
            columns: ["home_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      league_invites: {
        Row: {
          created_at: string | null
          created_by: string | null
          expires_at: string | null
          id: string
          invite_code: string
          league_id: string | null
          max_uses: number | null
          uses_count: number | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          expires_at?: string | null
          id?: string
          invite_code: string
          league_id?: string | null
          max_uses?: number | null
          uses_count?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          expires_at?: string | null
          id?: string
          invite_code?: string
          league_id?: string | null
          max_uses?: number | null
          uses_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "league_invites_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues"
            referencedColumns: ["id"]
          },
        ]
      }
      league_members: {
        Row: {
          id: string
          joined_at: string | null
          league_id: string | null
          role: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          joined_at?: string | null
          league_id?: string | null
          role?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          joined_at?: string | null
          league_id?: string | null
          role?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "league_members_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues"
            referencedColumns: ["id"]
          },
        ]
      }
      leagues: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          entry_fee: number | null
          id: string
          invite_code: string | null
          is_private: boolean | null
          max_members: number | null
          name: string
          password_hash: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          entry_fee?: number | null
          id?: string
          invite_code?: string | null
          is_private?: boolean | null
          max_members?: number | null
          name: string
          password_hash?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          entry_fee?: number | null
          id?: string
          invite_code?: string | null
          is_private?: boolean | null
          max_members?: number | null
          name?: string
          password_hash?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      picks: {
        Row: {
          confidence_points: number | null
          created_at: string | null
          game_id: number
          id: string
          is_correct: boolean | null
          league_id: string
          picked_team_id: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          confidence_points?: number | null
          created_at?: string | null
          game_id: number
          id?: string
          is_correct?: boolean | null
          league_id: string
          picked_team_id: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          confidence_points?: number | null
          created_at?: string | null
          game_id?: number
          id?: string
          is_correct?: boolean | null
          league_id?: string
          picked_team_id?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "picks_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "picks_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "picks_picked_team_id_fkey"
            columns: ["picked_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: []
      }
      teams: {
        Row: {
          abbreviation: string
          conference: string
          created_at: string | null
          display_name: string
          division: string
          espn_id: string
          id: number
          is_active: boolean | null
          location: string
          logo_url: string | null
          name: string
          nickname: string | null
          primary_color: string | null
          secondary_color: string | null
          short_display_name: string
          updated_at: string | null
        }
        Insert: {
          abbreviation: string
          conference: string
          created_at?: string | null
          display_name: string
          division: string
          espn_id: string
          id?: never
          is_active?: boolean | null
          location: string
          logo_url?: string | null
          name: string
          nickname?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          short_display_name: string
          updated_at?: string | null
        }
        Update: {
          abbreviation?: string
          conference?: string
          created_at?: string | null
          display_name?: string
          division?: string
          espn_id?: string
          id?: never
          is_active?: boolean | null
          location?: string
          logo_url?: string | null
          name?: string
          nickname?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          short_display_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_access_league: {
        Args: { league_uuid: string; user_uuid?: string }
        Returns: boolean
      }
      can_manage_league_membership: {
        Args: { league_uuid: string; user_uuid?: string }
        Returns: boolean
      }
      can_modify_league: {
        Args: { league_uuid: string; user_uuid?: string }
        Returns: boolean
      }
      can_pick_game: {
        Args: { game_bigint: number }
        Returns: boolean
      }
      can_view_league_members: {
        Args: { league_uuid: string; user_uuid?: string }
        Returns: boolean
      }
      can_view_user_profile: {
        Args: { target_user_uuid: string; viewing_user_uuid?: string }
        Returns: boolean
      }
      execute_sql: {
        Args: { query: string; read_only?: boolean }
        Returns: Json
      }
      generate_invite_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_league_ids: {
        Args: { user_uuid?: string }
        Returns: string[]
      }
      is_league_admin: {
        Args: { league_uuid: string; user_uuid?: string }
        Returns: boolean
      }
      is_league_creator: {
        Args: { league_uuid: string; user_uuid?: string }
        Returns: boolean
      }
      is_league_member: {
        Args: { league_uuid: string; user_uuid?: string }
        Returns: boolean
      }
      league_has_capacity: {
        Args: { league_uuid: string }
        Returns: boolean
      }
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

