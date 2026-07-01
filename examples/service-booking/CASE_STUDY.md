# Caso de Uso: Combinado — Agendamento para Profissionais Autônomos

> Exemplo oficial da metodologia [MedFront AI](https://github.com/13medeiros/medfront-ai)
> Caminho: `examples/autonomous-services-booking/`

Este caso exercita **três dimensões ao mesmo tempo**: **COMMERCE** (convencer o cliente a agendar), **UTILITY** (ajudar o autônomo a administrar a agenda) e **service design** (conectar seleção → disponibilidade → confiança → confirmação).

## Contexto

Profissionais autônomos (barbeiros, manicures, tatuadores, personal trainers, fotógrafos, professores, técnicos, consultores…) organizam a agenda no improviso e no WhatsApp. O **Combinado** dá a eles uma página de serviços com horários sempre no ar, e dá ao cliente a capacidade de descobrir, comparar e **marcar na hora** — sem trocar mensagem para confirmar.

## Problema

- **Profissional:** agenda manual, conflitos de horário, excesso de mensagens, dificuldade de divulgar e de acompanhar clientes/receita.
- **Cliente:** demora para resposta, dúvida sobre preço/disponibilidade, falta de confiança, necessidade de negociar detalhes por mensagem.

## Público

Dois lados: o **profissional autônomo** (não-técnico, quer organização e menos mensagens) e o **cliente** (consumidor comum, alta expectativa de fluidez). Ver `PRODUCT.md`.

## Modo de experiência

- **Primário — COMMERCE (lado cliente):** descoberta, comparação, desejo, confiança, conversão. O serviço é o protagonista; a disponibilidade é a prova.
- **Secundário — UTILITY (painel):** densidade legível para operação diária. Sem CINEMATIC — movimento serve à compreensão da disponibilidade, não à narrativa.

## Conceito central

> "Seu serviço disponível no momento em que o cliente decide agendar."

E a tensão que a interface torna honesta: **intenção do cliente × realidade da agenda**. O nome **Combinado** amarra tudo ao momento de conversão ("tá combinado").

## Decisões

| Decisão | Escolha | Motivo |
|---|---|---|
| Nome | **Combinado** | Liga-se à confirmação; proximidade + confiança; ownable |
| Arquitetura | 1 app Next.js, route groups `(cliente)`/`(painel)` | Design system coerente entre os dois lados; um deploy |
| Paleta | Quente cor de osso + acento clay | Distante de fintech/SaaS roxo-azul |
| Tipografia | Fraunces + Hanken Grotesk + IBM Plex Mono | Editorial humano + funcional + dados honestos |
| Interação central | Escolha de horário | O calendário é o produto |
| Dados | Simulados, tipados, substituíveis | Fronteira única em `src/data` |

## Arquitetura

```
src/
├── app/
│   ├── (cliente)/            # COMMERCE
│   │   ├── page.tsx          # Home
│   │   ├── buscar/           # Resultados + filtros
│   │   ├── profissional/[slug]
│   │   ├── agendar/[id]      # Fluxo (6 etapas)
│   │   └── confirmacao/[id]
│   ├── (painel)/painel/      # UTILITY
│   │   ├── page.tsx          # Visão geral
│   │   ├── agenda/ servicos/ clientes/ perfil/ disponibilidade/
│   ├── layout.tsx · globals.css · not-found.tsx
├── components/  ui/ · cliente/ · agendar/ · calendar/ · painel/
├── data/        professionals · appointments · clients · categories · index (seletores)
├── lib/         types · availability (motor) · format · demo (datas determinísticas)
└── hooks/       useReducedMotion · useMediaQuery
```

**Motor de disponibilidade (`lib/availability.ts`):** dado profissional + serviço + data, gera os slots do dia e seus estados a partir de janelas de trabalho, pausas, bloqueios, agendamentos existentes, antecedência mínima e buffer. Trocar o serviço (duração/intervalo) recompõe quais horários são `available` × `conflict` — é o momento principal, real e não decorativo.

## Fluxo de agendamento

Seis etapas com resumo fixo (preço, duração, local, política sempre visíveis):

1. **Serviço** (+ modalidade) → atualiza duração/preço/intervalo.
2. **Data** → `DateStrip` (radiogroup, setas).
3. **Horário** → `SlotGrid` recompõe com shimmer curto; estados honestos.
4. **Seus dados** → com/sem conta; validação e erros por campo.
5. **Revisão** → editar cada escolha; re-checagem de concorrência ("reservado por outra pessoa").
6. **Confirmação** → "Tá combinado!" + adicionar ao calendário (Google) + remarcar + cancelar.

## Decisões de confiança

- Preço, duração, local/modalidade e política **antes** de confirmar.
- Re-verificação do slot na confirmação → estado explícito de conflito com reoferta.
- Privacidade e suporte comunicados; pagamento combinado com o profissional.
- **Honestidade radical:** profissionais, clientes, avaliações e valores são fictícios e **rotulados "demonstração"**; fotos são placeholders identificados; sem números de mercado, depoimentos, selos ou parcerias.

## Decisões visuais

- Superfície quente `--bone` + acento `--clay`; motivo recorrente **trilha de horário** (mono) do slot ao card de compromisso.
- **8 estados de slot** com redundância não-cromática (cor + forma/padrão + ícone + rótulo + `aria`) — nunca só por cor.
- Marca de confirmação (check em chip clay) como assinatura do momento "combinado".
- Rejeitados: gradiente roxo-azul, glassmorphism, cards idênticos, ícones decorativos. Ver `IDENTITY.md`.

## Decisões de movimento

- Movimento só para: transição de etapa, atualização de disponibilidade, confirmação, feedback, abertura de detalhes, filtros, carregamento.
- Easing deliberado sem overshoot; apenas `transform`/`opacity`.
- Sem parallax, scroll storytelling, 3D ou cursor customizado.
- `prefers-reduced-motion`: recompute instantâneo, sem stagger/scale; conteúdo nunca depende de movimento. Ver `MOTION.md`.

## Decisões de responsividade

| Breakpoint | Comportamento |
|---|---|
| < 768px | Navegação inferior; filtros em bottom sheet; agenda semanal → lista vertical de dias; resumo fixo preservado |
| ≥ 768px | Resultados/serviços em 2 colunas; agenda semanal em grade |
| ≥ 1024px | Sidebar fixa do painel; resumo do agendamento sticky |

Mobile não é desktop encolhido: prioriza busca + agendamento; sem scroll horizontal (`overflow-x: hidden`).

## Estados implementados

~25 estados obrigatórios (cliente + painel) alcançáveis e testados — ver `QUALITY.md` e `INSPECTION_REPORT.md`. Inclui: vazio, carregando, erro, offline, conflito, reservado, férias, sem foto, sem descrição, sob consulta, cancelado, concluído, reagendamento, com/sem conta, datas distantes, textos longos.

## Problemas encontrados (inspect)

| ID | Sev | Finding | Correção |
|---|---|---|---|
| I-01 | P2 | Link "Continuar" desabilitado focalizável | `<button disabled>` condicional |
| I-02 | P3 | Estado "datas muito distantes" ausente | Indicador ao fim da `DateStrip` |
| I-03 | P3 | Slots só no cliente (SSR = skeleton) | Trade-off aceito e documentado |
| I-04 | P3 | Setas na grade navegam linearmente | Aceito (previsível/acessível) |
| I-05 | P2 | Loading/erro desigual cliente×painel | Componentes prontos; documentado |

**P0/P1 abertos:** nenhum.

## Correções realizadas

- Botão de continuar acessível (renderização condicional).
- Estado "datas muito distantes" adicionado.
- Foco visível unificado, `aria-live` na atualização de slots, toque ≥ 44px, reduced-motion completo.

## Limitações conhecidas

- Sem backend: dados simulados locais; alterações no painel são de estado local (não persistem). Fronteira única em `src/data` pronta para Supabase/Firebase/API.
- Disponibilidade recomputa no cliente (SSR mostra skeleton nos slots).
- **Screenshots dos 6 viewports não incluídas** — validação por composição + build + smoke test HTTP; capturar com `npm run dev` em `screenshots/`.
- Auditoria de acessibilidade automatizada (axe) recomendada como próximo passo.
- "Adicionar ao calendário" gera link do Google Calendar (funcional); demais integrações são demonstrativas.
- Conteúdo em português apenas.

## Pontuação final

**87/100** — experiência destacada (faixa 85–92). Breakdown em `QUALITY.md`.

**Certified:** ✅ sem P0/P1 abertos (ressalva: screenshots pendentes).

## Screenshots recomendadas

| Arquivo | Viewport | Conteúdo |
|---|---|---|
| `home-1440.png` | 1440×900 | Hero "Tá combinado." + busca |
| `resultados-1280.png` | 1280×800 | Lista + filtros |
| `perfil-slots-1280.png` | 1280×800 | Calendário com estados |
| `fluxo-horario-390.png` | 390×844 | Etapa horário no mobile |
| `confirmacao-768.png` | 768×1024 | "Tá combinado!" |
| `painel-visao-1440.png` | 1440×900 | Visão geral do painel |
| `painel-agenda-360.png` | 360×800 | Agenda semana → lista |

## Próximos passos

1. Capturar screenshots nos 6 viewports.
2. Auditoria axe + revisão de leitor de tela no calendário.
3. Substituir `src/data` por backend real (Supabase) mantendo a assinatura dos seletores.
4. Persistência de agendamentos e autenticação real.
5. Navegação 2D por teclado na grade de horários (refinamento).

## Como executar

```bash
cd examples/autonomous-services-booking
npm install
npm run dev   # http://localhost:3000
```

## Arquivos de memória

- [`PRODUCT.md`](./PRODUCT.md) — foundation → arquitetura da informação
- [`IDENTITY.md`](./IDENTITY.md) — gramática visual/verbal + estados do calendário
- [`MOTION.md`](./MOTION.md) — linguagem de movimento e signature moments
- [`QUALITY.md`](./QUALITY.md) — critérios, estados e certificação
- [`INSPECTION_REPORT.md`](./INSPECTION_REPORT.md) — findings P0–P3
