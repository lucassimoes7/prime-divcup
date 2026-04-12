import "./globals.css"
import { AppProvider } from "../context/AppContext"

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
      <body>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  )
}
