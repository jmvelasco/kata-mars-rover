## Purpose

Describes how the rover is placed on the surface, how it reports where it is, and how it turns, moves and keeps its bearings across successive command sequences.

## ADDED Requirements

### Requirement: The rover reports its position

The rover SHALL be placed with coordinates `(x, y)` and an orientation among north, east, south and west, and SHALL report both at any time.

#### Scenario: A newly placed rover reports where it was left
- **GIVEN** a rover placed at coordinates (0, 0) facing north
- **WHEN** its position is requested
- **THEN** it reports coordinates (0, 0) and orientation north

### Requirement: Turning left rotates 90 degrees counter-clockwise

The rover SHALL rotate 90 degrees counter-clockwise on receiving the turn-left command, and SHALL stay on the same cell.

#### Scenario: Turning left from north
- **GIVEN** a rover at coordinates (2, 2) facing north
- **WHEN** it executes `L`
- **THEN** it faces west
- **AND** it is still at coordinates (2, 2)

#### Scenario: Turning left from every orientation
- **GIVEN** a rover facing north, then west, then south, then east
- **WHEN** it executes `L` from each of them
- **THEN** it ends up facing west, south, east and north respectively

### Requirement: Turning right rotates 90 degrees clockwise

The rover SHALL rotate 90 degrees clockwise on receiving the turn-right command, and SHALL stay on the same cell.

#### Scenario: Turning right from north
- **GIVEN** a rover at coordinates (2, 2) facing north
- **WHEN** it executes `R`
- **THEN** it faces east
- **AND** it is still at coordinates (2, 2)

#### Scenario: Four right turns restore the original orientation
- **GIVEN** a rover facing north
- **WHEN** it executes `RRRR`
- **THEN** it faces north again

### Requirement: Moving forward advances one cell

The rover SHALL move one cell towards its current orientation on receiving the forward command, keeping its orientation unchanged. North increases `y`, east increases `x`, south decreases `y` and west decreases `x`.

#### Scenario: Moving forward facing north
- **GIVEN** a rover at coordinates (2, 2) facing north on a 5x5 surface
- **WHEN** it executes `M`
- **THEN** it is at coordinates (2, 3)
- **AND** it still faces north

#### Scenario: Moving forward in every orientation
- **GIVEN** a rover at coordinates (2, 2) on a 5x5 surface
- **WHEN** it executes `M` facing east, south and west respectively
- **THEN** it reaches coordinates (3, 2), (2, 1) and (1, 2) respectively

### Requirement: Moving backward retreats one cell

The rover SHALL move one cell opposite to its current orientation on receiving the backward command, keeping its orientation unchanged.

#### Scenario: Moving backward facing north
- **GIVEN** a rover at coordinates (2, 2) facing north on a 5x5 surface
- **WHEN** it executes `B`
- **THEN** it is at coordinates (2, 1)
- **AND** it still faces north

#### Scenario: Moving backward in every orientation
- **GIVEN** a rover at coordinates (2, 2) on a 5x5 surface
- **WHEN** it executes `B` facing east, south and west respectively
- **THEN** it reaches coordinates (1, 2), (2, 3) and (3, 2) respectively

### Requirement: A sequence is executed command by command in order

The rover SHALL execute the commands of a sequence in the order they were given, and SHALL report its final position when the sequence ends.

#### Scenario: A mixed sequence
- **GIVEN** a rover at coordinates (0, 0) facing north on a 5x5 surface
- **WHEN** it executes `MMRMM`
- **THEN** it is at coordinates (2, 2) facing east

#### Scenario: An empty sequence leaves the rover untouched
- **GIVEN** a rover at coordinates (1, 3) facing west
- **WHEN** it executes an empty sequence
- **THEN** it is still at coordinates (1, 3) facing west

### Requirement: The rover keeps its position between sequences

The rover SHALL retain its coordinates and orientation after a sequence ends, so that the next sequence starts from where the previous one left it. It MUST NOT return to its initial position.

#### Scenario: A second sequence continues where the first ended
- **GIVEN** a rover at coordinates (0, 0) facing north on a 5x5 surface
- **WHEN** it executes `MM` and afterwards executes `RM`
- **THEN** it is at coordinates (1, 2) facing east

#### Scenario: The reported position always reflects the accumulated movement
- **GIVEN** a rover that has already executed `MMR`
- **WHEN** its position is requested before sending any further command
- **THEN** it reports the position reached by that first sequence, not the one it was placed at
