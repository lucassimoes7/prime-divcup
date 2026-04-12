"use client";

import Link from "next/link";
import { useAppContext } from "../context/AppContext";

export default function HomePage() {
  const { championshipName, teams, rounds, isLoaded } = useAppContext();
  const status = rounds.length > 0 ? "Gerado" : "Nao gerado";

  return (
    <main className="app-shell">
      <section className="hero">
        <div className="hero-logo" aria-label="Logo do campeonato">
          FC
        </div>
        <div>
          <p className="page-eyebrow">Gerenciador de campeonatos</p>
          <h1>{championshipName}</h1>
          <p>
            Organize times, gere rodadas todos contra todos e acompanhe a
            sequencia de jogos de cada equipe em um painel simples e rapido.
          </p>
        </div>
      </section>

      <section className="grid stats-grid" aria-label="Resumo do campeonato">
        <article className="card stat-card">
          <p className="stat-label">Total de times</p>
          <p className="stat-value">{isLoaded ? teams.length : "-"}</p>
        </article>
        <article className="card stat-card">
          <p className="stat-label">Total de rodadas</p>
          <p className="stat-value">{isLoaded ? rounds.length : "-"}</p>
        </article>
        <article className="card stat-card">
          <p className="stat-label">Status</p>
          <p className="stat-value">{isLoaded ? status : "-"}</p>
        </article>
      </section>

      <section className="grid action-grid" aria-label="Acoes principais">
        <Link className="button" href="/times">
          Gerenciar Times
        </Link>
        <Link className="button" href="/configuracao">
          Configurar Campeonato
        </Link>
        <Link className="button" href="/rodadas">
          Ver Rodadas
        </Link>
      </section>
    </main>
  );
}
