# command-parsing Specification

## Purpose
Turns the textual input sent to the rover into the movement commands it understands, refusing any input containing something the rover cannot execute so that a malformed sequence never reaches the surface.
## Requirements
### Requirement: Recognised command vocabulary

The system SHALL recognise exactly four commands: `L` (turn left), `R` (turn right), `M` (move forward) and `B` (move backward). Any other character is unknown.

#### Scenario: A sequence made only of recognised commands is accepted
- **GIVEN** the text `LRMB`
- **WHEN** the sequence is prepared for the rover
- **THEN** it yields four commands in the same order: turn left, turn right, move forward, move backward
- **AND** the sequence is not rejected

#### Scenario: The forward command has no synonym
- **GIVEN** the text `F`
- **WHEN** the sequence is prepared for the rover
- **THEN** the sequence is rejected
- **AND** `M` remains the only command that moves the rover forward

#### Scenario: Command letters are uppercase only
- **GIVEN** the text `mm`
- **WHEN** the sequence is prepared for the rover
- **THEN** the sequence is rejected, because lowercase letters are not part of the vocabulary

### Requirement: An unknown character rejects the whole sequence

The system SHALL reject a command sequence in its entirety when it contains at least one unknown character. The rover MUST NOT execute any part of a rejected sequence, and MUST NOT change its coordinates or its orientation.

#### Scenario: Unknown character in the middle of the sequence
- **GIVEN** a rover at coordinates (2, 2) facing north
- **AND** the text `MMXR`
- **WHEN** the sequence is prepared for the rover
- **THEN** the sequence is rejected
- **AND** the rover is still at coordinates (2, 2) facing north

#### Scenario: The position of the unknown character is irrelevant
- **GIVEN** the text `MMR!`
- **WHEN** the sequence is prepared for the rover
- **THEN** the sequence is rejected exactly as if the unknown character had appeared first

#### Scenario: The rejection identifies the offending character
- **GIVEN** the text `MMXR`
- **WHEN** the sequence is prepared for the rover
- **THEN** the rejection reports `X` as the unknown character

### Requirement: An empty sequence is valid

The system SHALL accept empty input and produce a sequence with no commands.

#### Scenario: Empty text
- **GIVEN** the empty text
- **WHEN** the sequence is prepared for the rover
- **THEN** it yields a sequence containing no commands
- **AND** the sequence is not rejected

