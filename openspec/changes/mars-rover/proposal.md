## Why

The repository is scaffolded for the Mars Rover kata but contains no domain code — only a placeholder `sum.ts`. The kata requires building a rover navigation API that handles positioning, commands, spherical grid wrapping, and obstacle detection. Implementing this kata exercises TDD with TPP, rich domain modeling, and hexagonal architecture principles.

## What Changes

- Remove the placeholder `sum.ts` and its test
- Implement the full Mars Rover domain in `src/core/`:
  - Rover entity with mutable state and command execution
  - Direction value object with turn and movement-delta behavior
  - Coordinate value object with arithmetic and equality
  - MarsMap value object with wrapping and obstacle detection
  - Discriminated union result type for obstacle reporting
- Add comprehensive unit tests following TDD cycle

## Non-goals

- No CLI, HTTP API, or UI layer — this is a pure domain kata
- No persistence or adapters — no hexagonal ports/adapters needed yet
- No external dependencies in `src/core/`

## Capabilities

### New Capabilities

- `rover/initialization`: Rover creation with position (x, y) and orientation (N/E/S/W) on a grid
- `rover/commands`: Processing turn (L/R) and move (M/B) commands with state persistence across executions
- `rover/wrapping`: Spherical grid wrapping when the rover crosses map boundaries
- `rover/obstacle-detection`: Obstacle detection that aborts command sequence and reports the obstacle

### Modified Capabilities

_None — this is a greenfield implementation._

## Impact

- **Code**: New files in `src/core/`, new test files in `src/tests/unit/`
- **Removed**: `src/core/sum.ts` and `src/tests/sum.test.ts` (placeholder code)
- **Dependencies**: None — pure domain, zero external dependencies
- **APIs**: No public API beyond the domain classes
