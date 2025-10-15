import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { config } from './environment';

// Валидация конфигурации Firebase
if (!config.firebase.apiKey || !config.firebase.projectId) {
  throw new Error('Firebase configuration is missing required environment variables');
}

const firebaseConfig = {
  apiKey: config.firebase.apiKey,
  authDomain: config.firebase.authDomain,
  projectId: config.firebase.projectId,
  storageBucket: config.firebase.storageBucket,
  messagingSenderId: config.firebase.messagingSenderId,
  appId: config.firebase.appId,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;

