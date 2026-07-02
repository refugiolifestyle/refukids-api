declare namespace NodeJS {
    interface ProcessEnv {
        readonly DATABASE_URL: string;

        readonly KEYCLOAK_ISSUER: string;
        readonly KEYCLOAK_INTROSPECT_APP_KEY: string;
        readonly KEYCLOAK_INTROSPECT_SECRET_KEY: string;

        readonly NEXT_PUBLIC_API_URL: string;
        readonly NEXT_PUBLIC_BASE_URL: string;
        readonly NEXT_PUBLIC_BASE_SITE_URL: string;
        readonly NEXT_PUBLIC_BASE_REFUFILES_URL: string;
        readonly NEXT_PUBLIC_FIREBASE_PROJECT_ID: string;
        readonly NEXT_PUBLIC_FIREBASE_DATABASE_URL: string;
    }
}