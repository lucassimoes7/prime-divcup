"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useApp } from "../../context/AppContext";

export default function TeamsPage() {
  const { teams, addTeam, removeTeam } = useApp();
  const [teamName, setTeamName] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const name = teamName.trim();

    // 🔒 validação
    if (!name) return;

    const alreadyExists = teams.some(
      (t) => t.name.toLowerCase() === name.toLowerCase()
    );

    if (alreadyExists) {
      alert("Esse time já foi adicionado");
      return;
    }

    addTeam(name);
    setTeamName("");
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
          <Link className="button secondary" href="/configuracao">
            Configurar
          </Link>
          <Link className="button secondary" href="/rodadas">
            Rodadas
          </Link>
        </nav>
      </header>

      {/* HEADER PAGE */}
      <section className="page-header">
        <p className="page-eyebrow">Times</p>
        <h1 className="page-title">Gerenciar Times</h1>
        <p className="page-description">
          Cadastre as equipes participantes do campeonato.
        </p>
      </section>

      {/* FORM */}
      <section className="card panel">
        <h2 className="panel-title">Novo time</h2>

        <form className="input-row" onSubmit={handleSubmit}>
          <input
            className="input"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="Digite o nome do time e pressione Enter"
          />

          <button className="button" type="submit">
            Adicionar
          </button>
        </form>

        {/* LISTA */}
        {teams.length === 0 ? (
          <div className="empty-state">
            Nenhum time cadastrado ainda.
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
