declare namespace NodeJS {
    type ProcessEnv = {
        APP_PORT: string;
        
        DB_NAME: string;
        DB_HOST: string;
        DB_PORT: string;
        DB_USER: string;
        DB_PASSWORD: string;

        REDIS_HOST: string;
        REDIS_PORT: string;
    }
}