import { cert, initializeApp, ServiceAccount, App, getApps, getApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getDatabase } from 'firebase-admin/database';
import { getStorage } from 'firebase-admin/storage';
import { getMessaging } from 'firebase-admin/messaging';
import { getAuth as getSession } from 'firebase/auth';
import { FirebaseApp, initializeApp as initializeClient, getApp as getAppClient, getApps as getAppsClient } from 'firebase/app';

const app: App = !getApps().length
    ? initializeApp(
        {
            credential: cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
            }),
            databaseURL: process.env.FIREBASE_DATABASE_URL,
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET
        }
    )
    : getApps()[0]

const appClient: FirebaseApp = !getAppsClient().length
    ? initializeClient(
        {
            apiKey: process.env.FIREBASE_API_KEY,
            appId: process.env.FIREBASE_APP_ID,
            authDomain: process.env.FIREBASE_AUTH_DOMAIN,
            databaseURL: process.env.FIREBASE_DATABASE_URL,
            messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
            projectId: process.env.FIREBASE_PROJECT_ID,
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET
        }
    )
    : getAppClient()

const auth = getAuth(app)
const db = getDatabase(app)
const storage = getStorage(app)
const messaging = getMessaging(app)
const session = getSession(appClient)

export {
    app,
    appClient,
    auth,
    db,
    storage,
    messaging,
    session
}
