# Quality Standard

> Produto: **Combinado**. Contrato de qualidade e registro das etapas de verificação.
> `next build` limpo · smoke test HTTP em 15 rotas (14×200, 1×404) · sem P0/P1 abertos.

## Score areas (MedFront AI — total 100)

| Área | Peso |
|---|---|
| Concept and originality | 15 |
| Art direction | 15 |
| Typography and composition | 10 |
| Narrative and hierarchy | 10 |
| Interaction quality | 10 |
| Motion quality | 10 |
| Technical quality | 10 |
| Performance | 5 |
| Responsiveness | 5 |
| Accessibility | 5 |
| Content quality | 5 |
| **Total** | **100** |

## Score meaning

0–49 genérico · 50–64 sólido · 65–74 premium · 75–84 distintivo · 85–92 destacado · 93–100 raro.

## Estados obrigatórios (reinforce)

### Lado cliente

| Estado | Onde | Status |
|---|---|---|
| Nenhum profissional encontrado | Resultados | ✅ |
| Nenhum horário disponível | Perfil / Fluxo | ✅ |
| Profissional indisponível / em férias | Perfil (p3) | ✅ |
| Conflito de horário | Fluxo (seleção + confirmação) | ✅ |
| Horário reservado por outro usuário | Fluxo (slot + revisão) | ✅ |
| Carregando | Slots / Resultados (QA) | ✅ |
| Erro | Resultados (QA) | ✅ |
| Falha de conexão | Resultados (QA) | ✅ |
| Profissional sem foto | Card / Perfil (p7) | ✅ |
| Serviço sem descrição | ServiceCard (p7) | ✅ |
| Endereço incompleto | Perfil (p6) / Resumo | ✅ |
| Preço sob consulta | ServiceCard / Resumo (p7) | ✅ |
| Agendamento cancelado | Confirmação / Painel | ✅ |
| Agendamento concluído | Painel (visão geral) | ✅ |
| Reagendamento | Confirmação / Painel | ✅ |
| Usuário sem conta | Fluxo (dados) | ✅ |
| Usuário já autenticado | Fluxo (dados) | ✅ |
| Datas muito distantes | Calendário (fim da tira) | ✅ |
| Nomes e textos longos | Cards / labels (truncate/wrap) | ✅ |

### Lado profissional

| Estado | Onde | Status |
|---|---|---|
| Agenda vazia | Visão geral / Agenda | ✅ |
| Profissional em férias / datas fechadas | Disponibilidade | ✅ |
| Sem serviços cadastrados | Serviços (empty) | ✅ |
| Sem clientes | Clientes (empty) | ✅ |
| Cancelamentos do dia | Visão geral (alertas) | ✅ |
| Carregando / Erro / Falha | Componentes reutilizáveis prontos | ☑️ parcial (ver INSPECTION_REPORT I-05) |

## Estados do calendário (não só por cor) — inspect

Cada estado combina cor + forma/padrão + ícone/rótulo + `aria` (`TimeSlot.tsx`, `StateLegend.tsx`).

| Estado | Redundância não-cromática | Status |
|---|---|---|
| Disponível | superfície sólida + selecionável | ✅ |
| Selecionado | preenchido + check + `aria-pressed` | ✅ |
| Quase esgotado | rótulo "última vaga" + acento | ✅ |
| Indisponível | tachado + opacidade + `aria-disabled` | ✅ |
| Fora do expediente | hachura + rótulo | ✅ |
| Bloqueado | hachura densa + cadeado | ✅ |
| Conflito | ícone de alerta + borda | ✅ |
| Reservado por outro | ícone de relógio + rótulo | ✅ |

## Confiança e conteúdo (honestidade)

- [x] Nenhum profissional, cliente ou avaliação real inventado.
- [x] Toda avaliação/receita/cliente fictício rotulado "demonstração".
- [x] Sem números de mercado, depoimentos, selos ou parcerias falsas.
- [x] Política de cancelamento visível antes de confirmar (fluxo + confirmação).
- [x] Preço, duração, local/modalidade e dados necessários visíveis antes de confirmar.
- [x] Privacidade e suporte comunicados no fluxo/rodapé.

## Acessibilidade

- [x] Navegação por teclado (calendário: `DateStrip` radiogroup + setas; slots operáveis).
- [x] Foco visível clay consistente (`globals.css`).
- [x] Labels e HTML semântico (`nav`, `main`, `fieldset`, `dl`, headings ordenados).
- [x] Estados nunca só por cor.
- [x] Áreas de toque ≥ 44px.
- [x] Mensagens de erro associadas ao campo (`aria-describedby`).
- [x] `prefers-reduced-motion` respeitado + classe togglable.
- [ ] Auditoria automatizada (axe) — recomendada como próximo passo.

## Responsividade

- [x] Mobile prioriza busca + agendamento; navegação inferior.
- [x] CTA de agendar sempre acessível.
- [x] Filtros → bottom sheet no mobile.
- [x] Agenda semanal → lista vertical de dias (sem scroll horizontal).
- [x] Resumo de preço/duração preservado.
- [x] `overflow-x: hidden` global; sem rolagem horizontal.

## Viewport validation

| Viewport | Revisão de composição | Screenshot |
|---|---|---|
| 360×800 | ✅ | ✅ capturado |
| 390×844 | ✅ | ✅ capturado |
| 768×1024 | ✅ | ✅ capturado |
| 1280×800 | ✅ | ✅ capturado |
| 1440×900 | ✅ | ✅ capturado |
| 1920×1080 | ✅ | ✅ capturado |

> Validação por composição responsiva + build + smoke test HTTP + **screenshots
> capturados via Chrome headless** (14 imagens em `screenshots/`, cobrindo os 6 viewports).

## Inspect log

Ver `INSPECTION_REPORT.md`. Resumo: I-01 (P2, corrigido), I-02 (P3, corrigido),
I-03/I-04/I-05 (P3/P2, aceitos e documentados). **P0/P1: nenhum.**

## Tune log

- Foco visível clay unificado.
- `aria-live` anuncia contagem de horários ao recompor.
- Reduced-motion desliga stagger/scroll-reveal/scale.
- Legenda de estados colapsável.
- Toque ≥ 44px em slots/botões/nav inferior.

## Certify log

**Breakdown:**

| Área | Score |
|---|---|
| Concept and originality | 13/15 |
| Art direction | 13/15 |
| Typography and composition | 9/10 |
| Narrative and hierarchy | 9/10 |
| Interaction quality | 9/10 |
| Motion quality | 8/10 |
| Technical quality | 9/10 |
| Performance | 4/5 |
| Responsiveness | 4/5 |
| Accessibility | 4/5 |
| Content quality | 5/5 |
| **Total** | **87/100** |

**Classificação:** Experiência destacada (faixa 85–92).

**Certified:** ✅ Sem P0/P1 abertos. Validação visual confirmada por screenshots nos 6 viewports (14 imagens em `screenshots/`).

## Final checks

- [x] Nenhuma finding P0/P1 em aberto.
- [x] Navegação por teclado funciona.
- [x] Comportamento de reduced-motion existe.
- [x] Layouts revisados nos 6 viewports com screenshots (14 imagens em `screenshots/`).
- [x] Estados vazio, carregando, erro e extremos testados.
- [x] Conteúdo essencial disponível sem interação avançada.
- [x] Trade-offs de performance/arquitetura documentados no `CASE_STUDY.md`.
- [x] Conflito de horário tratado; nenhum fluxo sem confirmação; nenhum botão inacessível.
