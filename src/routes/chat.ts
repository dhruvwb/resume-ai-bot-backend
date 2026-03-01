import { Router, Request, Response } from 'express';
import { ResumeQuestionnaire } from '../services/resumeQuestionnaire';
import { ResumeBuilder } from '../services/resumeBuilder';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = Router();

// Store questionnaire sessions for each user/conversation
const questionnaireSessions: Map<string, ResumeQuestionnaire> = new Map();

// Configuration
const USE_GEMINI =
  process.env.USE_GEMINI === 'true' &&
  process.env.GEMINI_API_KEY &&
  !process.env.GEMINI_API_KEY.includes('your-');

let geminiClient: any = null;

if (USE_GEMINI) {
  geminiClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  console.log('✅ Gemini AI initialized');
}

// ===== OPTIMIZATION HELPER =====
async function optimizeField(fieldName: string, value: string): Promise<string> {
  if (!USE_GEMINI || !value.trim()) return value;

  try {
    const model = geminiClient.getGenerativeModel({ model: 'gemini-2.5-flash' });

    let prompt = '';

    if (fieldName === 'course') {
      prompt = `Optimize this course/program description for a Master's resume. Make it professional and impactful. Keep it concise (1-2 sentences max). Return only the optimized text, no explanations:\n\n${value}`;
    } else if (fieldName === 'specialization') {
      prompt = `Optimize this specialization description for a resume. Make it professional and concise. Highlight the key focus areas. Return only the optimized text, no explanations:\n\n${value}`;
    } else if (fieldName === 'interests') {
      prompt = `Enhance this list of skills/interests for a Master's resume. Make it sound professional and relevant. Return only the enhanced text:\n\n${value}`;
    } else if (fieldName === 'description' || fieldName === 'targetRole') {
      prompt = `Improve this resume description to be more professional and impactful. Use strong action verbs and make it concise. Return only the optimized text:\n\n${value}`;
    } else if (fieldName === 'responsibilities' || fieldName === 'achievements') {
      prompt = `Enhance this accomplishment for a resume. Make it specific, measurable, and impactful using action verbs. Return only the enhanced text:\n\n${value}`;
    }

    if (!prompt) return value;

    const result = await model.generateContent(prompt);
    const optimized = result.response.text().trim();
    console.log(`[Optimization] ${fieldName}: "${value.substring(0, 50)}..." → "${optimized.substring(0, 50)}..."`);
    return optimized;
  } catch (err: any) {
    console.warn(`[Optimization] Failed for ${fieldName}:`, err?.message);
    return value;
  }
}

// GET: Get initial question for a session
router.get('/start/:sessionId', (req: Request, res: Response) => {
  const sessionId = String(req.params.sessionId);

  // Initialize questionnaire for this session if needed
  if (!questionnaireSessions.has(sessionId)) {
    questionnaireSessions.set(sessionId, new ResumeQuestionnaire());
  }

  const questionnaire = questionnaireSessions.get(sessionId)!;
  const firstQuestion = questionnaire.getCurrentQuestion();

  return res.json({
    response: firstQuestion,
    nextQuestion: firstQuestion,
    isComplete: false,
    resumeData: {},
    sessionId,
  });
});

// POST: Main chat endpoint
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

    // Get current question before processing
    const currentQuestion = questionnaire.getCurrentQuestion();

    if (!currentQuestion) {
      // Resume is complete, build and return it
      const resumeData =
        (questionnaire as any).getResumeData?.() ??
        (questionnaire as any).resumeData ??
        {};

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
          console.warn(
            '[Chat] Gemini optimization failed, using raw resume:',
            err?.message || err
          );
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

    // Get updated resume data
    const resumeData =
      (questionnaire as any).getResumeData?.() ??
      (questionnaire as any).resumeData ??
      {};

    // Get next question
    const nextQuestion = questionnaire.getCurrentQuestion();

    // Check if current answer needs optimization
    const currentSection = (questionnaire as any).sectionIndex ?? 0;
    const currentQIndex = (questionnaire as any).questionIndex ?? 0;
    const QUESTIONNAIRE_FLOW = require('../services/resumeQuestionnaire').QUESTIONNAIRE_FLOW;
    const section = QUESTIONNAIRE_FLOW[currentSection];
    const currentQuestionObj = section?.questions?.[currentQIndex - 1];

    console.log(`[Debug-Full] currentQuestion="${currentQuestion}"`);
    console.log(`[Debug-Full] sectionIndex=${currentSection}, questionIndex=${currentQIndex}`);
    console.log(`[Debug-Full] section.section="${section?.section}", questions.length=${section?.questions?.length}`);
    console.log(`[Debug-Full] currentQuestionObj=${JSON.stringify(currentQuestionObj)}`);

    let optimizedAnswer = message;
    let isOptimizing = false;

    // Optimize certain fields
    if (currentQuestionObj) {
      const fieldKey = currentQuestionObj.key;
      console.log(`[Debug] fieldKey="${fieldKey}"`);
      if (['course', 'specialization', 'interests', 'targetRole', 'description', 'responsibilities', 'achievements'].includes(fieldKey)) {
        console.log(`[Optimize] Calling optimizeField for ${fieldKey}`);
        isOptimizing = true;
        optimizedAnswer = await optimizeField(fieldKey, message);

        // Update the answer in resumeData with optimized version
        if (resumeData) {
          const currentSectionData = (resumeData as any)[section.section];
          if (section.isArray) {
            const arrayIndex = (questionnaire as any).arrayIndex ?? 0;
            if (currentSectionData?.[arrayIndex]) {
              currentSectionData[arrayIndex][fieldKey] = optimizedAnswer;
            }
          } else {
            if (currentSectionData) {
              currentSectionData[fieldKey] = optimizedAnswer;
            }
          }
        }
      }
    } else {
      console.log(`[Debug] currentQuestionObj is null. section=${currentSection}, qIndex=${currentQIndex}, questions.length=${section?.questions?.length}`);
    }

    const response = {
      response: nextQuestion
        ? nextQuestion
        : '✅ All questions answered! Building your resume...',
      question: currentQuestion,
      nextQuestion: nextQuestion || null,
      isComplete: !nextQuestion,
      resumeData,
      sessionId,
      isOptimizing,
      originalAnswer: isOptimizing ? message : undefined,
      optimizedAnswer: isOptimizing ? optimizedAnswer : undefined,
    };

    console.log(
      `[Chat] "${currentQuestion}" -> User: "${message}"`
    );

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
