import { Router, Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = Router();

// Configuration
const USE_GEMINI = process.env.USE_GEMINI === 'true' && process.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY.includes('your-');

let geminiClient: any = null;

if (USE_GEMINI) {
  geminiClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  console.log('✅ Gemini AI initialized for extract service');
}

// POST /api/extract - Extract structured data from text using AI
router.post('/', async (req: Request, res: Response) => {
  try {
    const { text, field = 'general' } = req.body;

    if (!text) {
      return res.status(400).json({
        error: { code: 'INVALID_REQUEST', message: 'Text is required' },
      });
    }

    let extracted: any = {
      raw: text,
      field: field,
    };
    let confidence = 0.65;
    let aiExtracted = false;

    // Use Gemini AI if available
    if (USE_GEMINI && geminiClient) {
      try {
        const model = geminiClient.getGenerativeModel({ model: 'gemini-pro' });
        
        const extractionPrompt = `Extract structured information from the following text for field: "${field}". 
Return a JSON object with extracted key-value pairs. Be concise and factual.
If field is 'general', extract all key information.
If field is specific (e.g., 'skills', 'experience', 'education'), extract only relevant fields.

Text to extract from:
${text}

Return ONLY valid JSON without any markdown formatting or explanation.`;
        
        const result = await model.generateContent(extractionPrompt);
        const responseText = result.response.text().trim();
        
        try {
          // Try to parse as JSON
          const jsonMatch = responseText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            extracted.structured = JSON.parse(jsonMatch[0]);
            confidence = 0.92;
            aiExtracted = true;
            console.log(`[Extract] AI extracted data for field: ${field}`);
          } else {
            console.warn('[Extract] Could not parse JSON response from Gemini');
          }
        } catch (parseErr) {
          console.warn('[Extract] JSON parsing failed, returning raw extraction');
          extracted.aiResponse = responseText;
          confidence = 0.80;
        }
      } catch (err: any) {
        console.warn('[Extract] Gemini extraction failed:', err?.message || err);
        console.log('[Extract] Falling back to basic extraction');
      }
    } else {
      console.log('[Extract] Gemini not configured, using basic extraction');
    }

    return res.json({
      extracted,
      confidence,
      aiExtracted,
      aiEnabled: USE_GEMINI && !!geminiClient,
      message: aiExtracted ? 'AI-powered extraction completed' : 'Basic extraction completed',
    });
  } catch (error: any) {
    console.error('Extract error:', error);
    return res.status(500).json({
      error: {
        code: 'EXTRACT_ERROR',
        message: error.message || 'Failed to extract data',
      },
    });
  }
});

export default router;
