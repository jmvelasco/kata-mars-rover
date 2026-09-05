export enum Command {
  TurnLeft = 'L',
  TurnRight = 'R',
  MoveForward = 'M',
  MoveBackward = 'B',
}

export const parseCommands = (text: string): Command[] => text.split('').map(() => Command.TurnLeft);
