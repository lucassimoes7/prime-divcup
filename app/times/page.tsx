"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useApp } from "../../context/AppContext";
import { getTeamStats } from "../../lib/scheduler";

export default function TeamsPage() {
  const { teams, rounds, addTeam, removeTeam, updateTeamName } = useApp();
  const [teamName, setTeamName] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = teamName.trim();

    if (!name) return;

    const alreadyExists = teams.some(
      (team) => team.name.toLowerCase() === name.toLowerCase(),
    );

    if (alreadyExists) {
      alert("Esse time ja foi adicionado");
      return;
    }

    const wasAdded = addTeam(name);

    if (wasAdded) {
      setTeamName("");
    }
  }

  return (
    <main className="app-shell">
      <header className="top-nav">
        <Link className="brand-link" href="/">
          <span className="brand-mark">PD</span>
          <span>Prime DivCup</span>
        </Link>
        <nav className="nav-actions" aria-label="Navegacao principal">
          <Link className="button secondary" href="/configuracao">
            Configurar
          </Link>
          <Link className="button secondary" href="/rodadas">
            Confrontos
          </Link>
        </nav>
      </header>

      <section className="page-header">
        <p className="page-eyebrow">Times</p>
        <h1 className="page-title">Times definidos</h1>
        <p className="page-description">
          Os nomes comecam como Time 1, Time 2 e assim por diante. Quando voce
          altera um nome aqui, ele aparece atualizado nos confrontos e na tela
          individual do time.
        </p>
      </section>

      <section className="card panel">
        <div className="panel-heading">
          <div>
            <p className="page-eyebrow">Cadastro rapido</p>
            <h2 className="panel-title">Adicionar participante</h2>
          </div>
          <span className="badge">{teams.length} times</span>
        </div>

        <form className="input-row" onSubmit={handleSubmit}>
          <input
            className="input"
            value={teamName}
            onChange={(event) => setTeamName(event.target.value)}
            placeholder={`Time ${teams.length + 1}`}
            aria-label="Nome do time"
          />
          <button className="button" type="submit">
            Adicionar
          </button>
        </form>
      </section>

      <section className="team-table" aria-label="Lista de times">
        {teams.map((team, index) => {
          const stats = getTeamStats(rounds, team.id);

          return (
            <article className="card team-row" key={team.id}>
              <div className="team-number">{index + 1}</div>
              <div className="team-editor">
                <label htmlFor={`team-${team.id}`}>Nome do time</label>
                <input
                  id={`team-${team.id}`}
                  className="input"
                  value={team.name}
                  onBlur={(event) => {
                    if (!event.target.value.trim()) {
                      updateTeamName(team.id, `Time ${index + 1}`);
                    }
                  }}
                  onChange={(event) => updateTeamName(team.id, event.target.value)}
                />
              </div>
              <div className="team-mini-stats">
                <span>{stats.games} jogos</span>
                <span>{stats.byes} folgas</span>
              </div>
              <div className="team-actions">
                <Link className="button secondary" href={`/times/${team.id}`}>
                  Ver agenda
                </Link>
                <button
                  className="button danger"
                  type="button"
                  disabled={teams.length <= 2}
                  onClick={() => removeTeam(team.id)}
                >
                  Remover
                </button>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}
