#!/bin/sh
# Generate the optional same-origin reverse-proxy for the IdP back-channel.
# When OIDC_PROXY is truthy, the browser only ever talks to this app's origin
# (/oidc/...), so the OIDC token/jwks/userinfo calls never trigger CORS.
# Runs before nginx starts (via /docker-entrypoint.d).
set -eu

SNIPPET="/etc/nginx/snippets/oidc-proxy.conf"
mkdir -p /etc/nginx/snippets
: > "$SNIPPET"

is_true() {
  case "$(printf '%s' "${1:-}" | tr '[:upper:]' '[:lower:]')" in
    1 | true | yes | on) return 0 ;;
    *) return 1 ;;
  esac
}

if is_true "${OIDC_PROXY:-}" && [ -n "${OIDC_AUTHORITY:-}" ]; then
  # Derive scheme://host[:port] (origin) and host[:port] / host from OIDC_AUTHORITY.
  SCHEME="${OIDC_AUTHORITY%%://*}"
  REST="${OIDC_AUTHORITY#*://}"
  HOSTPORT="${REST%%/*}"
  HOST="${HOSTPORT%%:*}"
  IDP_ORIGIN="${SCHEME}://${HOSTPORT}"

  cat > "$SNIPPET" <<EOF
# Same-origin reverse proxy to the IdP back-channel (token / userinfo / jwks).
# Generated from OIDC_AUTHORITY=${OIDC_AUTHORITY}
location ^~ /oidc/ {
    proxy_pass ${IDP_ORIGIN}/;
    proxy_http_version 1.1;
    proxy_set_header Host ${HOSTPORT};
    proxy_set_header X-Forwarded-For \$remote_addr;
    proxy_set_header X-Forwarded-Proto \$scheme;
    # Disable upstream compression (keeps responses simple to relay).
    proxy_set_header Accept-Encoding "";
    # TLS upstreams: send SNI so the IdP serves the right certificate.
    proxy_ssl_server_name on;
    proxy_ssl_name ${HOST};
}
EOF
  echo "[proxy] OIDC reverse proxy ENABLED: /oidc/ -> ${IDP_ORIGIN}/"
else
  echo "[proxy] OIDC reverse proxy disabled"
fi
