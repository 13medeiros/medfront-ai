# Motion Language

> Criado na etapa **identity** e detalhado na etapa **signature**.
> Produto: **Combinado**.

## Core principle

O movimento comunica **mudança de disponibilidade e progresso do agendamento** — nunca decoração. Cada animação responde a uma pergunta do usuário: *"o que mudou nos horários?"*, *"em que etapa estou?"*, *"deu certo?"*. Se uma animação não responde a uma dessas perguntas, ela não existe.

## Personality

**Qualidades:** Preciso, calmo, confiante, direto. Sem bounce, sem spring exagerado, sem elasticidade. É o movimento de uma agenda sendo folheada por alguém organizado — objetivo e tranquilo.

**Metáfora:** Encaixar um horário. As transições "assentam" o conteúdo no lugar (settle), não o fazem quicar.

## Usos permitidos (e só estes)

Movimento é usado **apenas** para:

- transição entre etapas do agendamento;
- atualização de disponibilidade (recompute de slots);
- confirmação de horário ("combinado");
- feedback de ações (salvar, bloquear, remarcar, cancelar);
- abertura de detalhes (perfil, resumo, filtros);
- mudança de filtros (recomposição da lista);
- estados de carregamento (skeleton).

## Signature moments

### Momento principal — Disponibilidade que responde à escolha

**Onde:** Fluxo de agendamento e perfil do profissional (`AvailabilityCalendar`).

**Comportamento:** Ao mudar **serviço**, **modalidade**, **profissional** ou **data**, os slots recompõem-se de forma legível: os que deixam de ser compatíveis esmaecem/saem (crossfade + colapso curto), os novos compatíveis entram com um leve fade+rise (opacity + translateY 8px), em stagger suave por faixa de horário. O estado anterior **nunca some sem sinal** — há um skeleton de 120–200ms se o cálculo demorar. A intenção é deixar visível *como cada escolha afeta os horários*.

**Duração:** 180–260ms por recomposição; stagger 20–30ms entre slots (limitado, sem cascata longa).

**Fallback mobile:** Mesma lógica, stagger reduzido; recompute acontece sobre a lista de dia (não grade semanal).

**Fallback reduced-motion:** Troca instantânea dos slots; sem stagger, sem translate — apenas o conteúdo final. Um breve realce de foco indica que houve atualização.

### Momento secundário — Serviço atualiza o resumo

**Onde:** Seleção de serviço (perfil e etapa 1 do fluxo).

**Comportamento:** Ao escolher um serviço, **duração, preço, intervalo, localização** e **horários compatíveis** atualizam-se juntos. Os valores em mono fazem um crossfade curto (não contador rolante longo); o resumo (`BookingSummary`) reflete a mudança na mesma batida da atualização de slots.

**Duração:** 150–200ms crossfade.

**Fallback reduced-motion:** Atualização instantânea dos valores.

### Microinteração recorrente — Confirmar o horário ("combinado")

**Onde:** Seleção de slot e etapa de confirmação.

**Comportamento:** Ao travar um horário, o slot recebe a **marca de confirmação** (check em chip `--clay`): fade+scale sutil de 0.96→1 (sem overshoot) e um settle de 160ms. Na tela de confirmação, o `BookingSummary` faz um assentamento único que sinaliza "combinado".

**Duração:** 140–180ms.

**Fallback reduced-motion:** Estado confirmado aparece imediatamente, sem scale.

## Timing

**Microinteractions:** 120–200ms (hover, focus, toggle de filtro, seleção de slot).

**Component transitions:** 200–320ms (abertura de painel/bottom sheet, troca de etapa do stepper, recompute de lista).

**Narrative transitions:** não se aplicam — não há narrativa cinematográfica. Recomposições de disponibilidade ficam no teto de ~260ms.

## Easing

**Interaction easing:** `ease-out` — `[0, 0, 0.2, 1]` (entra rápido, assenta suave).

**Settle easing:** `[0.2, 0, 0, 1]` — deliberado, sem overshoot, para confirmações e recomposições.

**Proibido:** spring com bounce, `cubic-bezier` com overshoot, easings elásticos.

## Coordination

- A causa precede o efeito: a escolha (serviço/data) anima **antes** dos slots recomporem.
- Slots que saem esmaecem **antes** de os novos entrarem (evita "pulo" de layout).
- O resumo (`BookingSummary`) atualiza na **mesma batida** da disponibilidade.
- A confirmação é sempre o **último** movimento de uma sequência — nada anima depois do "combinado".
- No painel, feedback de ação (salvar/bloquear) é imediato e local; nada em cascata.

## Scroll behavior

- **Sem scroll-jacking, sem scroll storytelling, sem parallax.**
- Revelação de seções (lado cliente) por `IntersectionObserver`: opacity + translateY 12px, 400ms, uma vez. Puramente para suavizar entrada — o conteúdo é legível sem ela.
- O calendário **não** anima ao rolar; movimento nele só ocorre por escolha do usuário.

## Performance guidance

- Apenas `transform` e `opacity` para animação de layout.
- Recompute de disponibilidade deve parecer instantâneo: calcular em memória, animar só a diferença; `will-change: transform` apenas durante a transição, removido após.
- Skeleton de slots em `--muted-surface` para cargas > ~150ms.
- Lazy render da grade semanal do painel; virtualizar listas longas de clientes/agendamentos se necessário.
- Validar fluidez real em mobile (360–390px) antes de certificar.

## Reduced motion

**Experiência equivalente sob `prefers-reduced-motion: reduce` (e classe `.reduce-motion` togglable):**

- Recompute de disponibilidade: troca instantânea de slots, sem stagger/translate; realce de foco sinaliza atualização.
- Stepper: troca direta de etapa, sem slide.
- Confirmação: marca "combinado" aparece imediatamente, sem scale.
- Filtros/painéis: aparecem sem transição de entrada.
- Scroll reveals: desligados (conteúdo já visível).
- Nenhuma informação depende de movimento para ser compreendida.

## Patterns to avoid

- Parallax, scroll storytelling e cursor customizado.
- Animação cinematográfica, elementos flutuando, efeitos 3D.
- Excesso de movimento no calendário (cascatas longas, slots quicando).
- Contadores rolantes longos em preço/receita.
- Bounce / spring overshoot.
- Stagger idêntico global em toda a página.
- Spinners infinitos sem conteúdo alternativo (usar skeleton com contexto).
