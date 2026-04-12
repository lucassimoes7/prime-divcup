export const metadata = {
  title: "Prime DivCup Sorteio",
  description: "Sistema de sorteio e gerenciamento de campeonatos",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-br">
      <body style={{ margin: 0, background: "#0f172a", color: "#fff", fontFamily: "sans-serif" }}>
        {children}
      </body>
    </html>
  )
}
