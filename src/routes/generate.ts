import { Router, Request, Response } from 'express';
import { PDFGenerator } from '../services/pdfGenerator';
import { ResumeBuilder } from '../services/resumeBuilder';

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
 * Generate PDF resume
 */
router.post('/pdf', async (req: Request, res: Response) => {
  try {
    const { resumeData } = req.body;

    if (!resumeData) {
      return res.status(400).json({
        error: { code: 'INVALID_REQUEST', message: 'Resume data is required' },
      });
    }

    console.log('[PDF] Building resume text...');
    // Build resume text from data
    const resumeText = ResumeBuilder.buildRawResume(resumeData);
    console.log('[PDF] Resume text length:', resumeText.length);
    
    console.log('[PDF] Generating PDF buffer...');
    // Generate PDF buffer
    const pdfBuffer = await PDFGenerator.generatePDFFromHTML(resumeText);
    console.log('[PDF] PDF buffer size:', pdfBuffer.length, 'bytes');

    if (!pdfBuffer || pdfBuffer.length === 0) {
      throw new Error('PDF buffer is empty');
    }

    // Send PDF as response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="resume.pdf"');
    res.setHeader('Content-Length', pdfBuffer.length);
    console.log('[PDF] Sending PDF response...');
    return res.send(pdfBuffer);
  } catch (error: any) {
    console.error('[PDF] Error:', error);
    return res.status(500).json({
      error: {
        code: 'GENERATE_PDF_ERROR',
        message: error.message || 'Failed to generate PDF',
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
