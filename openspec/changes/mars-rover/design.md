## Context

The repository contains a clean TypeScript + Bun + Jest scaffold with a placeholder `sum.ts`. No domain code exists yet. The core domain lives in `src/core/` with zero external dependencies (see proposal.md for motivation).

## Goals / Non-Goals

**Goals:**
- Model the Mars Rover domain with rich Value Objects and an Entity that encapsulates behavior
- Follow TDD with TPP throughout, progressing from simple to complex cases
- Keep all code in `src/core/` with zero external dependencies

**Non-Goals:**
- No hexagonal ports/adapters — no infrastructure boundary exists yet (YAGNI)
- No CLI, HTTP, or UI layer
- No persistence

## Decisions

### D1: Mutable Rover Entity

**Choice**: Rover is a mutable entity — `execute()` mutates its internal position.

**Rationale**: The kata explicitly requires state persistence across executions ("the movement starts from where the rover was left"). A mutable entity models this naturally. The caller calls `rover.execute("MM")` and later `rover.execute("RM")`, and state accumulates.

**Alternatives considered**:
- *Immutable Rover returning new instances*: More functional, but fights the explicit "maintains state" requirement and adds caller complexity (must track latest reference).

### D2: Fine-grained Value Objects (Direction, Coordinate, Position)

**Choice**: Three separate Value Objects — `Direction`, `Coordinate`, `Position` (which composes the other two).

**Rationale**:
- `Direction` has its own behavior (turn left/right, movement delta) — it's a state machine with 4 states.
- `Coordinate` is needed independently for obstacles (an obstacle is a coordinate without a direction).
- `Position` composes both — the rover has a Position, which is a Coordinate + Direction.

**Alternatives considered**:
- *Single `Position(x, y, direction)`*: Simpler initially, but obstacles force extracting Coordinate anyway. Starting fine-grained avoids the refactor.

### D3: Direction as a circular state machine

**Choice**: Direction models turns as index arithmetic on an ordered array `[N, E, S, W]`:
- `turnRight()`: index + 1 mod 4
- `turnLeft()`: index - 1 mod 4 (with positive modulo)
- `delta()`: returns the (dx, dy) vector for the direction

**Rationale**: Eliminates switch/case for turns. Each direction knows its behavior. Aligns with Tell, Don't Ask and rich model principles.

**Alternatives considered**:
- *Map/lookup table*: Equivalent, but index arithmetic is more compact and self-documenting.
- *Enum with methods*: TypeScript enums lack real methods — would need helper functions, creating an anemic model.

### D4: MarsMap Value Object owns wrapping and obstacle detection

**Choice**: `MarsMap` receives dimensions and obstacles at construction. It exposes:
- `wrap(coordinate)`: applies `((v % size) + size) % size` wrapping
- `hasObstacle(coordinate)`: O(1) lookup

**Rationale**: The Rover asks MarsMap "can I move here?" — Tell, Don't Ask. MarsMap is the authority on grid topology and obstacles, not the Rover.

**Alternatives considered**:
- *Rover does its own wrapping*: Violates SRP — the Rover would need to know grid dimensions.
- *External navigation service*: Creates an anemic Rover — violates rich model rule.

### D5: Discriminated union for execution results

**Choice**: `execute()` returns a discriminated union:
```
type ExecutionResult =
  | { status: 'ok' }
  | { status: 'obstacle'; obstacle: Coordinate }
```

The rover's current position is always queryable via its own state (it's mutable), so the result only needs to signal what happened.

**Rationale**: TypeScript's type narrowing makes discriminated unions ergonomic. The compiler forces the caller to handle both cases. It's lighter than a full result class for a kata.

**Alternatives considered**:
- *Result class with factory methods*: More ceremony than needed (YAGNI).
- *Exception*: Obstacles are expected domain events, not exceptional errors.

### D6: Rover receives MarsMap at construction

**Choice**: The Rover receives a `MarsMap` in its constructor and uses it for all movement operations.

**Rationale**: The Rover "lives" on a map — it's a natural dependency. Injecting it at construction means every `execute()` call has the context it needs without passing the map repeatedly.

## Risks / Trade-offs

- **Mutable state**: Harder to reason about in tests — mitigated by testing each command sequence in isolation with fresh rover instances.
- **Fine-grained VOs upfront**: Slightly more files than a minimal approach — but each VO is small (< 20 lines) and has clear, testable behavior. TDD will validate each one independently.

## File Structure

```
src/core/
├── direction.ts       # VO: N/E/S/W with turn and delta behavior
├── coordinate.ts      # VO: (x, y) with arithmetic and equality
├── marsMap.ts         # VO: grid dimensions + obstacles + wrapping
└── rover.ts           # Entity: mutable, executes commands

src/tests/unit/
├── direction.test.ts          # Direction VO: turns and movement deltas
├── coordinate.test.ts         # Coordinate VO: equality and arithmetic
├── marsMap.test.ts            # MarsMap VO: wrapping and obstacle detection
├── rover-movement.test.ts     # Rover: forward, backward, sequences, state persistence
├── rover-wrapping.test.ts     # Rover: spherical grid boundary crossing
└── rover-obstacles.test.ts    # Rover: obstacle detection, abort, reporting
```

One test file per behavior block, each mapping to a capability/spec. The VOs get their own test files because they have independent, testable behavior (Direction turns, Coordinate arithmetic, MarsMap wrapping). The Rover tests are split by concern rather than bundled into a single file.
