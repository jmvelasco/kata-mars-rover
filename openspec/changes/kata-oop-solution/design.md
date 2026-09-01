## Context

The Mars Rover kata involves managing state and applying rules to coordinate transformations. See proposal.md for motivation on why we chose the classic OOP approach.

## Goals / Non-Goals

**Goals:**
- Implement a robust OOP domain model free of large conditional statements.
- Decouple coordinate calculations from the Rover itself.

**Non-Goals:**
- Implementing a user interface or API controllers (outside the core domain scope).
- Handling diagonal movement.

## Decisions

**Decision 1: The State Pattern for Direction**
- **Rationale**: Replaces `switch` statements with polymorphism. Each cardinal direction (`North`, `East`, `South`, `West`) implements a common `Direction` interface.
- **Alternatives**: Enums with a single large function handling rotations. Rejected because it violates the Open/Closed Principle.

**Decision 2: Value Object for Position**
- **Rationale**: Encapsulating `(x, y)` inside a `Position` class ensures immutability and centralizes equality checks (`pos.equals(other)`).
- **Alternatives**: Using bare tuples `[x, y]` or literal objects `{x, y}`. Rejected because they lack behavior and make equality checks repetitive.

**Decision 3: Grid calculates wrapping and obstacles**
- **Rationale**: The `Grid` owns the physical rules of the planet. When the Rover wants to move, it asks the `Grid` for the resulting position based on a movement vector.
- **Alternatives**: The Rover calculates its own next coordinate. Rejected because the Rover shouldn't know the dimensions or obstacle layout of the planet.

## Risks / Trade-offs

- **Risk**: Modulo arithmetic with negative numbers in JavaScript/TypeScript produces negative results (e.g., `-1 % 10 = -1`), which breaks wrapping when moving South or West from the `0` coordinate.
  - **Mitigation**: Implement a custom math helper or utility in the `Grid` class to ensure positive wrapping: `((val % max) + max) % max`.
