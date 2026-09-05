# Proposal: Mars Rover OOP Solution

## Why
This change implements the Mars Rover Kata using a classic Object-Oriented Programming (OOP) approach. By relying on the State pattern for orientation, Value Objects for coordinates, and delegating spatial logic to a Grid class, we prevent bloated "God objects" and avoid large conditional (switch) statements. This sets a solid architectural foundation that adheres to the project's Hexagonal Architecture and TDD rules.

## What Changes
- Scaffolds the core domain entities for the Rover: `Rover`, `Position`, `Grid`.
- Implements the State pattern for `Direction` (North, East, South, West).
- Implements wrapping behavior in the `Grid`.
- Implements obstacle detection and reporting.
- Introduces robust domain models in `src/core/rover/`.

## Capabilities
- **New Capabilities**:
  - `mars-rover`: Core domain navigation and obstacle detection features.
- **Modified Capabilities**:
  - None.

## Impact
- **Code**: Adds new domain files under `src/core/rover/`.
- **Testing**: Adds comprehensive unit tests for each component following the TDD Red-Green-Refactor cycle.
- **Dependencies**: No external dependencies added (zero-dependencies rule in `src/core`).
