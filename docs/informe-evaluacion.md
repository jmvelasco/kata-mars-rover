# 📋 Informe de evaluación técnica — Kata Mars Rover

|                             |                                                                               |
| --------------------------- | ----------------------------------------------------------------------------- |
| **Objeto de la revisión**   | Solución de la Kata Mars Rover en la rama `solution-01`                       |
| **Commit evaluado**         | `8e933d1` — _chore: fix deprecated setup options and tighten project tooling_ |
| **Fecha**                   | 2026-08-12                                                                    |
| **Enfoque**                 | Revisión por pares con criterio de evaluador de prueba técnica                |
| **Enunciado de referencia** | [Readme.md](../Readme.md) § _Enunciado de la Kata_                            |

Se evalúa la variante completa de la kata tal y como la plantea el README: grid con estado persistente, wrapping esférico en los cuatro bordes, comandos `L`/`R`/`M`|`F`/`B` y detección de obstáculos con aborto de secuencia y reporte.

Los hallazgos están verificados por ejecución, no solo por lectura: suite completa con cobertura, `tsc --noEmit`, `eslint .` y un script de sondeo sobre la API pública.

```text
Cobertura:  97.87% stmts | 87.5% branch | 21/21 tests verdes
            rover-controller.ts:37  <-- única línea sin cubrir

command('M')            => TypeError: undefined is not an object (evaluating 'position.value')
command('X')            => TypeError (idem)
command('f')            => TypeError (idem)
initialize(99,99) 10x10 => "99:99:N"   (rover fuera del planeta)
Position(1.5,0) + F     => "1.5:1:N"   (nunca vuelve a envolver)
updatePosition(42,42)   => "42:42:S"   (teletransporte desde fuera)
un solo comando 'F'     => invoca rotateLeft, rotateRight, moveForward Y moveBackward
```

---

## 1. Veredicto ejecutivo

Entrega con una **base de ingeniería notablemente buena y un modelado a medio camino**. La descomposición en `Orientation` / `Position` / `Surface` con value objects inmutables es la decisión correcta y está bien ejecutada en su parte central. Pero la solución está **funcionalmente incompleta** (falta el requisito 4 completo y el comando `M`), tiene las **responsabilidades del wrapping mal ubicadas** (`Surface` es un contenedor de datos vacío mientras el controlador hace su trabajo), y arrastra un **idiom de despacho mal aplicado** que ejecuta los cuatro comandos en cada paso. La suite está verde y con umbrales, pero deja sin test un requisito que el enunciado subraya y una de las cuatro ramas de wrapping.

## 2. Cobertura del enunciado

| Req.                         | Estado                 | Detalle                                                                                                               |
| ---------------------------- | ---------------------- | --------------------------------------------------------------------------------------------------------------------- |
| 1. Posición e inicialización | ✅ Cumplido            | `(x, y, orientación)` correcto. Sin validación de invariantes.                                                        |
| 2. Procesamiento de comandos | ⚠️ Parcial             | `L`/`R`/`F`/`B` correctos. **`M` no soportado** (el enunciado lo exige). Entrada inválida → excepción opaca.          |
| 2b. Persistencia de estado   | ✅ Cumplido            | Funciona. **Sin ningún test que lo cubra.**                                                                           |
| 3. Wrapping esférico         | ⚠️ Parcial             | Funciona en los 4 bordes, pero por igualdad exacta en lugar de módulo, con un eje por llamada y una rama sin testear. |
| 4. Detección de obstáculos   | ❌ **No implementado** | Sin `Obstacle`, sin aborto, sin reporte. La API actual además no lo admite.                                           |

## 3. Puntos fuertes

1. **Inmutabilidad consistente.** Todos los campos `readonly`, y cada operación devuelve una instancia nueva en lugar de mutar. Es lo que hace que el resto del código sea razonable y lo que salva varios de los problemas de abajo de convertirse en bugs.
2. **`Orientation` está bien resuelta.** Encapsular el orden cíclico en un array privado y rotar con aritmética modular (`+3 % 4` / `+1 % 4`) es limpio, simétrico, sin `switch` y sin casos especiales. Es el módulo mejor diseñado del repo, y el único con un `equals` propio.
3. **Descomposición y refactor progresivo.** El historial muestra un movimiento deliberado desde una clase única hacia módulos por concepto, en pasos acotados y con mensajes descriptivos: extraer `Orientation`, extraer `Surface`/`Position`, mover los comandos a métodos de `Position`. La dirección del refactor es la correcta.
4. **Toolchain de nivel profesional**, muy por encima de lo habitual en una kata: `strict` más `noUnusedLocals`, `noUnusedParameters`, `noImplicitReturns`, `noImplicitOverride`, `noFallthroughCasesInSwitch`, `forceConsistentCasingInFileNames`; ESLint 9 flat config con `recommendedTypeChecked` restringido a `src` e integración con Prettier; hooks de Husky en `pre-commit` (lint-staged + compile) y `pre-push` (`validate`); `tsconfig.build.json` separado que excluye tests del artefacto; `lib/` y `coverage/` correctamente ignorados. Los comentarios del `eslint.config.js` explican el _por qué_ de la separación CommonJS, no el qué.
5. **Repo cuidado.** README con enunciado, prerrequisitos, `.nvmrc`, scripts documentados y umbrales de cobertura configurados (no solo medidos). `validate` como puerta única de calidad.

## 4. Hallazgos por severidad

### Altos

**H1 — El requisito 4 no existe.** No hay concepto de obstáculo en ninguna parte del dominio, ni aborto de secuencia, ni reporte. Es 1 de los 4 requisitos y precisamente **el que discrimina el diseño**: es el que introduce "un comando puede fallar" y obliga a decidir cómo se propaga ese fallo. Agrava el problema que la API actual no lo admite sin romperla: `command()` devuelve `void` ([rover-controller.ts:16](../src/core/rover-controller.ts#L16)), así que no existe canal alguno para "reportar la presencia del obstáculo encontrado". En una prueba técnica esto pesa más que cualquier otro hallazgo del informe.

**H2 — El comando `M` no está soportado**, y el enunciado lo cita literalmente ("`M` (o `F`): Avanza"). No se ignora ni se rechaza: `command('M')` lanza `TypeError: undefined is not an object`. Un evaluador que pruebe la API con el vocabulario clásico de la kata (`LMLMLMLMM`) la rompe en el primer intento.

**H3 — Cast no seguro que anula la única red de seguridad del tipado.** `command` acepta `string` y hace `split('') as commands[]` ([rover-controller.ts:17](../src/core/rover-controller.ts#L17)). El tipo `commands` existe pero se _afirma_, no se _valida_: el compilador queda convencido de algo que en runtime es falso. Cualquier carácter desconocido, minúscula, espacio o cadena vacía produce `undefined` en el lookup y explota dos frames más abajo, dentro de `updatePosition`. No hay error de dominio, ni política de "comando ignorado", ni nada documentado. El fallo se manifiesta lejos de su causa, que es lo peor de los dos mundos.

**H4 — Evaluación anticipada: cada paso ejecuta los cuatro comandos.** `executeCommand` construye un objeto literal cuyos cuatro valores son _llamadas ya resueltas_, y solo después indexa ([rover-controller.ts:23-30](../src/core/rover-controller.ts#L23-L30)). Verificado instrumentando el prototipo: un único `'F'` invoca `rotateLeft`, `rotateRight`, `moveForward` **y** `moveBackward`. Y `moveForward`/`moveBackward` repiten el mismo patrón internamente ([position.ts:22-38](../src/core/position.ts#L22-L38)), creando cuatro `Position` cada uno — del orden de diez instancias por paso, nueve descartadas.

Hoy no produce un bug observable, pero **solo** porque `Position` es inmutable y sus métodos son puros. Esa es una garantía accidental y no documentada. En el momento en que un comando tenga cualquier efecto —consultar obstáculos (H1), contar movimientos, validar, loguear, emitir un evento— los cuatro efectos se dispararán en cada paso. Es el hallazgo que más pesa en la revisión de diseño porque no es un descuido local: es un idiom repetido en dos módulos. La intención (tabla de despacho en vez de `switch`) es buena; lo que se tabula son valores donde deberían diferirse funciones.

### Medios

**H5 — El wrapping está en el sitio equivocado y `Surface` es anémica.** Toda la topología del planeta vive en `RoverController.updatePosition` ([rover-controller.ts:32-39](../src/core/rover-controller.ts#L32-L39)), mientras `Surface` se limita a exponer `dimension()`: un contenedor de datos sin comportamiento. El controlador invoca `this.surface.dimension()` **cuatro veces en el mismo método** para hurgar en sus interioridades y decidir en su nombre — _feature envy_ y violación de tell-don't-ask de manual. Lo llamativo es que el mensaje del commit `a2bcba9` dice "manage wrapping surface" pero el resultado hizo justo lo contrario: vació `Surface` y trasladó su lógica al controlador. El historial lo confirma: ese mismo commit **borró** `src/tests/surface.test.ts`.

**H6 — Wrapping por igualdad exacta en lugar de aritmética modular.** Cuatro ramas encadenadas con `y === rows`, `y < 0`, `x < 0`, `x === columns`. Tres consecuencias:

- Al ser una cadena `else if`, **solo corrige un eje por llamada**. Es correcto únicamente bajo el invariante implícito "los movimientos son de ±1 partiendo de una posición válida", invariante que no está documentado ni testeado ni forzado en ningún sitio.
- Trata **asimétricamente el mismo concepto**: el borde superior por igualdad, el inferior por `< 0`. Es una sola operación (módulo positivo) escrita de dos maneras distintas y repetida por eje.
- Falla en silencio si el invariante se rompe. Verificado: con una coordenada `1.5` el rover avanza indefinidamente y **nunca vuelve a envolver**, porque `x === columns` no se cumple jamás. Contrasta con `Orientation`, donde el mismo problema circular sí se resolvió con módulo.

**H7 — Sin invariantes ni validación.** Verificado: `initialize` acepta una posición inicial en `99:99` sobre un grid de 10×10 y la mantiene tal cual; acepta `-5:-5`; acepta `new Surface(0, 0)` y deja al rover irse a `0:1` de una superficie de tamaño cero; acepta coordenadas fraccionarias. Los `static create` / `initialize` de `Position`, `Orientation` y `RoverController` existen pero **no aportan nada**: no validan, no normalizan y no nombran mejor que `new`. Son ceremonia donde había un sitio natural para poner las precondiciones.

**H8 — Fuga de encapsulación: `updatePosition` es público.** No lleva modificador ([rover-controller.ts:32](../src/core/rover-controller.ts#L32)) en una clase donde todo lo demás está anotado explícitamente (`public command`, `private executeCommand`), lo que lo delata como descuido y no como decisión. Verificado: cualquier cliente teletransporta el rover a `42:42` saltándose los comandos. Es además el único método público sin test propio.

**H9 — Duplicación de conocimiento en el mapa dirección→vector.** `moveForward` y `moveBackward` son literalmente la misma tabla con los signos invertidos ([position.ts:22-38](../src/core/position.ts#L22-L38)). Y el reparto de responsabilidades está invertido: `Orientation` sabe su orden cíclico pero no sabe hacia dónde apunta, así que `Position` le pregunta `orientation.value()` y decide por ella indexando sobre el string. Es el mismo _ask_ que en H5, una capa más abajo. Si la orientación conociera su propio vector, ambas tablas desaparecerían y `moveBackward` sería `moveForward` con el vector opuesto.

**H10 — `Surface(rows, columns)` transpone el orden respecto a `Position(x, y)`.** Semántica de matriz frente a semántica cartesiana en dos clases que colaboran en cada movimiento. El mapeo interno **es correcto** —verificado con `Surface(2, 5)`: `y` envuelve en 2 y `x` en 5—, pero quien escriba `new Surface(ancho, alto)` obtiene un planeta transpuesto sin ningún aviso, y **ningún test lo detectaría**, porque todos usan `10×10`.

### Bajos

**H11 — Nombres de tipos fuera de convención.** `type commands` ([rover-controller.ts:4](../src/core/rover-controller.ts#L4)) y `type directions` ([orientation.ts:1](../src/core/orientation.ts#L1)): minúscula y plural para tipos que representan **un** elemento. Además `directions` se exporta (y se reexporta en el índice) mientras `commands` no, sin razón aparente. Con `@typescript-eslint/naming-convention` activo saltarían solos.

**H12 — Idioma de construcción inconsistente.** Factorías estáticas con tres nombres distintos (`create`, `create`, `initialize`) conviviendo con constructores públicos, y `Surface` sin factoría. Los propios tests usan las dos vías indistintamente: `new Position(...)` en [position.test.ts:6](../src/tests/position.test.ts#L6) frente a `Position.create(...)` en [rover-controller.test.ts:10](../src/tests/rover-controller.test.ts#L10). Dos formas públicas de hacer lo mismo es una decisión que hay que tomar, no dejar abierta.

**H13 — `RoverController` no es un controlador.** Guarda el estado y aplica las reglas del dominio: es el agregado `Rover`. "Controller" apunta a capa de aplicación o adaptador, y en el modelo no existe ninguna entidad `Rover`. Coherente con esto, `Position.value()` es un _getter bag_ que devuelve un objeto con el `Orientation` dentro y existe solo para que el controlador reconstruya posiciones desde fuera — un síntoma de que la lógica está en la clase equivocada.

## 5. Calidad de la suite de tests

Lo bueno: 21 tests verdes en 3 suites, un test por módulo, umbrales de cobertura al 80% **configurados** (no solo medidos) y superados, `clearMocks`/`restoreMocks`, un helper de construcción en `position.test.ts` que reduce el ruido, y `beforeEach` limpio en el controlador.

Los problemas:

- **T1 — Una de las cuatro ramas de wrapping no está cubierta.** La cobertura señala [rover-controller.ts:37](../src/core/rover-controller.ts#L37) como única línea sin ejecutar: el borde este. Ese es exactamente el 87.5% de ramas. Tres bordes testeados y el cuarto no, en la característica que da nombre al requisito 3.
- **T2 — El requisito de persistencia de estado no tiene test.** El enunciado lo pone en negrita y hay un commit dedicado a aclararlo (`85cbac2`, "docs: clarify state persistence"), pero los 14 tests del controlador hacen **una sola** llamada a `command()`. El comportamiento funciona (verificado: `F` y luego `F` → `0:2:N`), pero nada lo protege de una regresión.
- **T3 — Los nombres describen la mecánica, no la regla.** `should execute the command BRBLFF correctly` no dice qué comportamiento se está fijando; obliga a simular la ejecución mentalmente para saber si el `9:1:N` esperado es el correcto. Cuando ese test se ponga rojo, su nombre no ayudará a diagnosticar nada. Los tests deberían nombrar reglas ("envuelve al cruzar el borde sur", "rotar no cambia de casilla"), no cadenas de entrada.
- **T4 — Un nombre directamente falso**: `should execute the command FFF correctly` ejecuta en realidad `'FFFLF'` ([rover-controller.test.ts:76-79](../src/tests/rover-controller.test.ts#L76-L79)). Copy-paste sin revisar; en una revisión real es comentario inmediato y resta credibilidad al resto de la suite.
- **T5 — Toda la suite acoplada al formato de presentación.** Casi todas las aserciones van contra `display()`, es decir contra la cadena `x:y:O`. Cambiar el formato de salida pondría en rojo unos 19 tests que no tienen nada que ver con la presentación. Y es incoherente dentro del propio repo: `orientation.test.ts` sí compara por valor con `equals` —el enfoque correcto—, pero `Position` no tiene `equals`, así que su API de value object está a medio construir.
- **T6 — Combinaciones incompletas y sesgadas en `position.test.ts`.** `moveForward` solo prueba N y E, `moveBackward` solo S y W ([position.test.ts:29-37](../src/tests/position.test.ts#L29-L37)): 4 de 8 combinaciones. Y las cuatro elegidas son precisamente las que **no** producen coordenadas negativas, lo que oculta que `Position` aislada sí las genera y que nadie más las normaliza.
- **T7 — Regresión de cobertura registrada en el historial.** El commit `a2bcba9` eliminó `src/tests/surface.test.ts`, que probaba el wrapping sobre una malla **no cuadrada** (10×13). Al mover la lógica al controlador no se reprodujo un test equivalente: se perdió el único test con dimensiones asimétricas y `Surface` se quedó sin suite. Es la causa raíz común de T1 y H10. Mover lógica en un refactor y no llevarse los tests con ella es el patrón que más caro sale.
- **T8 — Sin tests de entrada inválida ni de límites**: cadena vacía, minúsculas, caracteres desconocidos, superficie 1×1.
- Detalle menor: el `testMatch` contempla `__tests__/` y `.spec.ts`, patrones que nadie usa en el repo.

## 6. Proceso e ingeniería

- **Sin CI.** No existe `.github/`. Los hooks de Husky son locales y saltables con `--no-verify`; nada garantiza la puerta de calidad en el remoto. Con `test:ci` ya escrito en `package.json`, la ausencia del workflow es la pieza que falta más visible del tooling.
- **Evidencia de TDD débil.** El primer commit de solución (`93b402a`) entra con la implementación completa y sus tests de golpe —105 líneas de producción y 69 de test— bajo el mensaje "provide an initial solution with test in green". No hay cadencia rojo-verde-refactor observable en ningún punto del historial. Los tres commits siguientes son refactors buenos y bien acotados, y es lo mejor del log; pero en una prueba técnica donde se evalúa el proceso, un historial sin pasos pequeños no permite distinguir TDD de test-after.
- **Convención de commits inconsistente**: `chore:`/`docs:` conviven con mensajes sin prefijo. Y `a2bcba9` mete en un solo commit un refactor grande, un cambio de API pública y el borrado de una suite de tests: tres intenciones distintas que deberían haber sido tres commits, precisamente para que la pérdida de cobertura fuera visible al revisar.
- El paquete se publica como librería (`main`/`types` hacia `lib/`) pero es `private` y no tiene punto de entrada ejecutable ni ejemplo de uso; `src/index.ts` solo reexporta. No es un defecto, pero la kata no se puede "ver funcionar" sin escribir código propio.

## 7. Prioridad de mejora

Por relación impacto/coste, y en este orden:

1. Implementar obstáculos, lo que fuerza rediseñar el retorno de `command()` para poder reportar el aborto (H1 + el hueco de API).
2. Cerrar la entrada: validar la cadena de comandos en la frontera y eliminar el cast, dando soporte a `M` (H2, H3).
3. Diferir el despacho en lugar de tabular valores ya calculados, en los tres sitios donde aparece (H4) — prerrequisito para que (1) no dispare efectos espurios.
4. Devolver el wrapping a `Surface` y expresarlo con módulo positivo por eje (H5, H6), recuperando de paso un test con malla no cuadrada (T7) y cubriendo el borde este (T1).
5. Cerrar `updatePosition` y poner precondiciones en las factorías (H7, H8).
6. Reescribir los nombres de los tests como reglas de negocio, corregir el nombre falso, añadir el test de persistencia de estado y desacoplar las aserciones de `display()` mediante igualdad por valor (T2–T6).
7. Añadir CI ejecutando `validate`.

## 8. Preguntas de entrevista

Son las que mejor separan "funciona" de "sé por qué funciona":

- ¿Cuántas veces se ejecuta `moveForward` cuando envío el comando `R`? ¿Y por qué eso no rompe nada hoy?
- Si `Surface` no expusiera `dimension()`, ¿dónde tendría que vivir el wrapping?
- ¿Qué pasa si envío `command('LMLMLMLMM')`, el vocabulario clásico de esta kata?
- El wrapping usa `y === rows` para el borde norte y `y < 0` para el sur. ¿Es el mismo concepto? ¿Por qué se escribe de dos formas?
- Si añades obstáculos, ¿cómo se enteran quien llama de que la secuencia se abortó, con la firma actual de `command()`?
- Un test se llama `should execute the command FFF correctly`. ¿Qué ejecuta?

## 9. Nota

| Dimensión                            | Peso | Nota  |
| ------------------------------------ | ---- | ----- |
| Cumplimiento funcional del enunciado | 30%  | **5** |
| Diseño y modelado del dominio        | 25%  | **6** |
| Calidad de los tests                 | 25%  | **6** |
| Código limpio y legibilidad          | 10%  | **7** |
| Ingeniería, tooling y proceso        | 10%  | **8** |

### Nota global: 6 / 10

**Lectura como prueba técnica de selección:** _aprobado con reservas_. La entrega demuestra criterio real —inmutabilidad, value objects, refactor progresivo, un toolchain que muchos seniors no montan— y por eso no es un descarte. Pero no supera el filtro tal cual, por dos motivos que en una prueba pesan más que la elegancia del código: **está incompleta** (falta el requisito que precisamente obliga a diseñar el camino de error) y **el idiom de despacho revela un malentendido sobre cuándo se evalúa lo que se escribe**, no un despiste puntual.

Calibrando por nivel: para un perfil **junior/mid** es un resultado sólido y contratable, con feedback claro y accionable. Para un perfil **senior**, no pasa: se esperaría el enunciado completo, el wrapping en `Surface`, la frontera de entrada cerrada y una suite que testee reglas en lugar de cadenas de comandos.

**Lo que más subiría la nota con menos esfuerzo:** los puntos 1 a 4 de la sección 7. Con obstáculos implementados, el despacho diferido y el wrapping devuelto a `Surface`, esta misma entrega se movería a un 8 sin tocar la arquitectura general, porque los cimientos ya están bien puestos.
