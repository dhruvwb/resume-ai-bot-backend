// Intent Detection Service
export class IntentDetector {
  private static readonly INTENT_PATTERNS: Record<string, RegExp> = {
    personal: /name|email|phone|address|location|github|linkedin|portfolio/i,
    objective: /objective|pursue|master|specializ|field|role|want to work/i,
    academic_qualification: /degree|bachelor|master|phd|university|college|gpa|percentage/i,
    academic_projects: /project|developed|built|created|team|led|managed/i,
    work_experience: /worked|work|company|job|experience|position|designation|responsibility/i,
    technical_skills: /skill|proficient|language|programming|technology|expertise/i,
    certifications: /certificat|certif|aws|azure|gcp/i,
    internships: /internship|intern|interned/i,
    courses_workshops: /course|workshop|training/i,
    achievements: /award|achievement|won|received|recognize|accomplishment/i,
    leadership: /lead|leadership|president|head|captain|secretary/i,
    community: /volunteer|community|social|contribution|involvement/i,
  };

  static detectIntent(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    for (const [intent, pattern] of Object.entries(this.INTENT_PATTERNS)) {
      if (pattern.test(lowerMessage)) {
        return intent;
      }
    }

    return 'general';
  }
}

// Data Extraction Service
export class DataExtractor {
  static extract(
    text: string,
    section: string
  ): { data: any; confidence: number } {
    const confidence = 0.85;

    switch (section) {
      case 'personal':
        return {
          data: this.extractPersonal(text),
          confidence,
        };
      case 'objective':
        return {
          data: this.extractObjective(text),
          confidence,
        };
      case 'work_experience':
        return {
          data: this.extractWorkExperience(text),
          confidence,
        };
      case 'technical_skills':
        return {
          data: this.extractSkills(text),
          confidence,
        };
      default:
        return { data: { raw: text }, confidence };
    }
  }

  private static extractPersonal(text: string): any {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const phoneRegex = /\+?[\d\s().-]{7,}/;
    const emailMatch = emailRegex.exec(text);
    const phoneMatch = phoneRegex.exec(text);

    return {
      email: emailMatch ? emailMatch[0] : undefined,
      phone: phoneMatch ? phoneMatch[0] : undefined,
      raw: text,
    };
  }

  private static extractObjective(text: string): any {
    return {
      courseName: text,
      specialization: '', // To be filled by user
      targetField: '',
      targetRole: '',
    };
  }

  private static extractWorkExperience(text: string): any {
    const companyRegex = /at\s+([a-z\s]+)/i;
    const roleRegex = /as\s+([a-z\s]+)/i;
    const companyMatch = companyRegex.exec(text);
    const roleMatch = roleRegex.exec(text);

    return {
      companyName: companyMatch ? companyMatch[1] : undefined,
      designation: roleMatch ? roleMatch[1] : undefined,
      raw: text,
    };
  }

  private static extractSkills(text: string): any {
    const skills = text
      .split(/[,;]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    return {
      skills,
    };
  }
}

// Question Generator Service
export class QuestionGenerator {
  private static readonly questions: Readonly<{ [key: string]: readonly string[] }> = {
    personal: [
      "What is your full name? (First and Last)",
      "What is your email address?",
      "What is your phone number? (Include country code)",
      "What is your postal address?",
      "Do you have a GitHub profile? (Optional)",
      "Do you have a LinkedIn profile? (Optional)",
    ],
    objective: [
      "Which Master's program do you want to pursue? (e.g., MS in Computer Science)",
      "What specialization are you interested in? (e.g., AI/ML, Data Science)",
      "What technical skills do you want to upgrade?",
      "What field do you want to work in after your Master's?",
      "What role do you aim for? (e.g., Software Engineer, Data Scientist)",
    ],
    academic_qualification: [
      "What is your highest degree? (e.g., Bachelor of Science)",
      "What was your field of study?",
      "Which university did you attend?",
      "What city is the university in?",
      "What was your GPA or percentage?",
      "When did you graduate? (Month and Year)",
    ],
    academic_projects: [
      "What is the title of your project?",
      "Which institution or organization was it from?",
      "How many people were in your team?",
      "When did you work on this project? (Start date)",
      "When did you complete it? (End date)",
      "What was your role? (Team Lead or Team Member)",
      "What was the objective of this project?",
      "What were the main results or outcomes?",
      "What tools or technologies did you use?",
    ],
    work_experience: [
      "What is your current/most recent job title?",
      "Which company do/did you work for?",
      "In which city is the company located?",
      "When did you start this job? (Month and Year)",
      "Are you still working there? (Yes/No)",
      "If not, when did you leave? (Month and Year)",
      "What was your project or main responsibility?",
      "What are your key contributions? (Can list multiple)",
      "Did you receive any awards or recognition?",
    ],
    technical_skills: [
      "What programming languages are you proficient in?",
      "What web technologies do you know?",
      "What databases have you worked with?",
      "What development tools are you comfortable with?",
      "What frameworks or libraries do you use?",
      "Have you worked with any cloud platforms?",
    ],
    certifications: [
      "What technical certifications do you have?",
      "From which organization or platform?",
      "When did you obtain this certification? (Date range)",
      "Do you have any credential URL?",
    ],
    internships: [
      "What was your internship title?",
      "Which company did you intern at?",
      "What city was the internship in?",
      "What was your designation?",
      "When did your internship start and end? (Dates)",
      "What did you work on during the internship?",
    ],
    achievements: [
      "What achievements or awards do you have?",
      "What category does this fall under? (Academic, Sports, Cultural, Other)",
      "What year was this achieved?",
      "Can you describe this achievement?",
    ],
    leadership: [
      "What leadership positions have you held?",
      "What was the organization or club?",
      "When did you hold this position? (Dates)",
      "What were your key responsibilities?",
    ],
    community: [
      "What community involvement activities have you done?",
      "Which organization were you involved with?",
      "Can you describe your contributions?",
      "When did you participate? (Dates)",
    ],
  };

  static getNextQuestion(section: string): string {
    const sectionQuestions = this.questions[section] || this.questions['general'];
    if (!sectionQuestions || sectionQuestions.length === 0) {
      return 'Thank you for the information. Is there anything else you would like to add to your resume?';
    }
    return sectionQuestions[0]; // Return first question
  }
}
