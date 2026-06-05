import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider, type AuthProviderProps } from 'react-oidc-context';
import { buildOidcSettings } from './oidc';
import { isConfigured } from './config';
import App from './App';
import { Splash } from './components/Splash';
import { MisconfiguredPage } from './pages/MisconfiguredPage';
import { BootstrapError } from './pages/BootstrapError';
import './styles/index.css';

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

  if (!isConfigured) return <MisconfiguredPage />;
  if (error) return <BootstrapError error={error} />;
  if (!settings) return <Splash label="Подключаемся к Evolution Managed Identities…" />;

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
