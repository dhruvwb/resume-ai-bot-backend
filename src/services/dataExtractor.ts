export class DataExtractor {
  static extract(message: string, intent: string) {
    const text = (message || '').trim();
    let data: any = {};

    switch (intent) {
      case 'technical_skills':
        data.skills = text
          .split(/[,;]|\band\b/i)
          .map((s) => s.trim())
          .filter(Boolean);
        break;
      case 'work_experience':
        // naive parse: try to capture "Company - Role (dates) : bullets"
        data.text = text;
        break;
      case 'academic_projects':
        data.project = text;
        break;
      case 'academic_qualification':
        data.education = text;
        break;
      default:
        data.text = text;
        break;
    }

    // simple confidence heuristic
    const confidence = Math.min(0.9, Math.max(0.4, data.skills ? 0.8 : 0.6));
    return { data, confidence };
  }
}