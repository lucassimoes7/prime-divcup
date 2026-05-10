"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { useApp } from "../../../context/AppContext";
import { getTeamSchedule, getTeamStats } from "../../../lib/scheduler";

export default function TeamDetailPage() {
  const params = useParams<{ teamId: string }>();
  const { rounds, getTeamById, isLoaded } = useApp();
  const team = getTeamById(params.teamId);
  const schedule = useMemo(
    () => getTeamSchedule(rounds, params.teamId),
    [params.teamId, rounds],
  );
  const stats = useMemo(
    () => getTeamStats(rounds, params.teamId),
    [params.teamId, rounds],
  );

  if (isLoaded && !team) {
    return (
      <main className="app-shell">
        <section className="card panel">
          <p className="page-eyebrow">Nao encontrado</p>
          <h1 className="page-title">Time nao encontrado</h1>
          <p className="page-description">
            O time solicitado nao existe mais ou foi removido do campeonato.
          </p>
          <div className="button-row">
            <Link className="button" href="/times">
              Voltar para Times
            </Link>
          </div>
        </section>
      </main>
    );
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
        <p className="page-eyebrow">Confrontos por time</p>
        <h1 className="page-title">{team?.name ?? "Carregando time"}</h1>
        <p className="page-description">
          Veja em qual rodada o time joga, contra quem joga, a ordem do jogo na
          rodada e quando fica de folga.
        </p>
      </section>

      <section className="grid detail-stats">
        <article className="card stat-card">
          <p className="stat-label">Jogos</p>
          <p className="stat-value">{stats.games}</p>
        </article>
        <article className="card stat-card">
          <p className="stat-label">Folgas</p>
          <p className="stat-value">{stats.byes}</p>
        </article>
        <article className="card stat-card">
          <p className="stat-label">Maior sequencia de folgas</p>
          <p className="stat-value">{stats.maxByeSequence}</p>
        </article>
      </section>

      <section className="card panel">
        <div className="panel-heading">
          <div>
            <p className="page-eyebrow">Agenda</p>
            <h2 className="panel-title">Rodada por rodada</h2>
          </div>
          <span className="badge">{schedule.length} rodadas</span>
        </div>

        {schedule.length === 0 ? (
          <div className="empty-state">
            Nenhuma rodada gerada para este time ainda.
          </div>
        ) : (
          <ol className="opponent-sequence">
            {schedule.map((item) => {
              const opponent = item.opponentTeamId
                ? getTeamById(item.opponentTeamId)
                : undefined;

              return (
                <li
                  className={item.status === "bye" ? "schedule-bye" : undefined}
                  key={`${params.teamId}-${item.roundNumber}`}
                >
                  <span className="badge">Rodada {item.roundNumber}</span>
                  {item.status === "bye" ? (
                    <span>Folga</span>
                  ) : (
                    <span>
                      Joga contra{" "}
                      {opponent ? (
                        <Link className="text-link" href={`/times/${opponent.id}`}>
                          {opponent.name}
                        </Link>
                      ) : (
                        "adversario"
                      )}{" "}
                      no Jogo {item.slot}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        )}
      </section>
    </main>
  );
}
