import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="app-shell">
      <section className="card panel">
        <p className="page-eyebrow">Nao encontrado</p>
        <h1 className="page-title">Time nao encontrado</h1>
        <p className="page-description">
          O time solicitado nao existe mais ou foi removido do campeonato.
        </p>
        <div style={{ height: 18 }} />
        <Link className="button" href="/times">
          Voltar para Times
        </Link>
      </section>
    </main>
  );
}
