import { describe, expect, test } from '@jest/globals';
import { RoverController } from '../core/rover-controller';
import { Orientation } from '../core/orientation';
import { Surface } from '../core/surface';
import { Position } from '../core/position';

describe('The RoverController', () => {
  test('should be initialised with a position inside the boundaries of the surface', () => {
    const surfaceRows = 10;
    const surfaceCols = 20;
    const surface = new Surface(surfaceRows, surfaceCols);
    const orientation = Orientation.create('N');
    const position = Position.create(0, 0, orientation);
    const rover = RoverController.initialize(position, surface);
    expect(rover.displayPosition()).toBe('0:0:N');
  });

  test('should throw an error if it is positioned initially outside the boundaries of the surface', () => {
    const surfaceRows = 10;
    const surfaceCols = 20;
    const surface = new Surface(surfaceRows, surfaceCols);
    const orientation = Orientation.create('N');
    expect(() => RoverController.initialize(Position.create(22, 0, orientation), surface)).toThrow(
      'The Rover is positioned outside the boundaries of the surface'
    );
    expect(() => RoverController.initialize(Position.create(18, 12, orientation), surface)).toThrow(
      'The Rover is positioned outside the boundaries of the surface'
    );
    expect(() => RoverController.initialize(Position.create(23, 12, orientation), surface)).toThrow(
      'The Rover is positioned outside the boundaries of the surface'
    );
    expect(() => RoverController.initialize(Position.create(-1, 8, orientation), surface)).toThrow(
      'The Rover is positioned outside the boundaries of the surface'
    );
    expect(() => RoverController.initialize(Position.create(12, -2, orientation), surface)).toThrow(
      'The Rover is positioned outside the boundaries of the surface'
    );
    expect(() => RoverController.initialize(Position.create(-1, -2, orientation), surface)).toThrow(
      'The Rover is positioned outside the boundaries of the surface'
    );
  });

  test('should rotate to the left', () => {
    const surfaceRows = 10;
    const surfaceCols = 20;
    const surface = new Surface(surfaceRows, surfaceCols);
    const orientation = Orientation.create('N');
    const position = Position.create(0, 0, orientation);
    const rover = RoverController.initialize(position, surface);
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
    const surfaceRows = 10;
    const surfaceCols = 20;
    const surface = new Surface(surfaceRows, surfaceCols);
    const orientation = Orientation.create('N');
    const position = Position.create(0, 0, orientation);
    const rover = RoverController.initialize(position, surface);
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
    const surfaceRows = 10;
    const surfaceCols = 20;
    const surface = new Surface(surfaceRows, surfaceCols);
    const orientation = Orientation.create('N');
    const position = Position.create(0, 0, orientation);
    const rover = RoverController.initialize(position, surface);
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
    const surfaceRows = 10;
    const surfaceCols = 20;
    const surface = new Surface(surfaceRows, surfaceCols);
    const orientation = Orientation.create('E');
    const position = Position.create(0, 0, orientation);
    const rover = RoverController.initialize(position, surface);
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
    const surfaceRows = 10;
    const surfaceCols = 20;
    const surface = new Surface(surfaceRows, surfaceCols);
    const orientation = Orientation.create('N');
    const position = Position.create(0, 8, orientation);
    const rover = RoverController.initialize(position, surface);
    rover.command('FFF');
    expect(rover.displayPosition()).toBe('0:1:N');
    rover.command('BBBBB');
    expect(rover.displayPosition()).toBe('0:6:N');
  });

  test('should move forward and backward wrapping the surface when overlap the boundaries of the surface along the x axis', () => {
    const surfaceRows = 10;
    const surfaceCols = 20;
    const surface = new Surface(surfaceRows, surfaceCols);
    const orientation = Orientation.create('E');
    const position = Position.create(18, 0, orientation);
    const rover = RoverController.initialize(position, surface);
    rover.command('FFF');
    expect(rover.displayPosition()).toBe('1:0:E');
    rover.command('BBBBB');
    expect(rover.displayPosition()).toBe('16:0:E');
  });
});
