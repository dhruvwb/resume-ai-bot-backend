import { Router, Request, Response } from 'express';

const router = Router();

// POST /api/extract - Extract structured data from text
router.post('/', async (req: Request, res: Response) => {
  try {
    const { text, field } = req.body;

    if (!text) {
      return res.status(400).json({
        error: { code: 'INVALID_REQUEST', message: 'Text is required' },
      });
    }

    return res.json({
      extracted: {
        raw: text,
        field: field || 'general',
      },
      confidence: 0.75,
    });
  } catch (error: any) {
    return res.status(500).json({
      error: {
        code: 'EXTRACT_ERROR',
        message: error.message,
      },
    });
  }
});

export default router;
