export interface ResumeData {
  personalInfo: {
    fullName?: string;
    postalAddress?: string;
    email?: string;
    phone?: string;
    github?: string;
    linkedin?: string;
  };
  objective: {
    course?: string;
    specialization?: string;
    interests?: string;
    targetRole?: string;
  };
  education: {
    degree?: string;
    subject?: string;
    university?: string;
    city?: string;
    gpa?: string;
    duration?: string;
  };
  academicProjects: Array<{
    title?: string;
    institution?: string;
    city?: string;
    duration?: string;
    teamSize?: string;
    role?: string;
    description?: string;
  }>;
  workExperience: Array<{
    company?: string;
    designation?: string;
    city?: string;
    duration?: string;
    responsibilities?: string;
    achievements?: string;
  }>;
  technicalSkills: {
    skills?: string;
  };
  technicalCertifications: Array<{
    topic?: string;
    duration?: string;
  }>;
  internships: Array<{
    title?: string;
    company?: string;
    designation?: string;
    duration?: string;
    description?: string;
  }>;
  certifications: Array<{
    name?: string;
    organization?: string;
    duration?: string;
  }>;
  achievements: Array<{
    title?: string;
  }>;
  leadershipRoles: Array<{
    title?: string;
  }>;
  communityInvolvement: Array<{
    title?: string;
  }>;
}

export const QUESTIONNAIRE_FLOW = [
  // HEADER
  {
    section: 'personalInfo',
    questions: [
      { key: 'fullName', question: 'What is your First Name and Last Name?' },
      { key: 'postalAddress', question: 'What is your postal address? (as mentioned in passport)' },
      { key: 'email', question: 'What is your email address?' },
      { key: 'phone', question: 'What is your phone number?' },
      { key: 'github', question: 'What is your GitHub profile URL?' },
    ],
  },

  // OBJECTIVE
  {
    section: 'objective',
    questions: [
      { key: 'course', question: 'Which course do you wish to pursue? (e.g., MS in Computer Science)' },
      { key: 'specialization', question: 'Which specialization do you wish to pursue? (e.g., AI/ML)' },
      { key: 'interests', question: 'What skills or areas of interest do you want to explore through this program?' },
      { key: 'targetRole', question: 'What is your target field/domain and role after MS?' },
    ],
  },

  // ACADEMIC QUALIFICATION
  {
    section: 'education',
    questions: [
      { key: 'degree', question: 'Degree name?' },
      { key: 'subject', question: 'Subject / Major?' },
      { key: 'university', question: 'University name?' },
      { key: 'city', question: 'City?' },
      { key: 'gpa', question: 'GPA or Percentage?' },
      { key: 'duration', question: 'Duration? (Month 20xx - Month 20xx)' },
    ],
  },

  // ACADEMIC PROJECTS
  {
    section: 'academicProjects',
    isArray: true,
    questions: [
      { key: 'title', question: 'Project title?' },
      { key: 'institution', question: 'Institution / Organization name?' },
      { key: 'city', question: 'City?' },
      { key: 'duration', question: 'Duration? (Month 20xx - Month 20xx)' },
      { key: 'teamSize', question: 'Team size?' },
      { key: 'role', question: 'Your role? (Team Lead / Team Member)' },
      { key: 'description', question: 'Summary / Description (max 3–4 lines)' },
      { key: 'addMore', question: 'Add another academic project? (yes/no)' },
    ],
  },

  // WORK EXPERIENCE
  {
    section: 'workExperience',
    isArray: true,
    questions: [
      { key: 'company', question: 'Company name?' },
      { key: 'designation', question: 'Designation?' },
      { key: 'city', question: 'City?' },
      { key: 'duration', question: 'Duration? (Month 20xx - Present)' },
      { key: 'responsibilities', question: 'Project/Role summary?' },
      { key: 'achievements', question: 'Key contributions or highlights?' },
      { key: 'addMore', question: 'Add another work experience? (yes/no)' },
    ],
  },

  // TECHNICAL SKILLS
  {
    section: 'technicalSkills',
    questions: [
      { key: 'skills', question: 'List your technical skills (comma-separated)' },
    ],
  },

  // TECHNICAL CERTIFICATIONS
  {
    section: 'technicalCertifications',
    isArray: true,
    questions: [
      { key: 'topic', question: 'Certification topic?' },
      { key: 'duration', question: 'Duration? (Month 20xx - Month 20xx)' },
      { key: 'addMore', question: 'Add another technical certification? (yes/no)' },
    ],
  },

  // INTERNSHIPS
  {
    section: 'internships',
    isArray: true,
    questions: [
      { key: 'title', question: 'Internship title?' },
      { key: 'company', question: 'Company name?' },
      { key: 'designation', question: 'Designation?' },
      { key: 'duration', question: 'Duration? (Month 20xx - Month 20xx)' },
      { key: 'description', question: 'Internship description?' },
      { key: 'addMore', question: 'Add another internship? (yes/no)' },
    ],
  },

  // CERTIFICATIONS / WORKSHOPS / ADDITIONAL COURSES
  {
    section: 'certifications',
    isArray: true,
    questions: [
      { key: 'name', question: 'Certification / Workshop / Course name?' },
      { key: 'organization', question: 'Organization / Platform?' },
      { key: 'duration', question: 'Duration?' },
      { key: 'addMore', question: 'Add another certification/workshop/course? (yes/no)' },
    ],
  },

  // ACHIEVEMENTS / CO-CURRICULAR / EXTRACURRICULAR
  {
    section: 'achievements',
    isArray: true,
    questions: [
      { key: 'title', question: 'Achievement / Co-curricular / Extracurricular detail?' },
      { key: 'addMore', question: 'Add another achievement? (yes/no)' },
    ],
  },

  // LEADERSHIP ROLES
  {
    section: 'leadershipRoles',
    isArray: true,
    questions: [
      { key: 'title', question: 'Leadership role?' },
      { key: 'addMore', question: 'Add another leadership role? (yes/no)' },
    ],
  },

  // COMMUNITY INVOLVEMENT
  {
    section: 'communityInvolvement',
    isArray: true,
    questions: [
      { key: 'title', question: 'Community involvement detail?' },
      { key: 'addMore', question: 'Add another community involvement? (yes/no)' },
    ],
  },
];

export class ResumeQuestionnaire {
  private sectionIndex = 0;
  private questionIndex = 0;
  private arrayIndex = 0;

  private resumeData: ResumeData = {
    personalInfo: {},
    objective: {},
    education: {},
    academicProjects: [],
    workExperience: [],
    technicalSkills: {},
    technicalCertifications: [],
    internships: [],
    certifications: [],
    achievements: [],
    leadershipRoles: [],
    communityInvolvement: [],
  };

  getCurrentQuestion() {
    const section = QUESTIONNAIRE_FLOW[this.sectionIndex];
    if (!section) return null;
    const question = section.questions[this.questionIndex];
    return question ? question.question : null;
  }

  getResumeData() {
    return this.resumeData;
  }

  processAnswer(answer: string) {
    const section = QUESTIONNAIRE_FLOW[this.sectionIndex];
    const question = section.questions[this.questionIndex];

    if (section.isArray) {
      this.handleArrayAnswer(answer, section, question);
    } else {
      this.handleSimpleAnswer(answer, section, question);
    }

    return {
      nextQuestion: this.getCurrentQuestion(),
      resumeData: this.resumeData,
      isComplete: !this.getCurrentQuestion(),
    };
  }

  private handleSimpleAnswer(answer: string, section: any, question: any) {
    (this.resumeData as any)[section.section][question.key] = answer;
    this.questionIndex++;

    if (this.questionIndex >= section.questions.length) {
      this.questionIndex = 0;
      this.sectionIndex++;
    }
  }

  private handleArrayAnswer(answer: string, section: any, question: any) {
    const arr = (this.resumeData as any)[section.section];
    if (!arr[this.arrayIndex]) arr[this.arrayIndex] = {};

    if (question.key === 'addMore') {
      if (answer.toLowerCase() === 'yes') {
        this.arrayIndex++;
        this.questionIndex = 0;
      } else {
        this.arrayIndex = 0;
        this.questionIndex = 0;
        this.sectionIndex++;
      }
      return;
    }

    arr[this.arrayIndex][question.key] = answer;
    this.questionIndex++;
  }
}
