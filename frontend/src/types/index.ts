export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  plan: "free" | "pro" | "enterprise";
  organizationId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Chatbot {
  id: string;
  name: string;
  websiteUrl: string;
  status: "active" | "training" | "inactive" | "error";
  model: string;
  temperature: number;
  systemPrompt: string;
  widgetColor: string;
  widgetPosition: "bottom-right" | "bottom-left";
  conversationCount: number;
  leadCount: number;
  lastTrainedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  id: string;
  chatbotId: string;
  visitorId: string;
  status: "active" | "ended";
  messages: Message[];
  metadata: {
    url: string;
    userAgent: string;
    country?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
}

export interface Lead {
  id: string;
  chatbotId: string;
  conversationId: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  source: string;
  status: "new" | "contacted" | "qualified" | "converted";
  createdAt: string;
}

export interface AnalyticsSummary {
  totalConversations: number;
  totalMessages: number;
  avgResponseTime: number;
  satisfactionRate: number;
  leadsGenerated: number;
  conversionRate: number;
  topQuestions: { question: string; count: number }[];
  dailyConversations: { date: string; count: number }[];
}
