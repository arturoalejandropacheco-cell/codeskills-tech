// Auto-generated Supabase types
// Regenerate with: bun run db:types
// Requires Docker + `supabase start`

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          icon: string | null;
          item_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          icon?: string | null;
          item_count?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          icon?: string | null;
          item_count?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          username: string;
          display_name: string | null;
          avatar_url: string | null;
          github_username: string | null;
          bio: string | null;
          country: string | null;
          items_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          display_name?: string | null;
          avatar_url?: string | null;
          github_username?: string | null;
          bio?: string | null;
          country?: string | null;
          items_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          github_username?: string | null;
          bio?: string | null;
          country?: string | null;
          items_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      items: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string;
          content: string;
          type: string;
          editors: string[];
          tags: string[];
          language: string;
          github_url: string | null;
          author_id: string | null;
          status: string;
          installs: number;
          upvotes: number;
          featured: boolean;
          created_at: string;
          updated_at: string;
          published_at: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          description: string;
          content: string;
          type: string;
          editors?: string[];
          tags?: string[];
          language?: string;
          github_url?: string | null;
          author_id?: string | null;
          status?: string;
          installs?: number;
          upvotes?: number;
          featured?: boolean;
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          description?: string;
          content?: string;
          type?: string;
          editors?: string[];
          tags?: string[];
          language?: string;
          github_url?: string | null;
          author_id?: string | null;
          status?: string;
          installs?: number;
          upvotes?: number;
          featured?: boolean;
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "items_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      installs: {
        Row: {
          id: string;
          item_id: string;
          editor: string | null;
          country: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          item_id: string;
          editor?: string | null;
          country?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          item_id?: string;
          editor?: string | null;
          country?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "installs_item_id_fkey";
            columns: ["item_id"];
            isOneToOne: false;
            referencedRelation: "items";
            referencedColumns: ["id"];
          },
        ];
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
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
