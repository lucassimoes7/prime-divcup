"use client";

import Link from "next/link";
import { useAppContext } from "../../context/AppContext";

export default function ConfigurationPage() {
  const { teams, rounds, generateChampionship } = useAppContext();
  const canGenerate = teams.length >= 2;

  return (
    <main className="app-shell">
      <header className="top-nav">
        <Link className="brand-link" href="/">
          <span className="brand-mark">FC</span>
          <span>Campeonato</span>
        </Link>
        <nav className="nav-actions" aria-label="Navegacao principal">
          <Link className="button secondary" href="/times">
            Times
          </Link>
          <Link className="button secondary" href="/rodadas">
            Rodadas
          </Link>
        </nav>
      </header>

      <section className="page-header">
        <p className="page-eyebrow">Configuracao</p>
        <h1 className="page-title">Configurar Campeonato</h1>
        <p className="page-description">
          Gere automaticamente a tabela no formato todos contra todos. Se a
          quantidade de times for impar, o sistema cria uma folga por rodada.
        </p>
      </section>

      <section className="grid content-grid">
        <article className="card panel">
          <h2 className="panel-title">Geracao de rodadas</h2>
          <p className="page-description">
            Times cadastrados: <strong>{teams.length}</strong>
          </p>
          <p className="page-description">
            Rodadas geradas: <strong>{rounds.length}</strong>
          </p>
          <div style={{ height: 18 }} />
          <button
            className="button"
            type="button"
            disabled={!canGenerate}
            onClick={generateChampionship}
          >
            Gerar Campeonato
          </button>
          {!canGenerate ? (
            <p className="page-description">
              Cadastre pelo menos dois times para gerar o campeonato.
            </p>
          ) : null}
        </article>
      </section>
    </main>
  );
}
