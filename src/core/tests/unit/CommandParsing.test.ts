import { describe, it, expect } from '@jest/globals';
import { Command, parseCommands } from '../../Command';

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
});
