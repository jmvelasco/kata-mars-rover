import { describe, expect, test } from '@jest/globals';
import { Surface } from '../core/surface';
import { Position } from '../core/position';
import { Orientation } from '../core/orientation';

describe('The Surface module', () => {
  test('returns the normalized position', () => {
    const surfaceRows = 10;
    const surfaceCols = 20;
    const surface = new Surface(surfaceRows, surfaceCols);
    const orientation = Orientation.create('N');

    const position = Position.create(23, 12, orientation);
    const normalizedPosition = surface.normalizedPosition(position);
    expect(normalizedPosition.value()).toEqual({ x: 3, y: 2, orientation: orientation });
  });

  test('returns the normalized position', () => {
    const surfaceRows = 10;
    const surfaceCols = 20;
    const surface = new Surface(surfaceRows, surfaceCols);
    const orientation = Orientation.create('N');
    let position: Position;
    let normalizedPosition: Position;

    position = Position.create(20, 10, orientation);
    normalizedPosition = surface.normalizedPosition(position);
    expect(normalizedPosition.value()).toEqual({ x: 0, y: 0, orientation: orientation });

    position = Position.create(22, 9, orientation);
    normalizedPosition = surface.normalizedPosition(position);
    expect(normalizedPosition.value()).toEqual({ x: 2, y: 9, orientation: orientation });

    position = Position.create(18, 12, orientation);
    normalizedPosition = surface.normalizedPosition(position);
    expect(normalizedPosition.value()).toEqual({ x: 18, y: 2, orientation: orientation });

    position = Position.create(18, -1, orientation);
    normalizedPosition = surface.normalizedPosition(position);
    expect(normalizedPosition.value()).toEqual({ x: 18, y: 9, orientation: orientation });

    position = Position.create(-1, -1, orientation);
    normalizedPosition = surface.normalizedPosition(position);
    expect(normalizedPosition.value()).toEqual({ x: 19, y: 9, orientation: orientation });

    position = Position.create(-3, 3, orientation);
    normalizedPosition = surface.normalizedPosition(position);
    expect(normalizedPosition.value()).toEqual({ x: 17, y: 3, orientation: orientation });
  });
});
