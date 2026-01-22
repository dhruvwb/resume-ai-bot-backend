import { Router, Request, Response } from 'express';

const router = Router();

/**
 * POST /api/generate
 * Generate a resume bullet point from section, role, and details
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { section, role, details } = req.body;

    if (!section || !role || !details) {
      return res.status(400).json({
        error: {
          code: 'INVALID_REQUEST',
          message: 'Section, role, and details are required',
        },
      });
    }

    // Placeholder logic — replace with AI or template generation later
    const bullet = `• ${role} — ${details}`;

    return res.json({
      section,
      role,
      bullet,
    });
  } catch (error: any) {
    return res.status(500).json({
      error: {
        code: 'GENERATE_ERROR',
        message: error.message,
      },
    });
  }
});

/**
 * POST /api/generate/pdf
 * Generate PDF resume (placeholder)
 */
router.post('/pdf', async (req: Request, res: Response) => {
  try {
    const { resumeData } = req.body;

    if (!resumeData) {
      return res.status(400).json({
        error: { code: 'INVALID_REQUEST', message: 'Resume data is required' },
      });
    }

    // Placeholder — implement with Puppeteer or pdf-lib later
    return res.json({
      message: 'PDF generation coming soon',
      filename: 'resume.pdf',
      url: '/downloads/resume.pdf',
    });
  } catch (error: any) {
    return res.status(500).json({
      error: {
        code: 'GENERATE_PDF_ERROR',
        message: error.message,
      },
    });
  }
});

/**
 * POST /api/generate/docx
 * Generate DOCX resume (placeholder)
 */
router.post('/docx', async (req: Request, res: Response) => {
  try {
    const { resumeData } = req.body;

    if (!resumeData) {
      return res.status(400).json({
        error: { code: 'INVALID_REQUEST', message: 'Resume data is required' },
      });
    }

    // Placeholder — implement with docx or python-docx later
    return res.json({
      message: 'DOCX generation coming soon',
      filename: 'resume.docx',
      url: '/downloads/resume.docx',
    });
  } catch (error: any) {
    return res.status(500).json({
      error: {
        code: 'GENERATE_DOCX_ERROR',
        message: error.message,
      },
    });
  }
});

export default router;
