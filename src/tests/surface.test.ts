import { describe, expect, test } from '@jest/globals';
import { Surface } from '../core/surface';
import { Position } from '../core/position';
import { Orientation } from '../core/orientation';

describe('The Surface module', () => {
  const surface = new Surface(10, 20);
  const orientation = Orientation.create('N');

  test.each([
    [23, 12, 3, 2],
    [20, 10, 0, 0],
    [22, 9, 2, 9],
    [18, 12, 18, 2],
    [18, -1, 18, 9],
    [-1, -1, 19, 9],
    [-3, 3, 17, 3],
  ])('normalizes the position (%i, %i) to (%i, %i)', (initX, initY, normX, normY) => {
    const position = Position.create(initX, initY, orientation);
    const normalizedPosition = surface.normalizedPosition(position);
    expect(normalizedPosition.value()).toEqual({ x: normX, y: normY, orientation: orientation });
  });
});
