export const config = {
  // API Configuration
  apiBaseUrl: process.env.REACT_APP_API_BASE_URL || 'https://api.demo-logistica.com',
  
  // Firebase Configuration
  firebase: {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY || 'AIzaSyC-zFIkGSokxhBtHyf_gaBORKceaBBhq5c',
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || 'smsverify-edd18.firebaseapp.com',
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || 'smsverify-edd18',
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || 'smsverify-edd18.appspot.com',
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '835326116153',
    appId: process.env.REACT_APP_FIREBASE_APP_ID || '1:835326116153:web:637a14ef1cbb452976a8e8',
  },
  
  // App Configuration
  app: {
    name: process.env.REACT_APP_APP_NAME || 'Logistics Platform',
    version: process.env.REACT_APP_VERSION || '1.0.0',
    environment: process.env.REACT_APP_ENVIRONMENT || 'development',
    debug: process.env.REACT_APP_DEBUG === 'true' || true,
  },
  
  // Feature flags
  features: {
    enableDebugTools: process.env.REACT_APP_ENABLE_DEBUG_TOOLS === 'true' || true,
    enableApiTests: process.env.REACT_APP_ENABLE_API_TESTS === 'true' || true,
  },
};

export const validateEnvironment = () => {
  const requiredVars = [
    'REACT_APP_API_BASE_URL',
    'REACT_APP_FIREBASE_API_KEY',
    'REACT_APP_FIREBASE_PROJECT_ID',
  ];
  
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0 && config.app.environment === 'production') {
    console.warn('Missing environment variables:', missingVars);
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
  
  // Environment configuration loaded
};

export default config;
