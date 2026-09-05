## Context

Greenfield domain: `src/core` currently holds only the template's `sum.ts`. There are no consumers, no persistence, no transport — nothing that forces a boundary. See `proposal.md` — Why for motivation, and the four capability specs for the behaviour contract.

Two constraints shape everything below:

- `src/core` must have **zero external dependencies** — the only rule of the hexagonal skill that is active from day one.
- Implementation is **strictly TDD with TPP**. This document fixes the decisions that the kata statement left undefined; it deliberately does **not** fix the shapes that the Red-Green-Refactor cycle is supposed to discover.

## Goals / Non-Goals

**Goals:**

- A domain expressive enough that every spec scenario reads as a two-or-three-line test with no setup ceremony.
- Exactly one mutable object in the whole design, with every calculation around it pure.
- Invalid states unrepresentable at the type level where it costs nothing — the rover should never hold a command it cannot execute.
- A design that can absorb an adapter later (CLI, HTTP, UI) without touching the domain.

**Non-Goals:**

- Prescribing how turning, moving or sequence iteration are coded. Those emerge in REFACTOR, after the Rule of Three.
- Any abstraction introduced "so that it will be easy later". See `proposal.md` — Non-goals for the scope boundaries.

## Decisions

### The rover is the only mutable object

`Rover` is an **entity**: it has identity and a lifecycle — it is the same rover that stays on Mars between sequences. Its coordinates, orientation and position are **immutable value objects**, so mutation is confined to a single private reassignment while every geometric calculation stays pure and trivially testable.

*Alternatives considered.* A fully immutable rover returning a new instance from every execution makes tests pure, but the statement demands state persistence — so a `Mission` or `Control` object would have to hold the latest instance and would itself become mutable. That moves the state rather than removing it, and adds an element Simple Design would not justify. A classically mutable rover holding raw `x`, `y` and `direction` fields is the most literal reading of the statement but spreads mutation across the object, against `coding-standards` on setters and complete construction.

### Executing a sequence returns a report

`execute` returns a report carrying the final position and, when the rover was blocked, the obstacle coordinates. An obstacle is an **expected outcome of a mission**, not an error: modelling it as data keeps the happy path free of `try`/`catch`.

This breaks Command-Query Separation — `execute` both mutates and returns. It is a deliberate, justified exception of the kind `coding-standards` contemplates: the alternative (a void command plus separate `position` and `blockedBy` queries) forces the caller to remember to ask, and raises the awkward question of when a stale blocked flag gets cleared.

The report starts as a plain structure with an optional obstacle. A discriminated `Completed | Blocked` union is a legitimate later refactor, not the starting point — TPP reaches the optional field first.

### Commands are parsed at the boundary

A parsing factory converts text into a list of typed commands and throws on anything unknown; the rover's signature accepts only already-valid commands. The rover therefore never sees a raw string, and "reject the whole sequence" becomes structurally impossible to get wrong — there is no code path that could half-execute.

This also settles the statement's "a string **or** a list of commands": the list is the domain input, the string is what the factory parses.

*Alternatives considered.* Having `execute` accept a string and validate internally is a one-step API but widens the signature to accept anything. Carrying the rejection inside the report merges two different things — *the world said no* (an obstacle) and *you wrote it wrong* (an unknown character) — and can be silently ignored by the caller.

### The surface owns the grid; the rover owns the geometry

The rover computes the cell ahead of it from its orientation alone — pure geometry, no notion of edges. The surface owns width, height and obstacles, and answers where a coordinate actually lands. Coordinates never carry the grid dimensions; that would make every value object drag the whole map around.

Whether the rover asks the surface one question (*where does this land?*) or two (*wrap this*, then *is it occupied?*) is left to the REFACTOR of the obstacle block. The single-question form is more Tell-Don't-Ask and makes it impossible to check occupancy before wrapping — a real bug that the "obstacle across a connected edge" scenario exists to catch.

### On a sphere there is no "outside"

Initial coordinates are normalised with the same wrapping rule used for movement. The validation of an out-of-range placement disappears by design rather than by code, and the alternative — rejecting `(12, 3)` when placing but accepting it as a destination — would encode two contradictory rules about the same coordinate.

Landing on an obstacle is a different matter: that cell is physically occupied, so it is refused. This is the one construction-time validation, and it justifies a private constructor with a factory method, per `coding-standards`.

### Axes, names and vocabulary

- `N = y + 1`, origin bottom-left: "moving north increases y" reads naturally in every test assertion.
- `Planet` rather than `Grid` — it holds the obstacles and captures the connected-edge surface the statement describes.
- Separate `width` and `height` rather than a single `size`: identical cost, no square-grid assumption.
- Only `M` moves forward. `coding-standards` forbids synonyms for one concept, and the statement's "`M` (or `F`)" reads as the author offering a notation, not requiring both. As a consequence of parsing rejecting anything outside the vocabulary, `F` and lowercase letters are unknown characters.

### What the TDD cycle decides, not this document

Three shapes are deliberately left open, because writing them now would be the over-engineering the kata exists to avoid:

- **Turning.** The four orientations will be duplicated across turn-left, turn-right and displacement by roughly the third test. Whether that resolves into an ordered ring (`R = +1 mod 4`, `L = -1 mod 4`), a `Direction` value object with behaviour, or a vector table is a REFACTOR decision, taken once the duplication is visible three times — never in the first GREEN.
- **Backward movement.** Whether `B` is "`M` in the opposite orientation" or a rule of its own depends on whether the code shows it as duplicated knowledge.
- **Sequence iteration with an early abort.** `coding-standards` discourages `for` and prefers a declarative style, but aborting mid-sequence is exactly what `map`/`reduce` cannot express: a `reduce` that keeps iterating over a blocked rover *lies about the intent*. The honest candidates are `for...of` with `break` (§12: readability first) and recursion (TPP #9, pure). Decided at the REFACTOR of the obstacle block, with the code in front of us.

### Structure

```
src/core/
├── Rover.ts            entity, the only mutable object
├── Planet.ts           width, height, obstacles, coordinate resolution
├── Position.ts         coordinates + orientation (value object)
├── Coordinates.ts      value object
├── Direction.ts        value object
├── Command.ts          command vocabulary (enum) + parsing factory
├── MissionReport.ts    final position + optional obstacle
└── tests/unit/         one test file per behaviour block
```

Flat, no sub-layers: there is no application layer and no infrastructure to separate from. Files appear only when a test demands them.

## Risks / Trade-offs

- **Over-designing in the first GREEN** (reaching for the modulo-4 ring or the vector table at test three) → the task breakdown names the TPP transformation expected at each step, and the RE-EVALUATE checkpoint explicitly asks whether behaviour was added that no test required.
- **Wrapping and occupancy checked in the wrong order** — the classic bug: it passes "obstacle ahead" and fails only when the obstacle sits across an edge → that scenario is specified and gets its own test in the obstacle block.
- **CQS exception on `execute` becoming a habit** → it is documented here as a single justified exception; any further command returning a value needs its own justification.
- **A private constructor plus a factory adds an element** the statement never asked for → it is paid for by exactly one rule (cannot land on an obstacle), and by removing range validation entirely.
- **Coverage threshold of 80% in `jest.config.js`** could fail `bun run validate` if any code is written without a test → TDD makes this structurally impossible; if it trips, the cause is a rule violation, not a threshold problem.
- **The `sum.ts` scaffold stays** and lightly pollutes the core → removing an existing test needs explicit Tech Lead approval, so it is left alone rather than quietly deleted.

## Migration Plan

Not applicable. Greenfield domain with no consumers, no stored data and no public interface to preserve. Every step of the cycle leaves the suite green, so any commit is a safe stopping point and rollback is a `git revert` of a single TDD phase.

## Open Questions

- **Non-positive surface dimensions.** A surface of width or height zero is nonsense, but the statement says nothing and no scenario needs it. Deferred rather than invented: adding a guard later is purely additive and changes no existing behaviour.
