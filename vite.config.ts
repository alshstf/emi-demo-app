import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const TRUE = new Set(['1', 'true', 'yes', 'on']);

/** Extract scheme://host[:port] from a URL string without relying on the URL global. */
function originOf(url: string | undefined): string | undefined {
  const match = /^https?:\/\/[^/]+/i.exec(url ?? '');
  return match ? match[0] : undefined;
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const proxyOn = TRUE.has((env.VITE_OIDC_PROXY || '').toLowerCase());
  const target = originOf(env.VITE_OIDC_AUTHORITY);

  // Dev mirror of the nginx reverse proxy: /oidc/<X> -> <idp-origin>/<X>.
  // Lets `npm run dev` exercise proxy mode without a container.
  const proxy =
    proxyOn && target
      ? {
          '/oidc': {
            target,
            changeOrigin: true,
            secure: false,
            rewrite: (path: string) => path.replace(/^\/oidc/, ''),
          },
        }
      : undefined;

  return {
    plugins: [react()],
    server: { port: 5173, host: true, proxy },
    preview: { port: 5173, host: true },
  };
});
