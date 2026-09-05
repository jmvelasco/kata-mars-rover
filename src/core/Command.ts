export enum Command {
  TurnLeft = 'L',
  TurnRight = 'R',
  MoveForward = 'M',
  MoveBackward = 'B',
}

const toCommand = (character: string): Command => {
  const commandOf: Record<string, Command | undefined> = {
    [Command.TurnLeft]: Command.TurnLeft,
    [Command.TurnRight]: Command.TurnRight,
    [Command.MoveForward]: Command.MoveForward,
    [Command.MoveBackward]: Command.MoveBackward,
  };

  const command = commandOf[character];

  if (command === undefined) {
    throw new Error(`Unknown command '${character}'`);
  }

  return command;
};

export const parseCommands = (text: string): Command[] => text.split('').map((character) => toCommand(character));
