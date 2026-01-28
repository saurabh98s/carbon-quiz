// Type definitions for the Carbon Readiness Quiz

export interface QuizQuestion {
  id: number;
  section: QuizSection;
  statement: string;
  explanation?: string;
  category: string;
}

export interface QuizSection {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}

export interface QuizAnswer {
  questionId: number;
  score: number;
  timestamp: Date;
}

export interface QuizResult {
  totalScore: number;
  maxScore: number;
  percentage: number;
  tier: QuizTier;
  sectionScores: Record<string, SectionScore>;
  recommendations: string[];
  timestamp: Date;
}

export interface SectionScore {
  sectionId: string;
  sectionName: string;
  score: number;
  maxScore: number;
  percentage: number;
  tier: QuizTier;
}

export interface QuizTier {
  name: string;
  emoji: string;
  description: string;
  range: string;
  color: string;
}

// Basic user information collected before starting the quiz
export interface UserInfo {
  name: string;
  email: string;
  company: string;
  role: string;
}

export const QUIZ_TIERS: QuizTier[] = [
  {
    name: "Explorer",
    emoji: "🌱",
    description: "Just getting started. Room for major impact.",
    range: "0–30%",
    color: "#ef4444"
  },
  {
    name: "Builder",
    emoji: "🌿",
    description: "Taking steps toward sustainability. Good foundation.",
    range: "31–60%",
    color: "#f59e0b"
  },
  {
    name: "Achiever",
    emoji: "🌲",
    description: "Mature practices. Close to audit-ready.",
    range: "61–85%",
    color: "#3b82f6"
  },
  {
    name: "Leader",
    emoji: "🌳",
    description: "Green trailblazer. Ready for certification.",
    range: "86–100%",
    color: "#22c55e"
  }
];

export const QUIZ_SECTIONS: QuizSection[] = [
  {
    id: "energy-emissions",
    name: "Energy & Emissions",
    icon: "⚡",
    color: "#22c55e",
    description: "Track and reduce your carbon footprint through energy management"
  },
  {
    id: "water-treatment",
    name: "Water Use & Treatment",
    icon: "💧",
    color: "#06b6d4",
    description: "Monitor and optimize water consumption and treatment"
  },
  {
    id: "waste-circularity",
    name: "Waste & Circularity",
    icon: "♻️",
    color: "#8b5cf6",
    description: "Implement circular economy principles and reduce waste"
  },
  {
    id: "sustainable-procurement",
    name: "Sustainable Procurement",
    icon: "📦",
    color: "#f59e0b",
    description: "Choose eco-friendly suppliers and assess supply chain impact"
  },
  {
    id: "esg-compliance",
    name: "ESG Compliance & Integrity",
    icon: "📊",
    color: "#3b82f6",
    description: "Ensure regulatory compliance and transparent reporting"
  },
  {
    id: "governance-culture",
    name: "Governance & Culture",
    icon: "👥",
    color: "#ec4899",
    description: "Build sustainable leadership and employee engagement"
  },
  {
    id: "nature-community",
    name: "Nature & Community Impact",
    icon: "🌳",
    color: "#10b981",
    description: "Protect ecosystems and support local communities"
  },
  {
    id: "digital-efficiency",
    name: "Digital & Operational Efficiency",
    icon: "🖥️",
    color: "#6366f1",
    description: "Leverage technology for sustainable operations"
  },
  {
    id: "audit-readiness",
    name: "Audit Readiness & Transparency",
    icon: "📈",
    color: "#14b8a6",
    description: "Prepare for audits and demonstrate transparency"
  }
];
