"use client";

import Link from "next/link";
import { useApp } from "../../context/AppContext";

export default function RoundsPage() {
  const { rounds, teams, warnings, totalMatches, generate, getTeamById } = useApp();

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
          <Link className="button secondary" href="/configuracao">
            Configurar
          </Link>
          <button className="button" type="button" onClick={generate}>
            Sortear novamente
          </button>
        </nav>
      </header>

      <section className="page-header">
        <p className="page-eyebrow">Confrontos</p>
        <h1 className="page-title">Tabela de rodadas</h1>
        <p className="page-description">
          Acompanhe cada rodada com a ordem dos jogos, adversarios e times em
          folga. Esta e a tela principal para exibir o sorteio ao vivo.
        </p>
      </section>

      <section className="grid stats-grid">
        <article className="card stat-card">
          <p className="stat-label">Rodadas</p>
          <p className="stat-value">{rounds.length}</p>
        </article>
        <article className="card stat-card">
          <p className="stat-label">Jogos</p>
          <p className="stat-value">{totalMatches}</p>
        </article>
        <article className="card stat-card">
          <p className="stat-label">Times</p>
          <p className="stat-value">{teams.length}</p>
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

      {rounds.length === 0 ? (
        <section className="empty-state">
          Nenhuma rodada gerada. Use Sortear novamente ou acesse Configurar
          para criar a tabela.
        </section>
      ) : (
        <section className="round-list">
          {rounds.map((round) => (
            <article className="card round-item" key={round.id}>
              <div className="round-header">
                <div>
                  <p className="page-eyebrow">Rodada</p>
                  <h2 className="round-title">{round.number}</h2>
                </div>
                <span className="badge">
                  {round.matches.length} jogo
                  {round.matches.length === 1 ? "" : "s"}
                </span>
              </div>

              <div className="match-grid">
                {round.matches.map((match) => {
                  const homeTeam = getTeamById(match.homeTeamId);
                  const awayTeam = getTeamById(match.awayTeamId);

                  return (
                    <div className="match-item" key={match.id}>
                      <span className="match-order">Jogo {match.slot}</span>
                      <Link className="match-team" href={`/times/${match.homeTeamId}`}>
                        {homeTeam?.name ?? "Time removido"}
                      </Link>
                      <span className="versus">VS</span>
                      <Link className="match-team" href={`/times/${match.awayTeamId}`}>
                        {awayTeam?.name ?? "Time removido"}
                      </Link>
                    </div>
                  );
                })}
              </div>

              {round.byeTeamIds.length > 0 ? (
                <div className="bye-block">
                  <span className="muted">Folgam nesta rodada</span>
                  <div className="bye-list">
                    {round.byeTeamIds.map((teamId) => (
                      <Link className="bye-chip" href={`/times/${teamId}`} key={teamId}>
                        {getTeamById(teamId)?.name ?? "Time removido"}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
