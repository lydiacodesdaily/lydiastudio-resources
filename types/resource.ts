export type Category = "tool" | "method" | "community" | "content" | "physical";

export type SupportNeed =
  | "time_blindness"
  | "task_initiation"
  | "prioritization"
  | "planning"
  | "working_memory"
  | "follow_through"
  | "focus"
  | "distraction"
  | "transitioning"
  | "overwhelm"
  | "sensory_sensitivity"
  | "low_energy"
  | "accessibility_support";

export type SensoryLoad = "low" | "medium" | "high";
export type SetupEffort = "low" | "medium" | "high";
export type PriceType = "free" | "freemium" | "paid";

export type Resource = {
  id: string;
  title: string;
  url: string;
  description: string;
  why_it_helps: string;
  category: Category;
  support_needs: SupportNeed[];
  sensory_load: SensoryLoad;
  setup_effort: SetupEffort;
  price_type: PriceType;
  featured: boolean;
  affiliate_url: string | null;
  is_affiliate: boolean;
  domain: string;
};

export const SUPPORT_NEED_LABELS: Record<SupportNeed, string> = {
  time_blindness: "Time awareness",
  task_initiation: "Starting tasks",
  prioritization: "Prioritizing",
  planning: "Planning & organization",
  working_memory: "Remembering steps & details",
  follow_through: "Following through",
  focus: "Staying focused",
  distraction: "Reducing distractions",
  transitioning: "Switching tasks",
  overwhelm: "Feeling overwhelmed",
  sensory_sensitivity: "Sensory sensitivity",
  low_energy: "Low-energy days",
  accessibility_support: "Accessibility support",
};

export const CATEGORY_LABELS: Record<Category, string> = {
  tool: "Tool",
  method: "Method",
  community: "Community",
  content: "Content",
  physical: "Physical",
};
