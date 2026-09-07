import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider, type AuthProviderProps } from 'react-oidc-context';
import { buildOidcSettings } from './oidc';
import { isConfigured } from './config';
import { theme, applyThemeMeta } from './theme';
import App from './App';
import './styles/index.css';

// The skin is decided once, synchronously, before the first render — so even
// the splash and the error screens come out in the right theme.
applyThemeMeta();

function Root() {
  const [settings, setSettings] = useState<AuthProviderProps | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!isConfigured) return;
    let active = true;
    buildOidcSettings()
      .then((s) => active && setSettings(s))
      .catch((e) => active && setError(e instanceof Error ? e : new Error(String(e))));
    return () => {
      active = false;
    };
  }, []);

  if (!isConfigured) return <theme.Misconfigured />;
  if (error) return <theme.BootstrapError error={error} />;
  if (!settings) return <theme.Splash label={theme.splash.boot} />;

  return (
    <AuthProvider {...settings}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
);
