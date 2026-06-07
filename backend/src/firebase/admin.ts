import * as admin from 'firebase-admin';

let initialized = false;

export function initializeFirebase() {
  if (initialized) return;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;

  if (!projectId || !privateKey || !clientEmail) {
    console.warn('Firebase Admin credentials not configured — using emulator mode');
    admin.initializeApp({
      projectId: projectId || 'heritage-ai-demo',
    });
  } else {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        privateKey,
        clientEmail,
      }),
      storageBucket,
    });
  }
  initialized = true;
}

export function getDb() {
  return admin.firestore();
}

export function getStorage() {
  return admin.storage();
}

export function getAuth() {
  return admin.auth();
}
