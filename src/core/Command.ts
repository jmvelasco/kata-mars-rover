export enum Command {
  TurnLeft = 'L',
  TurnRight = 'R',
  MoveForward = 'M',
  MoveBackward = 'B',
}

export const parseCommands = (text: string): Command[] => {
  const commandOf: Record<string, Command> = {
    [Command.TurnLeft]: Command.TurnLeft,
    [Command.TurnRight]: Command.TurnRight,
    [Command.MoveForward]: Command.MoveForward,
    [Command.MoveBackward]: Command.MoveBackward,
  };

  return text.split('').map((character) => commandOf[character]);
};
