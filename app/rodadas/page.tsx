"use client";

import Link from "next/link";
import { useApp } from "../../context/AppContext"
export default function RoundsPage() {
const { rounds } = useApp()
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
          {rounds.map((round, index) => (
            <article className="round-item" key={index}>
              <div className="round-header">
                <h2 className="round-title">Rodada {index + 1}</h2>
                <span className="badge">
                  {round.length} jogo
                  {round.length === 1 ? "" : "s"}
                </span>
              </div>

              <div className="match-grid">
                {round.map((match: any) => (
                  <div
                    className="match-item"
                    key={`${index}-${match.casa}-${match.fora}`}
                  >
                    <strong>{match.casa}</strong>
                    <span>VS</span>
                    <strong>{match.fora}</strong>
                  </div>
                ))}
              </div>

              {round.byes.length > 0 ? (
                <div className="bye-block">
                  {round.byes.map((team: any) => (
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
