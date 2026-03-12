declare namespace NodeJS {
    interface ProcessEnv {
        readonly DATABASE_URL: string;

        readonly KEYCLOAK_ISSUER: string;
        readonly KEYCLOAK_INTROSPECT_APP_KEY: string;
        readonly KEYCLOAK_INTROSPECT_SECRET_KEY: string;
    }
}