export type TravelType = 'Solo' | 'Couple' | 'Family' | 'Friends' | 'Business';

export interface TripFormData {
  name: string;
  email: string;
  source: string;
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  budget: number;
  interests: string;
  travelType: TravelType;
}

export interface SubmissionResponse {
  success: boolean;
  status?: number;
  message?: string;
  referenceCode?: string;
  submittedAt?: string;
  error?: string;
}

export interface DestinationTemplate {
  id: string;
  title: string;
  country: string;
  tagline: string;
  image: string;
  suggestedDuration: string;
  suggestedNights: number;
  defaultTravelType: TravelType;
  estimatedBudget: number;
  interests: string[];
  description: string;
  highlights: string[];
}
