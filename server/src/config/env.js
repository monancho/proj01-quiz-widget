export function getEnv() {
  const aiServerTimeoutSeconds = Number.parseInt(
    process.env.AI_SERVER_TIMEOUT_SECONDS || '30',
    10
  );

  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: Number.parseInt(process.env.PORT || '3000', 10),
    databasePath: process.env.DATABASE_PATH || '../data/proj01-quiz.sqlite',
    corsAllowedOrigins: process.env.CORS_ALLOWED_ORIGINS || 'http://localhost:5173',
    tistoryHomeUrl: process.env.TISTORY_HOME_URL || 'https://your-blog.tistory.com',
    adminApiToken: process.env.ADMIN_API_TOKEN || '',
    aiServerBaseUrl: process.env.AI_SERVER_BASE_URL || 'http://localhost:8000',
    aiServerApiKey: process.env.AI_SERVER_API_KEY || '',
    aiServerTimeoutSeconds: Number.isInteger(aiServerTimeoutSeconds) && aiServerTimeoutSeconds > 0
      ? aiServerTimeoutSeconds
      : 30
  };
}

