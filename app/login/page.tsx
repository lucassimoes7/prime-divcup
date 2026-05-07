"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "../../context/AppContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useApp();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const wasAuthenticated = login(username, password);

    if (!wasAuthenticated) {
      setError("Login ou senha invalidos.");
      return;
    }

    router.replace("/");
  }

  return (
    <main className="login-shell">
      <section className="login-panel card">
        <div className="brand-lockup">
          <span className="brand-mark">PD</span>
          <div>
            <p className="page-eyebrow">Prime DivCup</p>
            <h1>Entrar no sorteio</h1>
          </div>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Login</span>
            <input
              className="input"
              autoComplete="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </label>

          <label className="field">
            <span>Senha</span>
            <input
              className="input"
              autoComplete="current-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>

          {error ? <div className="form-error">{error}</div> : null}

          <button className="button" type="submit">
            Entrar
          </button>
        </form>
      </section>
    </main>
  );
}
