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
      issue: {
        Row: {
          created_at: string
          description: string
          id: number
          status: Database["public"]["Enums"]["issue_status"]
          type_id: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: number
          status?: Database["public"]["Enums"]["issue_status"]
          type_id: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: number
          status?: Database["public"]["Enums"]["issue_status"]
          type_id?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "issue_type_id_fkey"
            columns: ["type_id"]
            isOneToOne: false
            referencedRelation: "issue_type"
            referencedColumns: ["id"]
          },
        ]
      }
      issue_type: {
        Row: {
          created_at: string
          description: string | null
          id: number
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      orchestra: {
        Row: {
          id: number
          is_modern: boolean
          name: string
        }
        Insert: {
          id?: number
          is_modern?: boolean
          name: string
        }
        Update: {
          id?: number
          is_modern?: boolean
          name?: string
        }
        Relationships: []
      }
      playlist: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          spotify_link: string | null
          title: string
          user_id: string | null
          visibility: Database["public"]["Enums"]["visibility"] | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          spotify_link?: string | null
          title: string
          user_id?: string | null
          visibility?: Database["public"]["Enums"]["visibility"] | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          spotify_link?: string | null
          title?: string
          user_id?: string | null
          visibility?: Database["public"]["Enums"]["visibility"] | null
        }
        Relationships: []
      }
      playlist_shared: {
        Row: {
          playlist_id: number
          user_id: string
        }
        Insert: {
          playlist_id: number
          user_id: string
        }
        Update: {
          playlist_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "playlist_shared_playlist_id_fkey"
            columns: ["playlist_id"]
            isOneToOne: false
            referencedRelation: "playlist"
            referencedColumns: ["id"]
          },
        ]
      }
      playlist_tanda: {
        Row: {
          order_in_playlist: number
          playlist_id: number
          tanda_id: number
        }
        Insert: {
          order_in_playlist: number
          playlist_id: number
          tanda_id: number
        }
        Update: {
          order_in_playlist?: number
          playlist_id?: number
          tanda_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "playlist_tanda_playlist_id_fkey"
            columns: ["playlist_id"]
            isOneToOne: false
            referencedRelation: "playlist"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "playlist_tanda_tanda_id_fkey"
            columns: ["tanda_id"]
            isOneToOne: false
            referencedRelation: "tanda"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          updated_at: string
          username: string
        }
        Insert: {
          created_at?: string
          id: string
          updated_at?: string
          username: string
        }
        Update: {
          created_at?: string
          id?: string
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      roles: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      singer: {
        Row: {
          id: number
          name: string
          sex: Database["public"]["Enums"]["gender"]
        }
        Insert: {
          id?: number
          name: string
          sex: Database["public"]["Enums"]["gender"]
        }
        Update: {
          id?: number
          name?: string
          sex?: Database["public"]["Enums"]["gender"]
        }
        Relationships: []
      }
      song: {
        Row: {
          duration: number | null
          id: number
          is_instrumental: boolean | null
          orchestra_id: number | null
          recording_year: number | null
          spotify_id: string | null
          style: Database["public"]["Enums"]["song_style"]
          title: string
          type: Database["public"]["Enums"]["song_type"]
        }
        Insert: {
          duration?: number | null
          id?: number
          is_instrumental?: boolean | null
          orchestra_id?: number | null
          recording_year?: number | null
          spotify_id?: string | null
          style: Database["public"]["Enums"]["song_style"]
          title: string
          type: Database["public"]["Enums"]["song_type"]
        }
        Update: {
          duration?: number | null
          id?: number
          is_instrumental?: boolean | null
          orchestra_id?: number | null
          recording_year?: number | null
          spotify_id?: string | null
          style?: Database["public"]["Enums"]["song_style"]
          title?: string
          type?: Database["public"]["Enums"]["song_type"]
        }
        Relationships: [
          {
            foreignKeyName: "song_orchestra_id_fkey"
            columns: ["orchestra_id"]
            isOneToOne: false
            referencedRelation: "orchestra"
            referencedColumns: ["id"]
          },
        ]
      }
      song_singer: {
        Row: {
          singer_id: number
          song_id: number
        }
        Insert: {
          singer_id: number
          song_id: number
        }
        Update: {
          singer_id?: number
          song_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "song_singer_singer_id_fkey"
            columns: ["singer_id"]
            isOneToOne: false
            referencedRelation: "singer"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "song_singer_song_id_fkey"
            columns: ["song_id"]
            isOneToOne: false
            referencedRelation: "song"
            referencedColumns: ["id"]
          },
        ]
      }
      suggested_song: {
        Row: {
          created_at: string | null
          duration: number | null
          id: number
          is_instrumental: boolean | null
          orchestra_id: number | null
          recording_year: number | null
          spotify_id: string | null
          status: string | null
          style: Database["public"]["Enums"]["song_style"]
          title: string
          type: Database["public"]["Enums"]["song_type"]
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          duration?: number | null
          id?: number
          is_instrumental?: boolean | null
          orchestra_id?: number | null
          recording_year?: number | null
          spotify_id?: string | null
          status?: string | null
          style: Database["public"]["Enums"]["song_style"]
          title: string
          type: Database["public"]["Enums"]["song_type"]
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          duration?: number | null
          id?: number
          is_instrumental?: boolean | null
          orchestra_id?: number | null
          recording_year?: number | null
          spotify_id?: string | null
          status?: string | null
          style?: Database["public"]["Enums"]["song_style"]
          title?: string
          type?: Database["public"]["Enums"]["song_type"]
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "suggested_song_orchestra_id_fkey"
            columns: ["orchestra_id"]
            isOneToOne: false
            referencedRelation: "orchestra"
            referencedColumns: ["id"]
          },
        ]
      }
      suggested_song_singer: {
        Row: {
          singer_id: number
          suggested_song_id: number
        }
        Insert: {
          singer_id: number
          suggested_song_id: number
        }
        Update: {
          singer_id?: number
          suggested_song_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "suggested_song_singer_singer_id_fkey"
            columns: ["singer_id"]
            isOneToOne: false
            referencedRelation: "singer"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suggested_song_singer_suggested_song_id_fkey"
            columns: ["suggested_song_id"]
            isOneToOne: false
            referencedRelation: "suggested_song"
            referencedColumns: ["id"]
          },
        ]
      }
      tanda: {
        Row: {
          comments: string | null
          created_at: string | null
          id: number
          spotify_link: string | null
          title: string
          user_id: string | null
          visibility: Database["public"]["Enums"]["visibility"] | null
        }
        Insert: {
          comments?: string | null
          created_at?: string | null
          id?: number
          spotify_link?: string | null
          title: string
          user_id?: string | null
          visibility?: Database["public"]["Enums"]["visibility"] | null
        }
        Update: {
          comments?: string | null
          created_at?: string | null
          id?: number
          spotify_link?: string | null
          title?: string
          user_id?: string | null
          visibility?: Database["public"]["Enums"]["visibility"] | null
        }
        Relationships: []
      }
      tanda_shared: {
        Row: {
          tanda_id: number
          user_id: string
        }
        Insert: {
          tanda_id: number
          user_id: string
        }
        Update: {
          tanda_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tanda_shared_tanda_id_fkey"
            columns: ["tanda_id"]
            isOneToOne: false
            referencedRelation: "tanda"
            referencedColumns: ["id"]
          },
        ]
      }
      tanda_song: {
        Row: {
          is_active: boolean | null
          order_in_tanda: number
          song_id: number
          tanda_id: number
        }
        Insert: {
          is_active?: boolean | null
          order_in_tanda: number
          song_id: number
          tanda_id: number
        }
        Update: {
          is_active?: boolean | null
          order_in_tanda?: number
          song_id?: number
          tanda_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "tanda_song_song_id_fkey"
            columns: ["song_id"]
            isOneToOne: false
            referencedRelation: "song"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tanda_song_tanda_id_fkey"
            columns: ["tanda_id"]
            isOneToOne: false
            referencedRelation: "tanda"
            referencedColumns: ["id"]
          },
        ]
      }
      user_playlist_likes: {
        Row: {
          liked_at: string
          playlist_id: number
          user_id: string
        }
        Insert: {
          liked_at?: string
          playlist_id: number
          user_id: string
        }
        Update: {
          liked_at?: string
          playlist_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_playlist_likes_playlist_id_fkey"
            columns: ["playlist_id"]
            isOneToOne: false
            referencedRelation: "playlist"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          role_id: number
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          role_id: number
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          role_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_song_likes: {
        Row: {
          liked_at: string | null
          song_id: number
          user_id: string
        }
        Insert: {
          liked_at?: string | null
          song_id: number
          user_id: string
        }
        Update: {
          liked_at?: string | null
          song_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_song_likes_song_id_fkey"
            columns: ["song_id"]
            isOneToOne: false
            referencedRelation: "song"
            referencedColumns: ["id"]
          },
        ]
      }
      user_tanda_likes: {
        Row: {
          liked_at: string
          tanda_id: number
          user_id: string
        }
        Insert: {
          liked_at?: string
          tanda_id: number
          user_id: string
        }
        Update: {
          liked_at?: string
          tanda_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_tanda_likes_tanda_id_fkey"
            columns: ["tanda_id"]
            isOneToOne: false
            referencedRelation: "tanda"
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
      gender: "male" | "female"
      issue_status: "pending" | "resolved" | "rejected"
      song_style: "rhythmic" | "melodic" | "dramatic"
      song_type: "tango" | "milonga" | "vals"
      visibility: "private" | "public" | "shared"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
