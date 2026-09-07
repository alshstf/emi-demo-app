/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OIDC_AUTHORITY?: string;
  readonly VITE_OIDC_CLIENT_ID?: string;
  readonly VITE_OIDC_CLIENT_SECRET?: string;
  readonly VITE_OIDC_REDIRECT_URI?: string;
  readonly VITE_OIDC_POST_LOGOUT_REDIRECT_URI?: string;
  readonly VITE_OIDC_SCOPE?: string;
  readonly VITE_OIDC_ROLES_CLAIM?: string;
  readonly VITE_OIDC_ROLES_CLAIM_PATH?: string;
  readonly VITE_OIDC_PROXY?: string;
  readonly VITE_OIDC_LOAD_USERINFO?: string;
  readonly VITE_APP_THEME?: string;
  readonly VITE_APP_THEME_HOSTS?: string;
  readonly VITE_APP_THEME_SWITCH?: string;
  readonly VITE_GIS_NAME?: string;
  readonly VITE_GIS_FULL_NAME?: string;
  readonly VITE_GIS_OPERATOR?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
