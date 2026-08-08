import { describe, expect, test, beforeEach } from '@jest/globals';
import { RoverController } from '../core/rover-controller';
import { Orientation } from '../core/orientation';
import { Position, Surface } from '../core/surface';

describe('The RoverController', () => {
  let rover: RoverController;
  beforeEach(() => {
    rover = RoverController.initialize(Position.create(0, 0, Orientation.North()), new Surface(10, 10));
  });
  test('should be initialised', () => {
    expect(rover.displayPosition()).toBe('0:0:N');
  });

  test('should execute the command L correctly', () => {
    const newRover = rover.command('L');
    expect(newRover.displayPosition()).toBe('0:0:W');
  });

  test('should execute the command R correctly', () => {
    const newRover = rover.command('R');
    expect(newRover.displayPosition()).toBe('0:0:E');
  });

  test('should execute the command F correctly', () => {
    const newRover = rover.command('F');
    expect(newRover.displayPosition()).toBe('0:1:N');
  });

  test('should execute the command LL correctly', () => {
    const newRover = rover.command('LL');
    expect(newRover.displayPosition()).toBe('0:0:S');
  });

  test('should execute the command LLLL correctly', () => {
    const newRover = rover.command('LLLL');
    expect(newRover.displayPosition()).toBe('0:0:N');
  });

  test('should execute the command RFF correctly', () => {
    const newRover = rover.command('RFF');
    expect(newRover.displayPosition()).toBe('2:0:E');
  });

  test('should execute the command LFF correctly', () => {
    const newRover = rover.command('LFF');
    expect(newRover.displayPosition()).toBe('8:0:W');
  });

  test('should execute the command LLFF correctly', () => {
    const newRover = rover.command('LLFF');
    expect(newRover.displayPosition()).toBe('0:8:S');
  });

  test('should execute the command FRFFR correctly', () => {
    const newRover = rover.command('FRFFR');
    expect(newRover.displayPosition()).toBe('2:1:S');
  });

  test('should execute the command FFF correctly', () => {
    const newRover = rover.command('FFFLF');
    expect(newRover.displayPosition()).toBe('9:3:W');
  });
});
