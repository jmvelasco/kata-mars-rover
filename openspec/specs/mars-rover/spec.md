## Purpose
Defines the behavior of the Mars Rover navigation system, including movement, rotation, wrapping, and obstacle detection.

## Requirements

### Requirement: Rover turns left
The system SHALL allow the rover to rotate 90 degrees to the left without changing its coordinates.

#### Scenario: Turn left from North
- **WHEN** the rover facing North receives an 'L' command
- **THEN** its direction changes to West, and coordinates remain the same.

### Requirement: Rover turns right
The system SHALL allow the rover to rotate 90 degrees to the right without changing its coordinates.

#### Scenario: Turn right from North
- **WHEN** the rover facing North receives an 'R' command
- **THEN** its direction changes to East, and coordinates remain the same.

### Requirement: Rover moves forward
The system SHALL move the rover one cell forward in the direction it is currently facing.

#### Scenario: Move forward facing North
- **WHEN** the rover facing North receives an 'M' or 'F' command
- **THEN** its y-coordinate increases by 1, and x-coordinate remains the same.

### Requirement: Rover moves backward
The system SHALL move the rover one cell backward opposite to the direction it is currently facing.

#### Scenario: Move backward facing North
- **WHEN** the rover facing North receives a 'B' command
- **THEN** its y-coordinate decreases by 1, and x-coordinate remains the same.

### Requirement: Spherical Grid Wrapping
The system SHALL wrap the rover's coordinates to the opposite side of the grid when moving past the edge.

#### Scenario: Wrap past North edge
- **WHEN** the rover moves forward from the maximum y-coordinate while facing North
- **THEN** it appears at y = 0 with the same x-coordinate.

### Requirement: Obstacle Detection
The system SHALL abort command execution if an obstacle is detected in the destination cell, stopping at the last valid position.

#### Scenario: Obstacle blocks movement
- **WHEN** the rover attempts to move into a cell containing an obstacle
- **THEN** the rover stops in the current cell, aborts remaining commands, and reports the obstacle.
