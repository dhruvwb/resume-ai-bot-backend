// Re-export all types from frontend for consistency
export interface MastersResumeData {
  personalInfo: {
    firstName: string;
    lastName: string;
    postalAddress: string;
    email: string;
    phone: string;
    github?: string;
    linkedin?: string;
    portfolio?: string;
  };
  objective: {
    courseName: string;
    specialization: string;
    skillsToUpgrade: string[];
    targetField: string;
    targetRole: string;
    additionalNotes?: string;
  };
  academicQualification: AcademicQualification[];
  academicProjects: AcademicProject[];
  workExperience: WorkExperienceMS[];
  technicalSkills: TechnicalSkills;
  technicalCertifications: Certification[];
  internships: Internship[];
  coursesAndWorkshops: CourseWorkshop[];
  achievements: Achievement[];
  leadershipRoles: LeadershipRole[];
  communityInvolvement: CommunityActivity[];
}

export interface AcademicQualification {
  degree: string;
  subject: string;
  universityName: string;
  city: string;
  percentage?: string;
  gpa?: string;
  startMonth: string;
  startYear: number;
  endMonth: string;
  endYear: number;
}

export interface AcademicProject {
  title: string;
  institution: string;
  city: string;
  teamSize: number;
  startMonth: string;
  startYear: number;
  endMonth: string;
  endYear: number;
  role: 'Team Lead' | 'Team Member';
  objective: string;
  results: string[];
  toolsUsed: string[];
  practicalApplications: string[];
}

export interface WorkExperienceMS {
  companyName: string;
  city: string;
  designation: string;
  startMonth: string;
  startYear: number;
  endMonth?: string;
  endYear?: number;
  isCurrentlyWorking: boolean;
  projectRole: string;
  contributions: string[];
  awards?: string[];
}

export interface TechnicalSkills {
  programming?: string[];
  webTechnologies?: string[];
  databases?: string[];
  tools?: string[];
  frameworks?: string[];
  cloudPlatforms?: string[];
  other?: string[];
}

export interface Certification {
  title: string;
  source: string;
  topic: string;
  startMonth: string;
  startYear: number;
  endMonth: string;
  endYear: number;
  credentialUrl?: string;
}

export interface Internship {
  title: string;
  companyName: string;
  city: string;
  designation: string;
  startMonth: string;
  startYear: number;
  endMonth: string;
  endYear: number;
  description?: string;
}

export interface CourseWorkshop {
  title: string;
  institute: string;
  duration: string;
  completionDate?: string;
  description?: string;
}

export interface Achievement {
  title: string;
  description: string;
  category: 'Academic' | 'Sports' | 'Cultural' | 'Other';
  year?: number;
}

export interface LeadershipRole {
  position: string;
  organization: string;
  startMonth: string;
  startYear: number;
  endMonth?: string;
  endYear?: number;
  isCurrentRole: boolean;
  responsibilities: string[];
}

export interface CommunityActivity {
  activity: string;
  organization: string;
  description: string;
  startDate?: string;
  endDate?: string;
}
