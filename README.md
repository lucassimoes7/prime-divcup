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

## Login

O acesso local usa um login simples no navegador:

```text
login: admin
senha: Prime@LucaseGuilherme
```

## Publicar online

O caminho mais rapido e usar Vercel:

1. Suba este projeto para um repositorio no GitHub.
2. Acesse https://vercel.com e conecte sua conta do GitHub.
3. Clique em Add New Project e selecione o repositorio.
4. Mantenha o framework como Next.js.
5. Clique em Deploy.

Depois do deploy, a Vercel gera um link online que abre no computador e no
celular. Para atualizar o site, basta enviar novas alteracoes para o GitHub.

Observacao: o login atual e client-side, suficiente para controlar acesso em um
app simples de sorteio, mas nao deve proteger dados sensiveis.
