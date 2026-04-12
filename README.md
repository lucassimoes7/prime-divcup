# Gerenciador de Campeonatos

Sistema web para gerenciamento de campeonatos de futebol ou futsal, feito com Next.js App Router, TypeScript e persistencia em localStorage.

## Como executar

1. Instale as dependencias:

```bash
npm install
```

2. Rode em modo desenvolvimento:

```bash
npm run dev
```

3. Abra no navegador:

```text
http://localhost:3000
```

## Build para producao

```bash
npm run build
npm run start
```

## Estrutura principal

```text
app/
  configuracao/
  rodadas/
  times/
context/
lib/
```

Os dados de times e rodadas ficam salvos no localStorage do navegador.
