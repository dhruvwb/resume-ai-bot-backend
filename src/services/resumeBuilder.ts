import { ResumeData } from './resumeQuestionnaire';

export class ResumeBuilder {
  private static readonly SECTION_DIVIDER = '-'.repeat(60);

  static buildRawResume(data: ResumeData): string {
    const sections: string[] = [
      this.buildHeader(data.personalInfo),
      this.buildObjective(data.objective),
      this.buildEducation(data.education),
      this.buildAcademicProjects(data.academicProjects),
      this.buildWorkExperience(data.workExperience),
      this.buildTechnicalSkills(data.technicalSkills),
      this.buildTechnicalCertifications(data.technicalCertifications),
      this.buildInternships(data.internships),
      this.buildCertifications(data.certifications),
      this.buildAchievements(data.achievements),
      this.buildLeadershipRoles(data.leadershipRoles),
      this.buildCommunityInvolvement(data.communityInvolvement),
    ];

    return sections.filter(Boolean).join('\n\n');
  }

  private static buildHeader(info: any): string {
    if (!info?.fullName) return '';

    const lines: string[] = [
      info.fullName.toUpperCase(),
      this.SECTION_DIVIDER,
    ];

    const contact: string[] = [];
    if (info.postalAddress) contact.push(info.postalAddress);
    if (info.email) contact.push(`Email: ${info.email}`);
    if (info.phone) contact.push(`Phone: ${info.phone}`);
    if (info.github) contact.push(`GitHub: ${info.github}`);

    if (contact.length > 0) lines.push(contact.join(' | '));
    return lines.join('\n');
  }

  private static buildObjective(obj: any): string {
    if (!obj?.course && !obj?.specialization && !obj?.interests && !obj?.targetRole) return '';

    const lines = ['OBJECTIVE', this.SECTION_DIVIDER];
    if (obj.course) lines.push(`Course: ${obj.course}`);
    if (obj.specialization) lines.push(`Specialization: ${obj.specialization}`);
    if (obj.interests) lines.push(`Interests: ${obj.interests}`);
    if (obj.targetRole) lines.push(`Target Role: ${obj.targetRole}`);
    return lines.join('\n');
  }

  private static buildEducation(edu: any): string {
    if (!edu?.degree && !edu?.university) return '';

    const lines = ['ACADEMIC QUALIFICATION', this.SECTION_DIVIDER];
    if (edu.degree) lines.push(`Degree: ${edu.degree}`);
    if (edu.subject) lines.push(`Major: ${edu.subject}`);
    if (edu.university) lines.push(`University: ${edu.university}`);
    if (edu.city) lines.push(`City: ${edu.city}`);
    if (edu.gpa) lines.push(`GPA / Percentage: ${edu.gpa}`);
    if (edu.duration) lines.push(`Duration: ${edu.duration}`);
    return lines.join('\n');
  }

  private static buildAcademicProjects(projects: any[]): string {
    if (!projects?.length) return '';

    const lines = ['ACADEMIC PROJECTS', this.SECTION_DIVIDER];
    projects.forEach((p, i) => {
      if (p.title) {
        lines.push(`${i + 1}. ${p.title}`);
        if (p.institution) lines.push(`   Institution: ${p.institution}`);
        if (p.city) lines.push(`   City: ${p.city}`);
        if (p.duration) lines.push(`   Duration: ${p.duration}`);
        if (p.teamSize) lines.push(`   Team Size: ${p.teamSize}`);
        if (p.role) lines.push(`   Role: ${p.role}`);
        if (p.description) lines.push(`   Description: ${p.description}`);
      }
    });

    return lines.join('\n');
  }

  private static buildWorkExperience(exps: any[]): string {
    if (!exps?.length) return '';

    const lines = ['WORK EXPERIENCE', this.SECTION_DIVIDER];
    exps.forEach((exp, i) => {
      if (exp.company) {
        lines.push(`${i + 1}. ${exp.designation} at ${exp.company}`);
        if (exp.city) lines.push(`   City: ${exp.city}`);
        if (exp.duration) lines.push(`   Duration: ${exp.duration}`);
        if (exp.responsibilities) lines.push(`   Summary: ${exp.responsibilities}`);
        if (exp.achievements) lines.push(`   Highlights: ${exp.achievements}`);
      }
    });

    return lines.join('\n');
  }

  private static buildTechnicalSkills(skills: any): string {
    if (!skills?.skills) return '';

    const lines = ['TECHNICAL SKILLS', this.SECTION_DIVIDER];
    lines.push(skills.skills);
    return lines.join('\n');
  }

  private static buildTechnicalCertifications(certs: any[]): string {
    if (!certs?.length) return '';

    const lines = ['TECHNICAL CERTIFICATIONS', this.SECTION_DIVIDER];
    certs.forEach((cert, i) => {
      if (cert.topic) {
        let line = `${i + 1}. ${cert.topic}`;
        if (cert.duration) line += ` (${cert.duration})`;
        lines.push(line);
      }
    });

    return lines.join('\n');
  }

  private static buildInternships(interns: any[]): string {
    if (!interns?.length) return '';

    const lines = ['INTERNSHIPS', this.SECTION_DIVIDER];
    interns.forEach((iData, i) => {
      if (iData.title || iData.company) {
        lines.push(`${i + 1}. ${iData.title || ''} at ${iData.company || ''}`.trim());
        if (iData.designation) lines.push(`   Designation: ${iData.designation}`);
        if (iData.duration) lines.push(`   Duration: ${iData.duration}`);
        if (iData.description) lines.push(`   Description: ${iData.description}`);
      }
    });

    return lines.join('\n');
  }

  private static buildCertifications(certs: any[]): string {
    if (!certs?.length) return '';

    const lines = ['CERTIFICATIONS / WORKSHOPS / COURSES', this.SECTION_DIVIDER];
    certs.forEach((cert, i) => {
      if (cert.name) {
        let line = `${i + 1}. ${cert.name}`;
        if (cert.organization) line += ` - ${cert.organization}`;
        if (cert.duration) line += ` (${cert.duration})`;
        lines.push(line);
      }
    });

    return lines.join('\n');
  }

  private static buildAchievements(achievements: any[]): string {
    if (!achievements?.length) return '';

    const lines = ['ACHIEVEMENTS / CO-CURRICULAR / EXTRACURRICULAR', this.SECTION_DIVIDER];
    achievements.forEach((a, i) => {
      if (a.title) lines.push(`${i + 1}. ${a.title}`);
    });

    return lines.join('\n');
  }

  private static buildLeadershipRoles(roles: any[]): string {
    if (!roles?.length) return '';

    const lines = ['LEADERSHIP ROLES', this.SECTION_DIVIDER];
    roles.forEach((r, i) => {
      if (r.title) lines.push(`${i + 1}. ${r.title}`);
    });

    return lines.join('\n');
  }

  private static buildCommunityInvolvement(comm: any[]): string {
    if (!comm?.length) return '';

    const lines = ['COMMUNITY INVOLVEMENT', this.SECTION_DIVIDER];
    comm.forEach((c, i) => {
      if (c.title) lines.push(`${i + 1}. ${c.title}`);
    });

    return lines.join('\n');
  }

  static getCompletionPercentage(data: ResumeData): number {
    const checks = [
      !!data.personalInfo?.fullName,
      !!data.personalInfo?.email,
      !!data.personalInfo?.phone,
      !!data.personalInfo?.github,
      !!data.objective?.course,
      !!data.objective?.specialization,
      !!data.objective?.targetRole,
      !!data.education?.degree,
      !!data.education?.university,
      !!data.education?.gpa,
      !!(data.academicProjects && data.academicProjects.length > 0),
      !!(data.workExperience && data.workExperience.length > 0),
      !!data.technicalSkills?.skills,
      !!(data.technicalCertifications && data.technicalCertifications.length > 0),
      !!(data.internships && data.internships.length > 0),
      !!(data.certifications && data.certifications.length > 0),
      !!(data.achievements && data.achievements.length > 0),
      !!(data.leadershipRoles && data.leadershipRoles.length > 0),
      !!(data.communityInvolvement && data.communityInvolvement.length > 0),
    ];

    const filled = checks.filter(Boolean).length;
    return Math.round((filled / checks.length) * 100);
  }
}
