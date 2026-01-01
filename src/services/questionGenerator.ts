export class QuestionGenerator {
  static getNextQuestion(intent: string, _context: any) {
    switch (intent) {
      case 'technical_skills':
        return 'Please list your top technical skills (comma separated).';
      case 'work_experience':
        return 'Provide company name, role/title, dates, and a short result-focused bullet.';
      case 'academic_projects':
        return 'Share project title, your role, technologies used, and the outcome or impact.';
      case 'academic_qualification':
        return 'What degree, university, and graduation year (and GPA if applicable)?';
      case 'certifications':
        return 'List certification name, provider, and date (if available).';
      case 'personal_info':
        return 'Please provide full name, email, and phone number.';
      default:
        return 'Can you provide more details about that item?';
    }
  }
}