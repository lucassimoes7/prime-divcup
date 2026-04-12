"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useApp } from "../../context/AppContext"

export default function TeamsPage() {
  const { teams, addTeam, removeTeam } = useApp();
  const [teamName, setTeamName] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const wasAdded = addTeam(teamName);

    if (wasAdded) {
      setTeamName("");
    }
  }

  return (
    <main className="app-shell">
      <header className="top-nav">
        <Link className="brand-link" href="/">
          <span className="brand-mark">FC</span>
          <span>Campeonato</span>
        </Link>
        <nav className="nav-actions" aria-label="Navegacao principal">
          <Link className="button secondary" href="/configuracao">
            Configurar
          </Link>
          <Link className="button secondary" href="/rodadas">
            Rodadas
          </Link>
        </nav>
      </header>

      <section className="page-header">
        <p className="page-eyebrow">Times</p>
        <h1 className="page-title">Gerenciar Times</h1>
        <p className="page-description">
          Cadastre as equipes participantes. Ao adicionar ou remover um time, as
          rodadas geradas sao limpas para manter a tabela correta.
        </p>
      </section>

      <section className="card panel">
        <h2 className="panel-title">Novo time</h2>
        <form className="input-row" onSubmit={handleSubmit}>
          <input
            className="input"
            value={teamName}
            onChange={(event) => setTeamName(event.target.value)}
            placeholder="Digite o nome do time e pressione Enter"
            aria-label="Nome do time"
          />
          <button className="button" type="submit">
            Adicionar
          </button>
        </form>

        {teams.length === 0 ? (
          <div className="empty-state">
            Nenhum time cadastrado ainda. Comece pelo primeiro participante.
          </div>
        ) : (
          <ul className="list">
            {teams.map((team) => (
              <li className="team-item" key={team.id}>
                <Link className="team-name" href={`/times/${team.id}`}>
                  {team.name}
                </Link>
                <button
                  className="button danger"
                  type="button"
                  onClick={() => removeTeam(team.id)}
                >
                  Remover
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
