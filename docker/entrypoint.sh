#!/bin/sh
# Regenerate the runtime configuration consumed by the SPA from environment
# variables. Runs on every container start (via /docker-entrypoint.d).
set -eu

CONFIG_FILE="/usr/share/nginx/html/config.js"

cat > "$CONFIG_FILE" <<EOF
window.__APP_CONFIG__ = {
  OIDC_AUTHORITY: "${OIDC_AUTHORITY:-}",
  OIDC_CLIENT_ID: "${OIDC_CLIENT_ID:-}",
  OIDC_REDIRECT_URI: "${OIDC_REDIRECT_URI:-}",
  OIDC_POST_LOGOUT_REDIRECT_URI: "${OIDC_POST_LOGOUT_REDIRECT_URI:-}",
  OIDC_SCOPE: "${OIDC_SCOPE:-openid profile}",
  OIDC_ROLES_CLAIM: "${OIDC_ROLES_CLAIM:-roles}"
};
EOF

echo "[entrypoint] runtime config written to ${CONFIG_FILE} (authority=${OIDC_AUTHORITY:-<unset>})"
