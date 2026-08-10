import { Position } from '../core/position';
import { directions, Orientation } from '../core/orientation';

const createInitialPositionOrientedTo = (direction: directions) => {
  return new Position(0, 0, Orientation.create(direction));
};

describe('The Position module', () => {
  test('creates and display a position', () => {
    const position = createInitialPositionOrientedTo('N');
    expect(position.display()).toBe(`0:0:N`);
  });

  test('registers a rotate left operation correctly', () => {
    expect(createInitialPositionOrientedTo('N').rotateLeft().display()).toBe(`0:0:W`);
    expect(createInitialPositionOrientedTo('E').rotateLeft().display()).toBe(`0:0:N`);
    expect(createInitialPositionOrientedTo('S').rotateLeft().display()).toBe(`0:0:E`);
    expect(createInitialPositionOrientedTo('W').rotateLeft().display()).toBe(`0:0:S`);
  });

  test('registers a rotate right operation correctly', () => {
    expect(createInitialPositionOrientedTo('N').rotateRight().display()).toBe(`0:0:E`);
    expect(createInitialPositionOrientedTo('E').rotateRight().display()).toBe(`0:0:S`);
    expect(createInitialPositionOrientedTo('S').rotateRight().display()).toBe(`0:0:W`);
    expect(createInitialPositionOrientedTo('W').rotateRight().display()).toBe(`0:0:N`);
  });

  test('registers a move forward operation correctly', () => {
    expect(createInitialPositionOrientedTo('N').moveForward().display()).toBe(`0:1:N`);
    expect(createInitialPositionOrientedTo('E').moveForward().display()).toBe(`1:0:E`);
  });

  test('registers a move backward operation correctly', () => {
    expect(createInitialPositionOrientedTo('S').moveBackward().display()).toBe(`0:1:S`);
    expect(createInitialPositionOrientedTo('W').moveBackward().display()).toBe(`1:0:W`);
  });
});
