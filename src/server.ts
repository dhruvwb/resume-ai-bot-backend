import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables FIRST before importing routes
dotenv.config({ path: '.env.local' });

import chatRoutes from './routes/chat';
import optimizeRoutes from './routes/optimize';
import extractRoutes from './routes/extract';
import generateRoutes from './routes/generate';
import { MastersResumeTemplate } from './templates/mastersTemplate';

const app: Express = express();
const PORT = process.env.PORT || 5000;

// ============ MIDDLEWARE ============

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ============ LOGGING MIDDLEWARE ============

app.use((_req: Request, _res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${_req.method} ${_req.path}`);
  next();
});

// ============ ROUTES ============

// API Routes
app.use('/api/chat', chatRoutes);
app.use('/api/optimize', optimizeRoutes);
app.use('/api/extract', extractRoutes);
app.use('/api/generate', generateRoutes);

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV,
  });
});

// Template info
app.get('/api/template', (_req: Request, res: Response) => {
  res.json({
    template: 'Masters Resume',
    version: '1.0.0',
    sections: MastersResumeTemplate.getSections(),
    questionCount: MastersResumeTemplate.getTotalQuestions(),
  });
});

// Get sample resume structure
app.get('/api/sample-resume', (_req: Request, res: Response) => {
  res.json(MastersResumeTemplate.getEmptyResume());
});

// ============ ERROR HANDLING ============

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: `Route ${_req.method} ${_req.path} not found`,
    },
  });
});

// Error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: err.message || 'An unexpected error occurred',
    },
  });
});

// ============ START SERVER ============

app.listen(PORT, () => {
  console.log(`✅ Backend Server Running`);
  console.log(`📍 Local:    http://localhost:${PORT}`);
  console.log(`🔗 API:      http://localhost:${PORT}/api`);
  console.log(`💡 Health:   http://localhost:${PORT}/api/health`);
  console.log(`📋 Template: http://localhost:${PORT}/api/template`);
  console.log(`\n🔑 OpenAI: ${process.env.OPENAI_API_KEY ? '✅ Connected' : '❌ Not configured'}`);
  console.log(`🌐 CORS: ${process.env.CORS_ORIGIN}`);
});

export default app;
