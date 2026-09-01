## Purpose

Defines how the rover is created and placed on a grid with an initial position and orientation.

## ADDED Requirements

### Requirement: Rover accepts an initial position on a grid

The system SHALL create a rover with coordinates (x, y) and an orientation from the set {N, E, S, W}, placed on a grid of defined dimensions.

#### Scenario: Creating a rover at the origin facing north

- **WHEN** a rover is created at position (0, 0) facing N on a 5×5 grid
- **THEN** the rover's position SHALL be (0, 0, N)

#### Scenario: Creating a rover at an arbitrary position

- **WHEN** a rover is created at position (3, 2) facing E on a 10×10 grid
- **THEN** the rover's position SHALL be (3, 2, E)

### Requirement: Rover position is queryable

The system SHALL allow querying the rover's current position and orientation at any time.

#### Scenario: Querying position after creation

- **WHEN** a rover is created at (1, 4) facing S
- **THEN** querying its position SHALL return (1, 4, S)
