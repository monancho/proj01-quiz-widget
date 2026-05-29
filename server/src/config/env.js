export function getEnv() {
  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: Number.parseInt(process.env.PORT || '3000', 10),
    databasePath: process.env.DATABASE_PATH || '../data/proj01-quiz.sqlite',
    corsAllowedOrigins: process.env.CORS_ALLOWED_ORIGINS || 'http://localhost:5173',
    tistoryHomeUrl: process.env.TISTORY_HOME_URL || 'https://your-blog.tistory.com'
  };
}

