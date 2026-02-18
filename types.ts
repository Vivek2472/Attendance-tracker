
export interface TimeSlot {
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, ... 6 = Saturday
  startTime: string; // "HH:MM" 24h format
  endTime: string;   // "HH:MM" 24h format
}

export interface Subject {
  id: string;
  name: string;
  code?: string;
  color: string;
  schedule: TimeSlot[];
  targetAttendance: number; // Percentage, e.g., 75
  type?: 'theory' | 'lab';
}

export type AttendanceStatus = 'present' | 'absent' | 'cancelled' | 'late' | 'holiday';

export interface AttendanceRecord {
  id: string;
  subjectId: string;
  date: string; // ISO Date String YYYY-MM-DD
  startTime: string; // "HH:MM" - Added to differentiate multiple slots of same subject on same day
  status: AttendanceStatus;
}

export interface DayStats {
  date: string;
  totalClasses: number;
  present: number;
  absent: number;
}

export interface UserProfile {
  name: string;
  year: string;
  semester: string;
}