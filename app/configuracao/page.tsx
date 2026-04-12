"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function ConfiguracaoPage() {
  const router = useRouter()

  const [totalTimes, setTotalTimes] = useState(0)
  const [jogosPorTime, setJogosPorTime] = useState(1)
  const [maxFolgas, setMaxFolgas] = useState(1)
  const [jogosPorRodada, setJogosPorRodada] = useState(2)
  const [repeticao, setRepeticao] = useState(false)

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("times") || "[]")

    if (Array.isArray(data)) {
      setTotalTimes(data.length)
    } else if (data?.times) {
      setTotalTimes(data.times.length)
    }

    const saved = localStorage.getItem("configCampeonato")
    if (saved) {
      const config = JSON.parse(saved)
      setJogosPorTime(config.jogosPorTime || 1)
      setMaxFolgas(config.maxFolgas || 1)
      setJogosPorRodada(config.jogosPorRodada || 2)
      setRepeticao(config.repeticao || false)
    }
  }, [])

  const salvar = () => {
    const config = {
      jogosPorTime,
      maxFolgas,
      jogosPorRodada,
      repeticao,
    }

    localStorage.setItem("configCampeonato", JSON.stringify(config))

    // volta automaticamente pra home
    router.push("/")
  }

  return (
    <div style={{ padding: 40, color: "#fff" }}>
      
      {/* BOTÃO VOLTAR */}
      <button
        onClick={() => router.push("/")}
        style={{
          marginBottom: 20,
          padding: 10,
          background: "#1e293b",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
          color: "#fff"
        }}
      >
        ← Voltar
      </button>

      <h1 style={{ fontSize: 28 }}>Configuração do Torneio</h1>

      <div style={{
        marginTop: 20,
        maxWidth: 400,
        display: "flex",
        flexDirection: "column",
        gap: 15
      }}>

        {/* TOTAL TIMES */}
        <div>
          <label>Total de times:</label>
          <input
            value={totalTimes}
            disabled
            style={{ width: "100%", padding: 10, background: "#020617", color: "#fff" }}
          />
        </div>

        {/* JOGOS POR TIME */}
        <div>
          <label>Jogos por time:</label>
          <input
            type="number"
            value={jogosPorTime}
            onChange={(e) => setJogosPorTime(Number(e.target.value))}
            style={{ width: "100%", padding: 10 }}
          />
        </div>

        {/* FOLGAS */}
        <div>
          <label>Máx. folgas consecutivas:</label>
          <input
            type="number"
            value={maxFolgas}
            onChange={(e) => setMaxFolgas(Number(e.target.value))}
            style={{ width: "100%", padding: 10 }}
          />
        </div>

        {/* JOGOS POR RODADA */}
        <div>
          <label>Jogos por rodada:</label>
          <input
            type="number"
            value={jogosPorRodada}
            onChange={(e) => setJogosPorRodada(Number(e.target.value))}
            style={{ width: "100%", padding: 10 }}
          />
        </div>

        {/* REPETIÇÃO */}
        <div>
          <label>
            <input
              type="checkbox"
              checked={repeticao}
              onChange={() => setRepeticao(!repeticao)}
            />
            Permitir repetição de confronto
          </label>
        </div>

        <button
          onClick={salvar}
          style={{
            marginTop: 10,
            padding: 12,
            background: "#22c55e",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            color: "#000",
            fontWeight: "bold"
          }}
        >
          Salvar Configuração
        </button>

      </div>
    </div>
  )
}
