import { describe, it, expect } from 'bun:test';
import { Rover } from '../../domain/Rover';

describe('The Rover', () => {
  it('stays in initial position when receiving an empty command', () => {
    const rover = new Rover(0, 0, 'N');

    const report = rover.execute('');

    expect(report).toBe('0:0:N');
  });
});
