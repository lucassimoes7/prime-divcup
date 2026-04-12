"use client";

import Link from "next/link";
import { useAppContext } from "../../context/AppContext";

export default function RoundsPage() {
  const { rounds } = useAppContext();

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
          <Link className="button secondary" href="/configuracao">
            Configurar
          </Link>
        </nav>
      </header>

      <section className="page-header">
        <p className="page-eyebrow">Rodadas</p>
        <h1 className="page-title">Tabela de Jogos</h1>
        <p className="page-description">
          Consulte todos os confrontos gerados e os times que folgam em cada
          rodada.
        </p>
      </section>

      {rounds.length === 0 ? (
        <section className="empty-state">
          Nenhuma rodada gerada. Va ate Configurar Campeonato para criar a
          tabela.
        </section>
      ) : (
        <section className="round-list">
          {rounds.map((round) => (
            <article className="round-item" key={round.id}>
              <div className="round-header">
                <h2 className="round-title">Rodada {round.number}</h2>
                <span className="badge">
                  {round.matches.length} jogo
                  {round.matches.length === 1 ? "" : "s"}
                </span>
              </div>

              <div className="match-grid">
                {round.matches.map((match) => (
                  <div
                    className="match-item"
                    key={`${round.id}-${match.home.id}-${match.away.id}`}
                  >
                    <strong>{match.home.name}</strong>
                    <span className="versus">VS</span>
                    <strong>{match.away.name}</strong>
                  </div>
                ))}
              </div>

              {round.byes.length > 0 ? (
                <div className="bye-block">
                  {round.byes.map((team) => (
                    <div className="bye-item" key={`${round.id}-${team.id}`}>
                      <span className="muted">Folga</span>
                      <strong>{team.name}</strong>
                    </div>
                  ))}
                </div>
              ) : null}
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
