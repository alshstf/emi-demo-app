# ─────────────────────────────────────────────────────────────────────────────
# Stage 1 — build the SPA
# ─────────────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies first (better layer caching).
COPY package.json package-lock.json* ./
RUN npm ci

# Build the static assets.
COPY . .
RUN npm run build

# ─────────────────────────────────────────────────────────────────────────────
# Stage 2 — serve with nginx
# ─────────────────────────────────────────────────────────────────────────────
FROM nginx:alpine AS runtime

# SPA-aware nginx config (history fallback + caching rules).
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Empty proxy snippet so the `include` in nginx.conf is valid even when the
# optional reverse proxy is disabled (the default).
RUN mkdir -p /etc/nginx/snippets && : > /etc/nginx/snippets/oidc-proxy.conf

# Built static assets.
COPY --from=build /app/dist /usr/share/nginx/html

# nginx:alpine runs every executable in /docker-entrypoint.d/*.sh before
# starting nginx. 35 renders the optional reverse proxy; 40 regenerates
# /usr/share/nginx/html/config.js from environment variables — both on every start.
COPY docker/render-proxy.sh /docker-entrypoint.d/35-render-proxy.sh
COPY docker/entrypoint.sh /docker-entrypoint.d/40-render-config.sh
RUN chmod +x /docker-entrypoint.d/35-render-proxy.sh /docker-entrypoint.d/40-render-config.sh

EXPOSE 80
# CMD/ENTRYPOINT inherited from the nginx base image.
