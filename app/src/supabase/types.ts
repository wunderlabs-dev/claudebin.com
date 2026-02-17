export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.1";
  };
  public: {
    Tables: {
      cli_auth_sessions: {
        Row: {
          accessToken: string | null;
          completedAt: string | null;
          createdAt: string;
          expiresAt: string | null;
          id: string;
          refreshToken: string | null;
          sessionToken: string;
          userId: string | null;
        };
        Insert: {
          accessToken?: string | null;
          completedAt?: string | null;
          createdAt?: string;
          expiresAt?: string | null;
          id?: string;
          refreshToken?: string | null;
          sessionToken: string;
          userId?: string | null;
        };
        Update: {
          accessToken?: string | null;
          completedAt?: string | null;
          createdAt?: string;
          expiresAt?: string | null;
          id?: string;
          refreshToken?: string | null;
          sessionToken?: string;
          userId?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "cli_auth_sessions_user_id_fkey";
            columns: ["userId"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      messages: {
        Row: {
          content: Json;
          createdAt: string;
          hasToolCalls: boolean;
          id: number;
          idx: number;
          isMeta: boolean;
          isSidechain: boolean;
          model: string | null;
          parentUuid: string | null;
          rawMessage: Json;
          role: string | null;
          sessionId: string;
          textPreview: string;
          timestamp: string;
          toolNames: string[];
          type: string;
          uuid: string;
        };
        Insert: {
          content: Json;
          createdAt?: string;
          hasToolCalls?: boolean;
          id?: never;
          idx: number;
          isMeta?: boolean;
          isSidechain?: boolean;
          model?: string | null;
          parentUuid?: string | null;
          rawMessage: Json;
          role?: string | null;
          sessionId: string;
          textPreview?: string;
          timestamp: string;
          toolNames?: string[];
          type: string;
          uuid: string;
        };
        Update: {
          content?: Json;
          createdAt?: string;
          hasToolCalls?: boolean;
          id?: never;
          idx?: number;
          isMeta?: boolean;
          isSidechain?: boolean;
          model?: string | null;
          parentUuid?: string | null;
          rawMessage?: Json;
          role?: string | null;
          sessionId?: string;
          textPreview?: string;
          timestamp?: string;
          toolNames?: string[];
          type?: string;
          uuid?: string;
        };
        Relationships: [
          {
            foreignKeyName: "messages_session_id_fkey";
            columns: ["sessionId"];
            isOneToOne: false;
            referencedRelation: "sessions";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          avatarUrl: string | null;
          createdAt: string;
          deletedAt: string | null;
          id: string;
          name: string | null;
          updatedAt: string;
          username: string | null;
          viewCount: number;
        };
        Insert: {
          avatarUrl?: string | null;
          createdAt?: string;
          deletedAt?: string | null;
          id: string;
          name?: string | null;
          updatedAt?: string;
          username?: string | null;
          viewCount?: number;
        };
        Update: {
          avatarUrl?: string | null;
          createdAt?: string;
          deletedAt?: string | null;
          id?: string;
          name?: string | null;
          updatedAt?: string;
          username?: string | null;
          viewCount?: number;
        };
        Relationships: [];
      };
      session_likes: {
        Row: {
          id: string;
          sessionId: string;
          userId: string;
          createdAt: string;
        };
        Insert: {
          id?: string;
          sessionId: string;
          userId: string;
          createdAt?: string;
        };
        Update: {
          id?: string;
          sessionId?: string;
          userId?: string;
          createdAt?: string;
        };
        Relationships: [
          {
            foreignKeyName: "session_likes_session_id_fkey";
            columns: ["sessionId"];
            isOneToOne: false;
            referencedRelation: "sessions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "session_likes_user_id_fkey";
            columns: ["userId"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      sessions: {
        Row: {
          createdAt: string;
          errorMessage: string | null;
          fileCount: number;
          id: string;
          isFeatured: boolean;
          isPublic: boolean;
          likeCount: number;
          messageCount: number | null;
          modelName: string | null;
          status: string;
          storagePath: string | null;
          title: string | null;
          updatedAt: string;
          userId: string;
          viewCount: number;
          workingDir: string | null;
        };
        Insert: {
          createdAt?: string;
          errorMessage?: string | null;
          fileCount?: number;
          id: string;
          isFeatured?: boolean;
          isPublic?: boolean;
          likeCount?: number;
          messageCount?: number | null;
          modelName?: string | null;
          status?: string;
          storagePath?: string | null;
          title?: string | null;
          updatedAt?: string;
          userId: string;
          viewCount?: number;
          workingDir?: string | null;
        };
        Update: {
          createdAt?: string;
          errorMessage?: string | null;
          fileCount?: number;
          id?: string;
          isFeatured?: boolean;
          isPublic?: boolean;
          likeCount?: number;
          messageCount?: number | null;
          modelName?: string | null;
          status?: string;
          storagePath?: string | null;
          title?: string | null;
          updatedAt?: string;
          userId?: string;
          viewCount?: number;
          workingDir?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "sessions_user_id_fkey";
            columns: ["userId"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      increment_session_view_count: {
        Args: {
          session_id: string;
        };
        Returns: undefined;
      };
      increment_profile_view_count: {
        Args: {
          profile_id: string;
        };
        Returns: undefined;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
