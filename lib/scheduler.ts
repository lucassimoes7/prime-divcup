export function generateSchedule(times: string[]) {
  if (!times || times.length < 2) return []

  let lista = [...times]

  // Se for ímpar, adiciona "Folga"
  if (lista.length % 2 !== 0) {
    lista.push("Folga")
  }

  const total = lista.length
  const rodadas = total - 1
  const jogosPorRodada = total / 2

  const tabela = []

  for (let r = 0; r < rodadas; r++) {
    const rodada = []

    for (let i = 0; i < jogosPorRodada; i++) {
      const timeA = lista[i]
      const timeB = lista[total - 1 - i]

      if (timeA !== "Folga" && timeB !== "Folga") {
        rodada.push({
          casa: timeA,
          fora: timeB,
        })
      }
    }

    tabela.push(rodada)

    // Rotaciona os times (menos o primeiro)
    const fixo = lista[0]
    const resto = lista.slice(1)

    resto.unshift(resto.pop() as string)

    lista = [fixo, ...resto]
  }

  return tabela
}
