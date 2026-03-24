// ─── Panchangam Types ─────────────────────────────────────────────────────────

export interface TimeRange {
  start: string; // "HH:MM"
  end:   string;
}

export interface PanchangamDay {
  date:          string;        // "YYYY-MM-DD"
  tamilDate:     string;        // "பங்குனி 12"
  tamilMonth:    string;        // "பங்குனி"
  tamilYear:     string;        // "விஜய"
  tithi:         string;        // "Dwadashi"
  tithiEnd:      string;        // "HH:MM"
  natchathiram:  string;        // "Hastam"
  natchathiramEnd: string;
  yogam:         string;
  yogamEnd:      string;
  karanam:       string;
  karanamEnd:    string;
  sunrise:       string;        // "06:15"
  sunset:        string;        // "18:27"
  rahuKalam:     TimeRange;
  yamagandam:    TimeRange;
  kuligai:       TimeRange;
  nallaNeram:    TimeRange[];
  isFestival:    boolean;
  isHoliday:     boolean;
  festivals:     string[];
}

// ─── Festival Types ───────────────────────────────────────────────────────────

export type FestivalCategory = 'Hindu' | 'Muslim' | 'Christian' | 'Tamil' | 'National';

export interface Festival {
  id:         string;
  name:       string;
  tamilName?: string;
  date:       string;           // "YYYY-MM-DD"
  category:   FestivalCategory;
  isHoliday:  boolean;
  description?: string;
}

// ─── Rasipalan Types ──────────────────────────────────────────────────────────

export type RasiName =
  | 'Mesham' | 'Rishabam' | 'Midhunam' | 'Kadagam'
  | 'Simmam' | 'Kanni'    | 'Thulam'   | 'Viruchigam'
  | 'Thanusu'| 'Magaram'  | 'Kumbam'   | 'Meenam';

export interface RasiPrediction {
  rasi:       RasiName;
  period:     'daily' | 'weekly' | 'monthly' | 'yearly';
  date:       string;
  text:       string;
  luckyNumber: number;
  luckyColor:  string;
  luckyDirection: string;
  rating:     1 | 2 | 3 | 4 | 5;
}

// ─── Muhurtham Types ──────────────────────────────────────────────────────────

export type MuhurthamEventType =
  | 'Marriage' | 'GruhaPravesh' | 'BabyNaming'
  | 'Vehicle'  | 'Business'     | 'Travel';

export type MuhurthamQuality = 'Excellent' | 'Very Good' | 'Good' | 'Average';

export interface MuhurthamDate {
  date:       string;
  tamilDate:  string;
  dayName:    string;
  natchathiram: string;
  yogam:      string;
  quality:    MuhurthamQuality;
  score:      number;           // 0–100
  timeSlots:  TimeRange[];
}

// ─── User / Profile Types ─────────────────────────────────────────────────────

export interface FamilyMember {
  id:         string;
  name:       string;
  tamilName?: string;
  rasi:       RasiName;
  natchathiram: string;
  birthDate?: string;
  relation:   string;
}

export interface UserProfile {
  id:           string;
  name:         string;
  rasi:         RasiName;
  natchathiram: string;
  birthDate?:   string;
  familyMembers: FamilyMember[];
  isPremium:    boolean;
  premiumExpiry?: string;
  language:     'tamil' | 'english';
  theme:        'dark' | 'light';
  notifications: boolean;
}

// ─── Reminder / Planner Types ─────────────────────────────────────────────────

export interface Reminder {
  id:         string;
  title:      string;
  date:       string;
  time:       string;
  type:       'festival' | 'personal' | 'muhurtham';
  repeat:     'none' | 'daily' | 'weekly' | 'yearly';
  enabled:    boolean;
}

export interface PlannerNote {
  id:         string;
  date:       string;
  title:      string;
  body:       string;
  createdAt:  string;
}

// ─── Premium / IAP Types ──────────────────────────────────────────────────────

export type PlanId = 'free' | 'premium_monthly' | 'premium_yearly';

export interface SubscriptionPlan {
  id:         PlanId;
  name:       string;
  price:      number;
  currency:   'INR';
  period:     'month' | 'year' | null;
  productId:  string;           // App Store / Play Store SKU
  savings?:   string;
}
