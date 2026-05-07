"use client";

import Link from "next/link";
import { useApp } from "../context/AppContext";

export default function Home() {
  const { teams, config, rounds, totalMatches, warnings, generatedAt, generate, logout } =
    useApp();
  const plannedMatches = Math.floor((teams.length * config.gamesPerTeam) / 2);
  const latestRounds = rounds.slice(0, 4);

  return (
    <main className="app-shell">
      <header className="top-nav">
        <Link className="brand-link" href="/">
          <span className="brand-mark">PD</span>
          <span>Prime DivCup</span>
        </Link>
        <nav className="nav-actions" aria-label="Navegacao principal">
          <Link className="button secondary" href="/times">
            Times
          </Link>
          <Link className="button secondary" href="/configuracao">
            Configurar
          </Link>
          <Link className="button secondary" href="/rodadas">
            Confrontos
          </Link>
          <button className="button secondary" type="button" onClick={logout}>
            Sair
          </button>
        </nav>
      </header>

      <section className="dashboard-hero">
        <div className="hero-copy">
          <p className="page-eyebrow">Dashboard do sorteio</p>
          <h1>Prime DivCup Sorteio</h1>
          <p>
            Defina participantes, gere confrontos ao vivo e acompanhe jogos,
            ordem das partidas e folgas em uma tabela pronta para validar o
            torneio.
          </p>
        </div>
        <div className="live-board">
          <span className="live-dot" />
          <span>{rounds.length > 0 ? "Sorteio gerado" : "Aguardando sorteio"}</span>
          <strong>{totalMatches} jogos</strong>
        </div>
      </section>

      <section className="grid stats-grid" aria-label="Resumo do campeonato">
        <article className="card stat-card">
          <p className="stat-label">Times definidos</p>
          <p className="stat-value">{teams.length}</p>
        </article>
        <article className="card stat-card">
          <p className="stat-label">Jogos sorteados</p>
          <p className="stat-value">
            {totalMatches}
            <span className="stat-suffix">/{plannedMatches}</span>
          </p>
        </article>
        <article className="card stat-card">
          <p className="stat-label">Rodadas geradas</p>
          <p className="stat-value">{rounds.length}</p>
        </article>
      </section>

      <section className="grid action-grid">
        <Link className="button action-button" href="/configuracao">
          Ajustar regras
        </Link>
        <Link className="button action-button secondary" href="/times">
          Editar times
        </Link>
        <button className="button action-button" type="button" onClick={generate}>
          Sortear agora
        </button>
      </section>

      <section className="grid dashboard-grid">
        <article className="card panel">
          <div className="panel-heading">
            <div>
              <p className="page-eyebrow">Regras ativas</p>
              <h2 className="panel-title">Configuracao do torneio</h2>
            </div>
            <Link className="text-link" href="/configuracao">
              Alterar
            </Link>
          </div>

          <dl className="info-list">
            <div>
              <dt>Jogos por time</dt>
              <dd>{config.gamesPerTeam}</dd>
            </div>
            <div>
              <dt>Jogos por rodada</dt>
              <dd>{config.matchesPerRound}</dd>
            </div>
            <div>
              <dt>Folgas consecutivas</dt>
              <dd>Maximo {config.maxConsecutiveByes}</dd>
            </div>
            <div>
              <dt>Repetir confronto</dt>
              <dd>{config.allowRematches ? "Permitido" : "Bloqueado"}</dd>
            </div>
          </dl>
        </article>

        <article className="card panel">
          <div className="panel-heading">
            <div>
              <p className="page-eyebrow">Ao vivo</p>
              <h2 className="panel-title">Primeiras rodadas</h2>
            </div>
            <Link className="text-link" href="/rodadas">
              Ver tudo
            </Link>
          </div>

          {latestRounds.length === 0 ? (
            <div className="empty-state">
              Nenhum confronto ainda. Clique em Sortear agora para gerar a
              primeira tabela.
            </div>
          ) : (
            <div className="compact-rounds">
              {latestRounds.map((round) => (
                <div className="compact-round" key={round.id}>
                  <strong>Rodada {round.number}</strong>
                  <span>
                    {round.matches.length} jogo
                    {round.matches.length === 1 ? "" : "s"}
                  </span>
                </div>
              ))}
            </div>
          )}

          {generatedAt ? (
            <p className="support-text">Ultimo sorteio: {formatDate(generatedAt)}</p>
          ) : null}
        </article>
      </section>

      {warnings.length > 0 ? (
        <section className="notice-list" aria-label="Avisos do sorteio">
          {warnings.map((warning) => (
            <div className="notice" key={warning}>
              {warning}
            </div>
          ))}
        </section>
      ) : null}
    </main>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}
