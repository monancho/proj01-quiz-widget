FROM node:24-slim

ENV NODE_ENV=production
ENV PORT=3000
ENV DATABASE_PATH=/data/proj01-quiz.sqlite

WORKDIR /app/server

COPY server/package*.json ./
RUN npm ci --omit=dev

COPY server ./
COPY migrations /app/migrations

EXPOSE 3000

CMD ["sh", "-c", "npm run db:migrate && npm run start"]
