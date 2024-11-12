import {
  User,
  Workshop,
  CalendarDay,
  CompanyMatch,
  Candidate,
  InternshipPosition,
  ProjectEvaluation,
  StudentProgress,
  WeeklyEvaluation,
  ProgramData,
  EvaluationData,
  StudentMetric,
  Cohort,
} from "@/types/dashboard";

// User Data
export const mockUsers: User[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "student",
    cohort: 1,
  },
  {
    id: 2,
    name: "Sarah Chen",
    email: "sarah@example.com",
    role: "student",
    cohort: 2,
  },
  {
    id: 3,
    name: "Michael Rodriguez",
    email: "michael@example.com",
    role: "mentor",
    cohort: 1,
  },
  {
    id: 4,
    name: "Emma Thompson",
    email: "emma@example.com",
    role: "mentor",
    cohort: 2,
  },
  {
    id: 5,
    name: "David Kim",
    email: "david@example.com",
    role: "mentor",
    cohort: 1,
  },
  {
    id: 6,
    name: "Sophie Martin",
    email: "sophie@example.com",
    role: "mentor",
    cohort: 2,
  },
  { id: 7, name: "Alice Johnson", email: "alice@example.com", role: "admin" },
  { id: 8, name: "Bob Brown", email: "bob@example.com", role: "company" },
];

// Workshop Data
export const mockWorkshops: Workshop[] = [
  {
    id: 1,
    title: "Introduction to AI",
    type: "technical",
    date: "2024-03-20",
    time: "10:00 AM",
    location: "Room 101",
    attendees: 50,
  },
  {
    id: 2,
    title: "Web Development Best Practices",
    type: "technical",
    date: "2024-03-25",
    time: "2:00 PM",
    location: "Online",
    attendees: 45,
  },
  {
    id: 3,
    title: "Communication Skills",
    type: "soft-skills",
    date: "2024-03-27",
    time: "3:00 PM",
    location: "Room 202",
    attendees: 30,
  },
];

// Calendar Data
export const mockCalendarEvents: CalendarDay[] = [
  {
    date: new Date(),
    events: [
      {
        title: "Technical Workshop",
        time: "10:00 AM",
        location: "Room 101",
        description: "Introduction to React Hooks",
      },
      {
        title: "Project Review",
        time: "2:00 PM",
        location: "Online",
        description: "Code review session with mentor",
      },
    ],
  },
  {
    date: new Date(new Date().setDate(new Date().getDate() + 4)),
    events: [
      {
        title: "English Practice",
        time: "11:00 AM",
        location: "Room 203",
        description: "Technical communication workshop",
      },
      {
        title: "Algorithm Study Group",
        time: "3:00 PM",
        location: "Room 105",
        description: "Group practice on dynamic programming",
      },
    ],
  },
  {
    date: new Date(new Date().setDate(new Date().getDate() + 8)),
    events: [
      {
        title: "Mock Interview",
        time: "2:00 PM",
        location: "Online",
        description: "Practice technical interview with industry mentor",
      },
    ],
  },
];

// Company and Matching Data
export const mockCompanyMatches: CompanyMatch[] = [
  {
    id: 1,
    companyName: "Tech Corp",
    matchPercentage: 95,
    interviewDate: "2024-03-20",
    interviewTime: "10:00 AM",
    status: "scheduled",
    position: "Frontend Developer Intern",
  },
  {
    id: 2,
    companyName: "Innovation Labs",
    matchPercentage: 88,
    interviewDate: "2024-03-22",
    interviewTime: "2:00 PM",
    status: "pending",
    position: "Full Stack Developer",
  },
  {
    id: 3,
    companyName: "Digital Solutions",
    matchPercentage: 85,
    interviewDate: "2024-03-25",
    interviewTime: "11:30 AM",
    status: "scheduled",
    position: "Software Engineer Intern",
  },
  {
    id: 4,
    companyName: "Cloud Systems",
    matchPercentage: 82,
    interviewDate: "2024-03-28",
    interviewTime: "3:00 PM",
    status: "pending",
    position: "Backend Developer",
  },
];

export const mockCandidates: Candidate[] = [
  {
    id: 1,
    name: "Alice Johnson",
    skills: ["React", "Node.js", "Python"],
    matchPercentage: 95,
  },
  {
    id: 2,
    name: "Bob Smith",
    skills: ["Java", "Spring Boot", "MySQL"],
    matchPercentage: 88,
  },
];

export const mockPositions: InternshipPosition[] = [
  {
    id: 1,
    title: "Frontend Developer Intern",
    department: "Engineering",
    location: "Remote",
    status: "open",
    applicants: 12,
  },
  {
    id: 2,
    title: "UX Design Intern",
    department: "Design",
    location: "New York, NY",
    status: "open",
    applicants: 8,
  },
];

// Evaluation and Progress Data
export const mockEvaluations: ProjectEvaluation[] = [
  {
    id: 1,
    studentName: "Alice Johnson",
    projectName: "Web Scraper",
    dueDate: "2024-03-15",
    status: "Pending",
    evaluationStatus: "",
  },
  {
    id: 2,
    studentName: "Bob Smith",
    projectName: "Chat Application",
    dueDate: "2024-03-18",
    status: "Completed",
    evaluationStatus: "passed",
  },
];

export const mockGroupProgress: StudentProgress[] = [
  { id: 1, name: "Alice Johnson", progress: 75 },
  { id: 2, name: "Bob Smith", progress: 60 },
  { id: 3, name: "Charlie Brown", progress: 90 },
  { id: 4, name: "Diana Prince", progress: 85 },
];

export const mockWeeklyEvaluations: WeeklyEvaluation[] = [
  {
    id: 1,
    studentName: "Alice Johnson",
    technicalSkills: 4,
    weeklyProgress: 5,
    notes: "Great job on the project!",
    lastUpdated: new Date(),
  },
  {
    id: 2,
    studentName: "Bob Smith",
    technicalSkills: 3,
    weeklyProgress: 4,
    notes: "Good progress, need to improve communication skills.",
    lastUpdated: new Date(),
  },
];

// Analytics Data
export const mockProgramData: ProgramData[] = [
  { month: "Jan", students: 50, completionRate: 85 },
  { month: "Feb", students: 60, completionRate: 82 },
  { month: "Mar", students: 70, completionRate: 88 },
  { month: "Apr", students: 80, completionRate: 90 },
  { month: "May", students: 90, completionRate: 87 },
  { month: "Jun", students: 100, completionRate: 91 },
];

export const mockEvaluationData: EvaluationData[] = [
  { skill: "Problem Solving", avgScore: 4.2 },
  { skill: "Communication", avgScore: 3.8 },
  { skill: "Teamwork", avgScore: 4.5 },
  { skill: "Technical Skills", avgScore: 4.0 },
  { skill: "Creativity", avgScore: 3.9 },
];

export const mockStudentMetrics: StudentMetric[] = [
  {
    id: 1,
    name: "Alice Johnson",
    overallScore: 4.5,
    technicalSkills: 4.7,
    softSkills: 4.3,
  },
  {
    id: 2,
    name: "Bob Smith",
    overallScore: 4.2,
    technicalSkills: 4.5,
    softSkills: 3.9,
  },
];

export const mockStudentProgress: StudentProgress[] = [
  {
    id: 1,
    name: "Alice Johnson",
    progress: 75,
    lastUpdated: "2024-03-15",
    currentModule: "React Advanced Concepts",
    status: "on_track",
  },
  {
    id: 2,
    name: "Bob Smith",
    progress: 60,
    lastUpdated: "2024-03-14",
    currentModule: "Node.js Fundamentals",
    status: "behind",
  },
  {
    id: 3,
    name: "Charlie Brown",
    progress: 90,
    lastUpdated: "2024-03-15",
    currentModule: "System Design",
    status: "ahead",
  },
  {
    id: 4,
    name: "Diana Prince",
    progress: 85,
    lastUpdated: "2024-03-15",
    currentModule: "Database Design",
    status: "on_track",
  },
  {
    id: 5,
    name: "Ethan Hunt",
    progress: 70,
    lastUpdated: "2024-03-14",
    currentModule: "API Development",
    status: "on_track",
  },
];

export const mockCohorts: Cohort[] = [
  {
    id: 1,
    title: "Cohort 2024 Spring",
    startDate: "2024-01-15",
    endDate: "2024-06-15",
    status: "active",
    capacity: 30,
    currentStudents: 25,
    location: "Lausanne",
    mentors: mockUsers
      .filter(
        (user): user is User & { role: "mentor" } => user.role === "mentor"
      )
      .slice(0, 2),
  },
  {
    id: 2,
    title: "Cohort 2024 Fall",
    startDate: "2024-08-15",
    endDate: "2025-01-15",
    status: "upcoming",
    capacity: 30,
    currentStudents: 0,
    location: "Lausanne",
    mentors: mockUsers
      .filter(
        (user): user is User & { role: "mentor" } => user.role === "mentor"
      )
      .slice(1, 3),
  },
  {
    id: 3,
    title: "Cohort 2023 Fall",
    startDate: "2023-08-15",
    endDate: "2024-01-15",
    status: "completed",
    capacity: 25,
    currentStudents: 22,
    location: "Lausanne",
    mentors: mockUsers
      .filter(
        (user): user is User & { role: "mentor" } => user.role === "mentor"
      )
      .slice(2, 4),
  },
];
