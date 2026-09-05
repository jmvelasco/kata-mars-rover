## Why

The repository currently holds only the TypeScript scaffold (`src/core/sum.ts`) — the Mars Rover domain described in `Readme.md` does not exist yet. This change implements that domain as the first real exercise of the repository's working agreement: strict TDD with TPP, a pure core with zero external dependencies, and a design that earns its abstractions instead of presupposing them.

The kata statement leaves several aspects undefined (axis convention, grid size, obstacle reporting, invalid commands, initial placement). Those were resolved with the Tech Lead during exploration and are fixed here so implementation never has to invent a requirement.

## What Changes

- **Rover as the only stateful object.** A `Rover` entity keeps its position across command sequences; `Position`, `Coordinates` and `Direction` are immutable value objects, so every geometric calculation is pure.
- **Typed command sequences parsed at the boundary.** A command factory turns text into `L | R | M | B` commands and rejects the whole sequence when it contains an unknown character — the rover never receives a raw string and never moves partially.
- **Spherical surface.** A `Planet` owns the grid dimensions and obstacles. Coordinates beyond an edge are normalised by wrapping, both while moving and when the rover is first placed: on a sphere there is no "outside the grid".
- **Obstacles as business data, not errors.** Executing a sequence returns a report with the final position and, when the rover was blocked, the obstacle coordinates. The remaining commands are discarded and the rover stays on the last valid cell.
- **Guarded construction.** The rover is created through a factory with a private constructor that refuses to land on an occupied cell.
- **Single forward command.** Only `M` is accepted; `F` is not introduced as a synonym.

## Non-goals

- **No HTTP or transport layer.** "API" is read as the public API of the domain classes. No server, no controllers, no serialization format.
- **No ports or adapters.** Nothing crosses a real boundary, so the hexagon stays adapter-free. Introducing them now would violate YAGNI and the progressive-adoption rule.
- **No application layer / use cases.** The rover is invoked directly; there is nothing to orchestrate.
- **No persistence.** State lives in memory for the lifetime of the rover instance.
- **No UI.** `src/ui` is not created; frontend guidelines stay dormant.
- **No CLI entry point.** `src/index.ts` and manual dependency wiring are out of scope until something needs to run outside the test suite.
- **Scaffold untouched.** `src/core/sum.ts` and `src/tests/sum.test.ts` are left in place; removing an existing test requires explicit Tech Lead approval.

## Capabilities

### New Capabilities

- `command-parsing`: Turning textual input into typed rover commands, and rejecting an entire sequence when it contains an unknown character.
- `rover-navigation`: Initial placement, position reporting, turning left and right, moving forward and backward, executing sequences in order, and keeping state between invocations.
- `spherical-grid`: Grid dimensions, obstacle registry, and wrapping of any coordinate beyond an edge — applied both to movement and to initial placement.
- `obstacle-detection`: Blocking movement into an occupied cell, aborting the remaining commands, preserving the last valid position, and reporting the obstacle found.

### Modified Capabilities

None — `openspec/specs/` is empty; this is the first capability set in the repository.

## Impact

- **New code**: `src/core/` gains the rover domain. Zero external dependencies, as required for the core.
- **New tests**: `src/core/tests/unit/` following the documented test location; existing tests are not moved or deleted.
- **Dependencies**: none added. Jest, ts-jest and TypeScript already cover the need.
- **Tooling**: `bun run validate` (compile + lint + test) must stay green at every step; the 80% coverage threshold in `jest.config.js` is satisfied naturally by TDD.
- **Naming decisions carried into implementation**: `Planet` (not `Grid`), separate `width` and `height` (not a single square `size`).
