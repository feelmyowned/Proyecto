export interface DatePlan {
  activity: string;
  cuisine: string;
  vibe: string;
  timing: string;
}

export interface OptionCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  badge?: string;
}

export type InvitationState = 'sealed' | 'proposing' | 'planning' | 'confirmed';
