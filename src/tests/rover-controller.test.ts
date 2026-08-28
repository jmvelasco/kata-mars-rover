import { describe, expect, test } from '@jest/globals';
import { RoverController } from '../core/rover-controller';
import { Directions, Orientation } from '../core/orientation';
import { Surface } from '../core/surface';
import { Position } from '../core/position';

const createRoverAt = (x: number, y: number, dir: Directions, surfaceRows = 10, surfaceCols = 20) => {
  const surface = new Surface(surfaceRows, surfaceCols);
  const orientation = Orientation.create(dir);
  const position = Position.create(x, y, orientation);
  return RoverController.initialize(position, surface);
};

describe('The RoverController', () => {
  test('should be initialised with a position inside the boundaries of the surface', () => {
    const rover = createRoverAt(0, 0, 'N');
    expect(rover.displayPosition()).toBe('0:0:N');
  });

  test('should throw an error if it is positioned initially outside the boundaries of the surface', () => {
    expect(() => createRoverAt(22, 0, 'N')).toThrow('The Rover is positioned outside the boundaries of the surface');
    expect(() => createRoverAt(18, 12, 'N')).toThrow('The Rover is positioned outside the boundaries of the surface');
    expect(() => createRoverAt(23, 12, 'N')).toThrow('The Rover is positioned outside the boundaries of the surface');
    expect(() => createRoverAt(-1, 8, 'N')).toThrow('The Rover is positioned outside the boundaries of the surface');
    expect(() => createRoverAt(12, -2, 'N')).toThrow('The Rover is positioned outside the boundaries of the surface');
    expect(() => createRoverAt(-1, -2, 'N')).toThrow('The Rover is positioned outside the boundaries of the surface');
  });

  test('should rotate to the left', () => {
    const rover = createRoverAt(0, 0, 'N');
    rover.command('L');
    expect(rover.displayPosition()).toBe('0:0:W');
    rover.command('L');
    expect(rover.displayPosition()).toBe('0:0:S');
    rover.command('L');
    expect(rover.displayPosition()).toBe('0:0:E');
    rover.command('L');
    expect(rover.displayPosition()).toBe('0:0:N');
  });

  test('should rotate to the right', () => {
    const rover = createRoverAt(0, 0, 'N');
    rover.command('R');
    expect(rover.displayPosition()).toBe('0:0:E');
    rover.command('R');
    expect(rover.displayPosition()).toBe('0:0:S');
    rover.command('R');
    expect(rover.displayPosition()).toBe('0:0:W');
    rover.command('R');
    expect(rover.displayPosition()).toBe('0:0:N');
  });

  test('should move forward and backward inside the boundaries of the surface along the y axis', () => {
    const rover = createRoverAt(0, 0, 'N');
    rover.command('F');
    expect(rover.displayPosition()).toBe('0:1:N');
    rover.command('B');
    expect(rover.displayPosition()).toBe('0:0:N');
    rover.command('FFFFF');
    expect(rover.displayPosition()).toBe('0:5:N');
    rover.command('BB');
    expect(rover.displayPosition()).toBe('0:3:N');
  });

  test('should move forward and backward inside the boundaries of the surface along the x axis', () => {
    const rover = createRoverAt(0, 0, 'E');
    rover.command('F');
    expect(rover.displayPosition()).toBe('1:0:E');
    rover.command('B');
    expect(rover.displayPosition()).toBe('0:0:E');
    rover.command('FFFFF');
    expect(rover.displayPosition()).toBe('5:0:E');
    rover.command('BB');
    expect(rover.displayPosition()).toBe('3:0:E');
  });

  test('should move forward and backward wrapping the surface when overlap the boundaries of the surface along the y axis', () => {
    const rover = createRoverAt(0, 8, 'N');
    rover.command('FFF');
    expect(rover.displayPosition()).toBe('0:1:N');
    rover.command('BBBBB');
    expect(rover.displayPosition()).toBe('0:6:N');
  });

  test('should move forward and backward wrapping the surface when overlap the boundaries of the surface along the x axis', () => {
    const rover = createRoverAt(18, 0, 'E');
    rover.command('FFF');
    expect(rover.displayPosition()).toBe('1:0:E');
    rover.command('BBBBB');
    expect(rover.displayPosition()).toBe('16:0:E');
  });
});
