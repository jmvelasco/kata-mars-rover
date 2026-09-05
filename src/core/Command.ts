export enum Command {
  TurnLeft = 'L',
  TurnRight = 'R',
  MoveForward = 'M',
  MoveBackward = 'B',
}

const toCommand = (character: string): Command => {
  const command = Object.values(Command).find((knownCommand) => knownCommand === character);

  if (command === undefined) {
    throw new Error(`Unknown command '${character}'`);
  }

  return command;
};

export const parseCommands = (text: string): Command[] => text.split('').map((character) => toCommand(character));
