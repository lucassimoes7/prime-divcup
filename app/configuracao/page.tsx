"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function ConfiguracaoPage() {
  const [totalTimes, setTotalTimes] = useState(0)
  const [jogosPorTime, setJogosPorTime] = useState(1)
  const [maxFolgas, setMaxFolgas] = useState(1)
  const [jogosPorRodada, setJogosPorRodada] = useState(2)
  const [repeticao, setRepeticao] = useState(false)
  const router = useRouter()

  // Carrega times salvos
  useEffect(() => {
    const times = JSON.parse(localStorage.getItem("times") || "[]")
    setTotalTimes(times.length)

    const saved = localStorage.getItem("configCampeonato")
    if (saved) {
      const data = JSON.parse(saved)
      setJogosPorTime(data.jogosPorTime || 1)
      setMaxFolgas(data.maxFolgas || 1)
      setJogosPorRodada(data.jogosPorRodada || 2)
      setRepeticao(data.repeticao || false)
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

    alert("Configuração salva com sucesso!")
  }

  return (
    <div style={{ padding: 40, color: "#fff" }}>
      <h1 style={{ fontSize: 28 }}>Configuração do Torneio</h1>

      <div style={{ marginTop: 20, maxWidth: 400, display: "flex", flexDirection: "column", gap: 15 }}>

        {/* TOTAL TIMES */}
        <div>
          <label>Total de times:</label>
          <input
            value={totalTimes}
            disabled
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        {/* JOGOS POR TIME */}
        <div>
          <label>Jogos por time:</label>
          <input
            type="number"
            value={jogosPorTime}
            onChange={(e) => setJogosPorTime(Number(e.target.value))}
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        {/* FOLGAS */}
        <div>
          <label>Máx. folgas consecutivas:</label>
          <input
            type="number"
            value={maxFolgas}
            onChange={(e) => setMaxFolgas(Number(e.target.value))}
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        {/* JOGOS POR RODADA */}
        <div>
          <label>Jogos por rodada (semana):</label>
          <input
            type="number"
            value={jogosPorRodada}
            onChange={(e) => setJogosPorRodada(Number(e.target.value))}
            style={{ width: "100%", padding: 8 }}
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
            padding: 10,
            background: "#22c55e",
            border: "none",
            borderRadius: 6,
            cursor: "pointer"
          }}
        >
          Salvar Configuração
        </button>

      </div>
    </div>
  )
}
