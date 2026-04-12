"use client"

import Link from "next/link"

export default function Home() {
  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <h1 style={{ fontSize: 42 }}>Prime DivCup Sorteio</h1>
      <p style={{ marginTop: 10 }}>
        Sistema de geração de campeonatos completo
      </p>

      <div style={{ marginTop: 40, display: "flex", gap: 20, justifyContent: "center" }}>
        <Link href="/times">
          <button>Gerenciar Times</button>
        </Link>

        <Link href="/configuracao">
          <button>Configurar Campeonato</button>
        </Link>

        <Link href="/rodadas">
          <button>Ver Rodadas</button>
        </Link>
      </div>
    </div>
  )
}
