import type { AuthErrorProps } from '../../../theme/types';

// Shown when the IdP redirect came back with an error (or the code exchange failed).
export function AuthErrorPage({ error, onHome }: AuthErrorProps) {
  return (
    <div className="grid min-h-screen place-items-center bg-sunburst px-6">
      <div className="card max-w-md p-8 text-center">
        <div className="text-5xl">🍔💥</div>
        <h1 className="headline mt-4 text-2xl">Не удалось войти</h1>
        <p className="mt-2 break-words text-sm font-semibold text-burger-char/70">{error.message}</p>
        <button className="btn-burger mt-6 text-lg" onClick={onHome}>
          На главную
        </button>
      </div>
    </div>
  );
}
