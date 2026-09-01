## Purpose

Defines how the rover detects obstacles, aborts remaining commands, and reports the encountered obstacle.

## ADDED Requirements

### Requirement: Rover stops before an obstacle

The system SHALL prevent the rover from moving into a cell occupied by an obstacle. The rover SHALL remain at its last valid position.

#### Scenario: Single move into an obstacle

- **WHEN** a rover at (0, 0) facing N on a grid with an obstacle at (0, 1) executes command M
- **THEN** the rover SHALL remain at (0, 0) facing N

### Requirement: Rover aborts remaining commands on obstacle detection

The system SHALL stop processing the command sequence when an obstacle is detected. Commands after the blocked move SHALL NOT be executed.

#### Scenario: Obstacle mid-sequence aborts remaining commands

- **WHEN** a rover at (0, 0) facing N on a grid with an obstacle at (0, 2) executes commands "MMRM"
- **THEN** the rover SHALL be at (0, 1) facing N
- **AND** commands R and M SHALL NOT have been executed

### Requirement: Rover reports the detected obstacle

The system SHALL report the coordinate of the obstacle that blocked the rover's movement. The execution result SHALL distinguish between a successful execution and one interrupted by an obstacle.

#### Scenario: Obstacle is reported with its coordinate

- **WHEN** a rover at (0, 0) facing N on a grid with an obstacle at (0, 1) executes command M
- **THEN** the result SHALL indicate an obstacle was detected at (0, 1)
- **AND** the result SHALL include the rover's final position (0, 0, N)

#### Scenario: Successful execution reports no obstacle

- **WHEN** a rover at (0, 0) facing N on a grid with no obstacles executes command M
- **THEN** the result SHALL indicate success
- **AND** the result SHALL include the rover's final position (0, 1, N)

### Requirement: Turns are unaffected by obstacles

The system SHALL execute turn commands (L, R) regardless of obstacles, since turns do not change the rover's position.

#### Scenario: Turn succeeds even when adjacent cell has obstacle

- **WHEN** a rover at (0, 0) facing N on a grid with an obstacle at (0, 1) executes command R
- **THEN** the rover SHALL face E at (0, 0)
- **AND** the result SHALL indicate success
