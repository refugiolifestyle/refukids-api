# =========================
# Base
# =========================
FROM node:20-bookworm-slim AS base
WORKDIR /app

# =========================
# Dependencies
# =========================
FROM base AS deps
RUN apt-get update && apt-get install -y --no-install-recommends \
  openssl \
  ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm ci

# =========================
# Builder
# =========================
FROM base AS builder
COPY . .
COPY --from=deps /app/node_modules ./node_modules

RUN npx prisma generate
RUN npm run build

# =========================
# Migrator (ONE-SHOT)
# =========================
FROM base AS migrator
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
  openssl \
  ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

ENV NODE_ENV=production

CMD ["sh", "-c", "npx prisma migrate deploy"]

# =========================
# Runtime (DISTROLESS)
# =========================
FROM gcr.io/distroless/nodejs20-debian12 AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

USER nonroot
EXPOSE 3000
CMD ["server.js"]
