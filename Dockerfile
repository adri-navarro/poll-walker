FROM node:24-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY index.html vite.config.js ./
COPY src ./src
RUN npm run build

FROM node:24-alpine

WORKDIR /app

ENV NODE_ENV=production \
    PORT=3001 \
    HOST=0.0.0.0 \
    DB_PATH=/app/data/polls.db

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY server ./server
COPY --from=builder /app/dist ./dist

RUN mkdir -p /app/data && chown -R node:node /app

USER node

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:${PORT}/api/health || exit 1

CMD ["node", "server/index.js"]
