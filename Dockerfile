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
# Stage 2 — serve with nginx (unprivileged, non-root, port 8080)
#
# Cloud.ru Evolution Container Apps runs containers as UID 1000 in the default
# (non-privileged) mode, so the runtime image must not need root and must not
# bind a privileged port. See:
# https://cloud.ru/docs/container-apps-evolution/ug/topics/concepts__runtime
# ─────────────────────────────────────────────────────────────────────────────
FROM nginxinc/nginx-unprivileged:alpine AS runtime

USER root

# SPA-aware nginx config (history fallback + caching rules).
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Empty proxy snippet so the `include` in nginx.conf is valid even when the
# optional reverse proxy is disabled (the default).
RUN mkdir -p /etc/nginx/snippets && : > /etc/nginx/snippets/oidc-proxy.conf

# Built static assets.
COPY --from=build /app/dist /usr/share/nginx/html

# nginx-unprivileged runs every executable in /docker-entrypoint.d/*.sh before
# starting nginx. 35 renders the optional reverse proxy; 40 regenerates
# /usr/share/nginx/html/config.js from environment variables — both on every start.
COPY docker/render-proxy.sh /docker-entrypoint.d/35-render-proxy.sh
COPY docker/entrypoint.sh /docker-entrypoint.d/40-render-config.sh
RUN chmod +x /docker-entrypoint.d/35-render-proxy.sh /docker-entrypoint.d/40-render-config.sh

# Everything the entrypoint scripts and nginx write at runtime must be owned by
# the runtime user (UID 1000), which is what Container Apps enforces.
RUN addgroup -g 1000 appuser 2>/dev/null || true; \
    adduser -u 1000 -G appuser -s /bin/sh -D appuser 2>/dev/null || true; \
    chown -R 1000:0 \
        /usr/share/nginx/html \
        /etc/nginx/conf.d \
        /etc/nginx/snippets \
        /var/cache/nginx \
        /tmp; \
    chmod -R g+w /usr/share/nginx/html /etc/nginx/conf.d /etc/nginx/snippets /var/cache/nginx

USER 1000

EXPOSE 8080
# CMD/ENTRYPOINT inherited from the nginx-unprivileged base image.
