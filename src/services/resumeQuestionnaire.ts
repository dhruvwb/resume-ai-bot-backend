// Structured Resume Building Questionnaire
// Systematically collects all required information

export interface ResumeData {
  personalInfo: {
    fullName?: string;
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
  };
  objective: {
    degree?: string;
    specialization?: string;
    targetRole?: string;
  };
  education: {
    university?: string;
    gpa?: string;
    graduationYear?: string;
    coursework?: string;
  };
  projects: Array<{
    title?: string;
    description?: string;
    technologies?: string;
    role?: string;
    results?: string;
  }>;
  workExperience: Array<{
    company?: string;
    position?: string;
    duration?: string;
    responsibilities?: string;
    achievements?: string;
  }>;
  technicalSkills: {
    languages?: string[];
    frameworks?: string[];
    databases?: string[];
    tools?: string[];
  };
  certifications: Array<{
    name?: string;
    issuer?: string;
    year?: string;
  }>;
  achievements: Array<{
    title?: string;
    description?: string;
    category?: string;
  }>;
}

export const QUESTIONNAIRE_FLOW = [
  // PERSONAL INFORMATION
  {
    section: 'personalInfo',
    questions: [
      { key: 'fullName', question: 'What is your full name?' },
      { key: 'email', question: 'What is your email address?' },
      { key: 'phone', question: 'What is your phone number?' },
      { key: 'location', question: 'What is your city and country?' },
      { key: 'linkedin', question: 'Do you have a LinkedIn profile? (Share the URL or type "skip")' },
    ],
  },
  // OBJECTIVE
  {
    section: 'objective',
    questions: [
      { key: 'degree', question: 'What Master\'s degree are you pursuing? (e.g., MS Computer Science, MBA)' },
      { key: 'specialization', question: 'What is your specialization or focus area?' },
      { key: 'targetRole', question: 'What is your target job role after graduation?' },
    ],
  },
  // EDUCATION
  {
    section: 'education',
    questions: [
      { key: 'university', question: 'Which university are you attending or have attended?' },
      { key: 'gpa', question: 'What is your GPA or percentage? (e.g., 3.8/4.0 or 8.5/10)' },
      { key: 'graduationYear', question: 'When do/did you graduate? (e.g., May 2024)' },
      { key: 'coursework', question: 'What are your relevant coursework/subjects? (comma-separated)' },
    ],
  },
  // PROJECTS
  {
    section: 'projects',
    isArray: true,
    questions: [
      { key: 'title', question: 'Project title?' },
      { key: 'description', question: 'What problem did it solve? (1-2 lines)' },
      { key: 'technologies', question: 'Technologies used? (comma-separated)' },
      { key: 'role', question: 'Your role in the project? (Team lead, Developer, etc.)' },
      { key: 'results', question: 'Key results or impact? (e.g., "Improved performance by 40%")' },
      { key: 'addMore', question: 'Add another project? (yes/no)' },
    ],
  },
  // WORK EXPERIENCE
  {
    section: 'workExperience',
    isArray: true,
    questions: [
      { key: 'company', question: 'Company name?' },
      { key: 'position', question: 'Job position/designation?' },
      { key: 'duration', question: 'Duration? (e.g., "Jan 2023 - Jun 2023")' },
      { key: 'responsibilities', question: 'Main responsibilities? (comma-separated)' },
      { key: 'achievements', question: 'Key achievements or contributions?' },
      { key: 'addMore', question: 'Add another work experience? (yes/no)' },
    ],
  },
  // TECHNICAL SKILLS
  {
    section: 'technicalSkills',
    questions: [
      { key: 'languages', question: 'Programming languages? (comma-separated, e.g., Java, Python, C++)' },
      { key: 'frameworks', question: 'Frameworks & libraries? (e.g., React, Spring Boot, Django)' },
      { key: 'databases', question: 'Databases & data tools? (e.g., MySQL, MongoDB, Hadoop)' },
      { key: 'tools', question: 'Tools & platforms? (e.g., Docker, Git, AWS, Jenkins)' },
    ],
  },
  // CERTIFICATIONS
  {
    section: 'certifications',
    isArray: true,
    questions: [
      { key: 'name', question: 'Certification name?' },
      { key: 'issuer', question: 'Issuing organization?' },
      { key: 'year', question: 'Year obtained?' },
      { key: 'addMore', question: 'Add another certification? (yes/no)' },
    ],
  },
  // ACHIEVEMENTS
  {
    section: 'achievements',
    isArray: true,
    questions: [
      { key: 'title', question: 'Achievement/Award title?' },
      { key: 'description', question: 'Brief description?' },
      { key: 'category', question: 'Category? (Academic, Professional, Extracurricular, Award, etc.)' },
      { key: 'addMore', question: 'Add another achievement? (yes/no)' },
    ],
  },
];

export class ResumeQuestionnaire {
  private currentSectionIndex: number = 0;
  private currentQuestionIndex: number = 0;
  private currentArrayItem: number = 0;
  private resumeData: ResumeData = {
    personalInfo: {},
    objective: {},
    education: {},
    projects: [],
    workExperience: [],
    technicalSkills: {},
    certifications: [],
    achievements: [],
  };

  getCurrentQuestion(): { question: string; section: string; key: string } | null {
    if (this.currentSectionIndex >= QUESTIONNAIRE_FLOW.length) {
      return null; // All questions done
    }

    const section = QUESTIONNAIRE_FLOW[this.currentSectionIndex];
    const question = section.questions[this.currentQuestionIndex];

    return {
      question: question.question,
      section: section.section,
      key: question.key,
    };
  }

  getProgress(): { current: number; total: number; percentage: number } {
    const totalQuestions = QUESTIONNAIRE_FLOW.reduce((sum, s) => sum + s.questions.length, 0);
    const answeredQuestions = this.currentSectionIndex * 10 + this.currentQuestionIndex;
    return {
      current: Math.min(answeredQuestions, totalQuestions),
      total: totalQuestions,
      percentage: Math.round((Math.min(answeredQuestions, totalQuestions) / totalQuestions) * 100),
    };
  }

  processAnswer(answer: string): { nextQuestion: string | null; isComplete: boolean } {
    const section = QUESTIONNAIRE_FLOW[this.currentSectionIndex];
    const question = section.questions[this.currentQuestionIndex];

    if (section.isArray) {
      this.processArrayAnswer(answer, section, question);
    } else {
      this.processSimpleAnswer(answer, section, question);
    }

    return this.getNextQuestion();
  }

  private processArrayAnswer(answer: string, section: any, question: any): void {
    if (question.key === 'addMore') {
      this.handleAddMore(answer, section);
    } else {
      this.storeArrayAnswer(answer, section, question);
      this.currentQuestionIndex++;
    }
  }

  private handleAddMore(answer: string, section: any): void {
    if (answer.toLowerCase() === 'yes') {
      this.currentArrayItem++;
      this.currentQuestionIndex = this.currentQuestionIndex - (section.questions.length - 1);
    } else {
      this.currentArrayItem = 0;
      this.currentQuestionIndex++;
      if (this.currentQuestionIndex >= section.questions.length) {
        this.currentQuestionIndex = 0;
        this.moveToNextSection();
      }
    }
  }

  private storeArrayAnswer(answer: string, section: any, question: any): void {
    if (!Array.isArray(this.resumeData[section.section as keyof ResumeData])) {
      this.resumeData[section.section as keyof ResumeData] = [];
    }
    const arr = this.resumeData[section.section as keyof ResumeData] as any[];
    if (this.currentArrayItem >= arr.length) {
      arr.push({});
    }
    arr[this.currentArrayItem][question.key] = answer;
  }

  private processSimpleAnswer(answer: string, section: any, question: any): void {
    const sectionData = this.resumeData[section.section as keyof ResumeData] as any;
    sectionData[question.key] = answer;
    this.currentQuestionIndex++;

    if (this.currentQuestionIndex >= section.questions.length) {
      this.currentQuestionIndex = 0;
      this.moveToNextSection();
    }
  }

  private moveToNextSection(): void {
    this.currentSectionIndex++;
  }

  private getNextQuestion(): { nextQuestion: string | null; isComplete: boolean } {
    const current = this.getCurrentQuestion();
    if (!current) {
      return { nextQuestion: null, isComplete: true };
    }
    return { nextQuestion: current.question, isComplete: false };
  }

  getResumeData(): ResumeData {
    return this.resumeData;
  }

  reset(): void {
    this.currentSectionIndex = 0;
    this.currentQuestionIndex = 0;
    this.currentArrayItem = 0;
    this.resumeData = {
      personalInfo: {},
      objective: {},
      education: {},
      projects: [],
      workExperience: [],
      technicalSkills: {},
      certifications: [],
      achievements: [],
    };
  }
}
