import { Request, Response, NextFunction } from 'express';
import { getAuth } from '../firebase/admin';

export interface AuthRequest extends Request {
  uid?: string;
  userEmail?: string;
}

export async function requireAuth(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'No authorization token provided' });
    return;
  }
  const token = authHeader.split('Bearer ')[1];

  // Graceful local development fallback when Firebase credentials are not fully configured
  const hasFirebaseConfig = process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL;
  if (!hasFirebaseConfig || token.startsWith('mock_')) {
    req.uid = token;
    req.userEmail = `${token.replace('mock_', '')}@heritage-ai.local`;
    next();
    return;
  }

  try {
    const decoded = await getAuth().verifyIdToken(token);
    req.uid = decoded.uid;
    req.userEmail = decoded.email;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

export async function optionalAuth(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.split('Bearer ')[1];

    // Graceful local development fallback
    const hasFirebaseConfig = process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL;
    if (!hasFirebaseConfig || token.startsWith('mock_')) {
      req.uid = token;
      next();
      return;
    }

    try {
      const decoded = await getAuth().verifyIdToken(token);
      req.uid = decoded.uid;
    } catch { /* continue without auth */ }
  }
  next();
}
