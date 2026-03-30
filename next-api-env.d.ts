declare namespace NodeJS {
    interface ProcessEnv {
        readonly DATABASE_URL: string;

        readonly KEYCLOAK_ISSUER: string;
        readonly KEYCLOAK_INTROSPECT_APP_KEY: string;
        readonly KEYCLOAK_INTROSPECT_SECRET_KEY: string;
        readonly KEYCLOAK_ADMIN: string;
        readonly KEYCLOAK_ADMIN_PASSWORD: string;
        readonly KEYCLOAK_DB: string;
        readonly KEYCLOAK_DB_URL: string;
        readonly KEYCLOAK_DB_USERNAME: string;
        readonly KEYCLOAK_DB_PASSWORD: string;
    }
}