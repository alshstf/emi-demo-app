#!/bin/sh
# Regenerate the runtime configuration consumed by the SPA from environment
# variables. Runs on every container start (via /docker-entrypoint.d).
set -eu

CONFIG_FILE="/usr/share/nginx/html/config.js"

cat > "$CONFIG_FILE" <<EOF
window.__APP_CONFIG__ = {
  OIDC_AUTHORITY: "${OIDC_AUTHORITY:-}",
  OIDC_CLIENT_ID: "${OIDC_CLIENT_ID:-}",
  OIDC_CLIENT_SECRET: "${OIDC_CLIENT_SECRET:-}",
  OIDC_REDIRECT_URI: "${OIDC_REDIRECT_URI:-}",
  OIDC_POST_LOGOUT_REDIRECT_URI: "${OIDC_POST_LOGOUT_REDIRECT_URI:-}",
  OIDC_SCOPE: "${OIDC_SCOPE:-openid profile}",
  OIDC_ROLES_CLAIM: "${OIDC_ROLES_CLAIM:-roles}",
  OIDC_ROLES_CLAIM_PATH: "${OIDC_ROLES_CLAIM_PATH:-resource_access.%%OIDC_CLIENT_ID%%.roles}",
  OIDC_PROXY: "${OIDC_PROXY:-false}",
  OIDC_LOAD_USERINFO: "${OIDC_LOAD_USERINFO:-false}",
  APP_THEME: "${APP_THEME:-auto}",
  APP_THEME_HOSTS: "${APP_THEME_HOSTS:-}",
  APP_THEME_SWITCH: "${APP_THEME_SWITCH:-false}",
  GIS_NAME: "${GIS_NAME:-}",
  GIS_FULL_NAME: "${GIS_FULL_NAME:-}",
  GIS_OPERATOR: "${GIS_OPERATOR:-}"
};
EOF

echo "[entrypoint] runtime config written to ${CONFIG_FILE} (authority=${OIDC_AUTHORITY:-<unset>}, proxy=${OIDC_PROXY:-false}, theme=${APP_THEME:-auto})"
