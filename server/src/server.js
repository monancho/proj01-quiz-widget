import { config } from 'dotenv';
import { createApp } from './app.js';
import { getEnv } from './config/env.js';

config();

const env = getEnv();
const app = createApp();

app.listen(env.port, () => {
  console.log(`API server listening on port ${env.port}`);
});

