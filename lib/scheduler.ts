type TeamStats = {
  name: string
  jogos: number
  ultimaRodada: number
  folgasSeguidas: number
}

export function generateSchedule(teams: string[]) {
  const config = JSON.parse(localStorage.getItem("configCampeonato") || "{}")

  const jogosPorTime = config.jogosPorTime || 4
  const maxFolgas = config.maxFolgas || 1
  const jogosPorRodada = config.jogosPorRodada || 4
  const repeticao = config.repeticao || false

  if (!teams || teams.length < 2) return []

  const stats: TeamStats[] = teams.map((t) => ({
    name: t,
    jogos: 0,
    ultimaRodada: -1,
    folgasSeguidas: 0,
  }))

  const confrontosFeitos = new Set<string>()
  const rodadas: any[] = []

  let rodadaAtual = 0

  function podeJogar(a: TeamStats, b: TeamStats) {
    if (a.name === b.name) return false

    if (a.jogos >= jogosPorTime || b.jogos >= jogosPorTime) return false

    const chave = [a.name, b.name].sort().join("x")

    if (!repeticao && confrontosFeitos.has(chave)) return false

    if (a.folgasSeguidas > maxFolgas || b.folgasSeguidas > maxFolgas) return false

    return true
  }

  while (true) {
    const disponiveis = stats.filter((t) => t.jogos < jogosPorTime)

    if (disponiveis.length < 2) break

    const rodada: any[] = []
    const usados = new Set<string>()

    for (let i = 0; i < disponiveis.length; i++) {
      const timeA = disponiveis[i]

      if (usados.has(timeA.name)) continue

      for (let j = i + 1; j < disponiveis.length; j++) {
        const timeB = disponiveis[j]

        if (usados.has(timeB.name)) continue

        if (podeJogar(timeA, timeB)) {
          rodada.push({
            casa: timeA.name,
            fora: timeB.name,
          })

          usados.add(timeA.name)
          usados.add(timeB.name)

          timeA.jogos++
          timeB.jogos++

          timeA.folgasSeguidas = 0
          timeB.folgasSeguidas = 0

          const chave = [timeA.name, timeB.name].sort().join("x")
          confrontosFeitos.add(chave)

          break
        }
      }

      if (rodada.length >= jogosPorRodada) break
    }

    // Atualiza folgas
    stats.forEach((t) => {
      if (!usados.has(t.name)) {
        t.folgasSeguidas++
      }
    })

    if (rodada.length === 0) break

    rodadas.push(rodada)
    rodadaAtual++
  }

  return rodadas
}
