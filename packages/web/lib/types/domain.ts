// packages/web/lib/types/domain.ts
import type { ContentBlock } from "./message";

// Session domain type - what UI consumes
export interface Session {
  id: string;
  title: string | null;
  status: "processing" | "ready" | "failed";
  messageCount: number | null;
  errorMessage: string | null;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Message domain type - with typed content
export interface Message {
  id: number;
  idx: number;
  role: "user" | "assistant" | null;
  model: string | null;
  content: ContentBlock[];
  hasToolCalls: boolean;
  toolNames: string[];
  textPreview: string;
}

// Profile domain type
export interface Profile {
  id: string;
  email: string | null;
  name: string | null;
  avatarUrl: string | null;
}

// CLI Auth Session domain type
export interface CliAuthSession {
  id: string;
  sessionToken: string;
  userId: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: Date | null;
  completedAt: Date | null;
}

// Session with messages for viewer page
export interface SessionWithMessages {
  session: Session;
  messages: Message[];
}
