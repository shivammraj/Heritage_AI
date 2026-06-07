import { getDb } from './admin';
import { Challenge, Guess, User } from '../types';
import * as admin from 'firebase-admin';

export async function createChallenge(data: Omit<Challenge, 'id'>): Promise<string> {
  const db = getDb();
  const ref = await db.collection('challenges').add({
    ...data,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    revealAt: admin.firestore.Timestamp.fromDate(data.revealAt),
  });
  return ref.id;
}

export async function getChallengeById(id: string): Promise<Challenge | null> {
  const db = getDb();
  const doc = await db.collection('challenges').doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() } as Challenge;
}

export async function incrementGuessCount(challengeId: string, isCorrect: boolean): Promise<void> {
  const db = getDb();
  await db.collection('challenges').doc(challengeId).update({
    guessCount: admin.firestore.FieldValue.increment(1),
    ...(isCorrect ? { correctCount: admin.firestore.FieldValue.increment(1) } : {}),
  });
}

export async function saveGuess(data: Omit<Guess, 'id'>): Promise<string> {
  const db = getDb();
  const ref = await db.collection('guesses').add({
    ...data,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  });
  return ref.id;
}

export async function getUserGuessForChallenge(userId: string, challengeId: string): Promise<Guess | null> {
  const db = getDb();
  const snap = await db
    .collection('guesses')
    .where('userId', '==', userId)
    .where('challengeId', '==', challengeId)
    .limit(1)
    .get();
  if (snap.empty) return null;
  const doc = snap.docs[0];
  return { id: doc.id, ...doc.data() } as Guess;
}

export async function getRecentChallenges(limit: number = 20, theme?: string): Promise<Challenge[]> {
  const db = getDb();
  let query: admin.firestore.Query = db
    .collection('challenges')
    .orderBy('createdAt', 'desc')
    .limit(limit);
  if (theme) query = query.where('theme', '==', theme);
  const snap = await query.get();
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Challenge));
}

export async function updateUserStats(userId: string, updates: Partial<User>): Promise<void> {
  const db = getDb();
  await db.collection('users').doc(userId).set(updates, { merge: true });
}

export async function getOrCreateUser(uid: string, displayName: string, photoURL: string): Promise<User> {
  const db = getDb();
  const ref = db.collection('users').doc(uid);
  const doc = await ref.get();
  if (doc.exists) return { uid, ...doc.data() } as User;
  const newUser: Omit<User, 'uid'> = {
    name: displayName || 'Anonymous',
    photoURL: photoURL || '',
    challengesCreated: 0,
    totalGuesses: 0,
    correctGuesses: 0,
    score: 0,
    accuracy: 0,
    statesCreated: [],
    statesGuessedCorrectly: [],
    badges: [],
  };
  await ref.set(newUser);
  return { uid, ...newUser };
}

export async function getLeaderboard(type: 'creators' | 'guessers', limit: number = 20): Promise<any[]> {
  const db = getDb();
  const field = type === 'creators' ? 'challengesCreated' : 'correctGuesses';
  const snap = await db.collection('users').orderBy(field, 'desc').limit(limit).get();
  return snap.docs.map((doc, i) => ({ rank: i + 1, uid: doc.id, ...doc.data() }));
}
