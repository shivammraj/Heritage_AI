import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { requireAuth, optionalAuth, AuthRequest } from '../middleware/auth.middleware';
import {
  generateWithValidation,
  generateClues,
  generateShareCaption,
  generateCulturalFact,
} from '../services/gemini.service';
import { generateImage } from '../services/imagen.service';
import { generateShareCard } from '../services/sharecard.service';
import { validateAllContent, validatePromptIsNameFree } from '../services/validation.service';
import { encryptStateId, decryptStateId } from '../utils/encryption';
import { getStateById, INDIAN_STATES, getDecoyStates } from '../data/states';
import { getDb } from '../firebase/admin';
import {
  createChallenge,
  getChallengeById,
  incrementGuessCount,
  saveGuess,
  getUserGuessForChallenge,
  getRecentChallenges,
  updateUserStats,
  getOrCreateUser,
  getLeaderboard,
} from '../firebase/firestore';
import { Theme, CreateChallengeRequest, GuessRequest } from '../types';

const router = Router();

// Store share cards and artwork in memory (use Cloud Storage in production)
const shareCardCache = new Map<string, Buffer>();
const artworkCache = new Map<string, Buffer>();

function buildPublicChallenge(challenge: any, now: Date) {
  const revealAt =
    challenge.revealAt instanceof Date
      ? challenge.revealAt
      : (challenge.revealAt as any).toDate();
  const isRevealed = now > revealAt || challenge.guessCount >= 50;
  const timeRemaining = Math.max(0, revealAt.getTime() - now.getTime());
  
  // Generate choices
  const correctStateId = decryptStateId(challenge.stateId_encrypted);
  const decoys = getDecoyStates(correctStateId, 5);
  const choices = [
    getStateById(correctStateId)!,
    ...decoys
  ].map(s => ({ id: s.id, name: s.name }));

  // Consistent shuffle based on challenge ID
  const shuffledChoices = choices.sort((a, b) => {
    const hashA = a.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const hashB = b.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const seed = challenge.id ? challenge.id.charCodeAt(0) : 0;
    return (hashA + hashB + seed) % 2 === 0 ? 1 : -1;
  });

  const { stateId_encrypted, imagenPrompt, ...publicData } = challenge;
  return {
    ...publicData,
    isRevealed,
    timeRemaining,
    choices: shuffledChoices,
    artworkURL: `http://localhost:${process.env.PORT || 3001}/api/challenge/${challenge.id}/artwork`,
  };
}

// POST /api/challenge/create
router.post('/create', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { stateId, theme } = req.body as CreateChallengeRequest;
    const state = getStateById(stateId);
    if (!state) {
      res.status(400).json({ error: 'Invalid state ID' });
      return;
    }
    const validThemes: Theme[] = ['spirit', 'food', 'festival', 'nature', 'architecture'];
    if (!validThemes.includes(theme)) {
      res.status(400).json({ error: 'Invalid theme' });
      return;
    }

    // Step 1: Generate validated image prompt
    console.log(`[CREATE] Generating prompt for ${state.name} / ${theme}`);
    const { prompt, attempts: promptAttempts } = await generateWithValidation(stateId, theme);
    console.log(`[VALIDATION] Prompt passed after ${promptAttempts} attempt(s)`);

    // Step 2: Generate image
    console.log('[CREATE] Generating artwork...');
    const imageBuffer = await generateImage(prompt);

    // Step 3: Generate clues with validation
    console.log('[CREATE] Generating clues...');
    let clues = await generateClues(stateId, theme);
    clues = clues.map(clue => {
      const validation = validatePromptIsNameFree(clue, stateId);
      if (!validation.isValid) {
        return 'A cultural mystery waiting to be discovered...';
      }
      return clue;
    });

    // Step 4: Generate share caption with validation
    console.log('[CREATE] Generating share caption...');
    let shareText = await generateShareCaption(stateId);
    const captionValidation = validatePromptIsNameFree(shareText, stateId);
    if (!captionValidation.isValid) {
      shareText = 'Something beautiful hides in plain sight. Can you guess which state? 🔍 [link]';
    }

    // Step 5: Validate all content
    const allValidation = validateAllContent({ prompt, clues, shareText }, stateId);
    console.log('[VALIDATION] All content check:', allValidation.allValid);

    // Step 6: Encrypt state ID
    const stateId_encrypted = encryptStateId(stateId);

    // Step 7: Save to Firestore
    const revealAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const challengeId = await createChallenge({
      creatorId: req.uid!,
      theme,
      artworkURL: `/api/challenge/artwork/${uuidv4()}`, // placeholder until Cloud Storage is set up
      imagenPrompt: prompt,
      clues,
      shareText,
      stateId_encrypted,
      revealAt,
      guessCount: 0,
      correctCount: 0,
      isDaily: false,
      createdAt: new Date(),
      validationPassed: allValidation.allValid,
      validationAttempts: promptAttempts,
    });

    // Cache artwork and generate share card
    artworkCache.set(challengeId, imageBuffer);
    try {
      const shareCard = await generateShareCard(imageBuffer, challengeId);
      shareCardCache.set(challengeId, shareCard);
    } catch (e) {
      console.warn('Share card generation failed:', e);
    }

    // Update user stats
    await updateUserStats(req.uid!, {
      challengesCreated: 1,
      statesCreated: [stateId],
    } as any);

    res.json({
      challengeId,
      artworkURL: `http://localhost:${process.env.PORT || 3001}/api/challenge/${challengeId}/artwork`,
      shareCardURL: `http://localhost:${process.env.PORT || 3001}/api/challenge/${challengeId}/sharecard.png`,
      clues,
      shareText,
      validationPassed: allValidation.allValid,
      validationAttempts: promptAttempts,
    });
  } catch (error: any) {
    console.error('[CREATE] Error:', error);
    res.status(500).json({ error: error.message || 'Failed to create challenge' });
  }
});

// GET /api/challenge/:id/artwork
router.get('/:id/artwork', async (req, res): Promise<void> => {
  const buf = artworkCache.get(req.params.id as string);
  if (!buf) {
    res.status(404).json({ error: 'Artwork not found' });
    return;
  }
  res.set('Content-Type', 'image/png');
  res.send(buf);
});

// GET /api/challenge/:id/sharecard.png
router.get('/:id/sharecard.png', async (req, res): Promise<void> => {
  const buf = shareCardCache.get(req.params.id as string);
  if (!buf) {
    res.status(404).json({ error: 'Share card not found' });
    return;
  }
  res.set('Content-Type', 'image/png');
  res.set('Cache-Control', 'public, max-age=86400');
  res.send(buf);
});

// GET /api/challenge/:id
router.get('/:id', optionalAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const challenge = await getChallengeById(req.params.id as string);
    if (!challenge) {
      res.status(404).json({ error: 'Challenge not found' });
      return;
    }
    const now = new Date();
    res.json(buildPublicChallenge(challenge, now));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/challenge/:id/reveal
router.get('/:id/reveal', optionalAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const challenge = await getChallengeById(req.params.id as string);
    if (!challenge) {
      res.status(404).json({ error: 'Challenge not found' });
      return;
    }
    const now = new Date();
    const revealAt =
      challenge.revealAt instanceof Date
        ? challenge.revealAt
        : (challenge.revealAt as any).toDate();
    const isTimeUp = now > revealAt || challenge.guessCount >= 50;
    let hasGuessed = false;
    if (req.uid) {
      const guess = await getUserGuessForChallenge(req.uid, req.params.id as string);
      hasGuessed = guess !== null;
    }
    if (!isTimeUp && !hasGuessed) {
      res.status(403).json({ error: 'State not yet revealed' });
      return;
    }
    const stateId = decryptStateId(challenge.stateId_encrypted);
    const state = getStateById(stateId);
    const culturalFact = await generateCulturalFact(stateId);
    const accuracy =
      challenge.guessCount > 0
        ? Math.round((challenge.correctCount / challenge.guessCount) * 100)
        : 0;
    res.json({
      stateName: state?.name || 'Unknown',
      stateId,
      culturalFact,
      accuracy,
      guessCount: challenge.guessCount,
      correctCount: challenge.correctCount,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/challenge/guess
router.post('/guess', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { challengeId, guessedState, cluesUsed } = req.body as GuessRequest;
    const challenge = await getChallengeById(challengeId);
    if (!challenge) {
      res.status(404).json({ error: 'Challenge not found' });
      return;
    }
    const correctStateId = decryptStateId(challenge.stateId_encrypted);
    const isCorrect = guessedState === correctStateId;
    const pointsEarned = Math.max(50, 300 - cluesUsed * 100);
    const guessId = await saveGuess({
      challengeId,
      userId: req.uid!,
      guessedState,
      isCorrect,
      cluesUsed,
      pointsEarned: isCorrect ? pointsEarned : 0,
      timestamp: new Date(),
    });
    await incrementGuessCount(challengeId, isCorrect);
    // Update user score
    if (isCorrect) {
      const state = getStateById(correctStateId);
      await updateUserStats(req.uid!, {
        score: pointsEarned,
        correctGuesses: 1,
        statesGuessedCorrectly: state ? [correctStateId] : [],
      } as any);
    } else {
      await updateUserStats(req.uid!, { totalGuesses: 1 } as any);
    }
    res.json({
      isCorrect,
      pointsEarned: isCorrect ? pointsEarned : 0,
      guessId,
      ...(isCorrect ? { correctState: getStateById(correctStateId)?.name } : {}),
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/challenges/feed
router.get('/feed', async (req, res): Promise<void> => {
  try {
    const theme = req.query.theme as string | undefined;
    const challenges = await getRecentChallenges(20, theme);
    const now = new Date();
    const publicChallenges = challenges.map(c => buildPublicChallenge(c, now));
    res.json(publicChallenges);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/challenges/daily
router.get('/daily', async (req, res): Promise<void> => {
  try {
    const db = getDb();
    const snap = await db.collection('challenges')
      .where('isDaily', '==', true)
      .orderBy('createdAt', 'desc')
      .limit(1)
      .get();
    
    let challenge: any = null;
    if (!snap.empty) {
      challenge = { id: snap.docs[0].id, ...snap.docs[0].data() };
    } else {
      // Fallback to most recent
      const recent = await getRecentChallenges(1);
      if (recent.length > 0) {
        challenge = recent[0];
      }
    }

    if (!challenge) {
      res.status(404).json({ error: 'No daily challenge available' });
      return;
    }

    const now = new Date();
    res.json(buildPublicChallenge(challenge, now));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/challenges/leaderboard
router.get('/leaderboard', async (req, res): Promise<void> => {
  try {
    const type = (req.query.type as 'creators' | 'guessers') || 'guessers';
    const limit = parseInt(req.query.limit as string) || 10;
    const list = await getLeaderboard(type, limit);
    res.json(list);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/challenges/profile
router.get('/profile', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await getOrCreateUser(req.uid!, 'Explorer', '');
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
