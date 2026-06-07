import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { initializeFirebase } from './firebase/admin';
import challengeRoutes from './routes/challenge.routes';

dotenv.config();
initializeFirebase();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet({ contentSecurityPolicy: false }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'Heritage AI Backend',
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use('/api/challenge', challengeRoutes);
app.use('/api/challenges', challengeRoutes);

app.listen(PORT, () => {
  console.log(`🏛️  Heritage AI Backend running on http://localhost:${PORT}`);
  console.log(
    `   Gemini: ${
      process.env.GEMINI_API_KEY ? '✓ configured' : '✗ not configured (set GEMINI_API_KEY)'
    }`
  );
  console.log(
    `   Firebase: ${
      process.env.FIREBASE_PROJECT_ID
        ? '✓ configured'
        : '✗ not configured (using emulator mode)'
    }`
  );
});

export default app;
