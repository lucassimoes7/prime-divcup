type Match = {
  casa: string
  fora: string
}

type Round = Match[]

export function generateSchedule(teams: string[]): Round[] {
  const config = JSON.parse(localStorage.getItem("configCampeonato") || "{}")

  const jogosPorTime = config.jogosPorTime || 4
  const jogosPorRodada = config.jogosPorRodada || 4
  const repeticao = config.repeticao || false

  if (!teams || teams.length < 2) return []

  const jogosFeitos: Record<string, number> = {}
  const confrontos = new Set<string>()
  const rodadas: Round[] = []

  teams.forEach((t) => (jogosFeitos[t] = 0))

  function podeJogar(a: string, b: string) {
    if (a === b) return false
    if (jogosFeitos[a] >= jogosPorTime) return false
    if (jogosFeitos[b] >= jogosPorTime) return false

    const chave = [a, b].sort().join("x")

    if (!repeticao && confrontos.has(chave)) return false

    return true
  }

  while (true) {
    const disponiveis = teams.filter((t) => jogosFeitos[t] < jogosPorTime)

    if (disponiveis.length < 2) break

    const rodada: Match[] = []
    const usados = new Set<string>()

    for (let i = 0; i < disponiveis.length; i++) {
      const a = disponiveis[i]

      if (usados.has(a)) continue

      for (let j = i + 1; j < disponiveis.length; j++) {
        const b = disponiveis[j]

        if (usados.has(b)) continue

        if (podeJogar(a, b)) {
          rodada.push({ casa: a, fora: b })

          usados.add(a)
          usados.add(b)

          jogosFeitos[a]++
          jogosFeitos[b]++

          const chave = [a, b].sort().join("x")
          confrontos.add(chave)

          break
        }
      }

      if (rodada.length >= jogosPorRodada) break
    }

    if (rodada.length === 0) break

    rodadas.push(rodada)
  }

  return rodadas
}

/* ============================= */
/* 🔥 FUNÇÕES QUE ESTAVAM FALTANDO */
/* ============================= */

export function getTeamSchedule(rounds: Round[], team: string) {
  const jogos: any[] = []

  rounds.forEach((rodada, index) => {
    rodada.forEach((match) => {
      if (match.casa === team || match.fora === team) {
        jogos.push({
          rodada: index + 1,
          adversario: match.casa === team ? match.fora : match.casa,
        })
      }
    })
  })

  return jogos
}

export function generateRoundRobin(teams: string[]) {
  return generateSchedule(teams)
}
