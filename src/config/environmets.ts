import dotenv from 'dotenv';

dotenv.config();

export const firebaseApiKey = process.env.FIREBASE_API_KEY;

export const firebaseAuthDomain = process.env.FIREBASE_AUTH_DOMAIN;

export const firebaseProjectId = process.env.FIREBASE_PROJECT_ID;

export const firebaseStorageBucket = process.env.FIREBASE_STORAGE_BUCKET;

export const firebaseMessagingSenderId = process.env.FIREBASE_MESSAGING_SENDER_ID;

export const firebaseAppId = process.env.FIREBASE_APP_ID;
