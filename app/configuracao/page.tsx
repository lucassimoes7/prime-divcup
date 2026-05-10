"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "../../context/AppContext";
import { TournamentConfig, normalizeConfig } from "../../lib/scheduler";

export default function ConfiguracaoPage() {
  const router = useRouter();
  const { config, saveConfig, generateWithConfig } = useApp();
  const [draft, setDraft] = useState<TournamentConfig>(config);

  useEffect(() => {
    setDraft(config);
  }, [config]);

  function updateDraft<K extends keyof TournamentConfig>(
    key: K,
    value: TournamentConfig[K],
  ) {
    setDraft((currentDraft) => ({
      ...currentDraft,
      [key]: value,
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    saveConfig(normalizeConfig(draft));
    router.push("/");
  }

  function saveAndDraw() {
    const normalized = normalizeConfig(draft);
    generateWithConfig(normalized);
    router.push("/rodadas");
  }

  return (
    <main className="app-shell">
      <header className="top-nav">
        <Link className="brand-link" href="/">
          <img className="brand-logo" src="/prime-divcup-logo.png" alt="Prime DivCup" />
          <span>Prime DivCup</span>
        </Link>
        <nav className="nav-actions" aria-label="Navegacao principal">
          <Link className="button secondary" href="/times">
            Times
          </Link>
          <Link className="button secondary" href="/rodadas">
            Confrontos
          </Link>
        </nav>
      </header>

      <section className="page-header">
        <p className="page-eyebrow">Configuracao</p>
        <h1 className="page-title">Regras do torneio</h1>
        <p className="page-description">
          Ajuste quantidade de times, jogos por time, jogos por rodada, folgas
          consecutivas e repeticao de confronto antes de sortear.
        </p>
      </section>

      <form className="config-layout" onSubmit={handleSubmit}>
        <section className="card panel">
          <h2 className="panel-title">Participantes e confrontos</h2>
          <div className="form-grid">
            <label className="field">
              <span>Total de times</span>
              <input
                className="input"
                min={2}
                max={64}
                type="number"
                value={draft.teamCount}
                onChange={(event) => updateDraft("teamCount", Number(event.target.value))}
              />
            </label>

            <label className="field">
              <span>Jogos por time</span>
              <input
                className="input"
                min={1}
                max={63}
                type="number"
                value={draft.gamesPerTeam}
                onChange={(event) =>
                  updateDraft("gamesPerTeam", Number(event.target.value))
                }
              />
            </label>

            <label className="field">
              <span>Jogos por rodada</span>
              <input
                className="input"
                min={1}
                max={32}
                type="number"
                value={draft.matchesPerRound}
                onChange={(event) =>
                  updateDraft("matchesPerRound", Number(event.target.value))
                }
              />
            </label>

            <label className="field">
              <span>Maximo de folgas seguidas</span>
              <input
                className="input"
                min={1}
                max={32}
                type="number"
                value={draft.maxConsecutiveByes}
                onChange={(event) =>
                  updateDraft("maxConsecutiveByes", Number(event.target.value))
                }
              />
            </label>
          </div>

          <label className="toggle-row">
            <input
              type="checkbox"
              checked={draft.allowRematches}
              onChange={(event) =>
                updateDraft("allowRematches", event.target.checked)
              }
            />
            <span>Permitir repeticao de confronto</span>
          </label>
        </section>

        <section className="card panel">
          <h2 className="panel-title">Previsao do sorteio</h2>

          <div className="rule-preview">
            <div>
              <span className="muted">Total previsto</span>
              <strong>
                {Math.floor((draft.teamCount * draft.gamesPerTeam) / 2)} jogos
              </strong>
            </div>
            <div>
              <span className="muted">Capacidade por rodada</span>
              <strong>
                Ate {Math.min(draft.matchesPerRound, Math.floor(draft.teamCount / 2))}
              </strong>
            </div>
            <div>
              <span className="muted">Ordem exibida</span>
              <strong>Jogo 1, Jogo 2...</strong>
            </div>
          </div>
        </section>

        <section className="config-actions">
          <button className="button secondary" type="submit">
            Salvar
          </button>
          <button className="button" type="button" onClick={saveAndDraw}>
            Salvar e sortear
          </button>
        </section>
      </form>
    </main>
  );
}
