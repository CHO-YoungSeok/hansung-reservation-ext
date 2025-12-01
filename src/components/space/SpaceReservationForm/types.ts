export interface SpaceSummary {
  id: string;
  name: string;
  location?: string;
  capacity: number;
  facilities?: string[];
  description?: string;
  coverImageUrl?: string;
  managerContact?: string;
  operatingHours?: string;
  roomGroup?: string;
}

export interface ApplicantProfile {
  name: string;
  studentId: string;
  phone: string;
  email: string;
}

export interface TimeSlot {
  id: string;
  label: string;
  status: 'available' | 'selected' | 'blocked';
}

export interface ReservationFormValues {
  buildingGroup: string;
  spaceId: string;
  reservationDate: string;
  phone: string;
  email: string;
  selectedTimeSlots: string[];
  allUsers: string;
  totalUsers: number;
}