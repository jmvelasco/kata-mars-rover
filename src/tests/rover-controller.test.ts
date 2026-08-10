import { describe, expect, test, beforeEach } from '@jest/globals';
import { RoverController } from '../core/rover-controller';
import { Orientation } from '../core/orientation';
import { Surface } from '../core/surface';
import { Position } from '../core/position';

describe('The RoverController', () => {
  let rover: RoverController;
  beforeEach(() => {
    rover = RoverController.initialize(Position.create(0, 0, Orientation.create('N')), new Surface(10, 10));
  });
  test('should be initialised', () => {
    expect(rover.displayPosition()).toBe('0:0:N');
  });

  test('should execute the command L correctly', () => {
    rover.command('L');
    expect(rover.displayPosition()).toBe('0:0:W');
  });

  test('should execute the command R correctly', () => {
    rover.command('R');
    expect(rover.displayPosition()).toBe('0:0:E');
  });

  test('should execute the command F correctly', () => {
    rover.command('F');
    expect(rover.displayPosition()).toBe('0:1:N');
  });

  test('should execute the command B correctly', () => {
    rover.command('B');
    expect(rover.displayPosition()).toBe('0:9:N');
  });

  test('should execute the command BRB correctly', () => {
    rover.command('BRB');
    expect(rover.displayPosition()).toBe('9:9:E');
  });

  test('should execute the command BRBLFF correctly', () => {
    rover.command('BRBLFF');
    expect(rover.displayPosition()).toBe('9:1:N');
  });

  test('should execute the command LL correctly', () => {
    rover.command('LL');
    expect(rover.displayPosition()).toBe('0:0:S');
  });

  test('should execute the command LLLL correctly', () => {
    rover.command('LLLL');
    expect(rover.displayPosition()).toBe('0:0:N');
  });

  test('should execute the command RFF correctly', () => {
    rover.command('RFF');
    expect(rover.displayPosition()).toBe('2:0:E');
  });

  test('should execute the command LFF correctly', () => {
    rover.command('LFF');
    expect(rover.displayPosition()).toBe('8:0:W');
  });

  test('should execute the command LLFF correctly', () => {
    rover.command('LLFF');
    expect(rover.displayPosition()).toBe('0:8:S');
  });

  test('should execute the command FRFFR correctly', () => {
    rover.command('FRFFR');
    expect(rover.displayPosition()).toBe('2:1:S');
  });

  test('should execute the command FFF correctly', () => {
    rover.command('FFFLF');
    expect(rover.displayPosition()).toBe('9:3:W');
  });
});
