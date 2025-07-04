declare global {
    namespace NodeJS {
      interface ProcessEnv {
        PORT: string;
        NODE_ENV: string;
        FIREBASE_PROJECT_ID: string;
        FIREBASE_CLIENT_EMAIL: string;
        FIREBASE_PRIVATE_KEY: string;
        FIREBASE_DATABASE_URL?: string;
        FIREBASE_STORAGE_BUCKET?: string;
        FIREBASE_API_KEY?: string;
        FIREBASE_APP_ID?: string;
        FIREBASE_AUTH_DOMAIN?: string;
        FIREBASE_MESSAGING_SENDER_ID?: string;
      }
    }
  }

  export {};