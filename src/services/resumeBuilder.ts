import { ResumeData } from './resumeQuestionnaire';

export class ResumeBuilder {
  private static readonly SECTION_DIVIDER = '-'.repeat(50);

  static buildRawResume(data: ResumeData): string {
    const sections: string[] = [
      this.buildHeader(data.personalInfo),
      this.buildObjective(data.objective),
      this.buildEducation(data.education),
      this.buildProjects(data.projects),
      this.buildWorkExperience(data.workExperience),
      this.buildTechnicalSkills(data.technicalSkills),
      this.buildCertifications(data.certifications),
      this.buildAchievements(data.achievements),
    ];

    return sections.filter(Boolean).join('\n\n');
  }

  private static buildHeader(info: any): string {
    if (!info?.fullName) return '';
    
    const lines = [info.fullName.toUpperCase(), '='.repeat(50)];
    const contact = [];
    if (info.email) contact.push(`Email: ${info.email}`);
    if (info.phone) contact.push(`Phone: ${info.phone}`);
    if (info.location) contact.push(`Location: ${info.location}`);
    if (info.linkedin) contact.push(`LinkedIn: ${info.linkedin}`);
    
    if (contact.length > 0) lines.push(contact.join(' | '));
    return lines.join('\n');
  }

  private static buildObjective(obj: any): string {
    if (!obj?.degree && !obj?.specialization && !obj?.targetRole) return '';
    
    const lines = ['OBJECTIVE', this.SECTION_DIVIDER];
    if (obj.degree) lines.push(`Degree: ${obj.degree}`);
    if (obj.specialization) lines.push(`Specialization: ${obj.specialization}`);
    if (obj.targetRole) lines.push(`Target Role: ${obj.targetRole}`);
    return lines.join('\n');
  }

  private static buildEducation(edu: any): string {
    if (!edu?.university && !edu?.gpa) return '';
    
    const lines = ['EDUCATION', this.SECTION_DIVIDER];
    if (edu.university) lines.push(`University: ${edu.university}`);
    if (edu.gpa) lines.push(`GPA: ${edu.gpa}`);
    if (edu.graduationYear) lines.push(`Graduation: ${edu.graduationYear}`);
    if (edu.coursework) lines.push(`Relevant Coursework: ${edu.coursework}`);
    return lines.join('\n');
  }

  private static buildProjects(projects: any[]): string {
    if (!projects?.length) return '';
    
    const lines = ['PROJECTS', this.SECTION_DIVIDER];
    projects.forEach((p, i) => {
      if (p.title) {
        lines.push(`${i + 1}. ${p.title}`);
        if (p.description) lines.push(`   Description: ${p.description}`);
        if (p.role) lines.push(`   Role: ${p.role}`);
        if (p.technologies) lines.push(`   Technologies: ${p.technologies}`);
        if (p.results) lines.push(`   Results: ${p.results}`);
      }
    });
    return lines.join('\n');
  }

  private static buildWorkExperience(exps: any[]): string {
    if (!exps?.length) return '';
    
    const lines = ['WORK EXPERIENCE', this.SECTION_DIVIDER];
    exps.forEach((exp, i) => {
      if (exp.company) {
        lines.push(`${i + 1}. ${exp.position} at ${exp.company}`);
        if (exp.duration) lines.push(`   Duration: ${exp.duration}`);
        if (exp.responsibilities) lines.push(`   Responsibilities: ${exp.responsibilities}`);
        if (exp.achievements) lines.push(`   Achievements: ${exp.achievements}`);
      }
    });
    return lines.join('\n');
  }

  private static buildTechnicalSkills(skills: any): string {
    if (!skills || Object.keys(skills).length === 0) return '';
    
    const lines = ['TECHNICAL SKILLS', this.SECTION_DIVIDER];
    if (skills.languages?.length) lines.push(`Languages: ${skills.languages.join(', ')}`);
    if (skills.frameworks?.length) lines.push(`Frameworks: ${skills.frameworks.join(', ')}`);
    if (skills.databases?.length) lines.push(`Databases: ${skills.databases.join(', ')}`);
    if (skills.tools?.length) lines.push(`Tools: ${skills.tools.join(', ')}`);
    return lines.join('\n');
  }

  private static buildCertifications(certs: any[]): string {
    if (!certs?.length) return '';
    
    const lines = ['CERTIFICATIONS', this.SECTION_DIVIDER];
    certs.forEach((cert, i) => {
      if (cert.name) {
        let line = `${i + 1}. ${cert.name}`;
        if (cert.issuer) line += ` - ${cert.issuer}`;
        if (cert.year) line += ` (${cert.year})`;
        lines.push(line);
      }
    });
    return lines.join('\n');
  }

  private static buildAchievements(achievements: any[]): string {
    if (!achievements?.length) return '';
    
    const lines = ['ACHIEVEMENTS', this.SECTION_DIVIDER];
    achievements.forEach((achievement, i) => {
      if (achievement.title) {
        let line = `${i + 1}. ${achievement.title}`;
        if (achievement.category) line += ` [${achievement.category}]`;
        lines.push(line);
        if (achievement.description) lines.push(`   ${achievement.description}`);
      }
    });
    return lines.join('\n');
  }

  static getCompletionPercentage(data: ResumeData): number {
    const checks = [
      // Personal Info
      !!data.personalInfo?.fullName,
      !!data.personalInfo?.email,
      !!data.personalInfo?.phone,
      !!data.personalInfo?.location,
      !!data.personalInfo?.linkedin,
      // Objective
      !!data.objective?.degree,
      !!data.objective?.specialization,
      !!data.objective?.targetRole,
      // Education
      !!data.education?.university,
      !!data.education?.gpa,
      !!data.education?.graduationYear,
      !!data.education?.coursework,
      // Collections
      !!(data.projects && data.projects.length > 0),
      !!(data.workExperience && data.workExperience.length > 0),
      !!(data.technicalSkills?.languages?.length),
      !!(data.technicalSkills?.frameworks?.length),
      !!(data.technicalSkills?.databases?.length),
      !!(data.technicalSkills?.tools?.length),
    ];

    const filled = checks.filter(Boolean).length;
    return Math.round((filled / checks.length) * 100);
  }
}
