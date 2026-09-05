import { describe, it, expect } from '@jest/globals';
import { Command, parseCommands } from '../../Command';
import { Coordinates } from '../../Coordinates';
import { Direction } from '../../Direction';
import { Planet } from '../../Planet';
import { Position } from '../../Position';
import { Rover } from '../../Rover';

describe('The Command Sequence', () => {
  it('turns the text of known commands into those commands in the same order', () => {
    const text = 'LRMB';

    const commands = parseCommands(text);

    expect(commands).toEqual([Command.TurnLeft, Command.TurnRight, Command.MoveForward, Command.MoveBackward]);
  });

  it('accepts an empty text and yields no commands', () => {
    const text = '';

    const commands = parseCommands(text);

    expect(commands).toEqual([]);
  });

  it('names the unknown character that rejected the sequence', () => {
    const text = 'MMXR';

    const parsing = () => parseCommands(text);

    expect(parsing).toThrow("Unknown command 'X'");
  });

  it.each([
    { unknown: 'F', text: 'F' },
    { unknown: 'm', text: 'mm' },
  ])('rejects $unknown because it is not part of the vocabulary', ({ unknown, text }) => {
    const parsing = () => parseCommands(text);

    expect(parsing).toThrow(`Unknown command '${unknown}'`);
  });
});

describe('The Rover', () => {
  it('does not move when the sequence contains an unknown character', () => {
    const rover = Rover.land(new Position(new Coordinates(2, 2), Direction.North), new Planet(5, 5));

    const mission = () => rover.execute(parseCommands('MMXR'));

    expect(mission).toThrow('Unknown command');
    expect(rover.position()).toEqual(new Position(new Coordinates(2, 2), Direction.North));
  });
});
