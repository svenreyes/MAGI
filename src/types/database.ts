/**
 * Supabase database type definitions.
 *
 * These mirror `supabase/migrations/0001_init.sql` using snake_case column
 * names (Postgres convention). The app's domain models (camelCase) are mapped
 * to/from these rows in the service layer.
 *
 * Once the Supabase CLI is wired up you can regenerate this file with:
 *   npx supabase gen types typescript --local > src/types/database.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// --- users ----------------------------------------------------------------
interface UserRow {
  id: string;
  email: string;
  created_at: string;
}
type UserInsert = { id: string; email: string; created_at?: string };

// --- profiles --------------------------------------------------------------
interface ProfileRow {
  id: string;
  user_id: string;
  username: string;
  display_name: string;
  bio: string | null;
  avatar_url: string | null;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}
interface ProfileInsert {
  id?: string;
  user_id: string;
  username: string;
  display_name: string;
  bio?: string | null;
  avatar_url?: string | null;
  onboarding_completed?: boolean;
  created_at?: string;
  updated_at?: string;
}

// --- personality_agents ----------------------------------------------------
interface AgentRow {
  id: string;
  user_id: string;
  name: string;
  description: string;
  personality_prompt: string;
  visual_style: string;
  color_palette: Json;
  avatar_url: string | null;
  avatar_prompt: string | null;
  default_visibility: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
interface AgentInsert {
  id?: string;
  user_id: string;
  name: string;
  description: string;
  personality_prompt: string;
  visual_style: string;
  color_palette: Json;
  avatar_url?: string | null;
  avatar_prompt?: string | null;
  default_visibility?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

// --- personality_snapshots -------------------------------------------------
interface SnapshotRow {
  id: string;
  agent_id: string;
  user_id: string;
  traits: Json;
  summary: string;
  embedding: string | null;
  created_at: string;
}
interface SnapshotInsert {
  id?: string;
  agent_id: string;
  user_id: string;
  traits: Json;
  summary: string;
  embedding?: string | null;
  created_at?: string;
}

// --- social_circles --------------------------------------------------------
interface CircleRow {
  id: string;
  user_id: string;
  type: string;
  name: string;
  description: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}
interface CircleInsert {
  id?: string;
  user_id: string;
  type: string;
  name: string;
  description?: string | null;
  is_public?: boolean;
  created_at?: string;
  updated_at?: string;
}

// --- circle_members --------------------------------------------------------
interface CircleMemberRow {
  id: string;
  circle_id: string;
  member_user_id: string;
  member_display_name: string;
  created_at: string;
}
interface CircleMemberInsert {
  id?: string;
  circle_id: string;
  member_user_id: string;
  member_display_name: string;
  created_at?: string;
}

// --- agent_visibility_rules ------------------------------------------------
interface VisibilityRuleRow {
  id: string;
  user_id: string;
  agent_id: string;
  circle_id: string;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}
interface VisibilityRuleInsert {
  id?: string;
  user_id: string;
  agent_id: string;
  circle_id: string;
  is_visible?: boolean;
  created_at?: string;
  updated_at?: string;
}

// --- journal_entries -------------------------------------------------------
interface JournalRow {
  id: string;
  user_id: string;
  title: string | null;
  content: string;
  embedding: string | null;
  created_at: string;
  updated_at: string;
}
interface JournalInsert {
  id?: string;
  user_id: string;
  title?: string | null;
  content: string;
  embedding?: string | null;
  created_at?: string;
  updated_at?: string;
}

// --- agent_interactions ----------------------------------------------------
interface InteractionRow {
  id: string;
  owner_user_id: string;
  agent_id: string;
  viewer_user_id: string;
  messages: Json;
  created_at: string;
  updated_at: string;
}
interface InteractionInsert {
  id?: string;
  owner_user_id: string;
  agent_id: string;
  viewer_user_id: string;
  messages?: Json;
  created_at?: string;
  updated_at?: string;
}

// --- memory_imports --------------------------------------------------------
interface MemoryImportRow {
  id: string;
  user_id: string;
  source: string;
  prompt: string;
  raw_response: string;
  embedding: string | null;
  created_at: string;
}
interface MemoryImportInsert {
  id?: string;
  user_id: string;
  source: string;
  prompt: string;
  raw_response: string;
  embedding?: string | null;
  created_at?: string;
}

interface TableShape<Row, Insert> {
  Row: Row;
  Insert: Insert;
  Update: Partial<Insert>;
}

export interface Database {
  public: {
    Tables: {
      users: TableShape<UserRow, UserInsert>;
      profiles: TableShape<ProfileRow, ProfileInsert>;
      personality_agents: TableShape<AgentRow, AgentInsert>;
      personality_snapshots: TableShape<SnapshotRow, SnapshotInsert>;
      social_circles: TableShape<CircleRow, CircleInsert>;
      circle_members: TableShape<CircleMemberRow, CircleMemberInsert>;
      agent_visibility_rules: TableShape<VisibilityRuleRow, VisibilityRuleInsert>;
      journal_entries: TableShape<JournalRow, JournalInsert>;
      agent_interactions: TableShape<InteractionRow, InteractionInsert>;
      memory_imports: TableShape<MemoryImportRow, MemoryImportInsert>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
