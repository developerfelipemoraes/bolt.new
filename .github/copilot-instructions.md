## Objetivo

Fornecer ao agente (Copilot / AI) contexto prático e exemplos para ser imediatamente produtivo neste repositório React + TypeScript (Vite + pnpm).

## Comandos essenciais

- Instalar dependências: use `pnpm install` (projeto configurado com `pnpm@8`)
- Rodar em dev: `pnpm dev` (Vite)
- Build: `pnpm build` e visualizar com `pnpm preview`
- Lint: `pnpm lint` (usa eslint) e Type-check: `pnpm type-check`

Arquivos úteis: `package.json`, `vite.config.ts`, `tsconfig.json`.

## Visão geral da arquitetura (rápida)

- Frontend: React + TypeScript, entrada em `src/main.tsx` e composição em `src/App.tsx`.
- Rotas principais: definidas em `src/App.tsx` (uso de `BrowserRouter` + `ProtectedRoute`).
- State + data fetching: `@tanstack/react-query` (QueryClient em `App.tsx`) combinado com serviços em `src/services/*`.
- Autenticação/contexto: `src/components/auth/AuthContext.tsx` fornece `useAuth()` e gerencia `user`, `company` e `sessionId` (localStorage).
- Componentes UI reutilizáveis: `src/components/ui/` e `src/components/CRMComponents/` (veja `src/components/CRMComponents/README.md`).

Por que importa: o app mistura React Query (para cache) com serviços 'imperativos' (ex.: `src/services/companyService.ts`) — prefira entender quando usar hooks vs. chamar serviços diretamente.

## Convenções e padrões específicos do projeto

- Alias de import: `@/*` aponta para `src/*` (ver `tsconfig.json` e `vite.config.ts`).
- Serviços: cada arquivo em `src/services/` exporta uma classe/instância (ex.: `apiService` em `companyService.ts`, `userService` e `vehicleService`). Eles:
  - usam constantes `API_BASE_URL` no topo;
  - fazem fetch com `fetch()` e retornam objetos `ApiResponse<T>` ({ data?, error?, message? });
  - esperam endpoints que começam com `/` e concatenam com `API_BASE_URL`.
- Multi-tenancy / empresa atual: os serviços adicionam automaticamente `companyId` (query) e o header `X-Company-ID` salvo em localStorage (`company`). Super admin evita esse filtro.
- Tokens: token principal salvo em `localStorage` sob chaves `auth_token` (geral) e `auth_token_vehicle` (veículos). `user` e `company` também são salvos em localStorage.
- Login / mocks: `src/components/Login.tsx` contém credenciais de teste e prefill; `src/services/userService.ts` contém dados iniciais mockados (veja `INITIAL_USERS` / `INITIAL_COMPANIES`).

## Padrões de alteração comuns (exemplos)

- Adicionar nova chamada API: editar `src/services/companyService.ts` (ou criar novo serviço) — implemente método que chama `this.request<T>('/rota', { method, body })` e retorne `response.data`.
- Trocar empresa em runtime: use `AuthProvider.switchCompany(companyId)` que atualiza `localStorage.company` e chama `userService.getCompanyById`.
- Debug de chamadas HTTP: os serviços fazem console.log detalhado (endpoint, companyId, response.status). Verifique o console do browser.

## Regras de segurança/expectativas observáveis

- Não buscar segredos: chaves e tokens são simulados no localStorage; não tentar buscar variáveis de ambiente sensíveis.
- Scripts de build/CI: há workflows em `.github/workflows/` (CI + Azure Static Web Apps). Evite modificar sem entender o pipeline.

## Pontos de integração externa

- Endpoints em serviços apontam para containers Azure (ex.: `bravewave-*.azurecontainerapps.io`) mas a aplicação também tem endpoints locais comentados (`localhost`). Verifique `API_BASE_URL` em cada serviço.
- Bibliotecas relevantes: `@tanstack/react-query`, `react-router-dom`, `react-hook-form` + `zod`, `sonner` (notificações), `@tailwindcss` e `@metagptx/vite-plugin-source-locator` (útil para rastrear origem de componentes).

## Dicas rápidas para o agente (exemplos de edições seguras)

- Para editar um formulário wizard, procure por `src/components/contact-wizard/` ou `wizard-contas-contatos/` — os passos são componentes separados (ex.: `AddressStep.tsx`).
- Para alterar mensagens do login ou credenciais de teste, edite `src/components/Login.tsx` (texto e valores pré-povoados).
- Para adicionar um novo endpoint ao cliente API, siga o padrão `request<T>(endpoint, options)` em `companyService.ts` para manter logs e tratamento de erro consistente.

## Arquivos que sempre revisar antes de uma PR

- `src/components/auth/AuthContext.tsx` — lógica de sessão / permissão
- `src/services/*` — contratos com backend (companyService, userService, vehicleService)
- `src/components/ui/` e `src/components/CRMComponents/README.md` — mudanças de UI compartilhada
- `package.json` / `vite.config.ts` / `tsconfig.json` — alterações de build/alias/deps

## Observações finais

Se algo não for óbvio a partir do código, verifique o console do navegador (os serviços fazem logs) e os mocks em `src/services/userService.ts`. Se precisar de acesso a variáveis de ambiente use `VITE_API_URL` (ver `README.md`).

Se quiser, eu posso ajustar este arquivo com exemplos adicionais (snippets de chamadas API, chaves de localStorage) — diga quais áreas quer priorizar.
