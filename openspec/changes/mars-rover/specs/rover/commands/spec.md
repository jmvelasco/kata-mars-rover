## Purpose

Defines how the rover processes turn and move commands, maintaining state across multiple command executions.

## ADDED Requirements

### Requirement: Rover turns left without moving

The system SHALL rotate the rover 90° counter-clockwise when it receives the L command, without changing its coordinates.

#### Scenario: Turning left from north

- **WHEN** a rover facing N executes command L
- **THEN** the rover SHALL face W at the same coordinates

#### Scenario: Full left rotation returns to original orientation

- **WHEN** a rover facing N executes commands L, L, L, L
- **THEN** the rover SHALL face N at the same coordinates

### Requirement: Rover turns right without moving

The system SHALL rotate the rover 90° clockwise when it receives the R command, without changing its coordinates.

#### Scenario: Turning right from north

- **WHEN** a rover facing N executes command R
- **THEN** the rover SHALL face E at the same coordinates

#### Scenario: Turning right from west

- **WHEN** a rover facing W executes command R
- **THEN** the rover SHALL face N at the same coordinates

### Requirement: Rover moves forward in current direction

The system SHALL advance the rover one grid cell in its current facing direction when it receives the M command.

#### Scenario: Moving forward facing north

- **WHEN** a rover at (0, 0) facing N executes command M
- **THEN** the rover SHALL be at (0, 1) facing N

#### Scenario: Moving forward facing east

- **WHEN** a rover at (0, 0) facing E executes command M
- **THEN** the rover SHALL be at (1, 0) facing E

#### Scenario: Moving forward facing south

- **WHEN** a rover at (2, 3) facing S executes command M
- **THEN** the rover SHALL be at (2, 2) facing S

#### Scenario: Moving forward facing west

- **WHEN** a rover at (2, 3) facing W executes command M
- **THEN** the rover SHALL be at (1, 3) facing W

### Requirement: Rover moves backward opposite to current direction

The system SHALL move the rover one grid cell in the opposite of its current facing direction when it receives the B command, without changing orientation.

#### Scenario: Moving backward facing north

- **WHEN** a rover at (0, 1) facing N executes command B
- **THEN** the rover SHALL be at (0, 0) facing N

### Requirement: Rover executes a sequence of commands in order

The system SHALL process a string of commands sequentially, applying each to the rover's current state.

#### Scenario: Mixed commands sequence

- **WHEN** a rover at (0, 0) facing N executes commands "MMRM"
- **THEN** the rover SHALL be at (1, 2) facing E

### Requirement: Rover maintains state across separate command executions

The system SHALL preserve the rover's position and orientation between successive command calls. Each new execution starts from where the previous one ended.

#### Scenario: Sequential command batches accumulate state

- **GIVEN** a rover at (0, 0) facing N
- **WHEN** the rover executes "MM"
- **AND** then executes "RM"
- **THEN** the rover SHALL be at (1, 2) facing E
