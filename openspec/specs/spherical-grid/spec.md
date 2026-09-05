# spherical-grid Specification

## Purpose
Describes the planetary surface as a finite grid whose opposite edges are connected, so that every coordinate the rover can name resolves to a real cell and nothing is ever outside the map.
## Requirements
### Requirement: The surface has a width and a height

The surface SHALL be created with a width and a height given independently, so that non-square grids are supported. Coordinates run from `0` to `width - 1` on the `x` axis and from `0` to `height - 1` on the `y` axis, with the origin at the bottom-left corner.

#### Scenario: A coordinate inside the grid is left as it is
- **GIVEN** a 5x3 surface
- **AND** the coordinates (4, 2)
- **WHEN** the surface resolves them
- **THEN** the result is (4, 2), unchanged

#### Scenario: Width and height are independent
- **GIVEN** a 5x3 surface
- **WHEN** the coordinates (5, 3) are resolved
- **THEN** the result is (0, 0), each axis wrapping around its own length

### Requirement: Crossing an edge reappears on the opposite one

The surface SHALL wrap any coordinate that falls beyond an edge to the opposite edge, so that the rover reappears on the other side instead of leaving the map.

#### Scenario: Crossing the north edge
- **GIVEN** a rover at coordinates (2, 4) facing north on a 5x5 surface
- **WHEN** it executes `M`
- **THEN** it is at coordinates (2, 0) facing north

#### Scenario: Crossing the east edge
- **GIVEN** a rover at coordinates (4, 2) facing east on a 5x5 surface
- **WHEN** it executes `M`
- **THEN** it is at coordinates (0, 2) facing east

#### Scenario: Crossing the south edge
- **GIVEN** a rover at coordinates (2, 0) facing south on a 5x5 surface
- **WHEN** it executes `M`
- **THEN** it is at coordinates (2, 4) facing south

#### Scenario: Crossing the west edge
- **GIVEN** a rover at coordinates (0, 2) facing west on a 5x5 surface
- **WHEN** it executes `M`
- **THEN** it is at coordinates (4, 2) facing west

#### Scenario: Moving backward also wraps
- **GIVEN** a rover at coordinates (2, 0) facing north on a 5x5 surface
- **WHEN** it executes `B`
- **THEN** it is at coordinates (2, 4) facing north

### Requirement: No coordinate is ever outside the surface

Because opposite edges are connected, the surface SHALL treat a coordinate beyond its bounds as another way of naming a cell inside them, and SHALL normalise it by wrapping. This applies to every coordinate the surface handles: the ones the rover reaches by moving, the ones it is placed at, and the ones that name an obstacle.

#### Scenario: Placing the rover beyond the east edge
- **GIVEN** a 5x5 surface
- **WHEN** a rover is placed at coordinates (12, 3) facing north
- **THEN** it reports coordinates (2, 3) facing north

#### Scenario: Placing the rover at a negative coordinate
- **GIVEN** a 5x5 surface
- **WHEN** a rover is placed at coordinates (-1, 0) facing north
- **THEN** it reports coordinates (4, 0) facing north

#### Scenario: Declaring an obstacle beyond an edge
- **GIVEN** a 5x5 surface with an obstacle at coordinates (7, 2)
- **WHEN** the surface resolves where that obstacle sits
- **THEN** the obstacle occupies the cell (2, 2), the one its coordinates name

