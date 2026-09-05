# 🛸 Mars Rover Kata — Exploración y Decisiones de Diseño

Documento generado el 2 de septiembre de 2026, recogiendo la sesión completa de exploración, análisis del enunciado, decisiones de diseño y generación de artefactos OpenSpec.

---

## 1. Análisis del Enunciado

### Contexto

El repositorio está preparado con un scaffold TypeScript + Bun + Jest, pero solo contiene código placeholder (`sum.ts`). La kata no se ha implementado aún.

### Los 4 Requisitos

```
┌─────────────────────────────────────────────────────────────────┐
│                    KATA MARS ROVER                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  R1. Posición e Inicialización                                  │
│      → Rover en grid con (x, y, orientación)                   │
│      → Orientaciones: N, E, S, W                                │
│                                                                 │
│  R2. Procesamiento de Comandos                                  │
│      → L: girar izquierda │ R: girar derecha                    │
│      → M/F: avanzar       │ B: retroceder                      │
│      → Persistencia de estado entre ejecuciones                 │
│                                                                 │
│  R3. Malla Esférica (Wrapping)                                  │
│      → Bordes conectados (como un toro/pac-man)                 │
│                                                                 │
│  R4. Detección de Obstáculos                                    │
│      → Obstáculos en coordenadas fijas                          │
│      → Abortar secuencia al encontrar obstáculo                 │
│      → Quedarse en última posición válida                       │
│      → Reportar el obstáculo                                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Exploración de Conceptos de Dominio

### Mapa de conceptos

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Coordinate  │    │  Direction   │    │   Command    │
│  (x, y)      │    │  N/E/S/W     │    │  L/R/M/B     │
└──────┬───────┘    └──────┬───────┘    └──────┬───────┘
       │                   │                   │
       ▼                   ▼                   │
┌──────────────────────────────────┐           │
│           Position               │           │
│  (coordinate + direction)        │           │
└──────────────┬───────────────────┘           │
               │                               │
               ▼                               ▼
┌──────────────────────────────────────────────────┐
│                    Rover                          │
│  - tiene posición actual                          │
│  - recibe y ejecuta comandos                      │
│  - mantiene estado entre ejecuciones              │
└──────────────────────┬───────────────────────────┘
                       │
                       │ se mueve sobre
                       ▼
┌──────────────────────────────────────────────────┐
│               MarsMap / Grid                      │
│  - dimensiones (ancho × alto)                     │
│  - wrapping en los bordes                         │
│  - contiene obstáculos                            │
│  - valida si una posición está libre              │
└──────────────────────────────────────────────────┘
```

### Value Objects vs Entities

| Concepto | Tipo | Razón |
|----------|------|-------|
| `Coordinate` | Value Object | Inmutable, se compara por valor (x,y) |
| `Direction` | Value Object (enum/literal type) | Conjunto finito: N, E, S, W |
| `Command` | Value Object (enum/literal type) | Conjunto finito: L, R, M, B |
| `Position` | Value Object | Coordinate + Direction, inmutable |
| `Rover` | Entity | Tiene estado mutable (posición cambia), identidad |
| `MarsMap` | Value Object o Entity | Configura el grid y los obstáculos |

### Mecánica de giro

Las direcciones forman una secuencia circular:

```
        N (0)
        ↑
  W (3) ← → E (1)
        ↓
        S (2)

  Girar derecha (R): N → E → S → W → N  (índice + 1 mod 4)
  Girar izquierda (L): N → W → S → E → N  (índice - 1 mod 4)
```

### Vectores de desplazamiento

| Dirección | Avanzar (M) | Retroceder (B) |
|-----------|-------------|-----------------|
| N | (0, +1) | (0, -1) |
| E | (+1, 0) | (-1, 0) |
| S | (0, -1) | (0, +1) |
| W | (-1, 0) | (+1, 0) |

### Fórmula de wrapping

```
Nuevo x = ((x + dx) % width + width) % width
Nuevo y = ((y + dy) % height + height) % height
```

La fórmula doble módulo garantiza que funciona con valores negativos.

### Flujo de detección de obstáculos

```
  Rover recibe comandos: "MMRMLM"

  Para cada comando:
  ┌──────────────────────────────────────┐
  │  ¿Es giro (L/R)?                     │
  │  → Sí: rotar, siguiente comando      │
  │  → No: es movimiento (M/B)           │
  │       calcular nueva coordenada       │
  │       ¿Hay obstáculo?                 │
  │       → Sí: ABORTAR, reportar         │
  │       → No: mover, siguiente comando  │
  └──────────────────────────────────────┘
```

---

## 3. Decisiones de Diseño — Opciones Presentadas y Resolución

### Decisión 1: ¿Rover mutable o inmutable?

**Opciones presentadas:**

**Opción mutable** (más fiel al enunciado):
```typescript
rover.execute("MM");  // rover ahora está en (0,2,N)
rover.execute("RM");  // rover ahora está en (1,2,E)
```

**Opción inmutable** (más funcional):
```typescript
const rover2 = rover.execute("MM");  // nuevo rover en (0,2,N)
const rover3 = rover2.execute("RM"); // nuevo rover en (1,2,E)
```

> **✅ Decisión tomada: Rover MUTABLE**
>
> El enunciado dice explícitamente que el rover "mantiene su posición y orientación actual". Un objeto mutable modela esto naturalmente. El Tech Lead confirmó esta decisión.

---

### Decisión 2: ¿Quién ejecuta los comandos?

**Opción A: El Rover conoce el mapa directamente**
```
┌──────────────────────────────────────────┐
│                 Rover                     │
│  - position                              │
│  - marsMap  ◄── inyectado en constructor  │
│                                          │
│  execute("MMRM")                         │
│    para cada comando:                    │
│      calcular siguiente coordenada       │
│      preguntar al mapa: ¿hay obstáculo?  │
│      → sí: parar, devolver resultado     │
│      → no: actualizar posición           │
└──────────────────────────────────────────┘
```

**Opción B: Una función/servicio coordina**
```
┌─────────┐     ┌──────────┐     ┌──────────┐
│ Caller  │────▶│ navigate │────▶│  Rover   │
│         │     │(rover,   │     │          │
│         │     │ map,     │     │          │
│         │     │ commands)│     │          │
└─────────┘     └────┬─────┘     └──────────┘
                     │
                     ▼
                ┌──────────┐
                │ MarsMap  │
                └──────────┘
```

> **✅ Decisión tomada: Opción A — El Rover conoce su mapa**
>
> El Rover recibe el MarsMap en el constructor. Es más cohesivo, evita el modelo anémico, y sigue Tell Don't Ask. El caller solo dice `rover.execute()`.

---

### Decisión 3: ¿Cómo reporta el obstáculo?

**Enfoque 1: Tipo resultado simple**
```typescript
type ExecutionResult = {
  position: Position;
  obstacleDetected?: Coordinate;
};
```
- ✅ Simple
- ❌ `obstacleDetected` es opcional — null-checks necesarios

**Enfoque 2: Union discriminada**
```typescript
type ExecutionResult =
  | { status: 'ok';      position: Position }
  | { status: 'obstacle'; position: Position; obstacle: Coordinate };
```
- ✅ El tipo fuerza al caller a manejar ambos casos
- ✅ Explícito, auto-documentado

**Enfoque 3: Clase resultado con comportamiento**
```typescript
class ExecutionResult {
  private constructor(
    readonly position: Position,
    readonly obstacle?: Coordinate
  ) {}

  static ok(position: Position): ExecutionResult { ... }
  static blocked(position: Position, obstacle: Coordinate): ExecutionResult { ... }

  hasObstacle(): boolean { return this.obstacle !== undefined; }
}
```
- ✅ Encapsula comportamiento, alineado con rich model
- ❌ Quizás excesivo para una kata

> **✅ Decisión tomada: Enfoque 2 — Union discriminada**
>
> TypeScript's type narrowing lo hace ergonómico. El compilador fuerza a manejar ambos casos. Más ligero que una clase para una kata. Como el rover es mutable, la posición se consulta vía el propio rover; el resultado solo señaliza qué pasó.
>
> Refinamiento final en design.md:
> ```typescript
> type ExecutionResult =
>   | { status: 'ok' }
>   | { status: 'obstacle'; obstacle: Coordinate };
> ```
> La posición no va en el resultado porque el rover ya la expone como estado propio.

---

### Decisión 4: ¿Granularidad de los Value Objects?

**Granularidad fina (más VOs):**
```
Coordinate (x, y)         ← VO independiente
Direction  (N/E/S/W)      ← VO independiente
Position   (Coordinate + Direction)  ← VO que compone los anteriores
Command    (L/R/M/B)      ← VO independiente
```

**Granularidad gruesa (menos VOs):**
```
Position (x, y, direction)  ← todo junto
Command  (L/R/M/B)          ← solo esto
```

> **✅ Decisión tomada: Granularidad FINA**
>
> Razones:
> 1. Los obstáculos son `Coordinate` (x,y) — no tienen dirección. Si Position fuera (x,y,direction), habría que comparar parcialmente.
> 2. `Direction` tiene comportamiento propio claro (girar, delta).
> 3. Son conceptos de dominio genuinamente distintos.

---

### Decisión 5: ¿Qué alternativa de modelado?

**Alternativa A: Command Pattern puro**

Cada comando es un objeto con un método `execute`:
```
┌───────────────────────────────┐
│ interface Command {           │
│   execute(rover, map): Result │
│ }                             │
├───────────────────────────────┤
│ TurnLeftCommand               │
│ TurnRightCommand              │
│ MoveForwardCommand            │
│ MoveBackwardCommand           │
└───────────────────────────────┘
```
- ✅ Open/Closed principle
- ❌ YAGNI — 4 comandos fijos que no cambiarán

**Alternativa B: Direction como State Machine**
```
       turnRight()
   N ─────────────▶ E
   ▲                │
   │  turnLeft()    │ turnRight()
   │                ▼
   W ◀───────────── S
       turnRight()
```
Direction encapsula la tabla de transiciones y los deltas de movimiento.
- ✅ Cohesivo, simple, testeable
- ✅ Alineado con Tell, Don't Ask y rich model

**Alternativa C: Funcional pura — todo funciones, sin clases**
```typescript
type Position = { x: number; y: number; direction: Direction };
function execute(pos: Position, map: MarsMap, commands: string): ExecutionResult
```
- ✅ Máxima simplicidad
- ❌ No alineado con las reglas del repo (rich model, evitar modelos anémicos)
- ❌ No encaja con rover mutable

> **✅ Decisión tomada: Alternativa B — Direction como State Machine**
>
> Encaja con:
> - Las reglas del repositorio (rich model, Tell Don't Ask)
> - La decisión de Rover mutable
> - YAGNI (no introducimos Command Pattern para 4 comandos fijos)

---

## 4. Diseño Final Propuesto

```
┌────────────────────────────────────────────────────────┐
│                   DISEÑO PROPUESTO                      │
├────────────────────────────────────────────────────────┤
│                                                        │
│  Direction (VO)       Coordinate (VO)                  │
│  ├─ turnLeft()        ├─ add(delta)                    │
│  ├─ turnRight()       └─ equals(other)                 │
│  └─ delta()                                            │
│        │                    │                          │
│        └──────┬─────────────┘                          │
│               ▼                                        │
│         Position (VO)                                  │
│         (coordinate + direction)                       │
│               │                                        │
│               ▼                                        │
│      Rover (Entity, mutable)                           │
│      ├─ position: Position                             │
│      ├─ marsMap: MarsMap                               │
│      └─ execute(commands): ExecutionResult              │
│               │                                        │
│               ▼                                        │
│      MarsMap (VO)                                      │
│      ├─ wrap(coordinate): Coordinate                   │
│      └─ hasObstacle(coordinate): boolean               │
│                                                        │
│      ExecutionResult (union discriminada)               │
│      ├─ { status: 'ok' }                               │
│      └─ { status: 'obstacle', obstacle: Coordinate }   │
│                                                        │
└────────────────────────────────────────────────────────┘
```

### Estructura de archivos

```
src/core/
├── direction.ts       # VO: N/E/S/W con giro y delta
├── coordinate.ts      # VO: (x, y) con aritmética e igualdad
├── marsMap.ts         # VO: dimensiones + obstáculos + wrapping
└── rover.ts           # Entity: mutable, ejecuta comandos

src/tests/unit/
└── rover.test.ts      # Tests de la kata en progresión TDD
```

### Arquitectura

No hay puertos ni adaptadores — es dominio puro sin dependencias externas. YAGNI: las capas hexagonales se introducirían solo si surgiera una frontera real (persistencia, API, etc.).

---

## 5. Orden de Tests (TDD — de simple a complejo)

### Bloque 1: Posición e Inicialización
1. Crear un rover con posición inicial (0,0,N)
2. Crear un rover con otra posición inicial (1,2,E)

### Bloque 2: Giros (sin movimiento)
3. Girar a la derecha desde N → E
4. Girar a la derecha desde E → S (verificar ciclo)
5. Girar a la izquierda desde N → W
6. Girar a la izquierda desde W → S (verificar ciclo)
7. Giro completo (4× R desde N → N)

### Bloque 3: Movimiento simple (sin wrapping, sin obstáculos)
8. Avanzar (M) mirando al Norte → y+1
9. Avanzar mirando al Este → x+1
10. Avanzar mirando al Sur → y-1
11. Retroceder (B) mirando al Norte → y-1

### Bloque 4: Comandos múltiples
12. Secuencia de giros y movimientos ("MMRM")
13. Persistencia de estado (ejecutar "M", luego ejecutar "M" → acumula)

### Bloque 5: Wrapping
14. Wrapping al ir al norte más allá del borde superior
15. Wrapping al ir al este más allá del borde derecho
16. Wrapping al ir al sur más allá del borde inferior
17. Wrapping al retroceder

### Bloque 6: Detección de obstáculos
18. Moverse a casilla con obstáculo → se detiene en posición anterior
19. Obstáculo a mitad de secuencia → aborta los comandos restantes
20. Reporta la coordenada del obstáculo detectado

---

## 6. Resumen de Decisiones

| # | Decisión | Opciones | Resultado |
|---|----------|----------|-----------|
| D1 | Mutabilidad del Rover | Mutable vs Inmutable | **Mutable** — fiel al enunciado |
| D2 | Quién ejecuta comandos | Rover con mapa vs Servicio externo | **Rover con mapa** — Tell, Don't Ask |
| D3 | Reporte de obstáculos | Simple / Union discriminada / Clase | **Union discriminada** — type-safe, ligero |
| D4 | Granularidad de VOs | Fina (3 VOs) vs Gruesa (1 VO) | **Fina** — obstáculos son Coordinate sin Direction |
| D5 | Modelado general | Command Pattern / State Machine / Funcional | **State Machine** — cohesivo, YAGNI |
| D6 | MarsMap como autoridad | Rover wrappea vs MarsMap wrappea | **MarsMap** — SRP, Tell Don't Ask |

---

## 7. Artefactos OpenSpec Generados

Todos los artefactos se encuentran en `openspec/changes/mars-rover/`:

| Artefacto | Archivo | Descripción |
|-----------|---------|-------------|
| Proposal | `proposal.md` | Motivación, alcance, non-goals y capabilities |
| Spec: Initialization | `specs/rover/initialization/spec.md` | Creación del rover con posición y orientación |
| Spec: Commands | `specs/rover/commands/spec.md` | Giros L/R, movimiento M/B, secuencias y persistencia |
| Spec: Wrapping | `specs/rover/wrapping/spec.md` | Wrapping en los 4 bordes y backward |
| Spec: Obstacle Detection | `specs/rover/obstacle-detection/spec.md` | Detención, abort de secuencia y reporte |
| Design | `design.md` | 6 decisiones técnicas con alternativas y rationale |
| Tasks | `tasks.md` | 9 grupos de tareas TDD ordenadas inside-out |

**Estado**: ✅ Todos los artefactos completos. Listo para implementar con `/opsx-apply`.

---

## Anexo A: Revisión post-exploración — Estructura de archivos de test

*Discusión del 5 de septiembre de 2026, antes de la implementación.*

### Pregunta del Tech Lead

> Al final del artefacto `design.md` está la file structure, no sé por qué hay un único archivo de test.

La estructura propuesta en el design.md era:

```
src/tests/unit/
└── rover.test.ts      # All kata tests in TDD progression
```

### Análisis presentado

Se identificaron dos opciones:

**Opción A: Un solo archivo** (lo que se propuso)

```
src/tests/unit/
└── rover.test.ts
```

- Argumento: La kata trata de un solo sujeto — el Rover. Un `describe('The Rover')` que progresa en bloques anidados refleja la narrativa TDD de forma lineal.
- Problema: A medida que crecen los tests (giros + movimiento + wrapping + obstáculos + parsing), el archivo se vuelve largo y difícil de navegar. Mezcla comportamientos de dominio distintos.

**Opción B: Un archivo por bloque de comportamiento**

```
src/tests/unit/
├── rover-positioning.test.ts     # Inicialización y giros
├── rover-movement.test.ts        # Avance, retroceso, secuencias
├── rover-wrapping.test.ts        # Superficie esférica
├── rover-obstacles.test.ts       # Detección de obstáculos
└── command-parsing.test.ts       # Parsing de comandos
```

- Argumento: Cada archivo mapea a una capability/spec. Más fácil de localizar, más cohesivo.
- Además: Los testing-standards dicen que los tests viven dentro de cada módulo. Si tenemos 4+ archivos de producción (`Direction`, `Coordinate`, `MarsMap`, `Rover`), tener un solo archivo de test para todos ellos rompe esa correspondencia.

**Valoración del agente**: La Opción B es mejor.

### Cuestionamiento del Tech Lead

> No entiendo: si tu valoración es que B es mejor, que coincido, ¿por qué asumiste sin siquiera preguntar hacerlo siguiendo la opción A? ¿Ha sido por alguna regla o solo por el contexto inicial del boilerplate del proyecto?

### Aclaración del agente

No hubo ninguna regla que justificara la Opción A. Fue un error por dos motivos:

1. **Inercia del boilerplate**: El proyecto tenía un solo `sum.test.ts` y se arrastró esa estructura sin cuestionarla. Se copió el patrón existente en vez de razonar sobre lo que el dominio necesitaba.

2. **Violación de la regla de consulta del AGENTS.md**: Las instrucciones dicen textualmente *"If any aspect is not deterministic, stop and ask the Tech Lead before proceeding"*. La organización de los archivos de test era una decisión de diseño no trivial que debió haberse presentado como opciones — exactamente como se hizo con la mutabilidad del rover o el reporte de obstáculos.

No fue una decisión deliberada. Fue una asunción que no se sometió a escrutinio. Lo correcto habría sido presentar A y B durante la exploración, igual que se hizo con las demás decisiones.

### Decisión

> **✅ Decisión tomada: Opción B — Un archivo de test por bloque de comportamiento.**
>
> Pendiente de actualizar el `design.md` con la corrección.
