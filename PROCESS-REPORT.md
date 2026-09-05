# Mars Rover — Informe del proceso de Apply

Registro de ejecución de `/opsx-apply add-mars-rover`, desde la instrucción del Tech Lead hasta el cierre del change.

- **Ventana**: 2026-09-05 23:28 → 2026-09-06 00:07 (primer `test(red)` → último commit)
- **Resultado**: 54/54 tareas, 47 tests en verde, 100 % de cobertura, `bun run validate` en verde, 82 commits
- **Escrito a petición del Tech Lead**. Es un registro de auditoría de ejecución, que la *Documentation Retention Rule* de `CLAUDE.md` excluye del repositorio — ver [§13](#13-tensión-de-reglas-declarada).

---

## 1. Invocación del comando y selección del change

| Paso | Comando | Resultado |
|---|---|---|
| Selección | `openspec list --json` | Un único change activo: `add-mars-rover` (0/54). Seleccionado automáticamente, anunciando cómo sobreescribirlo. |
| Inspección | `openspec status --change add-mars-rover --json` | Schema `spec-driven`; los cuatro artefactos de planificación completos; `applyRequires: [tasks]`. |
| Instrucciones | `openspec instructions apply --change add-mars-rover --json` | `contextFiles` de proposal, 4 specs, design y tasks; progreso 0/54; estado listo. |

## 2. Contexto leído antes de escribir una sola línea de código

- `openspec/changes/add-mars-rover/proposal.md`, `design.md`, `tasks.md`
- Las cuatro specs de capacidad: `command-parsing`, `obstacle-detection`, `rover-navigation`, `spherical-grid`
- `.claude/skills/backend-hexagonal/SKILL.md` (comprobado si tenía carpeta `references/` — no la tiene, así que la regla de "leer todas las referencias" no aplicaba)
- Configuración del repositorio: `package.json`, `jest.config.js`, `tsconfig.json`, `eslint.config.js`, `.prettierrc`, `.husky/pre-commit`, `.husky/pre-push`, y los `src/core/sum.ts` y `src/tests/sum.test.ts` existentes

Reglas cargadas automáticamente y aplicadas durante todo el proceso: `tdd.md`, `xp-methodology.md`, `coding-standards.md`, `testing-standards.md`, `commit-strategy.md`.

## 3. Restricción del entorno descubierta antes de empezar

`tsconfig.json` activa `noUnusedLocals` y `noUnusedParameters`, y `.husky/pre-commit` ejecuta `lint-staged` (eslint + prettier) **y `tsc --noEmit`**. Por tanto, todo commit — incluidos los RED — debe compilar.

Se escribió y se borró un fichero sonda para confirmar el comportamiento exacto:

```ts
export class Probe {
  constructor(private readonly stored: number) {}
  value(): number { return 0; }
}
// error TS6138: Property 'stored' is declared but its value is never read.
```

Este único hecho condicionó la fase RED de toda la sesión (ver [§5-C](#c-cómo-escribir-un-red-que-compile)).

## 4. Protocolo de trabajo aplicado en cada ciclo

1. Escribir el test que falla (y el andamiaje mínimo que compile) → ejecutar `bun run test` → **verificar el fallo y su motivo** → `test(red): …`
2. Escribir la implementación mínima elegida por TPP → ejecutar la suite → `test(green): …`
3. Refactorizar solo cuando aporta valor → ejecutar la suite → `test(refactor): …`
4. `bun run compile` al cerrar cada grupo de tareas, y `chore(tasks):` para marcar los checkboxes.

Commits por fase: **21 `test(red)`, 36 `test(green)`, 15 `test(refactor)`, 9 `chore(tasks)`, 1 `docs`**.

## 5. Preguntas que me hice y resolví yo mismo, con su justificación

### A. ¿Dónde van los ficheros de test y cuántos son?

`design.md` — Structure dice *"one test file per behaviour block"*. Se crearon siete ficheros bajo `src/core/tests/unit/`, nombrados según su bloque (`RoverPositionAndTurning`, `RoverMovement`, `RoverSequences`, `SphericalSurface`, `ObstacleDetection`, `RoverLanding`, `CommandParsing`), cada uno con `describe('The Rover' | 'The Planet' | 'The Command Sequence')` según `testing-standards`.

### B. ¿Dónde vive la lista TODO de casos, y hasta cuándo?

La tarea 1.2 dice "inside the test file", pero un fichero que solo contiene comentarios hace fallar a Jest con *"Your test suite must contain at least one test"*. **Decisión**: las tareas 1.1 y 1.2 se integraron en el primer commit RED, con la lista completa de los siete bloques en la cabecera del primer fichero de test, eliminada en la tarea 9.1. La suite es ejecutable en todos y cada uno de los commits.

### C. ¿Cómo escribir un RED que compile?

El andamiaje natural (`return null` guardando el colaborador) es imposible: el campo guardado nunca se lee → TS6138, y un parámetro ignorado → TS6133 / `@typescript-eslint/no-unused-vars`.

| Opción | Veredicto |
|---|---|
| Guardar el colaborador en privado y devolver `null` | No compila (TS6138) |
| Dejar que el test falle con "Cannot find module" | `tdd.md` exige un fallo por *comportamiento*, no por compilación |
| Andamiaje temporalmente `public readonly` + `return null` | **Usado en 2.1**; restringido a `private` en el GREEN inmediatamente posterior |
| Un placeholder que *usa* el parámetro y devuelve un valor incorrecto | **Usado en 5.1** (`coordinates.movedBy(1, 1)`) y **8.1** (`map(() => Command.TurnLeft)`), porque una función con forma de identidad no admite ningún placeholder que ignore su parámetro |

**Justificación**: `tdd.md` sanciona explícitamente "empty function, return null, etc." como andamiaje de RED, y `commit-strategy` define el contenido del RED como "the absolute minimum scaffolding required to compile". El desliz de encapsulación nunca sobrevivió más allá del GREEN siguiente.

### D. `Direction` y `Command` como enums

`coding-standards` — Conventions: *"Avoid magic strings, better use enums or literal types"*. Empezaron como enum de strings, creciendo miembro a miembro conforme los tests lo exigían (`North` en 2.1, `West` en 2.2, `South`/`East` en 2.3) — YAGNI aplicado al pie de la letra.

En el refactor 3.5 `Direction` pasó a ser un **value object con comportamiento** sin tocar un solo test, porque `Direction.North` se lee idéntico como miembro de enum y como instancia `static readonly`.

### E. Tests parametrizados que no duplican a uno ya existente

`testing-standards` prohíbe borrar o modificar un test existente sin aprobación. Un `it.each` de cuatro filas para "girar a la izquierda desde cada orientación" habría subsumido al test de caso único escrito un ciclo antes, creando una duplicación que después no tendría permitido eliminar. **Decisión**: los tests parametrizados (2.3, 3.2, 3.4) cubren solo las orientaciones que no estaban ya cubiertas.

### F. TPP en 3.1: ¿constante o escalar?

La Regla de Oro dice que un `(2, 3)` hardcodeado habría pasado. **Decisión**: se implementó `Coordinates.movedNorth()` (`constant → scalar`) porque la constante no codifica nada del dominio y se habría descartado un test después. A diferencia de las tareas 2.1 y 2.2, la tarea 3.1 no fija ninguna transformación esperada, así que había margen.

### G. Tests que nacieron verdes

**15 de los 47 tests pasaron en el momento de escribirse**, sin ningún cambio en producción:

| Bloque | Tests | Por qué no era posible un RED |
|---|---|---|
| 4 — secuencias | 4.1, 4.2, 4.3 | La iteración y la persistencia de estado ya existían: el caso 2.5 (`RRRR`) las forzó |
| 5 — superficie | 5.4, 5.5 | El wrapping vive en `Planet.resolve`, compartido por el avance y el retroceso |
| 6 — obstáculos | 6.4 … 6.8 | La regla de bloqueo de 6.1/6.3 ya cubría retroceso, bordes, giros y recuperación |
| 7 — aterrizaje | 7.2 | `land` resuelve antes de comprobar, así que las coordenadas envueltas ya quedaban cubiertas por 7.1 |
| 8 — parsing | 8.2, 8.5 | `''.split('')` es vacío, y `F`/minúsculas simplemente no están en el vocabulario |
| posteriores a la revisión | aterrizaje sobre obstáculo envuelto, `MMR!` | Misma regla que el test que provocó la corrección |

Se commitearon como `test(green)` sin RED previo. Hacerlos fallar habría exigido borrar comportamiento ya especificado, algo que `testing-standards` prohíbe. Quedan como cierres de especificación.

> **Corrección de un dato dado en el chat.** En el informe intermedio dije «12 tests nacieron verdes»; la cifra exacta, contando los dos posteriores a la revisión de código, es **15 de 47** — coherente con los 36 commits `test(green)` frente a 21 `test(red)`. El desglose por bloque de esta tabla es el bueno.

### H. Un falso verde evitado en 8.3

El test natural — `expect(mission).toThrow()` — habría pasado **por accidente**: con el carácter desconocido, `parseCommands` devolvía `undefined` y `outcomeOf[undefined]()` lanzaba un `TypeError`. **Decisión**: afirmar el mensaje concreto (`'Unknown command'`) para que el RED fallara por el motivo correcto, dejando la identificación del carácter ofensor para 8.4.

### I. Enhebrar la superficie sin dejar un campo muerto (5.1)

Guardar `planet` en el rover sin usarlo → TS6138. **Decisión**: el planeta se enhebró dentro de `execute` (el rover pregunta a la superficie dónde aterriza cada destino) mientras `resolve` era todavía la identidad, de modo que el comportamiento no cambió y todos los tests anteriores siguieron verdes tocando solo los call sites — exactamente lo que exigía la tarea 5.1.

### J. ¿Una pregunta o dos a la superficie? (dejado abierto por `design.md`)

Se mantuvo la forma de dos preguntas (`resolve` y después `hasObstacleAt`) con el orden "resolver primero" visible en ambos call sites, y en la tarea 9.2 decidí explícitamente **no** añadir resolución interna, por YAGNI, ya que ningún test la exigía. La revisión de código demostró después que eso dejaba un agujero latente (hallazgo 1) — ver [§9](#9-preguntas-escaladas-al-tech-lead). *La decisión YAGNI era defendible, pero equivocada: lo que faltaba no era una funcionalidad, era una asimetría.*

### K. Tipo de commit para los checkboxes de tareas

`commit-strategy` solo define `test(red|green|refactor)`. Marcar `tasks.md` dentro de un commit de fase rompería la atomicidad. **Decisión**: `chore(tasks): …`, coherente con el historial `chore:` / `docs:` que ya existe en el repositorio.

### L. Trayectoria de encapsulación de los value objects

`Coordinates` y `Position` empezaron con campos `public readonly` (un VO sin comportamiento dispara TS6138) y se restringieron a `private` en el refactor 5.7, una vez que `wrappedWithin`, `equals` y `cell()` les dieron comportamiento que justificara ese estado.

### M. Usar el subagente `code-reviewer`

Mis propias directrices de operación desaconsejan lanzar subagentes salvo petición expresa. `CLAUDE.md` — *Commands and Subagents* y la tarea 9.5 lo exigen, así que se ejecutó.

### N. Incidente: un commit revertido por el hook

El commit de 4.1 fue rechazado por `lint-staged`: el fichero de test importaba `Command` sin usarlo. El hook revirtió el working tree, así que la edición encadenada nunca llegó a ejecutarse. Se corrigió eliminando el import y volviendo a commitear. Se registra porque demuestra que el hook de pre-commit es una barrera real, no un formalismo.

## 6. Cronología de ejecución y decisiones de diseño por bloque

| Bloque | Ciclos | Decisión tomada |
|---|---|---|
| 1 — banco de pruebas | — | Siete ficheros de test, lista completa de casos en el primero |
| 2 — posición y giros | 2.1 … 2.5 | `nil → constant` y después `constant → constant+`; dos tablas de consulta (`leftOf`, `rightOf`). **Checkpoint 2.6: la Regla de Tres no se cumple (conocimiento duplicado dos veces) → deliberadamente no se abstrae** |
| 3 — movimiento | 3.1 … 3.4 | Desplazamiento por orientación; el anillo aparece por cuarta vez |
| **refactor 3.5** | — | **`Direction` como value object con comportamiento** (anillo horario + vector de paso). `leftOf`, `rightOf`, `cellAhead` y `cellBehind` desaparecieron. `behind` es el vector negado, así que el retroceso no es una regla propia — la segunda forma abierta en `design.md` resuelta por el código |
| 4 — secuencias | 4.1 … 4.3 | Tests nacidos verdes |
| **refactor 4.4** | — | Tabla de despacho de comandos; mutación confinada a una única asignación. Eliminó además un bug latente: la cadena de `if` trataba cualquier comando no reconocido como "girar a la izquierda" |
| 5 — superficie | 5.1 … 5.6 | `Planet(width, height)`; wrapping con `((v % l) + l) % l`, forzado por los bordes sur y oeste (módulo negativo) |
| **refactor 5.7** | — | Ley de Demeter: `x`/`y` y las dimensiones pasan a privados; `Coordinates.wrappedWithin(width, height)` recibe las dimensiones en vez de arrastrarlas |
| 6 — obstáculos | 6.1 … 6.8 | `MissionReport` (posición + obstáculo opcional); obstáculos como dato, nunca como excepción |
| **refactor 6.9** | — | **Recursión** para el aborto temprano (TPP #9, pura). Sustituida después por `for...of` + `break` por decisión del Tech Lead — ver [§9](#9-preguntas-escaladas-al-tech-lead) |
| 7 — aterrizaje | 7.1, 7.2 | Constructor privado + factoría `Rover.land`; todos los call sites migrados |
| 8 — parsing | 8.1 … 8.5 | Factoría de frontera `parseCommands`; el rover nunca ve un string crudo |
| 9 — cierre | 9.1 … 9.6 | Lista TODO eliminada, refactor final, invariantes verificados, `validate`, revisión e informe |

## 7. Desviaciones respecto al proceso documentado

| # | Desviación | Justificación |
|---|---|---|
| 1 | El andamiaje RED tuvo que *usar* sus parámetros (o exponerlos públicamente) en lugar de `return null` | `noUnusedLocals` / `noUnusedParameters` + `tsc --noEmit` en el hook de pre-commit. Siempre restringido en la fase siguiente |
| 2 | 15 tests commiteados como `test(green)` sin RED | El comportamiento ya estaba implicado por GREENs anteriores; forzar un RED habría exigido borrar comportamiento especificado (`testing-standards` lo prohíbe) |
| 3 | 3.1 usó `constant → scalar` en lugar de una constante pura | La tarea no fijaba transformación esperada; la constante no codificaba nada del dominio |
| 4 | Tipo de commit `chore(tasks):`, ausente de `commit-strategy` | Mantiene los artefactos de planificación fuera de los commits de fase TDD; coherente con el historial del repo |
| 5 | `Command` implementado como `enum`, mientras `design.md` decía "literal union" | `coding-standards` permite ambos. Se señaló como discrepancia doc/código y los artefactos se alinearon después (commit `docs:`) |
| 6 | Las tareas 1.1 y 1.2 se commitearon junto al primer RED | Un fichero de test con solo comentarios rompe la ejecución de Jest |
| 7 | La decisión de 6.9 (recursión) se revisó después de implementarla | Decisión posterior del Tech Lead tras la revisión, aplicada como refactor con la suite en verde |

## 8. Revisión de código (tarea 9.5) — hallazgos y tratamiento

El subagente `code-reviewer` reportó diez hallazgos. Tratamiento:

| # | Severidad | Hallazgo | Tratamiento |
|---|---|---|---|
| 1 | ALTA | Un obstáculo declarado más allá de un borde es invisible: los obstáculos nunca se normalizaban | **Escalado → corregido** con un ciclo TDD completo |
| 2 | ALTA | `CommandParsing.test.ts` contenía una aserción que no podía fallar (demostrado por mutación) | **Escalado → test reescrito** |
| 3 | MEDIA | El vocabulario de comandos estaba declarado dos veces; la copia no tenía comprobación de exhaustividad | **Corregido de inmediato** (`test(refactor)`): derivado del propio enum |
| 4 | MEDIA | `hasObstacleAt` arrastraba una precondición no escrita (su argumento debía venir ya resuelto) | **Escalado → corregido** junto al hallazgo 1 |
| 5 | BAJA | El orden de miembros en `Rover` se apartaba de `coding-standards` §3 | **Corregido de inmediato** (puro movimiento de código) |
| 6 | BAJA | El ejecutor recursivo desbordaba la pila a ~5000 comandos | **Escalado → sustituido por `for...of`**; verificado con 50 000 comandos |
| 7 | BAJA | `quarterTurnsInRing` nombraba un índice, no un número de giros | **Corregido de inmediato** (renombrado a `positionInRing`) |
| 8 | BAJA | `MissionReport` encapsula menos que sus vecinos | **Sin cambios**: la forma la fijaba `design.md` |
| 9 | BAJA | Discrepancia doc/código: `enum` frente a "literal union" | **Escalado → artefactos alineados** |
| 10 | BAJA | El escenario de spec `MMR!` no tenía test propio | **Escalado → test añadido** |

Los hallazgos 3, 5 y 7 se aplicaron sin preguntar: son refactors que preservan el comportamiento y están respaldados explícitamente por las reglas, y la tarea 9.5 obliga a atender la revisión. Todo lo que tocaba un test o un requisito no especificado se escaló, como exigen `testing-standards` y `CLAUDE.md` — *Instruction Handling*.

## 9. Preguntas escaladas al Tech Lead

Planteadas en español mediante la herramienta de preguntas; recogidas aquí con las mismas opciones.

### Q1 — Obstáculos declarados fuera de la rejilla (hallazgos 1 + 4)

**Contexto**: `new Planet(5, 5, [new Coordinates(7, 2)])` — el obstáculo nombra la celda `(2, 2)` pero era invisible, porque la regla de wrapping se aplicaba a las coordenadas del rover y nunca a los datos propios de la superficie. Ningún escenario de spec lo cubre, así que corregirlo suponía añadir comportamiento no especificado.

| Opción | Justificación ofrecida |
|---|---|
| **Corregir con ciclo TDD** *(recomendada)* | Normalizar los obstáculos al construir `Planet` y hacer `hasObstacleAt` total, empezando por un `test(red)` que exponga el agujero. Elimina la asimetría con `design.md` — *On a sphere there is no "outside"* |
| Dejarlo y documentarlo | Ninguna spec lo exige; YAGNI. Anotarlo como Open Question en `design.md` |
| Solo hacer `hasObstacleAt` total | Refactor sin cambio de comportamiento que elimina la precondición no escrita, pero no arregla el obstáculo invisible |

> **Decisión del Tech Lead: corregir con ciclo TDD.**
> Aplicado: `test(red)` → `test(green)` (obstáculos normalizados en el constructor) → un segundo test para el lado del aterrizaje → `test(refactor)` haciendo la pregunta de ocupación independiente de quien la formula.

### Q2 — Una aserción de test que no podía fallar (hallazgo 2)

**Contexto**: en `CommandParsing.test.ts`, `parseCommands` lanza mientras se evalúa el argumento, así que `rover.execute` nunca llegaba a entrar y "el rover no se movió" era trivialmente cierto. Modificar o borrar un test requiere aprobación del Tech Lead.

| Opción | Justificación ofrecida |
|---|---|
| **Reescribirlo** *(recomendada)* | Dejarlo como la afirmación que el diseño realmente hace — la secuencia se rechaza antes de llegar al rover — y quitar la aserción vacua |
| Dejarlo como está | Documenta el escenario de spec *Unknown character in the middle of the sequence*, aunque la aserción esté garantizada por el parseo en la frontera |
| Borrarlo | Queda cubierto por los tests de parseo; menos ruido, pero pierde la trazabilidad con ese escenario |

> **Decisión del Tech Lead: reescribirlo.**
> Aplicado como `test(refactor): drop the assertion that could not fail`; el test es ahora `never receives a sequence that contains an unknown character` y afirma el mensaje exacto de rechazo.

### Q3 — Hallazgos menores (selección múltiple)

| Opción | Justificación ofrecida | Decisión |
|---|---|---|
| Test del escenario `MMR!` | Hallazgo 10: el escenario no tenía test propio, solo cobertura transitiva | ✅ Elegida |
| Alinear `design.md` con el enum | Hallazgo 9: el artefacto decía "literal union" mientras el código usa un enum de TypeScript, permitido por `coding-standards` | ✅ Elegida |
| Cambiar recursión por `for...of` | Hallazgo 6: `reportOfExecutingAll` desbordaba la pila a ~5000 comandos. Quita el techo pero renuncia a la pureza elegida en 6.9 | ✅ Elegida |
| Ninguna de ellas | Cerrar el change tal como estaba | — |

> **Aplicado**: el test de `MMR!` (nacido verde), el commit `docs:` alineando `design.md` y `tasks.md`, y el refactor a `for...of` + `break` — verificado con una sonda desechable de 50 000 comandos, que ahora se ejecuta en 26 ms.

## 10. Estado final

```
src/core/
├── Rover.ts            entity, the only mutable object
├── Planet.ts           width, height, normalised obstacles, coordinate resolution
├── Position.ts         coordinates + orientation (value object)
├── Coordinates.ts      value object
├── Direction.ts        value object with behaviour (clockwise ring + step vector)
├── Command.ts          command vocabulary + parsing factory
├── MissionReport.ts    final position + optional obstacle
└── tests/unit/         seven files, one per behaviour block
```

- 47 tests en 8 suites, 100 % de sentencias / ramas / funciones / líneas
- `bun run validate` (compile + lint + test) en verde
- El código de producción de `src/core` solo importa sus propios módulos relativos — **cero dependencias externas**
- Sin puertos, sin adaptadores, sin capa de aplicación (YAGNI, según `proposal.md` — Non-goals)
- `src/core/sum.ts` y `src/tests/sum.test.ts` intactos, según lo acordado

## 11. Cierre del change: hueco de spec detectado y sincronización

Al ejecutar `/opsx-archive` (2026-09-06), la evaluación previa a la sincronización destapó una incoherencia entre el código y las specs.

### La raíz

Las cuatro delta specs se escribieron durante `/opsx-propose`, **antes** de implementar. El comportamiento aprobado en [Q1 de §9](#q1--obstáculos-declarados-fuera-de-la-rejilla-hallazgos-1--4) — *un obstáculo nombrado más allá de un borde ocupa la celda a la que envuelve* — nació **después**, durante la revisión de código: se implementó con su ciclo TDD y quedó cubierto por tres tests, pero ningún requisito lo describía.

Con `openspec/specs/` vacío, las cuatro delta specs eran altas puras: sincronizar tal cual habría creado la **línea base de capacidades del repositorio diciendo menos de lo que el código hace**, y el próximo change habría partido de esa base incompleta. Se escaló como pregunta antes de tocar nada.

### Cómo se resolvió: edición quirúrgica de las delta specs antes de sincronizar

No fue un cambio de código ni una regeneración de artefactos: se editaron a mano las dos specs afectadas, mientras el change seguía activo y las specs aún no habían llegado a `openspec/specs/`.

| Fichero | Edición |
|---|---|
| `specs/spherical-grid/spec.md` | En el requisito *No coordinate is ever outside the surface*, la frase que acotaba la normalización a las coordenadas del rover pasa a cubrir **toda** coordenada que la superficie maneja, obstáculos incluidos. Nuevo escenario *Declaring an obstacle beyond an edge* |
| `specs/obstacle-detection/spec.md` | En el requisito *An obstacle prevents the rover from entering a cell*, cláusula indicando que los obstáculos se normalizan con la misma regla de wrapping. Dos escenarios nuevos: bloqueo en movimiento y rechazo en el aterrizaje |

La regla raíz vive en `spherical-grid` (es la superficie quien normaliza) y `obstacle-detection` aporta los dos escenarios observables — uno por cada test que ya existía. Escenarios totales: **39 → 42**, sin tocar el número de requisitos (19). `openspec validate add-mars-rover` → válido.

### Cómo se sincronizó y archivó: el comando oficial del CLI

En lugar del `mkdir` + `mv` a mano que describe el slash command, se usó **`openspec archive add-mars-rover -y`**, que el propio CLI define como *"Archive a completed change and update main specs"*: hace la sincronización y el movimiento en una sola operación consistente.

```
archivedAs:   2026-09-06-add-mars-rover
specsUpdated: true
totals:       added 19, modified 0, removed 0, renamed 0
```

Resultado: `openspec/specs/` pasa de vacío a las cuatro capacidades (`command-parsing`, `obstacle-detection`, `rover-navigation`, `spherical-grid`), con 19 requisitos y 42 escenarios; `openspec validate --specs` → 4/4 válidas; el change vive en `openspec/changes/archive/2026-09-06-add-mars-rover/`; no quedan changes activos.

### Sin commits

Por indicación expresa del Tech Lead, este cierre **no generó ningún commit**: la edición de las specs, la sincronización, el archivado y esta misma sección quedaron en el working tree para que los revise y los commitee él.

## 12. Asuntos abiertos para el Tech Lead

- `src/tests/sum.test.ts` usa `it('should sum two numbers')`, que incumple la regla de nombrado de `testing-standards`. Tocarlo requiere aprobación; se ha dejado como estaba.
- `MissionReport` expone campos `public readonly` y hace además de acumulador por comando. La forma la fijaba `design.md`; una unión discriminada `Completed | Blocked` sigue siendo un refactor legítimo para más adelante.
- Las dimensiones no positivas de la superficie siguen siendo la Open Question registrada en `design.md`; ningún escenario las necesita.

## 13. Tensión de reglas declarada

`CLAUDE.md` — *Documentation Retention Rule* excluye del repositorio cualquier documentación que sea solo "historical planning, progress logging, execution audit trails". **Este documento es exactamente eso**, y se escribió porque el Tech Lead lo pidió de forma explícita.

Se plantearon tres salidas conformes: mantenerlo fuera del control de versiones, archivarlo junto al change en `openspec/changes/archive/`, o commitearlo en la raíz asumiendo la excepción. **El Tech Lead lo commiteó en la raíz**, resolviendo la tensión a favor de conservarlo; esta nota queda como la declaración explícita de esa excepción, que `CLAUDE.md` exige no dar nunca por supuesta.

## 14. Nota sobre el idioma de este documento

`CLAUDE.md` — *Purpose* establece que la conversación se mantiene en español pero que **el código, los artefactos del repositorio y los ficheros de instrucciones se escriben en inglés**. Al ser este fichero un artefacto del repositorio, se redactó originalmente en inglés en aplicación de esa regla.

Su traducción al español se hizo **después y por petición expresa del Tech Lead**, que prevalece sobre la convención por decisión suya. Se conservan en inglés los identificadores, nombres de fichero, mensajes de commit, nombres de test y las citas literales de las reglas y de los artefactos de OpenSpec, porque son código o texto exacto de artefactos y traducirlos rompería la trazabilidad.
