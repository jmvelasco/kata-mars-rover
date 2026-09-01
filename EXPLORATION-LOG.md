# 🛸 Mars Rover Kata — Registro de exploración

> **Qué es este archivo.** Volcado íntegro de todo lo que el agente aportó en el chat desde el arranque de `/opsx-explore` hasta la creación de la propuesta OpenSpec `add-mars-rover`. Se conserva en español porque reproduce respuestas conversacionales (`CLAUDE.md` mantiene el español solo para el chat; el código y los artefactos del repo van en inglés).
>
> ⚠️ **Aviso de reglas.** La *Documentation Retention Rule* de `CLAUDE.md` desaconseja conservar documentación que sea únicamente registro histórico de planificación o rastro de ejecución. Este archivo lo es. La fuente de verdad para implementar es `openspec/changes/add-mars-rover/`. Recomendación: excluirlo de git, igual que ya se hace con `CLAUDE.md`, `.claude/` y `openspec/config.yaml`.

---

## Índice

- [Fase 0 — Contexto de arranque](#fase-0--contexto-de-arranque)
- [Fase 1 — Exploración inicial](#fase-1--exploración-inicial)
  - [1.1 Punto de partida real](#11-punto-de-partida-real)
  - [1.2 Lectura literal del enunciado](#12-lectura-literal-del-enunciado)
  - [1.3 El espacio del problema, dibujado](#13-el-espacio-del-problema-dibujado)
  - [1.4 Hilos de diseño](#14-hilos-de-diseño)
  - [1.5 Lista de casos (paso REASON)](#15-lista-de-casos-paso-reason)
  - [1.6 Riesgos identificados](#16-riesgos-identificados)
  - [1.7 Ronda de decisiones 1](#17-ronda-de-decisiones-1)
- [Fase 2 — Cierre de hilos abiertos](#fase-2--cierre-de-hilos-abiertos)
  - [2.1 Descubrimiento: en una malla esférica no existe "fuera"](#21-descubrimiento-en-una-malla-esférica-no-existe-fuera)
  - [2.2 Ronda de decisiones 2](#22-ronda-de-decisiones-2)
- [Fase 3 — Ficha consolidada](#fase-3--ficha-consolidada)
- [Fase 4 — Propuesta OpenSpec](#fase-4--propuesta-openspec)

---

## Fase 0 — Contexto de arranque

**Comando:** `/opsx-explore` — *"lee «## 🎯 Enunciado de la Kata» de Readme.md y explora una solución. No tienes permitido mirar el histórico del repositorio."*

**Rol asumido:** Navigator (pensar, no implementar). Tech Lead: el usuario.

**Reglas cargadas:**

- 🏛️ `.claude/skills/backend-hexagonal/SKILL.md` — leída **antes** de cualquier discusión de arquitectura de `src/core` (obligatorio por `CLAUDE.md`).
- 🔴🟢🔵 `.claude/rules/tdd.md` + `xp-methodology.md` — el entregable natural de un explore para una kata es la lista de casos del paso REASON.
- ✂️ `coding-standards.md` (CQS, Tell-Don't-Ask, modelos ricos, YAGNI) y `testing-standards.md` (AAA, naming de negocio, sin mocks).
- 🚫 Sin escribir código. Restricción del usuario respetada: no se consultó `git log`, `git show` ni ramas.

---

## Fase 1 — Exploración inicial

### 1.1 Punto de partida real

El repo era un lienzo en blanco:

```
src/
├── core/sum.ts          ← scaffold de la plantilla
└── tests/sum.test.ts    ← scaffold de la plantilla

openspec/  → 0 changes activos
```

⚠️ Dos desajustes señalados (`CLAUDE.md` §6: si la doc choca con el código, se confía en el código y se señala el desajuste):

| Desajuste | Estado real | Lo que dice la regla |
|---|---|---|
| Ubicación de tests | `src/tests/sum.test.ts` | `testing-standards.md`: `src/[module]/tests/unit/` → sería `src/core/tests/unit/` |
| `sum.ts` / `sum.test.ts` | Es el único test que existe | Es scaffold de plantilla, no dominio. ¿Se retira al aterrizar el primer test real? |

### 1.2 Lectura literal del enunciado

Sin inventar requisitos, esto es lo determinista y esto lo que falta:

```
✅ DETERMINISTA                          ❓ NO ESPECIFICADO
─────────────────────────────────────    ─────────────────────────────────────
Estado = (x, y, orientación N/E/S/W)     Tamaño de la cuadrícula (¿de dónde sale?)
L = 90° izq, sin cambiar de casilla      Convención de ejes: ¿N = y+1 o y-1?
R = 90° dcha, sin cambiar de casilla     ¿'M' y 'F' son ambos válidos, o alias?
M/F = avanza 1 en la dirección actual    ¿Entrada string "MML" o lista ['M','M','L']?
B = retrocede 1                          Qué hacer con un comando desconocido
Estado persiste entre invocaciones       Formato del "reporte" del obstáculo
Wrapping en los bordes                   ¿Excepción o valor de retorno?
Obstáculo: aborta, se queda, reporta     ¿Validación al colocar el rover?
                                         "API" = ¿clase in-process o HTTP?
```

Sobre la última: el enunciado dice *"desarrollando la API para controlar un rover"*. Por **YAGNI estricto** + `openspec/config.yaml` ("puertos y adaptadores solo cuando el problema exige una frontera real"), se lee como **API pública de clases en `src/core`**, sin HTTP, sin puertos, sin adaptadores. Si mañana aparece HTTP, *ahí* nace el puerto.

### 1.3 El espacio del problema, dibujado

```
        y
        ▲
   4    ·   ·   ·   ·   ·
   3    ·   ·   ✖   ·   ·        ✖ = obstáculo (2,3)
   2    ·   ·   ·   ·   ·
   1    ·   ·   ·   ·   ·
   0    ·  🤖   ·   ·   ·        🤖 = (1,0,'N')
        └───────────────────► x
        0   1   2   3   4

   Malla esférica (wrapping):
        (4,y) --M mirando E--> (0,y)
        (x,0) --B mirando N--> (x,4)      ← ojo: B también hace wrapping
```

El anillo de orientaciones, corazón de los giros:

```
                    N
                    ▲
          L  ┌──────┴──────┐  R
     W ◄─────┤             ├─────► E
             └──────┬──────┘
                    ▼
                    S

     R (horario):      N → E → S → W → N
     L (antihorario):  N → W → S → E → N

     💡 L es exactamente la inversa de R.
        ¿Duplicación de conocimiento o dos reglas?
```

### 1.4 Hilos de diseño

#### Hilo A — ¿Quién recuerda? El punto más delicado del enunciado

El requisito *"el rover mantiene su posición actual"* choca de frente con `coding-standards`: *"objetos completos en construcción, evita setters"*, *"prefiere funciones puras"*.

```
A1) Rover MUTABLE                A2) Rover INMUTABLE            A3) Entidad + VOs inmutables
┌──────────────────┐             ┌──────────────────┐           ┌──────────────────────────┐
│ rover.execute()  │             │ r2 = r1.execute()│           │ Rover (entidad, identidad│
│ muta this.x/y/dir│             │ devuelve nuevo   │           │ estable en el tiempo)    │
└──────────────────┘             └──────────────────┘           │   └─ position: Position  │
                                                                 │        (VO inmutable)    │
✔ literal al enunciado           ✔ tests triviales               │  execute() → this.position│
✘ roza "evita setters"           ✘ ¿quién guarda r2?             │            = nueva Position│
                                   necesitas un Mission/Control  └──────────────────────────┘
                                   que... vuelve a ser mutable   ✔ mutación en 1 sola línea
                                   (has movido el problema)      ✔ toda la lógica es pura
```

💡 **Lectura del Navigator:** A2 no elimina el estado, lo **desplaza** a un objeto extra → viola *"mínimo número de elementos"* de Simple Design. **A3** es el punto dulce: el Rover es una **entidad** (tiene identidad y ciclo de vida — es *el mismo rover* el que sigue en Marte), y todo lo que lleva dentro es inmutable. La mutación queda confinada a una asignación privada.

#### Hilo B — ¿Dónde vive el wrapping? (Tell, Don't Ask)

El rover **no debería conocer el tamaño del mapa**. Si `Coordinates` conociera los límites, cada coordenada arrastraría la malla entera → smell.

```
 comando 'M'
     │
     ▼
┌────────────────────────────────────────────────┐
│ Rover                                          │
│   candidata = orientación.delanteDe(posición)  │  ← geometría pura, sin bordes
└──────────────────┬─────────────────────────────┘
                   ▼
┌────────────────────────────────────────────────┐
│ Planet / Grid   (conoce límites + obstáculos)   │
│   1. envuelta = wrap(candidata)                 │
│   2. ¿hayObstáculoEn(envuelta)?                 │
└──────┬──────────────────────────┬──────────────┘
       │ no                       │ sí
       ▼                          ▼
  posición ← envuelta      conserva posición
  continúa la secuencia    + aborta + reporta
```

🤔 Sub-hilo: ¿dos preguntas al planeta (`wrap` + `hayObstáculo`) o **una sola** (`planeta.destinoDesde(candidata)` que devuelve *casilla válida* u *obstáculo*)? La segunda es más "Tell, Don't Ask" y hace imposible olvidar el wrapping antes de comprobar el obstáculo — un bug real y sutil (*un obstáculo justo al otro lado del borde*). La primera es más legible. **Se deja emerger en el REFACTOR del bloque de obstáculos**, no se decide en la pizarra.

🏷️ Nombre: el enunciado dice *"cuadrícula"*, *"malla esférica"*, *"mapa"*. `Grid` es literal; `Planet` captura mejor *"la superficie se conecta en los bordes"* y aloja los obstáculos con naturalidad. Preferencia débil por `Planet`.

#### Hilo C — Reportar el obstáculo: ¿excepción o valor?

Un obstáculo **no es un error**: es un resultado esperado de la misión. Lanzar una excepción para un flujo previsto es un smell clásico.

```
C1) throw ObstacleFound          C2) execute() → MissionReport        C3) CQS puro
    ✘ control de flujo por           { posición, obstáculo? }             execute() → void
      excepciones                 ✔ el obstáculo es un dato            rover.position (query)
    ✘ el caller obligado a        ~ rompe CQS (comando que             rover.blockedBy (query)
      try/catch en el happy path    devuelve valor)                    ✔ CQS impecable
                                  ✔ coding-standards admite            ✘ el caller "tiene que
                                    excepciones justificadas             acordarse de preguntar"
```

🤔 Pregunta que abre C3: si `blockedBy` es estado del rover... ¿**se limpia** en la siguiente secuencia? Un rover que quedó bloqueado y luego gira y se aleja no debería seguir "reportando obstáculo". Eso es una regla de negocio no escrita en el enunciado.

#### Hilo D — El smell que va a aparecer sí o sí

Predicción: hacia el caso 6-7 aparece **conocimiento de las 4 orientaciones duplicado en tres sitios** — girar a la izquierda, girar a la derecha, y calcular el desplazamiento.

```
  ⚠️ olor típico:            switch (dir) { case 'N': ... case 'E': ... }   ×3

  🔵 salidas en REFACTOR (regla de tres, no antes):
     · anillo ordenado [N,E,S,W] → R = +1 mod 4, L = -1 mod 4  (L deja de ser regla propia)
     · Direction como objeto con comportamiento (delanteDe / izquierda / derecha)
     · tabla de vectores { N:(0,+1), E:(+1,0), S:(0,-1), W:(-1,0) }
```

Lo interesante: **TPP prohíbe llegar ahí en el primer GREEN**. El primer giro se resuelve con una constante. La abstracción se gana, no se presupone. Arrancar con el anillo módulo-4 en el caso 2 es hacerle trampa a la kata.

#### Hilo E — Arquitectura: lo que **no** hay que construir

```
┌─ src/core  (ZERO dependencias externas — regla CRÍTICA, activa desde el día 1) ─┐
│                                                                                 │
│    Rover ──── Position ──── Coordinates                                         │
│      │            └──────── Direction                                           │
│      └──────► Planet ────── Obstacles                                           │
│                                                                                 │
│    Command (L|R|M|B)        MissionReport                                       │
└─────────────────────────────────────────────────────────────────────────────────┘

   ❌ NO hay puertos       ❌ NO hay adaptadores      ❌ NO hay capa de aplicación
   ❌ NO hay HTTP          ❌ NO hay persistencia     ❌ NO hay UseCase

   Motivo: no existe ninguna frontera real que cruzar. Todo es dominio puro.
   El skill backend-hexagonal es explícito: "las capas se introducen solo cuando
   el problema exige una frontera real — nunca preventivamente (YAGNI)".
```

Esta kata es, arquitectónicamente, **un hexágono sin adaptadores**. Y está bien así.

### 1.5 Lista de casos (paso REASON)

Ordenada de trivial a complejo, pensada para que cada GREEN sea la transformación TPP más barata posible:

```
BLOQUE 0 · Posición
  1. informa su posición inicial                          [nil → constante]

BLOQUE 1 · Giros (sin cambiar de casilla)
  2. gira a la izquierda desde el norte                    [constante → constante+]
  3. gira a la derecha desde el norte
  4. gira a la derecha desde el resto de orientaciones
  5. cuatro giros a la derecha devuelven la orientación inicial

BLOQUE 2 · Avance
  6. avanza mirando al norte                               [aparece el eje y]
  7. avanza mirando al este / sur / oeste                  ⚠️ aquí surge el smell del hilo D

BLOQUE 3 · Retroceso
  8. retrocede mirando al norte
  9. retrocede en el resto de orientaciones                💡 ¿B = "M en la opuesta"?

BLOQUE 4 · Secuencias y persistencia
 10. una secuencia vacía deja el rover donde está
 11. ejecuta una secuencia de comandos en orden
 12. continúa desde la última posición en una segunda secuencia   ← requisito 2 del enunciado

BLOQUE 5 · Malla esférica
 13. reaparece por el sur al cruzar el borde norte
 14. reaparece por el oeste al cruzar el borde este
 15. bordes sur y oeste
 16. el retroceso también reaparece por el extremo opuesto

BLOQUE 6 · Obstáculos
 17. un obstáculo delante impide el avance
 18. conserva la última posición válida anterior al obstáculo
 19. reporta el obstáculo encontrado
 20. descarta los comandos restantes de la secuencia
 21. un obstáculo detrás impide el retroceso
 22. un obstáculo al otro lado del borde también bloquea   ← el bug sutil del hilo B
 23. una secuencia sin incidencias no reporta obstáculo
 24. tras un bloqueo, el rover puede girar y alejarse      ← la regla no escrita del hilo C

BLOQUE 7 · Bordes (dependen de decisiones del Tech Lead)
 25. comando desconocido → ¿ignorar / abortar / rechazar?
 26. colocación inicial inválida → ¿fuera del grid? ¿sobre obstáculo?
```

Nombres en formato de regla de negocio según `testing-standards` (`describe('The Rover')` / `it('reappears on the south edge when it crosses the north border')`), sin verbos técnicos tipo *returns* o *calls*.

### 1.6 Riesgos identificados

| Riesgo | Por qué importa |
|---|---|
| **Sobre-diseñar en el caso 2** | La tentación del anillo módulo-4 y la tabla de vectores en el primer GREEN. TPP lo prohíbe; la abstracción se gana en el REFACTOR tras la regla de tres. |
| **Obstáculo al otro lado del wrapping** | Es el caso que casi todo el mundo olvida. Si `wrap` y `hasObstacle` se preguntan en orden incorrecto, pasa el test 17 y falla el 22. |
| **`B` implementado como "M invertido"** | Elegante, pero ¿es *conocimiento duplicado* o *una regla propia*? Si un día "retroceder" tuviera coste distinto, la abstracción se rompe. YAGNI dice: hoy son lo mismo. |
| **Estado de bloqueo pegajoso** | Si el reporte de obstáculo vive en el rover y no se limpia, el rover queda "bloqueado para siempre". |
| **Cobertura 80%** en `jest.config.js` | Con TDD real no es un problema, pero está ahí y `bun run validate` fallará si algo se implementa sin test. |

### 1.7 Ronda de decisiones 1

Cuatro decisiones que condicionan la forma del dominio desde el caso 1. Se presentaron con sus alternativas; la respuesta del Tech Lead va marcada con ✅.

#### Pregunta 1 — ¿Dónde vive el estado del rover entre secuencias de comandos?

| Opción | Descripción | Elegida |
|---|---|:--:|
| **Entidad + VOs inmutables** | Rover es una entidad mutable (identidad estable), pero `Position`/`Direction`/`Coordinates` son Value Objects inmutables. La mutación queda en una asignación privada; toda la lógica es pura. Cumple el enunciado literalmente sin repartir setters. | ✅ |
| Rover totalmente inmutable | `execute()` devuelve un Rover nuevo. Tests triviales y funciones 100% puras, pero alguien externo (Mission/Control) debe guardar la última instancia — el estado no desaparece, se desplaza. | |
| Rover mutable clásico | El rover muta `x`, `y` y orientación directamente. Lectura más literal del enunciado, pero roza la norma de `coding-standards` sobre setters y objetos completos en construcción. | |

```
Rover (entidad)
  position ───► Position (VO inmutable)
                 ├─ Coordinates (VO)
                 └─ Direction  (VO)

execute(cmds):
   this.position = <nueva Position>   ← única mutación
```

#### Pregunta 2 — ¿Cómo se comunica al llamante que ha aparecido un obstáculo?

| Opción | Descripción | Elegida |
|---|---|:--:|
| **Valor de retorno** | `execute()` devuelve un reporte con la posición final y el obstáculo encontrado (si lo hubo). El obstáculo es un dato, no un error. Rompe CQS, pero es la excepción justificada que contempla `coding-standards`. | ✅ |
| CQS puro: comando + consultas | `execute()` no devuelve nada; el llamante consulta `rover.position` y `rover.blockedBy` por separado. CQS impecable, pero obliga a "acordarse de preguntar" y abre la duda de cuándo se limpia el bloqueo. | |
| Excepción | Se lanza un error de dominio al topar con el obstáculo. Aborta la secuencia de forma natural, pero usa excepciones como control de flujo para un caso previsto por el enunciado. | |

```
execute('MMM')  →  { position: (1,2,'N'), obstacle: (1,3) }
execute('MM')   →  { position: (0,2,'N'), obstacle: none }
```

#### Pregunta 3 — Convención de ejes y forma de la cuadrícula

| Opción | Descripción | Elegida |
|---|---|:--:|
| **N = y+1, tamaño inyectado** | Origen abajo-izquierda (convención matemática, la habitual en esta kata). El tamaño de la malla se inyecta al construir el planeta, lo que permite tests con cuadrículas diminutas de 3x3 y wrapping rápido de verificar. | ✅ |
| N = y-1 (estilo matriz) | Origen arriba-izquierda, como una matriz o una pantalla. Coherente si algún día se pinta en una UI, pero menos natural al razonar sobre "norte" en los tests. | |
| Cuadrícula fija 10x10 | El tamaño es una constante del dominio. Menos elementos y menos parámetros, pero los tests de wrapping necesitan secuencias largas o posiciones iniciales pegadas al borde. | |

```
  y
  ▲
2 · · ·      N → y+1
1 · · ·      S → y-1
0 🤖 · ·     E → x+1
  └────► x   W → x-1
  0 1 2

Planet(width, height, obstacles)
```

#### Pregunta 4 — ¿Qué hace el rover ante un carácter de comando desconocido?

| Opción | Descripción | Elegida |
|---|---|:--:|
| **Rechazar la secuencia entera** | Una secuencia inválida no se ejecuta en absoluto: se valida al parsear, antes de mover nada. Fail-fast, sin estados a medias, y mantiene el dominio protegido de entradas basura. | ✅ |
| Ignorar los desconocidos | Se ejecutan los comandos válidos y se descartan silenciosamente los demás. Tolerante, pero el silencio esconde errores del llamante. | |
| Abortar al llegar a él | Se ejecutan los comandos previos y la secuencia se detiene en el carácter inválido, igual que con un obstáculo. Coherente con el aborto por obstáculo, pero deja el rover a medio camino. | |
| Fuera de alcance por ahora | El enunciado no lo menciona. Aplicar YAGNI: no se escribe ningún test ni ninguna defensa hasta que aparezca la necesidad real. | |

---

## Fase 2 — Cierre de hilos abiertos

Tras la ronda 1, el modelo resultante:

```
┌─ src/core  (ZERO dependencias externas) ────────────────────────────────────┐
│                                                                              │
│   ┌─────────────────────────────────┐                                        │
│   │ Rover            ◀── ENTIDAD    │  el único mutable del sistema          │
│   │   position: Position            │                                        │
│   │   planet:   Planet              │                                        │
│   │                                 │                                        │
│   │   execute(commands) → Report    │                                        │
│   └──────┬─────────────────┬────────┘                                        │
│          │                 │                                                 │
│          ▼                 ▼                                                 │
│   ┌──────────────┐   ┌──────────────────────────────┐                        │
│   │ Position  VO │   │ Planet                       │  conoce límites        │
│   │  Coordinates │   │   width, height, obstacles   │  y obstáculos          │
│   │  Direction   │   │   ¿dónde aterriza X?         │  (el Rover NO)         │
│   └──────────────┘   └──────────────────────────────┘                        │
│                                                                              │
│   Command = L | R | M | B          Report { position, obstacle? }            │
└──────────────────────────────────────────────────────────────────────────────┘
```

Flujo completo de una secuencia:

```
 execute("MMXR")                    execute("MMM")
      │                                  │
      ▼                                  ▼
 ┌─────────────────┐              ┌─────────────────┐
 │ 1. PARSEAR todo │              │ 1. PARSEAR todo │
 └────────┬────────┘              └────────┬────────┘
   'X' inválido                         todo OK
          ▼                                  ▼
   ✋ rechazo total               ┌──────────────────────────┐
   el rover NO se mueve          │ 2. EJECUTAR en secuencia │
                                 └────────┬─────────────────┘
                                          │  por cada comando:
                                          ▼
                                  candidata = dirección.delanteDe(pos)
                                          ▼
                                  planeta: wrap → ¿obstáculo?
                                     ┌────┴────┐
                                  no │         │ sí
                                     ▼         ▼
                              avanza y     ⛔ aborta el resto
                              continúa     conserva última pos. válida
                                     └────┬────┘
                                          ▼
                            Report { position, obstacle? }
```

### Hilo nuevo (I) — el aborto choca con `coding-standards`

`coding-standards` §8 dice *"evita usar for"* y §9 *"prefiere estilo declarativo"*. Pero **abortar a mitad de una secuencia es precisamente lo que `map`/`reduce` no saben hacer.**

```
 D1) for...of + break        D2) reduce que se "rinde"      D3) recursión
 ─────────────────────       ──────────────────────────     ─────────────────
 for (const c of cmds) {     cmds.reduce((estado, c) =>      ejecutar([c, ...resto])
   const r = aplicar(c)        estado.bloqueado                if (bloqueado) return estado
   if (r.bloqueado) break        ? estado                      return ejecutar(resto)
 }                              : aplicar(estado, c), inicio)
 ✔ obvio de leer             ✔ puro y declarativo           ✔ puro, TPP #9
 ✘ choca con §8 (literal)    ✘ recorre TODA la lista        ✔ expresa "sigue con el resto"
 ✔ §12: legibilidad primero    aunque ya esté bloqueado     ~ menos idiomático en TS
                             ✘ "seguir iterando parado"
                               es mentir sobre la intención
```

💡 **Lectura del Navigator:** `coding-standards` §12 (*"prioriza la legibilidad"*) y la **Excepción Declarativa** de `tdd.md` cortan en la misma dirección: la regla *"evita for"* existe para eliminar bucles que en realidad son transformaciones, **no** para prohibir el único constructo que expresa "parar antes de tiempo". D2 es declarativo pero **miente**: dice "recorro todo" cuando el negocio dice "me detengo". D3 lo expresa honestamente y es puro. **Decisión de REFACTOR del bloque 6**, no de la pizarra.

### Hilo nuevo (II) — ¿cómo viaja el rechazo de un comando inválido?

Hay **dos formas distintas de "no hacer nada"** y conviene no confundirlas:

```
   obstáculo  →  el mundo dijo que no    →  resultado de negocio esperado  →  Report
   'X'        →  el llamante se equivocó →  error de programación          →  ¿?
```

```
 E1) Estados ilegales irrepresentables      E2) El rechazo va en el Report
 ────────────────────────────────────       ──────────────────────────────
 Parseo en la frontera:                     execute("MMXR")
   Command.parse("MMXR")  → 💥               → { position, rejected: 'X' }
   Command.parse("MMR")   → [M,M,R]
 El Rover SOLO acepta Command[] tipados.    ✔ una sola vía de retorno
 ✔ el dominio nunca ve basura               ✘ mezcla "el mundo dijo no" con
 ✔ el compilador hace de guardia               "tú lo escribiste mal"
 ✘ la API pública ya no acepta un string    ✘ el llamante puede ignorarlo
   directamente (o hay dos entradas)           en silencio
```

### Preguntas menores que quedaron abiertas tras la ronda 1

| # | Pregunta | Inclinación del Navigator |
|---|---|---|
| 1 | **Colocación inicial inválida** — ¿rover fuera del grid? ¿encima de un obstáculo? | Constructor privado + factory con validación (`coding-standards` §2 de Clases). Pero puede ser YAGNI: el enunciado no lo pide. |
| 2 | **`Planet` con `width`+`height` o un único `size`** | `width`/`height`: cuesta lo mismo y no fuerza una malla cuadrada. |
| 3 | **Contenido exacto del `Report`** | Posición final siempre; coordenadas del obstáculo cuando lo hay. ¿Hace falta también *qué comandos quedaron sin ejecutar*? Probablemente no. |
| 4 | **`M` y `F` como sinónimos** | El enunciado escribe `M` (o `F`). Aceptar ambos es trivial, pero es un caso de test extra. |
| 5 | **Nombre: `Planet` vs `Grid`** | `Planet` — captura la "malla esférica" y aloja obstáculos con naturalidad. |
| 6 | **Ubicación de tests y el scaffold `sum.ts`** | Mover a `src/core/tests/unit/` según `testing-standards`; retirar `sum` al aterrizar el primer test real. |

### 2.1 Descubrimiento: en una malla esférica no existe "fuera"

```
   Planeta 5×5, alguien coloca el rover en (12, 3)

   ¿Error?  ─────────────►  ¿o simplemente (2, 3)?

        y
        ▲
   4    ·  ·  ·  ·  ·
   3    ·  ·  🤖 ·  ·      12 mod 5 = 2
   2    ·  ·  ·  ·  ·
   1    ·  ·  ·  ·  ·           La misma regla que ya necesitas
   0    ·  ·  ·  ·  ·           para el wrapping resuelve también
        └──────────────► x      la colocación inicial. Cero código nuevo.
        0  1  2  3  4
```

Si el planeta envuelve, una coordenada "fuera de rango" **no es inválida, es la misma casilla dicha de otra forma**. La validación de rango desaparece por diseño en vez de por código. Lo que sí sigue siendo un estado imposible del mundo es **un rover encima de un obstáculo** — esa casilla está físicamente ocupada.

Y sobre `M`/`F`: `coding-standards` es tajante —*"sin alias ni sinónimos para el mismo concepto: un concepto, un nombre"*. El paréntesis del enunciado (*`M` (o `F`)*) parece el autor ofreciendo notación a elegir, no exigiendo ambas.

### 2.2 Ronda de decisiones 2

#### Pregunta 5 — Un comando desconocido rechaza la secuencia entera: ¿dónde se decide y cómo viaja ese rechazo?

| Opción | Descripción | Elegida |
|---|---|:--:|
| **Parseo en la frontera** | Una factoría de secuencia convierte el texto en comandos tipados y revienta si hay basura. El Rover solo acepta comandos ya válidos: nunca ve una `'X'`. Estado ilegal irrepresentable, el compilador hace de guardia. | ✅ |
| `execute(string)` lanza y no mueve nada | La API pública sigue aceptando el string directamente; el Rover lo valida entero antes de mover y lanza un error de dominio si algo no encaja. Un solo paso para el llamante, mismo fail-fast, pero la firma acepta cualquier string. | |
| El rechazo viaja en el Report | `execute()` siempre devuelve reporte; si la secuencia era inválida el reporte lo indica y la posición no cambia. Una única vía de retorno, pero mezcla el error del llamante con el resultado de negocio. | |

#### Pregunta 6 — ¿Cómo se valida la colocación inicial del rover?

| Opción | Descripción | Elegida |
|---|---|:--:|
| **Wrapping + rechazar sobre obstáculo** | Las coordenadas iniciales se normalizan con la misma regla de la malla esférica — no existe "fuera". Solo se rechaza aterrizar sobre una casilla ocupada, que sí es un estado imposible del mundo. Factoría con constructor privado. | ✅ |
| Factoría que valida ambas cosas | Se rechaza tanto una coordenada fuera de rango como aterrizar sobre un obstáculo. Más explícito, pero introduce un concepto de "fuera del grid" que el wrapping niega en todos los demás casos: `(12,3)` sería inválido al colocar y válido al desplazarse. | |
| Sin validación (YAGNI) | El enunciado no menciona colocaciones inválidas. Constructor simple, sin factoría. Pero un rover podría nacer dentro de una roca. | |

#### Pregunta 7 — ¿Qué contiene exactamente el reporte que devuelve `execute()`?

| Opción | Descripción | Elegida |
|---|---|:--:|
| **Posición + obstáculo opcional** | Lo mínimo que exige el enunciado: siempre la posición final, y las coordenadas del obstáculo cuando hubo bloqueo. Es lo que emerge de forma natural en el caso 19 siguiendo TPP. | ✅ |
| Unión discriminada `Completed \| Blocked` | Dos formas distintas de reporte en vez de un campo opcional. Más preciso — imposible leer el obstáculo sin comprobar antes que lo hubo — pero añade un elemento que TPP no pediría todavía. **Buen candidato a REFACTOR.** | |
| Añadir los comandos no ejecutados | El reporte incluye además qué parte de la secuencia se descartó al abortar. Útil para depurar, pero el enunciado solo pide "reportar la presencia del obstáculo". | |

#### Pregunta 8 — El enunciado escribe «M (o F)» para avanzar. ¿Se aceptan las dos letras?

| Opción | Descripción | Elegida |
|---|---|:--:|
| **Solo M** | Un concepto, un nombre — regla explícita de `coding-standards` contra alias y sinónimos. El paréntesis del enunciado se lee como notación a elegir, no como requisito de aceptar ambas. `'F'` pasa a ser comando desconocido. | ✅ |
| Ambas, M y F | Lectura más literal del enunciado. Cuesta un caso de test, pero introduce exactamente el tipo de sinónimo que `coding-standards` desaconseja. | |
| Solo F | Simetría con `B` (Forward/Backward), que sí es un par coherente. Descarta `M` pese a ser la letra principal del enunciado. | |

---

## Fase 3 — Ficha consolidada

```
┌────────────────────────────────────────────────────────────────────────────┐
│ ESTADO      Rover = entidad (único mutable) · Position/Coordinates/        │
│             Direction = VOs inmutables · toda la geometría es pura         │
├────────────────────────────────────────────────────────────────────────────┤
│ EJES        N = y+1  ·  origen abajo-izquierda  ·  Planet(w, h, obstacles) │
│             inyectado → tests con mallas 3×3                               │
├────────────────────────────────────────────────────────────────────────────┤
│ COMANDOS    L | R | M | B   (solo M: "un concepto, un nombre")             │
│             Parseo en la frontera: el Rover nunca ve un string crudo       │
│             'X' → 💥 rechazo total, el rover no se mueve                   │
├────────────────────────────────────────────────────────────────────────────┤
│ OBSTÁCULO   dato de negocio, no error → Report { position, obstacle? }     │
│             aborta el resto · conserva la última posición válida           │
├────────────────────────────────────────────────────────────────────────────┤
│ COLOCACIÓN  coordenadas normalizadas por wrapping (no existe "fuera")      │
│             encima de obstáculo → 💥 factoría con constructor privado      │
├────────────────────────────────────────────────────────────────────────────┤
│ ALCANCE     hexágono sin adaptadores: solo src/core, cero dependencias     │
│             ❌ HTTP  ❌ puertos  ❌ persistencia  ❌ UI  ❌ capa aplicación │
└────────────────────────────────────────────────────────────────────────────┘
```

**Sigue decidido por el ciclo TDD, no por la pizarra:** cómo se resuelven los giros, si `B` es `M` invertido, y cómo se compone el bucle con aborto. Emergen en el REFACTOR, con la regla de tres.

### Supuestos asumidos (no preguntados, vetables)

1. **`Planet`** como nombre (no `Grid`) — captura la malla esférica y aloja los obstáculos.
2. **`width` y `height` separados**, no un `size` único — cuesta lo mismo y no fuerza malla cuadrada.
3. **Tests en `src/core/tests/unit/`** según `testing-standards`. 🚫 **No se tocan `sum.ts` ni `sum.test.ts`**: `testing-standards` prohíbe borrar tests sin visto bueno explícito del Tech Lead, aunque sean scaffold de plantilla.

---

## Fase 4 — Propuesta OpenSpec

### 4.1 Artefactos creados

Change **`add-mars-rover`** en `openspec/changes/add-mars-rover/` — 4/4 artefactos completos, `openspec validate --strict` en verde.

| Artefacto | Contenido |
|---|---|
| `proposal.md` | El *porqué*, las 6 decisiones cerradas y una sección **Non-goals** explícita: sin HTTP, sin puertos, sin adaptadores, sin capa de aplicación, sin persistencia, sin UI, sin `index.ts`, y el scaffold `sum` intacto. |
| `specs/` | 4 capacidades · 19 requisitos · 41 escenarios en GIVEN/WHEN/THEN con datos concretos: `command-parsing`, `rover-navigation`, `spherical-grid`, `obstacle-detection`. |
| `design.md` | Cada decisión con sus alternativas descartadas y el porqué, la estructura de ficheros, riesgos con mitigación, y una sección explícita de **lo que decide el ciclo TDD y no este documento**. |
| `tasks.md` | 9 grupos, 45 tareas, cada una anotada con la regla o skill que la gobierna y la transformación TPP esperada. |

### 4.2 Decisiones derivadas (candidatas a veto)

Tres cosas decididas **derivándolas** de las respuestas del Tech Lead, no preguntándoselas:

1. **Minúsculas rechazadas.** `mm` es secuencia inválida. Se deduce de *"solo `M`, sin sinónimos"* + *"un carácter desconocido rechaza la secuencia"*, pero no se habló. Está en `specs/command-parsing`.
2. **El rechazo identifica el carácter ofensor** (`'X'`), no solo dice "inválido". Calidad de error, no la pide el enunciado.
3. **El planeta entra en el grupo 5** de tareas, no en el 1. Antes de eso el rover no necesita conocer bordes → YAGNI. Cuesta un refactor de construcción en la tarea 5.1 que toca las llamadas de los tests anteriores, nunca sus aserciones. Es la única churn del plan; el parseo va al final precisamente porque **no** genera ninguna.

### 4.3 Pregunta aparcada conscientemente

En *Open Questions* de `design.md`: **qué hacer con un planeta de dimensión 0 o negativa**. El enunciado calla y ningún escenario lo necesita — `CLAUDE.md` prohíbe inventar requisitos. Añadirlo después es puramente aditivo y no cambia ningún comportamiento existente.

### 4.4 Decisiones diferidas al ciclo TDD

Con las opciones ya acotadas en `design.md` y su tarea de REFACTOR reservada:

- 🔵 **Tarea 3.5** — cómo colapsar el conocimiento de las orientaciones (anillo módulo-4 / VO con comportamiento / tabla de vectores). Se decide cuando la duplicación se vea tres veces, no antes.
- 🔵 **Tarea 6.9** — la forma del bucle con aborto: `for...of` + `break` o recursión. Con nota explícita de rechazar el `reduce` que sigue iterando sobre un rover bloqueado, porque miente sobre la intención.

### 4.5 Siguiente paso

`/opsx-apply` para arrancar el ciclo. La primera tarea real es **1.2** (🤔 REASON: volcar la lista de casos como TODO en el fichero de test) y el primer 🔴 RED es **2.1**, *el rover informa de la posición en la que fue colocado* — que en GREEN se resuelve con una constante, no con una variable.
