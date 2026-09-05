import { describe, it, expect } from '@jest/globals';
import { Command } from '../../Command';
import { Coordinates } from '../../Coordinates';
import { Direction } from '../../Direction';
import { Position } from '../../Position';
import { Rover } from '../../Rover';

/*
 * TODO - ordered case list (REASON step, temporary tracking artifact)
 *
 * 1. Position and turning
 *    [ ] the rover reports the position it was placed at
 *    [ ] the rover turns left from north
 *    [ ] the rover turns left from every orientation
 *    [ ] the rover turns right from north
 *    [ ] four right turns restore the original orientation
 * 2. Moving forward and backward
 *    [ ] the rover moves forward one cell facing north
 *    [ ] the rover moves forward in every orientation
 *    [ ] the rover moves backward one cell facing north
 *    [ ] the rover moves backward in every orientation
 * 3. Sequences and state persistence
 *    [ ] an empty sequence leaves the rover untouched
 *    [ ] a sequence is executed command by command in order
 *    [ ] a second sequence continues from where the first one ended
 * 4. The spherical surface
 *    [ ] a coordinate inside the grid resolves unchanged
 *    [ ] crossing the north edge reappears on the south one
 *    [ ] crossing the east, south and west edges
 *    [ ] moving backward also wraps
 *    [ ] each axis wraps around its own length
 *    [ ] coordinates beyond an edge are normalised when the rover is placed
 * 5. Obstacles
 *    [ ] an obstacle ahead stops the advance
 *    [ ] the report of a blocked sequence carries the obstacle coordinates
 *    [ ] a block discards every remaining command
 *    [ ] an obstacle behind stops the retreat
 *    [ ] an obstacle across a connected edge also blocks
 *    [ ] a completed sequence reports no obstacle
 *    [ ] a surrounded rover can still turn
 *    [ ] a blocked rover can leave afterwards
 * 6. Guarded placement
 *    [ ] placing the rover on an occupied cell is refused
 *    [ ] the refusal considers the wrapped coordinates
 * 7. Command parsing at the boundary
 *    [ ] text made only of known commands yields them in order
 *    [ ] empty text yields an empty sequence
 *    [ ] an unknown character rejects the whole sequence
 *    [ ] the rejection identifies the offending character
 *    [ ] F and lowercase letters are unknown characters
 */

describe('The Rover', () => {
  it('reports the position it was placed at', () => {
    const rover = new Rover(new Position(new Coordinates(0, 0), Direction.North));

    const position = rover.position();

    expect(position).toEqual(new Position(new Coordinates(0, 0), Direction.North));
  });

  it('faces west after turning left from north', () => {
    const rover = new Rover(new Position(new Coordinates(2, 2), Direction.North));

    rover.execute([Command.TurnLeft]);

    expect(rover.position()).toEqual(new Position(new Coordinates(2, 2), Direction.West));
  });

  it.each([
    { from: 'west', to: 'south', start: Direction.West, expected: Direction.South },
    { from: 'south', to: 'east', start: Direction.South, expected: Direction.East },
    { from: 'east', to: 'north', start: Direction.East, expected: Direction.North },
  ])('faces $to after turning left from $from', ({ start, expected }) => {
    const rover = new Rover(new Position(new Coordinates(2, 2), start));

    rover.execute([Command.TurnLeft]);

    expect(rover.position()).toEqual(new Position(new Coordinates(2, 2), expected));
  });
});
