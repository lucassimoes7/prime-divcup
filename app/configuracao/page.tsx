"use client"

import { useState, useEffect } from "react"

export default function ConfiguracaoPage() {
  const [turnos, setTurnos] = useState(1)
  const [idaVolta, setIdaVolta] = useState(false)
  const [maxFolgas, setMaxFolgas] = useState(1)
  const [tipo, setTipo] = useState("pontos")

  useEffect(() => {
    const saved = localStorage.getItem("configCampeonato")
    if (saved) {
      const data = JSON.parse(saved)
      setTurnos(data.turnos || 1)
      setIdaVolta(data.idaVolta || false)
      setMaxFolgas(data.maxFolgas || 1)
      setTipo(data.tipo || "pontos")
    }
  }, [])

  const salvar = () => {
    const config = {
      turnos,
      idaVolta,
      maxFolgas,
      tipo,
    }

    localStorage.setItem("configCampeonato", JSON.stringify(config))
    alert("Configuração salva com sucesso!")
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Configuração do Campeonato</h1>

      <div style={{ marginTop: 20, maxWidth: 400 }}>

        <div>
          <label>Turnos:</label>
          <input
            type="number"
            value={turnos}
            onChange={(e) => setTurnos(Number(e.target.value))}
          />
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={idaVolta}
              onChange={() => setIdaVolta(!idaVolta)}
            />
            Ida e volta
          </label>
        </div>

        <div>
          <label>Máx. folgas seguidas:</label>
          <input
            type="number"
            value={maxFolgas}
            onChange={(e) => setMaxFolgas(Number(e.target.value))}
          />
        </div>

        <div>
          <label>Tipo:</label>
          <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
            <option value="pontos">Pontos corridos</option>
            <option value="mata">Mata-mata</option>
          </select>
        </div>

        <button onClick={salvar} style={{ marginTop: 20 }}>
          Salvar
        </button>
      </div>
    </div>
  )
}
