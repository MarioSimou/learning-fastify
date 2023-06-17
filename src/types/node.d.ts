declare namespace NodeJS {
    interface ProcessEnv {
        JWT_SECRET: string
        NODE_ENV: 'development' | 'production'
        PLUGINS_DIR: string
        ROUTES_DIR: string
    }

    interface Process {
        env: ProcessEnv
    }
}
