"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { useApp } from "../../../context/AppContext";
import { getTeamSchedule } from "../../../lib/scheduler";

export default function TeamDetailPage() {
  const params = useParams<{ teamId: string }>();
  const { rounds, getTeamById, isLoaded } = useApp();
  const team = getTeamById(params.teamId);

  const schedule = useMemo(
  () => getTeamSchedule(rounds, params.teamId),
  [params.teamId, rounds]
);

  const totalGames = schedule.filter((item) => !item.isBye).length;

  if (isLoaded && !team) {
    return (
      <main className="app-shell">
        <section className="card panel">
          <p className="page-eyebrow">Nao encontrado</p>
          <h1 className="page-title">Time nao encontrado</h1>
          <p className="page-description">
            O time solicitado nao existe mais ou foi removido do campeonato.
          </p>
          <div style={{ height: 18 }} />
          <Link className="button" href="/times">
            Voltar para Times
          </Link>
        </section>
      </main>
    );
  }

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
        <p className="page-eyebrow">Detalhe do time</p>
        <h1 className="page-title">{team?.name ?? "Carregando time"}</h1>
        <p className="page-description">
          Veja a quantidade de jogos e a sequencia de adversarios deste time.
        </p>
      </section>

      <section className="grid detail-stats">
        <article className="card stat-card">
          <p className="stat-label">Quantidade de jogos</p>
          <p className="stat-value">{totalGames}</p>
        </article>
        <article className="card stat-card">
          <p className="stat-label">Rodadas na sequencia</p>
          <p className="stat-value">{schedule.length}</p>
        </article>
      </section>

      <section className="card panel">
        <h2 className="panel-title">Sequencia de adversarios</h2>
        {schedule.length === 0 ? (
          <div className="empty-state">
            Nenhuma rodada gerada para este time ainda.
          </div>
        ) : (
          <ol className="opponent-sequence">
            {schedule.map((item) => (
              <li key={`${params.teamId}-${item.roundNumber}`}>
                <span className="badge">Rodada {item.roundNumber}</span>
                <span>
                  {item.isBye
                    ? "Folga"
                    : `Contra ${item.opponent?.name ?? "adversario"}`}
                </span>
              </li>
            ))}
          </ol>
        )}
      </section>
    </main>
  );
}
