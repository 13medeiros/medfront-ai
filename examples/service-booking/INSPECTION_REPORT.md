# Inspection Report — Combinado

> Etapas `inspect` e `reinforce` da metodologia MedFront AI.
> Formato: problema · prioridade · impacto · evidência · correção · status.
> Build verificado: `next build` sem erros; smoke test HTTP em 15 rotas (14×200 + 1×404).

## Prioridades

`P0` bloqueia uso/acesso · `P1` dano sério a UX/estabilidade · `P2` defeito relevante · `P3` refinamento.

## Findings

### I-01 · P2 · Link "Continuar" desabilitado de forma inacessível
- **Impacto:** No perfil, o botão "Continuar agendamento" era um `<a>` desabilitado apenas com `pointer-events-none` + opacidade. Continuava focalizável por teclado e anunciado como link ativo, embora inerte — anti-padrão de acessibilidade.
- **Evidência:** `AvailabilityCalendar.tsx` — `<Button href={bookingHref} className={time ? "" : "pointer-events-none opacity-45"}>`.
- **Correção:** Renderização condicional — quando não há horário, um `<button disabled aria-disabled>` real ("Escolha um horário"); com horário, o link de continuar.
- **Status:** ✅ Corrigido.

### I-02 · P3 · Estado "datas muito distantes" ausente
- **Impacto:** A tira de datas mostrava 14 dias sem comunicar que datas além do horizonte ainda não abriram — um dos estados obrigatórios do briefing.
- **Evidência:** `DateStrip.tsx` renderizava só o intervalo, sem indicador de fim.
- **Correção:** Indicador não-interativo ao fim da tira: "Datas mais distantes ainda não abriram" (`bg-muted-surface`, borda tracejada, `title`).
- **Status:** ✅ Corrigido.

### I-03 · P3 · Disponibilidade calculada apenas no cliente
- **Impacto:** `SlotGrid` computa os horários em `useEffect` (client). No SSR/sem-JS, aparece o skeleton e a legenda, não os slots. O restante do perfil (bio, serviços, preços, políticas) é SSR e legível.
- **Evidência:** `SlotGrid.tsx` — `useEffect(... getDaySlotsFor ...)`; HTML do perfil contém legenda e estrutura, não os horários.
- **Correção:** Trade-off aceito — a seleção de horário é inerentemente interativa; conteúdo essencial permanece disponível sem os slots. Documentado como limitação.
- **Status:** ☑️ Aceito e documentado.

### I-04 · P3 · Navegação por setas na grade de horários é linear
- **Impacto:** As setas ↑/↓ movem o foco como →/← (lista achatada dos slots selecionáveis), não em 2D por linha/coluna da grade visual.
- **Evidência:** `SlotGrid.tsx` — handler `onKeyDown` percorre `button:not([disabled])` linearmente.
- **Correção:** Mantido — navegação previsível e totalmente operável por teclado; `DateStrip` usa `radiogroup` com setas. Refinamento 2D fica como melhoria futura.
- **Status:** ☑️ Aceito e documentado.

### I-05 · P2 · Cobertura de loading/erro desigual entre cliente e painel
- **Impacto:** Estados de carregamento/erro/falha de conexão são demonstráveis no lado cliente (painel "Estados de teste (QA)" em `/buscar`), mas as páginas do painel são server-render estáticas e não expõem esses estados por tela.
- **Evidência:** `ResultsClient.tsx` tem simulação de estados; páginas em `(painel)/` não.
- **Correção:** Componentes `LoadingState`/`ErrorState`/`Skeleton` reutilizáveis existem e estão prontos para plugar quando houver fetch real; demonstração concentrada onde há assíncronia perceptível. Documentado.
- **Status:** ☑️ Parcial e documentado.

## Reinforce — estados obrigatórios testados

| Estado | Onde é alcançável | Resultado |
|---|---|---|
| Nenhum profissional encontrado | `/buscar` com filtros restritivos | ✅ |
| Nenhum horário disponível | dia lotado / fora do expediente | ✅ |
| Profissional indisponível / em férias | perfil de `luana-prado` (p3) | ✅ |
| Conflito de horário | serviço longo em slot tardio / confirmação | ✅ |
| Reservado por outro usuário | slot `reserved` (p2 hoje) + banner na revisão | ✅ |
| Carregando | recompute de slots + QA `/buscar` | ✅ |
| Erro / falha de conexão | QA `/buscar` (error/offline) | ✅ |
| Profissional sem foto | `bruno-costa` (p7) | ✅ |
| Serviço sem descrição | "Diagnóstico de reparo" (p7) | ✅ |
| Endereço incompleto / preço sob consulta | p6 sem endereço / p7 sob consulta | ✅ |
| Cancelado / concluído / reagendamento | painel (agenda + visão geral) e confirmação | ✅ |
| Usuário sem conta / já autenticado | etapa "Seus dados" do fluxo | ✅ |
| Agenda vazia | `/painel` sem agendamentos no dia | ✅ |
| Datas muito distantes | fim da `DateStrip` | ✅ |
| Nomes e textos longos | `truncate`/wrap em cards e resumo | ✅ |

## Tune — refinamentos aplicados

- Foco visível clay consistente via `globals.css` (`:focus-visible`).
- `prefers-reduced-motion` desliga stagger, scroll-reveal e scale de confirmação.
- Áreas de toque ≥ 44px em slots, botões e navegação inferior.
- `aria-live` anuncia contagem de horários ao recompor.
- Legenda de estados colapsável para reduzir ruído.

## Pendências conhecidas (não bloqueantes)

- **Screenshots pixel-a-pixel nos 6 viewports:** validação feita por composição responsiva + build + smoke test HTTP; captura visual em `screenshots/` é o passo remanescente (rodar `npm run dev` e capturar).
- I-03, I-04, I-05 aceitos e documentados acima.

**P0/P1 em aberto: nenhum.**
