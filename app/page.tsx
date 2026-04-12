"use client"

import Link from "next/link"

export default function Home() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a, #020617)",
      color: "#fff",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center"
    }}>
      
      {/* LOGO */}
      <div style={{
        width: 120,
        height: 120,
        background: "linear-gradient(135deg, #22c55e, #06b6d4)",
        borderRadius: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 40,
        fontWeight: "bold"
      }}>
        PD
      </div>

      <p style={{ marginTop: 10, opacity: 0.7 }}>
        GERENCIADOR DE CAMPEONATOS
      </p>

      <h1 style={{ fontSize: 48, marginTop: 10 }}>
        Prime DivCup Sorteio
      </h1>

      <p style={{ marginTop: 10, maxWidth: 500, opacity: 0.7 }}>
        Organize times, gere rodadas e controle seu campeonato de forma inteligente.
      </p>

      {/* BOTÕES */}
      <div style={{
        marginTop: 40,
        display: "flex",
        gap: 20,
        flexWrap: "wrap",
        justifyContent: "center"
      }}>
        <Link href="/times"><button>Gerenciar Times</button></Link>
        <Link href="/configuracao"><button>Configuração</button></Link>
        <Link href="/rodadas"><button>Ver Rodadas</button></Link>
      </div>

    </div>
  )
}
