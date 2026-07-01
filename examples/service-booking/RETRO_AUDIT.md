# Auditoria Retroativa — Combinado

> Projeto criado **antes** dos módulos `chroma`, `benchmark`, `anti-slop` e `compare`.
> Esta auditoria os aplica retroativamente. **Nenhum código foi alterado.**
> Data: 2026-07-01. Metodologia: [MedFront AI](https://github.com/13medeiros/medfront-ai) (versão com workflow de 18 etapas).

---

## 1. `chroma` — Color Score: **75/100** (certifica no piso ≥75, com achados)

### Contrastes medidos (WCAG, fundo `--bone #F6F1E9`)

| Par | Ratio | Veredito |
|---|---|---|
| `ink` / bone | 14.91 | AA ✅ |
| `ink-soft` / bone | 6.54 | AA ✅ |
| `clay-deep` / bone | 6.53 | AA ✅ |
| `alert` / bone | 6.61 | AA ✅ |
| **`bone-raised` / `clay` — texto do CTA primário** | **4.32** | ❌ abaixo de 4.5 (AA texto normal) |
| `sage` / bone — texto "próximo horário" | 4.44 | só AA-large |
| `clay` / bone — texto | 4.00 | só AA-large |
| `amber` / bone — texto | 3.03 | só gráfico/large |

### Breakdown

| Critério | Peso | Nota | Evidência |
|---|---|---|---|
| Harmonia | 20 | 16 | Base análoga quente + sage frio; harmônica, mas `clay` e `amber` quase no mesmo matiz. |
| Contraste/legibilidade | 20 | 14 | CTA 4.32 falha AA normal (`Button.tsx`, `text-sm` sobre `--clay`); sage/clay/amber como texto só AA-large. |
| Papéis semânticos | 15 | 9 | `--clay` acumula **marca + seleção + foco** (`globals.css`, `TimeSlot`, CTA). Módulo exige separá-los. |
| Distribuição/equilíbrio | 15 | 12 | Neutro-dominante correto. |
| Coerência de identidade | 15 | 13 | Forte, ownable. |
| Acessibilidade de estado | 10 | 9 | Estados nunca só por cor (ícone+padrão+rótulo+`aria`). |
| Consistência claro/escuro | 5 | 2 | Não há dark mode. |
| **Total** | 100 | **75** | |

**Combinações proibidas identificadas:** `clay` como texto pequeno sobre bone; `amber`/`sage` como texto pequeno.

---

## 2. `anti-slop` — Slop Score: **≈24/100** (dentro da meta ≤30 — "alguns padrões genéricos")

| Sinal | Contribuição | Evidência |
|---|---|---|
| Grades de cards idênticos | +8 | Home: categorias (7), como-funciona (3), recomendados — mesmo shell |
| Shell de card uniforme | +6 | `rounded-xl/2xl border border-line bg-bone-raised` em quase tudo |
| Reveal uniforme | +4 | `Reveal` igual em todas as seções da home |
| Section header genérico | +3 | "eyebrow mono uppercase + título serif" |
| Ícones sem forte direção de arte | +3 | Conjunto de linha tipo lucide |
| Ausentes (bom) | 0 | Sem roxo-azul, glassmorphism, orbs, stock, métricas/depoimentos falsos |

Honestidade ("demonstração"), estados ricos e ausência de clichês seguram o score fora da faixa de slop grave.

---

## 3. `benchmark` — medições reais (Lighthouse)

**Ambiente:** Lighthouse 12 · Chrome headless · form-factor desktop · build de produção (`next start`) em `http://localhost:3311/` · 2026-07-01.
**Comando:** `npx lighthouse@12 http://localhost:3311/ --only-categories=performance,accessibility,best-practices,seo --form-factor=desktop --screenEmulation.disabled`

| Métrica | Resultado | Meta | Status |
|---|---|---|---|
| Performance | **71** | ≥80 | ❌ |
| Accessibility | **88** | ≥90 | ❌ |
| Best Practices | 96 | — | ✅ |
| SEO | 100 | — | ✅ |
| LCP | 2.7 s | <2.5 s | ❌ (marginal) |
| CLS | 0 | <0.1 | ✅ |
| TBT | 180 ms | — | ✅ |
| Peso total | 296 KiB | — | ✅ |

**Falhas específicas (evidência do próprio Lighthouse):**
- *"Background and foreground colors do not have a sufficient contrast ratio"* → corrobora o achado do `chroma`.
- *"List items (`<li>`) are not contained within `<ul>`/`<ol>`/`<menu>`"* → **bug real**: a home envolve cada `<li>` num `<Reveal>` (`<ol>`→`<div>`→`<li>`). Meu `inspect` original não pegou.
- LCP = subheadline do hero (texto esperando swap de fonte) → **3 famílias de fonte** penalizam o LCP.

> Nenhum valor foi inventado; medição reproduzível pelo comando acima.

---

## 4–5. `compare` — Combinado × Auditoria de Atendimentos: convergências

| Dimensão | Convergência | Classificação |
|---|---|---|
| Tipografia | Serif display + sans + **IBM Plex Mono** (mono idêntico) | Mono p/ dados = **adequada**; serif display + Plex Mono = **herdada** |
| Paleta | Papel quente + **âmbar** + **verde teal** + **vermelho-quente** (mesmos papéis) | Tríade semântica = **herdada**; brand clay = própria |
| Geometria | Retângulo editorial de raio pequeno + "trilho/margem" | Trilha de horário = **adequada**; instinto = **herdada** |
| Bordas | Linhas 1px quentes como separador principal | **Herdada** |
| Densidade | Divergiu (painel denso) | **Adequada** |
| Composição | Grid assimétrico editorial | Convergente, mas **adequada** |
| Microinterações | Mesmo `Reveal`, mesma filosofia de easing | Filosofia adequada; componente **herdado** |
| Linguagem visual | "Editorial quente anti-SaaS" | **Parcialmente induzida pela metodologia** (não só herança) |

### Classificação das decisões

- ✅ **Adequadas ao produto:** mono p/ horários/preços/durações; motivo da trilha de horário; 8 estados de slot não-cromáticos; base clara e quente; navegação inferior; stepper; densidade do painel.
- ⚠️ **Genéricas:** grades de cards idênticos; shell de card uniforme; Reveal uniforme; section header eyebrow+serif; ícones de linha padrão.
- ⛔ **Herdadas do outro projeto:** IBM Plex Mono; serif como display; tríade âmbar/verde/vermelho; linhas 1px; easing/`Reveal`; `<details>` "Estados (QA)"; rótulo "demonstração".

---

## 6. Três direções propostas (nenhuma implementada)

**Preservar em todas:** motor de disponibilidade, calendário de 8 estados, fluxo de 6 etapas, arquitetura de dois lados, camada de dados substituível, honestidade "demonstração", reduced-motion, navegação inferior, stepper. Crítica é de **pele visual**, não de ossatura.

- **Direção 1 — "Vizinhança":** grotesca humanista única (sem serif); rebrand fora do eixo laranja; mono diferente do Plex; card por contexto. Máximo equilíbrio.
- **Direção 2 — "Marca de serviço":** cor de marca saturada ownable, display com caráter, slot-chip como device. Máxima diferenciação/conversão, menos calor.
- **Direção 3 — "Utilitário calmo":** quase monocromático + 1 acento, densidade maior, tipografia de escaneamento. Ótimo p/ ease/utility, fraco em desejo.

### Recomendação: **Direção 1 "Vizinhança"**

| Critério | Dir. 1 | Dir. 2 | Dir. 3 |
|---|---|---|---|
| Proximidade | ●●● | ●● | ●● |
| Confiança | ●●● | ●●○ | ●●● |
| Facilidade | ●●● | ●●● | ●●● |
| Conversão | ●●○ | ●●● | ●● |
| Utilidade | ●●● | ●●○ | ●●● |
| Diferenciação | ●●○ | ●●● | ●○ |

### Proposta de tokens — Direção 1 (contrastes medidos, fundo `--canvas #F3EFE7`)

| Token | Valor | Papel | Contraste |
|---|---|---|---|
| `--canvas` | `#F3EFE7` | Fundo | — |
| `--surface` | `#FBF8F2` | Cards | ink 15.33 ✅ |
| `--ink` | `#232019` | Texto | 14.17 ✅ |
| `--ink-soft` | `#5A544A` | Texto 2º | 6.54 ✅ |
| `--brand` | `#A8451E` | **Marca/CTA/link** | CTA `canvas/brand` **5.18 ✅** (resolve o 4.32) |
| `--brand-strong` | `#87381A` | Hover | 7.01 ✅ |
| `--available` | `#2E7D57` | Disponível/sucesso | btn 4.73 ✅ |
| `--selected` | `#232019` (fill ink) | **Seleção** (chip escuro) | texto 14.17 ✅ — distinto do brand |
| `--attention` | `#A9761C` | Última vaga | 3.46 (gráfico/large) |
| `--alert` | `#A32A22` | Erro/conflito | 6.29 ✅ |
| **Foco** | anel `--ink` 2px + offset | **Foco** | 15.33 ✅ — neutro, distinto de brand/seleção |

**Papéis separados (correção do `--clay` tríplice):** marca = terracota; seleção = chip ink escuro; foco = anel ink neutro; disponível = verde; atenção = âmbar. Cinco papéis distinguíveis.
**Tipografia:** grotesca humanista única (display+corpo) para cortar o tique serif; mono **diferente** do IBM Plex (ex.: Spline Sans Mono) só para horários/preços.

---

## 7. Correções priorizadas (para quando o código for autorizado)

| # | Sev | Achado | Correção |
|---|---|---|---|
| R-01 | P2 | CTA `bone-raised/clay = 4.32` < AA | brand `#A8451E` (5.18) ou texto mais claro |
| R-02 | P2 | `<ol>`→`<Reveal div>`→`<li>` (Lighthouse) | Reveal envolve a `<ol>`, ou `<li>` como filho direto |
| R-03 | P2 | `--clay` = marca+seleção+foco | separar papéis (tabela acima) |
| R-04 | P3 | Grades de cards idênticos / shell uniforme | variar tratamento por contexto |
| R-05 | P3 | Reveal uniforme / LCP por 3 fontes | reduzir a 1–2 famílias; reveal seletivo |
| R-06 | P3 | Sem dark mode (Color Score 2/5) | definir superfícies escuras equivalentes |

**Metas a bater na re-certificação:** Color Score ≥75 (subir de 75), Slop ≤30 (já ok, reduzir), Performance ≥80, Accessibility ≥90.

---

## 8. Re-run pós aplicação da Direção 1 "Vizinhança" (2026-07-01)

Reskin aplicado **sem refazer a aplicação** (só tipografia, paleta, superfícies, geometria, hierarquia e elementos de disponibilidade/agendamento). Fluxos, arquitetura, motor de disponibilidade e sistema de estados **preservados**.

**Mudanças:** tipografia → Bricolage Grotesque (única) + Spline Sans Mono (corta serif + IBM Plex Mono herdados; 3→2 famílias); paleta → Direção 1 (tabela em `IDENTITY.md`); seleção de slot/data → chip **ink**; foco → anel **ink** neutro; superfície de agendamento diferenciada; R-01/R-02/R-03 corrigidos.

| Módulo | Antes | Depois | Evidência |
|---|---|---|---|
| **chroma** (Color Score) | 75/100 | **≈84/100** | Contraste: CTA 5.18, clay-texto 5.18, sage 4.92, amber(texto) 5.4 — todos AA; papéis marca/seleção/foco separados |
| **anti-slop** (Slop Score) | ≈24 | **≈19** | Cortados o tique serif e a herança IBM Plex Mono; restam grades de card/Reveal (fora do escopo desta rodada) |
| **compare** (convergência) | alta | **materialmente menor** | Heranças mais literais (serif display + Plex Mono) **eliminadas**; marca agora terracota distinta do "mark" âmbar do audit; seleção ink ≠ marca |
| **benchmark** (Lighthouse) | Perf 71 · A11y 88 | **Perf 72–79 · A11y 100** · BP 96 · SEO 100 | A11y: contraste ✅ e markup de lista ✅ resolvidos; LCP 2.6s (font-bound); CLS 0 |
| **inspect** | 2 achados novos | **resolvidos** | R-02 (lista) e contraste sumiram; build limpo; smoke 200 |

**Pendências P3 (fora do escopo pedido):** Performance <80 (LCP limitado pelo swap de web font — self-host/preload resolveria); sem dark mode (Color Score 2/5); grades de card idênticos e Reveal uniforme (redução exigiria mexer além da "pele"). 
