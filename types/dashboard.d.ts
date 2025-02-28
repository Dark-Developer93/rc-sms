export interface Candidate {
  id: number;
  name: string;
  skills: string[];
  matchPercentage: number;
}

export interface ScheduledInterview {
  date: string;
  time: string;
  notes: string;
  interviewDate: string;
  status?: "accepted" | "rejected" | "pending";
  decisionNotes?: string;
}

export interface ScheduledInterviews {
  [key: number]: ScheduledInterview;
}

export interface InternshipPosition {
  id: number;
  title: string;
  department: string;
  location: string;
  status: "open" | "closed";
  applicants: number;
}

export interface BaseUser {
  id: number;
  name: string;
  email: string;
}

export interface StudentUser extends BaseUser {
  role: "student";
  cohort: number;
}

export interface MentorUser extends BaseUser {
  role: "mentor";
  cohort: number;
}

export interface AdminUser extends BaseUser {
  role: "admin";
}

export interface CompanyUser extends BaseUser {
  role: "company";
}

export type User = StudentUser | MentorUser | AdminUser | CompanyUser;

export interface ProgramData {
  month: string;
  students: number;
  completionRate: number;
}

export interface EvaluationData {
  skill: string;
  avgScore: number;
}

export interface StudentMetric {
  id: number;
  name: string;
  overallScore: number;
  technicalSkills: number;
  softSkills: number;
  feedback?: string;
}

export interface Workshop {
  id: number;
  title: string;
  type: "technical" | "soft-skills" | "english";
  date: string;
  time: string;
  location: string;
  attendees: number;
}

export interface StudentProgress {
  id: number;
  name: string;
  progress: number;
  lastUpdated?: string;
  currentModule?: string;
  status?: "on_track" | "behind" | "ahead";
}

export interface CalendarEvent {
  title: string;
  time: string;
  location: string;
  description?: string;
}

export interface CalendarDay {
  date: Date;
  events: CalendarEvent[];
}

export interface CompanyMatch {
  id: number;
  companyName: string;
  matchPercentage: number;
  interviewDate: string;
  interviewTime: string;
  status?: "scheduled" | "completed" | "pending";
  position?: string;
}

export interface NewUserFormData {
  name: string;
  email: string;
  role: User["role"]; // "student" | "mentor" | "admin" | "company"
  cohort?: number; // Optional, only for student/mentor
}

export interface NewWorkshopFormData {
  title: string;
  type: Workshop["type"];
  date: string;
  time: string;
  location: string;
  attendees?: number;
}

export type EvaluationStatus = "passed" | "failed" | "pending";

export interface ProjectEvaluation {
  id: number;
  studentName: string;
  projectName: string;
  dueDate: string;
  evaluationStatus?: EvaluationStatus;
  technicalSkills: number;
  feedback: string;
}

export interface WeeklyEvaluation {
  id: number;
  studentName: string;
  technicalSkills: number;
  weeklyProgress: number;
  notes: string;
  lastUpdated?: Date;
}

export interface Cohort {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  status: "upcoming" | "active" | "completed";
  capacity: number;
  currentStudents: number;
  location: string;
  mentors?: Array<User & { role: "mentor" }>;
}
