## Purpose

Defines how the rover wraps around grid edges as if the surface were spherical.

## ADDED Requirements

### Requirement: Rover wraps when crossing the northern boundary

The system SHALL move the rover to the southern edge of the grid when it moves north beyond the top boundary.

#### Scenario: Wrapping north to south

- **WHEN** a rover at (0, 4) facing N on a 5×5 grid executes command M
- **THEN** the rover SHALL be at (0, 0) facing N

### Requirement: Rover wraps when crossing the eastern boundary

The system SHALL move the rover to the western edge of the grid when it moves east beyond the right boundary.

#### Scenario: Wrapping east to west

- **WHEN** a rover at (4, 0) facing E on a 5×5 grid executes command M
- **THEN** the rover SHALL be at (0, 0) facing E

### Requirement: Rover wraps when crossing the southern boundary

The system SHALL move the rover to the northern edge of the grid when it moves south beyond the bottom boundary.

#### Scenario: Wrapping south to north

- **WHEN** a rover at (0, 0) facing S on a 5×5 grid executes command M
- **THEN** the rover SHALL be at (0, 4) facing S

### Requirement: Rover wraps when crossing the western boundary

The system SHALL move the rover to the eastern edge of the grid when it moves west beyond the left boundary.

#### Scenario: Wrapping west to east

- **WHEN** a rover at (0, 0) facing W on a 5×5 grid executes command M
- **THEN** the rover SHALL be at (4, 0) facing W

### Requirement: Rover wraps when moving backward across a boundary

The system SHALL apply the same wrapping rules when the rover moves backward across a boundary.

#### Scenario: Wrapping backward across southern boundary

- **WHEN** a rover at (0, 0) facing N on a 5×5 grid executes command B
- **THEN** the rover SHALL be at (0, 4) facing N
