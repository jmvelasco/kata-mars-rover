# obstacle-detection Specification

## Purpose
Describes how fixed obstacles on the surface stop the rover, how the interrupted sequence is reported back, and how the rover recovers once it has been blocked.
## Requirements
### Requirement: An obstacle prevents the rover from entering a cell

The surface MAY contain obstacles at fixed coordinates, normalised by the same wrapping rule as any other coordinate. When a movement command would take the rover onto an obstacle, the rover SHALL stay on the last valid cell it occupied, keeping its current orientation.

#### Scenario: An obstacle directly ahead stops the advance
- **GIVEN** a 5x5 surface with an obstacle at coordinates (0, 2)
- **AND** a rover at coordinates (0, 0) facing north
- **WHEN** it executes `MMM`
- **THEN** it is at coordinates (0, 1) facing north

#### Scenario: An obstacle behind stops the retreat
- **GIVEN** a 5x5 surface with an obstacle at coordinates (2, 1)
- **AND** a rover at coordinates (2, 3) facing north
- **WHEN** it executes `BB`
- **THEN** it is at coordinates (2, 2) facing north

#### Scenario: An obstacle declared beyond an edge blocks the cell it names
- **GIVEN** a 5x5 surface with an obstacle at coordinates (7, 2)
- **AND** a rover at coordinates (2, 1) facing north
- **WHEN** it executes `M`
- **THEN** it is at coordinates (2, 1) facing north, blocked by the obstacle that names the cell (2, 2)

#### Scenario: An obstacle across a connected edge also blocks
- **GIVEN** a 5x5 surface with an obstacle at coordinates (2, 0)
- **AND** a rover at coordinates (2, 4) facing north
- **WHEN** it executes `M`
- **THEN** it is at coordinates (2, 4) facing north, having been blocked by the cell on the far side of the edge

### Requirement: An obstacle aborts the rest of the sequence

When the rover is blocked by an obstacle, it SHALL discard every command remaining in the sequence, including turns.

#### Scenario: The remaining commands are never executed
- **GIVEN** a 5x5 surface with an obstacle at coordinates (0, 2)
- **AND** a rover at coordinates (0, 0) facing north
- **WHEN** it executes `MMRMM`
- **THEN** it is at coordinates (0, 1) facing north
- **AND** the turn and the two further moves have had no effect

### Requirement: The rover reports the obstacle it found

Executing a sequence SHALL produce a report containing the rover's final position. When the sequence was aborted by an obstacle, the report SHALL also contain the coordinates of that obstacle. An obstacle is an expected outcome of a mission, not a failure of the command.

#### Scenario: A blocked sequence reports the obstacle
- **GIVEN** a 5x5 surface with an obstacle at coordinates (0, 2)
- **AND** a rover at coordinates (0, 0) facing north
- **WHEN** it executes `MMM`
- **THEN** the report gives the final position (0, 1) facing north
- **AND** the report gives the obstacle coordinates (0, 2)

#### Scenario: A completed sequence reports no obstacle
- **GIVEN** a 5x5 surface with no obstacles
- **AND** a rover at coordinates (0, 0) facing north
- **WHEN** it executes `MM`
- **THEN** the report gives the final position (0, 2) facing north
- **AND** the report carries no obstacle

### Requirement: Turning is never blocked

An obstacle occupies a cell, so it SHALL never prevent the rover from turning. A turn command always succeeds, even when the rover is surrounded.

#### Scenario: A surrounded rover can still turn
- **GIVEN** a 3x3 surface with obstacles at coordinates (1, 2), (2, 1), (1, 0) and (0, 1)
- **AND** a rover at coordinates (1, 1) facing north
- **WHEN** it executes `RR`
- **THEN** it is at coordinates (1, 1) facing south

### Requirement: A blocked rover can leave afterwards

Being blocked SHALL NOT leave the rover in a permanently blocked state. A later sequence SHALL be executed normally, so the rover can turn away from the obstacle and continue.

#### Scenario: Turning away after a block
- **GIVEN** a 5x5 surface with an obstacle at coordinates (0, 2)
- **AND** a rover at coordinates (0, 0) facing north that has already been blocked while executing `MMM`
- **WHEN** it afterwards executes `RM`
- **THEN** it is at coordinates (1, 1) facing east
- **AND** the report of this second sequence carries no obstacle

### Requirement: The rover cannot be placed on an obstacle

An obstacle physically occupies its cell, so placing the rover there SHALL be refused.

#### Scenario: Landing on an occupied cell is refused
- **GIVEN** a 5x5 surface with an obstacle at coordinates (1, 1)
- **WHEN** a rover is placed at coordinates (1, 1) facing north
- **THEN** the placement is refused and no rover is created

#### Scenario: Refusal considers the wrapped coordinates
- **GIVEN** a 5x5 surface with an obstacle at coordinates (1, 1)
- **WHEN** a rover is placed at coordinates (6, 6) facing north
- **THEN** the placement is refused, because those coordinates name the occupied cell (1, 1)

#### Scenario: Refusal considers an obstacle named beyond an edge
- **GIVEN** a 5x5 surface with an obstacle at coordinates (7, 2)
- **WHEN** a rover is placed at coordinates (2, 2) facing north
- **THEN** the placement is refused, because the obstacle names that cell

