# Product Context

> Caso de uso oficial da metodologia [MedFront AI](https://github.com/13medeiros/medfront-ai)
> Caminho: `examples/autonomous-services-booking/`
> Etapas concluídas neste documento: **foundation**, **reference**, **direction** (e ponteiro para **identity**).

## Product

**Name:** Combinado (definido na etapa `direction`; substitui o provisório "LivreAgenda")

**One-sentence description:** Plataforma onde profissionais autônomos publicam seus serviços e horários disponíveis, e clientes descobrem, comparam e agendam — escolhendo o horário na hora, sem precisar negociar por mensagem.

## Audience

**Primary audience:** Dois lados complementares.

1. **Profissional autônomo** (barbeiro, manicure, cabeleireiro, tatuador, fotógrafo, personal trainer, professor, massagista, técnico, consultor e outros prestadores). Precisa organizar a agenda, divulgar serviços e reduzir a fricção de mensagens.
2. **Cliente final** — quer encontrar, comparar e agendar um serviço com rapidez e confiança, sem depender de conversa manual por WhatsApp.

**Primary job to be done:**

- Profissional: *"Deixe minha disponibilidade sempre visível e organizada, e converta interesse em agendamento confirmado sem eu precisar responder mensagem a mensagem."*
- Cliente: *"Deixe eu ver quem atende o que eu preciso, quanto custa, quando tem horário — e reservar na hora, com segurança."*

**User knowledge level:** Misto e cotidiano. O profissional entende do seu ofício, não necessariamente de software — a curva de configuração precisa ser baixa. O cliente é um consumidor comum acostumado a apps de consumo (iFood, Uber, marketplaces), com expectativa alta de fluidez e baixa tolerância a fricção. Nenhum dos dois é usuário técnico.

## Goals

**Business goal:** Servir como caso de uso oficial do MedFront AI que exercita **três dimensões simultâneas** — COMMERCE (convencer o cliente a agendar), UTILITY (ajudar o autônomo a administrar a agenda) e SERVICE DESIGN (conectar seleção → disponibilidade → confiança → confirmação). Demonstrar que a metodologia produz um sistema coerente de dois lados, não uma tela isolada.

**User goal:**

- Cliente: sair de "quero um serviço" para "está agendado" com o menor número de decisões e zero mensagens.
- Profissional: sair de "agenda bagunçada e cheia de mensagens" para "agenda organizada que se preenche sozinha".

**Primary conversion or task:** A **confirmação de um agendamento** (lado cliente). A tarefa-espelho no lado profissional é **manter disponibilidade e serviços configurados** para que a conversão aconteça.

## Experience mode

**Primary mode:** `COMMERCE`

**Secondary mode:** `UTILITY`

**Why:** A jornada do cliente é essencialmente comercial — descoberta, comparação, desejo, confiança e conversão (COMMERCE): o serviço é o protagonista e a disponibilidade é a prova. Já o painel do profissional é uma ferramenta de uso frequente, densa em informação e voltada à operação diária (UTILITY): eficiência, clareza e controle acima de espetáculo. As duas metades compartilham a mesma gramática visual, mas invertem a prioridade: no cliente, **desejo com confiança**; no profissional, **densidade com calma**. Não há modo CINEMATIC — o movimento serve à compreensão da disponibilidade, nunca à narrativa dramática.

## Desired perception

**The experience should feel:**

- **Próxima** — fala a língua do cliente ("marcar horário", "tem vaga?"), não o jargão de SaaS.
- **Profissional** — transmite que o autônomo do outro lado é sério e organizado.
- **Simples** — cada etapa tem uma decisão clara; nada compete pela atenção.
- **Confiável** — preço, duração, local e política de cancelamento sempre visíveis antes de confirmar.
- **Autônoma** — o cliente resolve sozinho; o profissional controla sua própria agenda.
- **Organizada** — a disponibilidade é a estrela; o calendário é legível e honesto.

**The experience must not feel:**

- Estética bancária / fintech fria.
- Corporativa demais ou "enterprise".
- SaaS genérico com gradiente roxo-azul e glassmorphism.
- Uma grade infinita de cards idênticos.
- Cheia de ícones decorativos sem função.
- Página visualmente fria e distante.
- Gamificada, com animação decorativa ou texto vago ("revolucione seus agendamentos").

## Content

**Available real content:**

- Estrutura de serviços (nome, descrição, preço, duração, intervalo, modalidade).
- Categorias plausíveis: beleza, bem-estar, saúde, aulas, serviços técnicos, fotografia, consultoria.
- Lógica de disponibilidade (dias, horários, pausas, exceções, antecedência, limites).
- Fluxo de agendamento em 6 etapas.
- Métricas operacionais descritivas do painel (agendamentos do dia, próximos horários, receita **estimada**, cancelamentos).

**Missing content (será simulado e marcado como demonstração):**

- Profissionais, clientes e avaliações — todos **fictícios**, rotulados como demonstração.
- Fotos reais — usar placeholders claramente identificados.
- Números de mercado, depoimentos, selos e parcerias — **não usar**.

**Claims requiring evidence (proibido inventar):**

- Profissionais ou clientes reais — **não usar**.
- Avaliações e depoimentos reais — **não usar** (avaliações fictícias sempre rotuladas "demonstração").
- Números de mercado, % de conversão, ROI — **não usar**.
- Selos de segurança e parcerias — **não usar**.

## Constraints

**Framework and stack:** Next.js + TypeScript + Tailwind CSS + Motion (`motion/react`). Componentes reutilizáveis. Camada de **dados simulados locais** desenhada para ser substituível por Supabase/Firebase/API própria no futuro. **Sem backend real** nesta versão. Biblioteca de calendário só se necessária e justificada — preferência por implementação própria com HTML semântico.

**Browser and device requirements:** Navegadores modernos; viewports 360×800 a 1920×1080.

**Accessibility requirements:** HTML semântico, navegação por teclado, foco visível, labels corretos, contraste WCAG AA, áreas de toque adequadas, **calendário acessível**, estados **nunca comunicados só por cor**, `prefers-reduced-motion`, mensagens de erro claras.

**Performance budget:** Animações via `transform`/`opacity`; sem WebGL/3D; recomputo de disponibilidade barato o suficiente para parecer instantâneo; lazy render de painéis pesados.

**Deadline or scope limits:** Caso de uso demonstrativo de dois lados (customer-experience + professional-dashboard). Todos os estados (loading/erro/vazio/extremos) simulados. Sem pagamento real, sem autenticação real.

## Success criteria

- [ ] O cliente entende o valor e sabe como agendar em menos de 10s na home.
- [ ] O fluxo de agendamento sempre mostra etapa atual, preço, duração, local e regras.
- [ ] O calendário comunica todos os estados **sem depender só de cor**.
- [ ] Trocar serviço/modalidade/profissional/data atualiza a disponibilidade de forma clara.
- [ ] O painel do profissional permite gerir agenda, serviços, clientes, perfil e disponibilidade.
- [ ] Todos os estados obrigatórios (ver QUALITY.md) implementados e testados.
- [ ] Nenhum dado fictício sem rótulo "demonstração".
- [ ] Navegação por teclado e `prefers-reduced-motion` funcionais.
- [ ] Validado nos 6 viewports; sem overflow horizontal.
- [ ] Mobile prioriza busca + agendamento; CTA de agendar sempre acessível.

---

## Etapa: foundation

**Data:** 2026-07-01

**Audiência e intenção:** Produto de dois lados. Cliente (COMMERCE) quer descobrir, comparar e agendar sem fricção; profissional (UTILITY) quer organizar a agenda e converter interesse em agendamento sem excesso de mensagens. Ambos são não-técnicos e cotidianos.

**Metas de negócio e experiência:** Caso de uso oficial que prova a metodologia MedFront AI em três dimensões (COMMERCE + UTILITY + SERVICE DESIGN). Conversão-alvo: confirmação de agendamento.

**Modo de experiência:** COMMERCE (primário, lado cliente) + UTILITY (secundário, painel do profissional). Sem CINEMATIC.

**Restrições:** Next.js/TS/Tailwind/Motion; dados simulados locais substituíveis; sem backend; anti-padrões de SaaS genérico; sem dados falsos não rotulados; acessibilidade e responsividade obrigatórias.

**Critérios de sucesso:** lista acima.

**Arquivos iniciais criados nesta etapa:** este `PRODUCT.md` e `QUALITY.md`.

**Conceito central (âncora):** *"Seu serviço disponível no momento em que o cliente decide agendar."*

---

## Etapa: reference

> Princípios transferíveis extraídos de experiências notáveis — **não** cópia de layout, marca ou interação.

| Referência (classe) | Princípio extraído | O que NÃO copiar |
|---|---|---|
| Marketplaces de serviço (booking / marcação) | Card de resultado que resolve a decisão na própria lista: preço, próximo horário e prova de confiança juntos | Grade infinita de cards idênticos; excesso de badges |
| Apps de reserva (restaurante/consulta) | Seletor de horário como interação principal; disponibilidade que reage a cada escolha | Calendário genérico só com cor; slots sem contexto de duração/preço |
| Ferramentas de agenda (calendar apps profissionais) | Densidade legível: dia/semana, bloqueios, intervalos comunicados com clareza | Estética corporativa fria; grades pesadas no mobile |
| Checkout premium de e-commerce | Stepper honesto: sempre sei em que etapa estou, o que custa e o que falta | Upsell agressivo; esconder custo até o fim |
| Sistemas de identidade fortes (marcas de serviço local) | Calor + profissionalismo; tipografia com personalidade sem ser decorativa | Ilustração fofa demais; tom infantil |

**Emoção e posicionamento:** Proximidade profissional. Nem frio (banco/fintech), nem informal demais (gíria total). O ponto de equilíbrio é "o profissional de confiança do seu bairro, mas organizado como um bom sistema".

**Composição e tipografia:** Layout que respira, com a disponibilidade como herói. Tipografia com uma display de caráter humano + sans utilitária legível + mono só para dados de agenda (horários, durações, preços) — reforçando a leitura de "sistema honesto".

**Ritmo e movimento:** Movimento a serviço da compreensão da disponibilidade — atualização de slots, transição de etapa, confirmação. Nada cinematográfico, nada decorativo.

**Modelo de interação:** Seleção de horário como gesto central. Cada escolha (serviço, modalidade, profissional, data) recalcula visivelmente os horários compatíveis. No painel, manipulação direta da agenda (bloquear, remarcar, criar).

**Direção de mídia:** UI simulada com dados plausíveis e rotulados; placeholders de foto explícitos; nenhuma stock photo genérica; superfícies limpas que valorizam informação.

**Momento memorável:** O instante em que o cliente escolhe um serviço e vê a agenda "acender" com os horários realmente compatíveis — e depois trava um horário e recebe a confirmação completa (preço, duração, local, política).

**Anti-padrões identificados (rejeitar):** gradiente roxo-azul; glassmorphism; cards idênticos repetidos; ícones genéricos em quadrados arredondados; páginas frias; avaliações/números falsos; parallax e efeitos 3D; animação decorativa no calendário; texto vago de marketing.

---

## Etapa: direction

**Nome definido:** **Combinado**. Escolhido por amarrar-se ao momento de conversão (confirmação = "tá combinado"), transmitir proximidade e confiança (evitando frieza de SaaS) e ser ownable na linguagem real do público brasileiro. Substitui o provisório "LivreAgenda".

**Conceito central:** *"Seu serviço disponível no momento em que o cliente decide agendar."* Traduzido em interface: **a disponibilidade é a prova e o produto** — tudo converge para um horário que se pode travar com confiança.

**Tensão visual central:** **Intenção do cliente vs. realidade da agenda.** O cliente quer "qualquer hora que sirva"; a agenda tem regras (duração, intervalo, expediente, bloqueios). A interface torna essa negociação visível e honesta em vez de escondê-la atrás de mensagens.

### Arquitetura do produto (dois lados)

**Lado A — Experiência do cliente (COMMERCE):**

1. **Home** — buscar serviço/profissional, localização, categorias, recomendados (demonstração), agendamentos recentes, "como funciona".
2. **Resultados** — lista com foto (placeholder), nome, especialidade, localização, faixa de preço, avaliação de demonstração, **próximo horário disponível**, serviços principais, filtros.
3. **Perfil do profissional** — descrição, serviços/preços/duração, modalidade, políticas, disponibilidade, avaliações de demonstração, FAQ, CTA de agendar.
4. **Fluxo de agendamento (6 etapas)** — serviço → data → horário → dados → revisão → confirmação. Sempre visível: etapa, preço, duração, local, regras.
5. **Confirmação** — resumo completo + adicionar ao calendário + remarcar + cancelar.

**Lado B — Painel do profissional (UTILITY):**

1. **Visão geral** — agendamentos do dia, próximos horários, receita estimada, novos clientes, cancelamentos, serviços mais agendados, alertas.
2. **Agenda** — dia/semana, bloqueio, criação manual, reagendamento, cancelamento, intervalos, visão por serviço.
3. **Serviços** — CRUD (nome, descrição, preço, duração, intervalo, modalidade, disponibilidade, status).
4. **Clientes** — histórico, último serviço, frequência, observações, cancelamentos, valor total (demonstrativo).
5. **Perfil público** — nome, foto, bio, localização, formas de atendimento, redes, políticas, cores básicas, links.
6. **Disponibilidade** — dias/horários, pausas, férias, exceções, antecedência mínima, limite de agendamentos, intervalo entre serviços.

### Hierarquia de informação

**Lado cliente:** (1) o que preciso agendar → (2) quem atende + quando tem vaga → (3) prova de confiança (preço, política, avaliação de demonstração) → (4) travar o horário → (5) confirmação.

**Lado profissional:** (1) o que acontece hoje → (2) o que preciso resolver (alertas, próximos) → (3) gestão (agenda, serviços, disponibilidade) → (4) relacionamento (clientes, perfil).

### Interação central e momentos

- **Interação principal:** a **escolha de horário**. O calendário/seletor comunica claramente: disponível, indisponível, selecionado, quase esgotado, conflito, bloqueado, fora do expediente — **nunca só por cor** (ícone, padrão, rótulo e texto acessível acompanham).
- **Momento principal:** a disponibilidade se atualiza de forma legível quando o cliente muda serviço / modalidade / profissional / data — deixando visível como cada escolha afeta os horários.
- **Momento secundário:** ao selecionar um serviço, a página atualiza duração, preço, intervalo, localização e horários compatíveis.
- **Microinteração recorrente:** confirmação de um slot (travar horário) com feedback tátil-visual claro.

### Estratégia de responsividade (mobile ≠ desktop encolhido)

No mobile: prioriza busca + agendamento; navegação inferior quando fizer sentido; CTA de agendar sempre acessível; filtros viram painel; agenda semanal vira visão adequada ao toque; sem rolagem horizontal; resumo de preço/duração preservado; seleção de data/horário facilitada.

### Riscos e trade-offs

| Risco | Mitigação |
|---|---|
| Calendário comunicar estados só por cor | Ícone + padrão + rótulo textual + `aria` para cada estado |
| Recompute de disponibilidade parecer lento/confuso | Transição curta (150–250ms) + skeleton de slots; estado anterior nunca "some" sem sinal |
| Fluxo de 6 etapas cansar no mobile | Stepper enxuto, resumo fixo de preço/duração, uma decisão por tela |
| Conflito de horário (slot reservado por outro) | Estado explícito "horário reservado por outro usuário" + reoferta de horários próximos |
| Painel do profissional virar SaaS frio | Mesma identidade calorosa do lado cliente; densidade com respiro, sem grade azul |
| Dados fictícios parecerem reais | Rótulo "demonstração" persistente em avaliações, receita e clientes |
| Agenda semanal quebrar no toque | Vira lista/dia rolável verticalmente no mobile, sem scroll horizontal |

---

## Etapa: identity

Ver [`IDENTITY.md`](./IDENTITY.md) — gramática visual e verbal completa (geometria, tipografia, paleta, estados do calendário, identidade verbal e teste de reconhecimento). Criado nesta etapa.

---

## Etapa: signature

Detalhamento em [`MOTION.md`](./MOTION.md). Resumo:

- **Momento principal:** disponibilidade que responde à escolha — mudar serviço/modalidade/profissional/data recompõe os slots compatíveis de forma legível.
- **Momento secundário:** ao escolher um serviço, duração, preço, intervalo, localização e horários compatíveis atualizam juntos no `BookingSummary`.
- **Microinteração recorrente:** confirmar um horário ("combinado") — marca de confirmação (check em chip `--clay`), o último movimento de qualquer sequência.

Cada momento expressa o conceito central: *a disponibilidade é a prova e o produto*.

---

## Etapa: sequence

Como o modo é COMMERCE + UTILITY (não CINEMATIC), a experiência é um **funil honesto**, não uma narrativa dramática. "Cenas" só onde a progressão ajuda a entender.

**Lado cliente (funil):**

| Cena | Intensidade | Papel |
|---|---|---|
| Home | Baixa | Orientação: buscar, categorias, como funciona |
| Resultados | Média | Comparação: quem atende + quando tem vaga |
| Perfil | Média-alta | Confiança: serviços, preços, políticas, avaliações (demo) |
| Fluxo (6 etapas) | Alta (foco) | Decisão: uma escolha por tela, resumo sempre visível |
| Confirmação | Repouso | Recompensa: "combinado" + próximos passos |

**Lado profissional (uso frequente, sem funil):** ritmo plano e denso — a "cena" é o **hoje** (Visão geral). Nada dramático; tudo a um clique. Transições curtas de troca de aba, sem storytelling.

**Transições:** fade + translateY curto (≤12px) entre seções do lado cliente; troca direta de aba no painel. Sem scroll-jacking. Ver `MOTION.md`.

---

## Etapa: arquitetura da informação

**Decisão de arquitetura:** um **único app Next.js** (não dois apps separados), com o design system compartilhado exigido pelo `IDENTITY.md` (coerência entre os dois lados). As duas experiências vivem em **route groups**. Isso substitui a ideia de pastas `customer-experience/` e `professional-dashboard/` irmãs — mantém uma base coerente, um deploy, zero duplicação de tokens/componentes.

```
examples/autonomous-services-booking/
├── src/
│   ├── app/
│   │   ├── (cliente)/            # Experiência do cliente (COMMERCE)
│   │   │   ├── page.tsx          # Home
│   │   │   ├── buscar/           # Resultados + filtros
│   │   │   ├── profissional/[id] # Perfil do profissional
│   │   │   ├── agendar/[id]      # Fluxo de agendamento (6 etapas)
│   │   │   └── confirmacao/[id]  # Confirmação
│   │   ├── (painel)/painel/      # Painel do profissional (UTILITY)
│   │   │   ├── page.tsx          # Visão geral
│   │   │   ├── agenda/           # Agenda dia/semana
│   │   │   ├── servicos/         # CRUD de serviços
│   │   │   ├── clientes/         # Clientes
│   │   │   ├── perfil/           # Perfil público
│   │   │   └── disponibilidade/  # Disponibilidade
│   │   ├── layout.tsx            # Fontes, metadata, skip link
│   │   ├── globals.css           # Tokens da identidade
│   │   └── not-found.tsx
│   ├── components/               # ui/, cliente/, painel/, calendar/
│   ├── data/                     # Camada de dados simulados (substituível)
│   ├── lib/                      # availability engine, formatação, tipos
│   └── hooks/                    # useReducedMotion, useMediaQuery, useInView
├── PRODUCT.md · IDENTITY.md · MOTION.md · QUALITY.md
├── CASE_STUDY.md · INSPECTION_REPORT.md · README.md
└── screenshots/
```

**Rotas (cliente):** `/` → `/buscar` → `/profissional/[id]` → `/agendar/[id]` → `/confirmacao/[id]`.
**Rotas (painel):** `/painel`, `/painel/agenda`, `/painel/servicos`, `/painel/clientes`, `/painel/perfil`, `/painel/disponibilidade`.

---

## Etapas seguintes

build (cliente) → build (fluxo) → build (painel) → `reflow` → `motion` → `inspect` → `reinforce` → `simplify`/`calm` → `tune` → `certify`. Logs em `QUALITY.md` e `INSPECTION_REPORT.md`.
