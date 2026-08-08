import { describe, expect, test } from '@jest/globals';
import { RoverController } from '../core/rover-controller';

describe('The RoverController', () => {
  test('should be initialised', () => {
    const rover = RoverController.initialize(0, 0, 'N');
    expect(rover.position()).toBe('0:0:N');
  });

  test('should execute the command L correctly', () => {
    const rover = RoverController.initialize(0, 0, 'N');
    const newRover = rover.command('L');
    expect(newRover.position()).toBe('0:0:W');
  });

  test('should execute the command R correctly', () => {
    const rover = RoverController.initialize(0, 0, 'N');
    const newRover = rover.command('R');
    expect(newRover.position()).toBe('0:0:E');
  });

  test('should execute the command F correctly', () => {
    const rover = RoverController.initialize(0, 0, 'N');
    const newRover = rover.command('F');
    expect(newRover.position()).toBe('0:1:N');
  });

  test('should execute the command LL correctly', () => {
    const rover = RoverController.initialize(0, 0, 'N');
    const newRover = rover.command('LL');
    expect(newRover.position()).toBe('0:0:S');
  });

  test('should execute the command LLLL correctly', () => {
    const rover = RoverController.initialize(0, 0, 'N');
    const newRover = rover.command('LLLL');
    expect(newRover.position()).toBe('0:0:N');
  });

  test('should execute the command RFF correctly', () => {
    const rover = RoverController.initialize(0, 0, 'N');
    const newRover = rover.command('RFF');
    expect(newRover.position()).toBe('2:0:E');
  });

  test('should execute the command LFF correctly', () => {
    const rover = RoverController.initialize(0, 0, 'N');
    const newRover = rover.command('LFF');
    expect(newRover.position()).toBe('8:0:W');
  });

  test('should execute the command LLFF correctly', () => {
    const rover = RoverController.initialize(0, 0, 'N');
    const newRover = rover.command('LLFF');
    expect(newRover.position()).toBe('0:8:S');
  });

  test('should execute the command FRFFR correctly', () => {
    const rover = RoverController.initialize(0, 0, 'N');
    const newRover = rover.command('FRFFR');
    expect(newRover.position()).toBe('2:1:S');
  });

  test('should execute the command FFF correctly', () => {
    const rover = RoverController.initialize(0, 0, 'N');
    const newRover = rover.command('FFFLF');
    expect(newRover.position()).toBe('9:3:W');
  });
});
