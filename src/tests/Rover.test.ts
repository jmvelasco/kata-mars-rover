import { Rover } from '../core/Rover';
import { Navigator } from '../core/Navigator';
import { Planet } from '../core/Planet';

const createRover = (x: number, y: number, direction: string, obstacles: { x: number; y: number }[] = []) => {
  const planet = new Planet(10, 10, obstacles);
  const navigator = new Navigator(planet);
  return new Rover(x, y, direction, navigator);
};

describe('The Rover', () => {
  it('stays in initial position when receiving an empty command', () => {
    const rover = createRover(0, 0, 'N');
    const report = rover.execute('');
    expect(report).toBe('0:0:N');
  });

  it('rotates Left (L) once from North to West', () => {
    const rover = createRover(0, 0, 'N');
    const report = rover.execute('L');
    expect(report).toBe('0:0:W');
  });

  it('rotates Right (R) once from North to East', () => {
    const rover = createRover(0, 0, 'N');
    const report = rover.execute('R');
    expect(report).toBe('0:0:E');
  });

  it('processes multiple commands (LL) and rotates from North to South', () => {
    const rover = createRover(0, 0, 'N');
    const report = rover.execute('LL');
    expect(report).toBe('0:0:S');
  });

  it('rotates 360 degrees (LLLL) and returns to original direction', () => {
    const rover = createRover(0, 0, 'N');
    const report = rover.execute('LLLL');
    expect(report).toBe('0:0:N');
  });

  it('rotates 360 degrees (RRRR) and returns to original direction', () => {
    const rover = createRover(0, 0, 'N');
    const report = rover.execute('RRRR');
    expect(report).toBe('0:0:N');
  });

  it('moves Forward (M) facing North (Y+1)', () => {
    const rover = createRover(0, 0, 'N');
    const report = rover.execute('M');
    expect(report).toBe('0:1:N');
  });

  it('moves Backward (B) facing North (Y-1)', () => {
    const rover = createRover(0, 1, 'N');
    const report = rover.execute('B');
    expect(report).toBe('0:0:N');
  });

  it('moves Forward (M) facing East (X+1)', () => {
    const rover = createRover(0, 0, 'E');
    const report = rover.execute('M');
    expect(report).toBe('1:0:E');
  });

  it('crosses North edge (Y > max) and appears at Y = 0', () => {
    const rover = createRover(0, 9, 'N');
    const report = rover.execute('M');
    expect(report).toBe('0:0:N');
  });

  it('crosses South edge (Y < 0) and appears at Y = max', () => {
    const rover = createRover(0, 0, 'S');
    const report = rover.execute('M');
    expect(report).toBe('0:9:S');
  });

  it('crosses East edge (X > max) and appears at X = 0', () => {
    const rover = createRover(9, 0, 'E');
    const report = rover.execute('M');
    expect(report).toBe('0:0:E');
  });

  it('crosses West edge (X < 0) and appears at X = max', () => {
    const rover = createRover(0, 0, 'W');
    const report = rover.execute('M');
    expect(report).toBe('9:0:W');
  });

  it('stops sequence and returns "O:x:y:D" report format when encountering obstacle', () => {
    const rover = createRover(0, 0, 'N', [{ x: 0, y: 2 }]);
    const report = rover.execute('MMM');
    expect(report).toBe('O:0:1:N');
  });
});
