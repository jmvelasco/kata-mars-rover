import { describe, expect, test } from '@jest/globals';
import { Surface } from '../core/surface';

describe('The Surface module', () => {
  test('create a surface with the defined dimension', () => {
    const surfaceRows = 10;
    const surfaceCols = 20;
    const surface = new Surface(surfaceRows, surfaceCols);
    expect(surface).toBeInstanceOf(Surface);
    expect(surface.dimension().rows).toBe(surfaceRows);
    expect(surface.dimension().columns).toBe(surfaceCols);
  });

  test('detects when the surface is must not be wrapped ', () => {
    const surfaceRows = 10;
    const surfaceCols = 20;
    const surface = new Surface(surfaceRows, surfaceCols);

    const coordinate = { x: surfaceCols - 1, y: surfaceRows - 1 };
    expect(surface.shouldWrapTheSurface(coordinate)).toEqual({
      E: false,
      W: false,
      S: false,
      N: false,
    });
  });

  test('detects when the surface is wrapped at the north', () => {
    const surfaceRows = 10;
    const surfaceCols = 20;
    const surface = new Surface(surfaceRows, surfaceCols);

    const coordinate = { x: surfaceCols - 1, y: surfaceRows + 1 };
    expect(surface.shouldWrapTheSurface(coordinate)).toEqual({
      E: false,
      W: false,
      S: false,
      N: true,
    });
  });

  test('detects when the surface is wrapped at the south', () => {
    const surfaceRows = 10;
    const surfaceCols = 20;
    const surface = new Surface(surfaceRows, surfaceCols);

    const coordinate = { x: surfaceCols - 1, y: surfaceRows - (surfaceRows + 1) };
    expect(surface.shouldWrapTheSurface(coordinate)).toEqual({
      E: false,
      W: false,
      S: true,
      N: false,
    });
  });

  test('detects when the surface is wrapped at the east', () => {
    const surfaceRows = 10;
    const surfaceCols = 20;
    const surface = new Surface(surfaceRows, surfaceCols);

    const coordinate = { x: surfaceCols + 1, y: surfaceRows - 1 };
    expect(surface.shouldWrapTheSurface(coordinate)).toEqual({
      E: true,
      W: false,
      S: false,
      N: false,
    });
  });

  test('detects when the surface is wrapped at the west', () => {
    const surfaceRows = 10;
    const surfaceCols = 20;
    const surface = new Surface(surfaceRows, surfaceCols);

    const coordinate = { x: surfaceCols - (surfaceCols + 1), y: surfaceRows - 1 };
    expect(surface.shouldWrapTheSurface(coordinate)).toEqual({
      E: false,
      W: true,
      S: false,
      N: false,
    });
  });
});
