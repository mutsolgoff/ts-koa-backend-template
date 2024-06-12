declare module "bun" {
  interface Env {
    DB_HOST: string;
    DB_USER: string;
    DB_PASSWORD: string;
    DB_NAME: string;
    DB_PORT: number;
    JWT_ACCESS_SECRET_KEY: string;
    JWT_REFRESH_SECRET_KEY: string;
  }
}

export {};
