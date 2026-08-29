import { describe, it, expect } from 'bun:test';
import { Rover } from '../../domain/Rover';

describe('The Rover', () => {
  it('stays in initial position when receiving an empty command', () => {
    const rover = new Rover(0, 0, 'N');

    const report = rover.execute('');

    expect(report).toBe('0:0:N');
  });

  it('rotates Left (L) once from North to West', () => {
    const rover = new Rover(0, 0, 'N');

    const report = rover.execute('L');

    expect(report).toBe('0:0:W');
  });

  it('rotates Right (R) once from North to East', () => {
    const rover = new Rover(0, 0, 'N');

    const report = rover.execute('R');

    expect(report).toBe('0:0:E');
  });
});
