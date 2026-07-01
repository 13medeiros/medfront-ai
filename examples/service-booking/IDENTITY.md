# Identity System

> Criado na etapa **identity** — gramática visual e verbal coerente para os dois lados do produto (cliente + profissional).
> Produto: **Combinado**.

---

## ⟳ Revisão — Direção 1 "Vizinhança" (aplicada 2026-07-01)

Após a auditoria retroativa ([`RETRO_AUDIT.md`](./RETRO_AUDIT.md)), a **pele visual** foi revista para cortar heranças do projeto de auditoria e resolver os achados de `chroma`. **Fluxos, arquitetura e o sistema de estados do calendário foram preservados.** Esta seção **supersede** a paleta e a tipografia descritas mais abaixo.

**Tipografia (nova):** uma grotesca humanista única — **Bricolage Grotesque** (display + corpo) — + **Spline Sans Mono** para dados (horários/preços/durações). Remove o serif (Fraunces) e o IBM Plex Mono herdados; reduz de 3 → 2 famílias (ajuda o LCP).

**Paleta (nova) — papéis separados (marca ≠ seleção ≠ foco):**

| Token | Valor | Papel | Contraste |
|---|---|---|---|
| `--bone` (canvas) | `#F3EFE7` | Fundo | — |
| `--bone-raised` (surface) | `#FBF8F2` | Cards / superfície de agendamento | ink 15.3 |
| `--muted-surface` | `#E9E3D8` | Inativo / hachura | — |
| `--ink` | `#232019` | Texto **e seleção (chip)** | 14.2 ✅ |
| `--ink-soft` | `#5A544A` | Texto 2º | 6.5 ✅ |
| `--clay` | `#A8451E` | **Marca / CTA / link** | CTA 5.18 ✅ (era 4.32) |
| `--clay-deep` | `#87381A` | Hover / texto de marca | 7.0 ✅ |
| `--sage` | `#2C744F` | Disponível / sucesso | 4.9 ✅ |
| `--amber` | `#A9761C` | Atenção / última vaga | 3.5 (gráfico) |
| `--alert` | `#A32A22` | Erro / conflito | 6.3 ✅ |
| **Foco** | anel `--ink` 2px + offset | **Foco** | 15.3 ✅ |

**Correções aplicadas:** R-01 contraste do CTA (novo `--clay`); R-02 markup de lista (`<ol>`→`<li>` direto na home); R-03 `--clay` deixou de acumular seleção e foco — **slot/data selecionados = chip ink; foco = anel ink neutro**. Superfície de agendamento diferenciada (`--bone-raised` + moldura mais forte).

---

## Core idea

**Central concept:** Combinado comporta-se como um **profissional de confiança que mostra exatamente quando está livre e trava o horário na sua frente**. A interface transforma a negociação invisível do WhatsApp ("tem horário quinta?") em um objeto visível e honesto: o **horário disponível**, que se pode escolher e confirmar. Quando confirmado, "tá combinado".

**Primary contrast or tension:** **Intenção do cliente** (quer qualquer hora que sirva) versus **realidade da agenda** (regras de duração, intervalo, expediente, bloqueios). A identidade torna essa negociação transparente — a disponibilidade nunca mente, e cada escolha do cliente é respondida com honestidade visual.

## Visual grammar

**Dominant geometry:** O **slot de tempo** — retângulo com cantos suaves (6–8px), nunca pílula, nunca card genérico flutuante. Cada slot carrega uma **trilha de horário** à esquerda (timestamp em mono), como a margem de uma agenda de papel. Linhas horizontais finas separam faixas de horário. A grade da agenda é uma **lane temporal legível**, não um dashboard de quadrados iguais.

**Recurring motif:** **A trilha de horário** (time-rail) — coluna estreita à esquerda com o horário em mono, presente no slot, no resumo do agendamento e no card de compromisso. Une descoberta, agendamento e confirmação sob o mesmo elemento. Complemento: a **marca de confirmação** (um check dentro de um chip clay) que aparece só no momento "combinado" — a recompensa visual do fluxo.

**Composition style:** Layout arejado sobre superfície clara e quente. Lado cliente: assimetria editorial — serviço/profissional à esquerda, disponibilidade à direita (empilha no mobile). Lado profissional: grid denso mas respirado, com uma `ProfessionalSidebar` fixa e conteúdo em faixas horizontais (não em mar de cards). Nunca grade 3×3 de cards idênticos.

**Spacing rhythm:** Base 8px. Seções (cliente): 72–112px vertical desktop, 48–64px mobile. Painel (profissional): 24–40px entre blocos — mais denso, ainda respirável. Blocos internos: 16–24px. Slots: altura mínima 44px (área de toque).

## Typography

**Display role:** **Fraunces** (serif suave, "soft"/opsz alto) — peso 400–560, tracking levemente negativo. Dá calor e personalidade humana a headlines, sem cair no corporativo. Usado com parcimônia: headline do hero, títulos de seção, nome do profissional no perfil.

**Body role:** **Hanken Grotesk** — peso 400/500/600, line-height 1.55. Sans humanista, amigável e altamente legível. Todo o texto funcional, botões, descrições, formulários.

**Data or utility role:** **IBM Plex Mono** — horários, durações, preços, contadores de vaga, IDs. A voz de "sistema honesto": quando é número de agenda, é mono. Reforça a leitura de dados confiáveis.

**Rules for hierarchy and line length:**

- Headlines: máx. 10 palavras; máx-width ~16ch em display grande.
- Body: máx-width 62–66ch.
- Labels/captions: uppercase, tracking +0.06em, 11–12px.
- Preço e duração sempre em mono, alinhados para varredura rápida.

## Color

Paleta **quente e clara** — deliberadamente distante da estética bancária/fintech e do azul-roxo de SaaS. Uma única base coerente para os dois lados (cliente e painel), mudando só a densidade.

| Token | Valor | Uso |
|---|---|---|
| `--bone` | `#F6F1E9` | Fundo principal (superfície quente tipo papel) |
| `--bone-raised` | `#FDFAF4` | Cards, painéis, slots elevados |
| `--muted-surface` | `#ECE5D8` | Fundo de estado inativo / fora do expediente |
| `--ink` | `#211D17` | Texto primário (quase-preto quente) |
| `--ink-soft` | `#5C554B` | Texto secundário |
| `--clay` | `#C2562E` | Marca / CTA / horário selecionado / "combinado" |
| `--clay-deep` | `#8F3D22` | Hover / pressed / foco de CTA |
| `--sage` | `#2F7D5B` | Disponível / positivo / concluído |
| `--amber` | `#B4822A` | Quase esgotado / atenção |
| `--alert` | `#9E2B25` | Conflito / erro / cancelamento |
| `--line` | `#E4DCCF` | Divisores sobre `--bone` |
| `--line-strong` | `#CDC2AF` | Bordas de slot / inputs |

**Semantic colors:** `--sage` = disponível/positivo; `--amber` = quase esgotado/atenção; `--alert` = conflito/erro/cancelado; `--clay` = ação e seleção. `--clay` (marca) é intencionalmente distinto de `--sage` (disponível) para nunca confundir "meu CTA" com "horário livre".

**Contrast rules:** Alvo WCAG **AA**. `--ink` sobre `--bone` e `--bone-raised` ≥ 7:1. Texto sobre `--clay`/`--sage`/`--alert` usa `--bone-raised` (claro) com contraste ≥ 4.5:1. **Nenhuma cor é indicador único** — todo estado semântico carrega também ícone, padrão de preenchimento e/ou rótulo textual (ver "Estados do calendário").

## Estados do calendário (não comunicar só por cor)

O calendário/seletor é a interação principal. Cada estado combina **cor + forma/padrão + ícone/rótulo + `aria`** para ser legível sem depender de cor.

| Estado | Cor | Redundância não-cromática | `aria` / texto |
|---|---|---|---|
| Disponível | `--bone-raised`, texto `--ink` | Slot sólido, borda `--line-strong`, selecionável | `aria-label="09:30, disponível"` |
| Selecionado | preenchido `--clay`, texto claro | Borda 2px `--clay-deep` + **check** | `aria-pressed="true"`, "selecionado" |
| Quase esgotado | acento `--amber` | Rótulo **"última vaga"** + ponto | `aria-label="…, última vaga"` |
| Indisponível | `--muted-surface`, texto esmaecido | **Texto tachado** + opacidade | `aria-disabled="true"`, "indisponível" |
| Fora do expediente | `--muted-surface` | **Hachura diagonal** sutil + rótulo | "fora do expediente" |
| Bloqueado | `--muted-surface` | **Ícone de cadeado** + hachura densa | "bloqueado pelo profissional" |
| Conflito | `--alert` | **Ícone de alerta** (triângulo) + borda | `role="alert"`, "conflito de horário" |
| Reservado por outro | `--amber` | **Ícone de relógio** + rótulo | "reservado agora por outra pessoa" |

## Media direction

**Photography:** Fotos de profissionais e trabalhos são **placeholders explícitos** (moldura + rótulo "foto de demonstração"). Sem stock photography genérica. Quando houver "foto real", o layout a valoriza com moldura editorial, não como banner.

**Illustration:** Sem ilustração decorativa. Ícones apenas funcionais (estado, ação, categoria), traço consistente, nunca em quadrados arredondados repetidos.

**Video:** Não utilizar nesta versão.

**3D or procedural graphics:** Não utilizar. Sem partículas, orbs borrados ou parallax.

## Verbal identity

**Tone:** Próximo, claro, confiante e humano — como um bom profissional que se organiza bem. Fala a língua do agendamento cotidiano, não o jargão de software.

**Words to favor:** agendar, marcar horário, tem vaga, disponível, próximo horário, combinar, confirmar, remarcar, cancelar, seu horário, duração, valor, sem trocar mensagem.

**Words and clichés to avoid:** revolucionar, disruptivo, plataforma completa, powered by AI, solução all-in-one, otimize seu negócio (vago), transformação digital, agende com um clique (superlativo vazio), o melhor da região (sem evidência).

**Headline proposta (hero, cliente):** "Tá combinado."

**Subheadline (cliente):** "Encontre o profissional, veja os horários livres e marque na hora — sem trocar mensagem para confirmar."

**Headline (painel, profissional):** "Sua agenda, combinada."

**Subheadline (profissional):** "Seus serviços e horários sempre no ar. Os agendamentos chegam organizados — você atende, não responde mensagem."

## Recognition test

**A interface ainda pareceria este produto sem o logo?**

Sim. A combinação de (1) superfície quente cor de osso com acento **clay**, (2) a **trilha de horário em mono** repetida do slot ao card de compromisso, (3) **Fraunces** editorial + **Hanken Grotesk** funcional, e (4) os **estados de slot com múltiplos sinais** (cor + padrão + ícone + rótulo) cria identidade reconhecível. Nada depende de logo, gradiente ou glassmorphism. O momento "combinado" (check em chip clay) é uma assinatura visual própria.

## Component patterns

| Padrão | Descrição |
|---|---|
| `TimeSlot` | Retângulo 6–8px, trilha de horário mono à esquerda; estados conforme tabela acima (cor + padrão + ícone + rótulo) |
| `AvailabilityCalendar` | Lane temporal com faixas horárias; navegação por teclado (setas/roving tabindex); legenda de estados visível |
| `ProfessionalCard` | Foto placeholder rotulada + nome (Fraunces) + especialidade + faixa de preço (mono) + **próximo horário** em destaque + selo "demonstração" na avaliação |
| `ServiceCard` | Nome + descrição + preço/duração em mono + modalidade (ícone+rótulo) + status ativo/inativo |
| `BookingStepper` | 6 etapas; etapa atual sempre visível; resumo de preço/duração fixo |
| `BookingSummary` | Trilha de horário + serviço + profissional + local/modalidade + política de cancelamento + total (mono) |
| `AppointmentCard` | Trilha de horário + cliente + serviço + estado (confirmado/remarcado/cancelado/concluído) com ícone+rótulo |
| `DashboardMetric` | Rótulo mono uppercase + valor grande; receita/clientes marcados "estimado/demonstração" |
| `FilterPanel` | Painel lateral (desktop) / bottom sheet (mobile); grupos claros; contadores em mono |
| `EmptyState` / `ErrorState` / `LoadingState` | Ilustração-zero; ícone funcional + texto claro + ação de saída; skeleton em `--muted-surface` |
| `ProfessionalSidebar` | Navegação fixa do painel (Visão geral, Agenda, Serviços, Clientes, Perfil, Disponibilidade) com foco visível |

## Anti-patterns (rejeitar)

- Gradiente roxo-azul e paleta de fintech.
- Glassmorphism / backdrop-blur decorativo.
- Ícones genéricos em containers arredondados repetidos.
- Grade 3×3 de cards idênticos.
- Avaliações, números de mercado, depoimentos ou selos de segurança falsos.
- Estado de calendário comunicado **apenas** por cor.
- Animação decorativa no calendário; parallax; 3D; partículas.
- Headline vaga de marketing; superlativos sem evidência.
