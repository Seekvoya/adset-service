import * as dotenv from 'dotenv';

dotenv.config();
class EnvConfig {
  get app() {
    return {
      port: parseInt(process.env.APP_PORT) || 8888,
    };
  };

  get db() {
    return {
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
    }
  };

  get redis() {
    return {
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT) || 6379
    }
  }
}

export default new EnvConfig();