# Design: Mars Rover Architecture

## Overview
The architecture strictly follows Hexagonal Architecture principles, isolating the core domain logic from any input/output concerns.

## Domain Model

### 1. `Planet` (Value Object / Data Structure)
- **Responsibility**: Holds the topography data of the grid.
- **Properties**: `width`, `height`, `obstacles` (list of coordinates).
- **Behavior**: Purely queryable. Does not calculate movement.

### 2. `Navigator` (Domain Service)
- **Responsibility**: The mathematical brain for coordinate calculation, boundary wrapping, and collision detection.
- **Dependencies**: Receives a `Planet` upon instantiation.
- **Core Method**: `calculateNextPosition(currentCoordinate, direction, movementType)`
- **Return Type (Result Pattern)**:
  ```typescript
  type NavigationResult =
    | { success: true, coordinate: Coordinate }
    | { success: false, reason: 'OBSTACLE', obstacleCoordinate: Coordinate };
  ```

### 3. `Rover` (Entity)
- **Responsibility**: Holds its own state and orchestrates commands.
- **State**: `Coordinate` (x, y) and `Direction` (N, S, E, W).
- **Dependencies**: Interacts with the `Navigator`.
- **Behavior**: 
  - Receives a string of commands (e.g., `"MMRM"`).
  - Handles internal rotations (`L`, `R`) without delegating.
  - Delegates movement (`M`, `B`) to the `Navigator`.
  - Aborts sequence if `NavigationResult` is false.
  - Returns a final report string (e.g., `"0:1:N"` or `"X:0:2:N"` if blocked).

## Error Handling & Reporting
- We avoid exceptions for expected business rules (like hitting an obstacle). Instead, we use a Result Pattern to explicitly handle the `success: false` state.
- The Rover returns the final status string directly upon completion of its command loop.
