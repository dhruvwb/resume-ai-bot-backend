import { Router, Request, Response } from 'express';
import { ResumeQuestionnaire } from '../services/resumeQuestionnaire';
import { ResumeBuilder } from '../services/resumeBuilder';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = Router();

// Store questionnaire sessions for each user/conversation
const questionnaireSessions: Map<string, ResumeQuestionnaire> = new Map();

// Configuration
const USE_GEMINI = process.env.USE_GEMINI === 'true' && process.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY.includes('your-');

let geminiClient: any = null;

if (USE_GEMINI) {
  geminiClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  console.log('✅ Gemini AI initialized');
}

router.post('/', async (req: Request, res: Response) => {
  try {
    const { message, sessionId = 'default' } = req.body;

    // Validation
    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        error: {
          code: 'INVALID_MESSAGE',
          message: 'Message is required and must be a string',
        },
      });
    }

    // Initialize questionnaire for this session if needed
    if (!questionnaireSessions.has(sessionId)) {
      questionnaireSessions.set(sessionId, new ResumeQuestionnaire());
    }

    const questionnaire = questionnaireSessions.get(sessionId)!;

    // Get current question
    const currentQuestion = questionnaire.getCurrentQuestion();

    if (!currentQuestion) {
      // All questions answered - build resume
      const resumeData = questionnaire.getResumeData();
      const rawResume = ResumeBuilder.buildRawResume(resumeData);
      const completion = ResumeBuilder.getCompletionPercentage(resumeData);

      let optimizedResume = rawResume;

      // Apply AI optimization if available
      if (USE_GEMINI) {
        try {
          const model = geminiClient.getGenerativeModel({ model: 'gemini-pro' });
          const optimizationPrompt = `Optimize this resume for ATS systems and make it more professional and impactful. Keep the same structure but improve the language, add strong action verbs, and enhance descriptions:\n\n${rawResume}`;
          
          const result = await model.generateContent(optimizationPrompt);
          optimizedResume = result.response.text();
          console.log('[Chat] Applied Gemini optimization');
        } catch (err: any) {
          console.warn('[Chat] Gemini optimization failed, using raw resume:', err?.message || err);
        }
      }

      return res.json({
        response: `✅ Resume Complete!\n\n${rawResume}`,
        isComplete: true,
        rawResume,
        optimizedResume,
        resumeData,
        completion,
        nextQuestion: null,
      });
    }

    // Process user's answer to current question
    questionnaire.processAnswer(message);
    const progress = questionnaire.getProgress();
    const resumeData = questionnaire.getResumeData();

    // Get next question
    const nextQuestion = questionnaire.getCurrentQuestion();

    const response = {
      response: nextQuestion ? nextQuestion.question : '✅ All questions answered! Building your resume...',
      question: currentQuestion.question,
      nextQuestion: nextQuestion?.question || null,
      progress,
      isComplete: !nextQuestion,
      resumeData, // Include current resume data for real-time preview
      sessionId,
    };

    console.log(`[Chat] Q${progress.current}/${progress.total}: "${currentQuestion.question}" -> User: "${message}"`);
    console.log(`[Chat] Progress: ${progress.percentage}% complete`);

    return res.json(response);
  } catch (error: any) {
    console.error('Chat error:', error);
    return res.status(500).json({
      error: {
        code: 'CHAT_ERROR',
        message: error.message || 'Failed to process chat message',
      },
    });
  }
});

export default router;
