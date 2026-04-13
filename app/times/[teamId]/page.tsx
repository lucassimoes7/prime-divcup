"use client"

import { useParams } from "next/navigation"
import { useMemo } from "react"
import Link from "next/link"
import { useApp } from "../../../context/AppContext"
import { getTeamSchedule } from "../../../lib/scheduler"

export default function TeamDetailPage() {
  const params = useParams<{ teamId: string }>()
  const { rounds, teams } = useApp()

  const team = teams.find((t) => t.id === params.teamId)

  const schedule = useMemo(() => {
    if (!team) return []
    return getTeamSchedule(rounds, team.name)
  }, [team, rounds])

  const totalGames = schedule.length

  if (!team) {
    return (
      <main className="app-shell">
        <section className="card panel">
          <p className="page-eyebrow">Não encontrado</p>
          <h1 className="page-title">Time não encontrado</h1>
          <p className="page-description">
            O time solicitado não existe ou foi removido.
          </p>
          <div style={{ height: 18 }} />
          <Link className="button" href="/times">
            Voltar para Times
          </Link>
        </section>
      </main>
    )
  }

  return (
    <main className="app-shell">
      {/* HEADER */}
      <header className="top-nav">
        <Link className="brand-link" href="/">
          <span className="brand-mark">⚽</span>
          <span>Prime DivCup</span>
        </Link>

        <nav className="nav-actions">
          <Link className="button secondary" href="/times">
            Times
          </Link>
          <Link className="button secondary" href="/rodadas">
            Rodadas
          </Link>
        </nav>
      </header>

      {/* HEADER PAGE */}
      <section className="page-header">
        <p className="page-eyebrow">Detalhe do time</p>
        <h1 className="page-title">{team.name}</h1>
        <p className="page-description">
          Veja os jogos deste time no campeonato.
        </p>
      </section>

      {/* STATS */}
      <section className="grid detail-stats">
        <article className="card stat-card">
          <p className="stat-label">Total de jogos</p>
          <p className="stat-value">{totalGames}</p>
        </article>

        <article className="card stat-card">
          <p className="stat-label">Rodadas jogadas</p>
          <p className="stat-value">{schedule.length}</p>
        </article>
      </section>

      {/* LISTA */}
      <section className="card panel">
        <h2 className="panel-title">Jogos</h2>

        {schedule.length === 0 ? (
          <div className="empty-state">
            Nenhum jogo gerado ainda.
          </div>
        ) : (
          <ol className="opponent-sequence">
            {schedule.map((item, index) => (
              <li key={index}>
                <span className="badge">Rodada {item.rodada}</span>
                <span>Contra {item.adversario}</span>
              </li>
            ))}
          </ol>
        )}
      </section>
    </main>
  )
}
