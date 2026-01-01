import { MastersResumeData } from './../types';

export class MastersResumeTemplate {
  static getEmptyResume(): MastersResumeData {
    return {
      personalInfo: {
        firstName: '',
        lastName: '',
        postalAddress: '',
        email: '',
        phone: '',
        github: '',
        linkedin: '',
        portfolio: '',
      },
      objective: {
        courseName: '',
        specialization: '',
        skillsToUpgrade: [],
        targetField: '',
        targetRole: '',
        additionalNotes: '',
      },
      academicQualification: [],
      academicProjects: [],
      workExperience: [],
      technicalSkills: {
        programming: [],
        webTechnologies: [],
        databases: [],
        tools: [],
        frameworks: [],
        cloudPlatforms: [],
        other: [],
      },
      technicalCertifications: [],
      internships: [],
      coursesAndWorkshops: [],
      achievements: [],
      leadershipRoles: [],
      communityInvolvement: [],
    };
  }

  static getSections(): string[] {
    return [
      'Personal Information',
      'Objective',
      'Academic Qualification',
      'Academic Projects',
      'Work Experience',
      'Technical Skills',
      'Technical Certifications',
      'Internships',
      'Courses & Workshops',
      'Achievements',
      'Leadership Roles',
      'Community Involvement',
    ];
  }

  static getTotalQuestions(): number {
    return 45; // Approximate total questions
  }

  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validatePhone(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s\-()]{7,}$/;
    return phoneRegex.test(phone);
  }

  static getProgressPercentage(resume: Partial<MastersResumeData>): number {
    const sections = [
      resume.personalInfo?.email && resume.personalInfo?.phone,
      resume.objective?.courseName,
      resume.academicQualification?.length,
      resume.academicProjects?.length,
      resume.workExperience?.length,
      resume.technicalSkills && Object.keys(resume.technicalSkills).some(key =>
        (resume.technicalSkills as any)[key]?.length > 0),
      resume.technicalCertifications?.length,
      resume.internships?.length,
      resume.coursesAndWorkshops?.length,
      resume.achievements?.length,
      resume.leadershipRoles?.length,
      resume.communityInvolvement?.length,
    ];

    const filled = sections.filter(Boolean).length;
    return Math.round((filled / sections.length) * 100);
  }

  static formatResume(resume: MastersResumeData): string {
    const parts: string[] = [];

    // Header
    parts.push(this.formatHeader(resume.personalInfo));

    // Objective
    if (resume.objective.courseName) {
      parts.push(this.formatObjective(resume.objective));
    }

    // Academic Qualification
    if (resume.academicQualification.length > 0) {
      parts.push(this.formatAcademicQualification(resume.academicQualification));
    }

    // Work Experience
    if (resume.workExperience.length > 0) {
      parts.push(this.formatWorkExperience(resume.workExperience));
    }

    // Technical Skills
    if (resume.technicalSkills) {
      parts.push(this.formatTechnicalSkills(resume.technicalSkills));
    }

    return parts.join('\n');
  }

  private static formatHeader(info: any): string {
    const lines = [
      `${info.firstName} ${info.lastName}`,
      info.postalAddress,
      `Email: ${info.email} | Phone: ${info.phone}`,
    ];
    
    const social: string[] = [];
    if (info.github) social.push(`GitHub: ${info.github}`);
    if (info.linkedin) social.push(`LinkedIn: ${info.linkedin}`);
    if (social.length > 0) lines.push(social.join(' | '));
    
    return lines.join('\n');
  }

  private static formatObjective(obj: any): string {
    return `# OBJECTIVE\nTo pursue ${obj.courseName} with specialization in ${obj.specialization} to work as a ${obj.targetRole} in ${obj.targetField}.`;
  }

  private static formatAcademicQualification(quals: any[]): string {
    const lines = ['# ACADEMIC QUALIFICATION'];
    quals.forEach((qual) => {
      const gpaText = qual.gpa ? `GPA: ${qual.gpa}` : `${qual.percentage}%`;
      const dates = `${qual.startMonth} ${qual.startYear} - ${qual.endMonth} ${qual.endYear}`;
      lines.push(`${qual.degree} in ${qual.subject}, ${qual.universityName}, ${qual.city} (${gpaText}) | ${dates}`);
    });
    return lines.join('\n');
  }

  private static formatWorkExperience(exps: any[]): string {
    const lines = ['# WORK EXPERIENCE'];
    exps.forEach(exp => {
      const endDate = exp.isCurrentlyWorking ? 'Present' : `${exp.endMonth} ${exp.endYear}`;
      lines.push(
        `${exp.companyName}, ${exp.designation}, ${exp.city}`,
        `${exp.startMonth} ${exp.startYear} - ${endDate}`,
        `Project/Role: ${exp.projectRole}`
      );
      exp.contributions.forEach((contrib: string) => {
        lines.push(`> ${contrib}`);
      });
      if (exp.awards) {
        exp.awards.forEach((award: string) => {
          lines.push(`> Received: ${award}`);
        });
      }
    });
    return lines.join('\n');
  }

  private static formatTechnicalSkills(skills: any): string {
    const lines = ['# TECHNICAL SKILLS'];
    const skillTypes = [
      ['programming', 'Programming'],
      ['webTechnologies', 'Web Technologies'],
      ['databases', 'Databases'],
      ['frameworks', 'Frameworks'],
      ['tools', 'Tools'],
      ['cloudPlatforms', 'Cloud Platforms'],
    ];

    skillTypes.forEach(([key, label]) => {
      if (skills[key]?.length) {
        lines.push(`${label}: ${skills[key].join(', ')}`);
      }
    });

    return lines.join('\n');
  }
}

export default MastersResumeTemplate;
