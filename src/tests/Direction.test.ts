import { North, West, East, South } from '../core/Direction';

describe('The North Direction', () => {
  it('has value N', () => {
    expect(new North().value).toBe('N');
  });
  it('turns left to West', () => {
    const north = new North();
    expect(north.turnLeft()).toBeInstanceOf(West);
  });
  it('turns right to East', () => {
    const north = new North();
    expect(north.turnRight()).toBeInstanceOf(East);
  });
  it('moves forward by incrementing Y', () => {
    const north = new North();
    expect(north.moveForward({ x: 0, y: 0 })).toEqual({ x: 0, y: 1 });
  });
  it('moves backward by decrementing Y', () => {
    const north = new North();
    expect(north.moveBackward({ x: 0, y: 1 })).toEqual({ x: 0, y: 0 });
  });
});

describe('The South Direction', () => {
  it('has value S', () => {
    expect(new South().value).toBe('S');
  });
  it('turns left to East', () => {
    const south = new South();
    expect(south.turnLeft()).toBeInstanceOf(East);
  });
  it('turns right to West', () => {
    const south = new South();
    expect(south.turnRight()).toBeInstanceOf(West);
  });
  it('moves forward by decrementing Y', () => {
    const south = new South();
    expect(south.moveForward({ x: 0, y: 1 })).toEqual({ x: 0, y: 0 });
  });
  it('moves backward by incrementing Y', () => {
    const south = new South();
    expect(south.moveBackward({ x: 0, y: 0 })).toEqual({ x: 0, y: 1 });
  });
});

describe('The East Direction', () => {
  it('has value E', () => {
    expect(new East().value).toBe('E');
  });
  it('turns left to North', () => {
    const east = new East();
    expect(east.turnLeft()).toBeInstanceOf(North);
  });
  it('turns right to South', () => {
    const east = new East();
    expect(east.turnRight()).toBeInstanceOf(South);
  });
  it('moves forward by incrementing X', () => {
    const east = new East();
    expect(east.moveForward({ x: 0, y: 0 })).toEqual({ x: 1, y: 0 });
  });
  it('moves backward by decrementing X', () => {
    const east = new East();
    expect(east.moveBackward({ x: 1, y: 0 })).toEqual({ x: 0, y: 0 });
  });
});

describe('The West Direction', () => {
  it('has value W', () => {
    expect(new West().value).toBe('W');
  });
  it('turns left to South', () => {
    const west = new West();
    expect(west.turnLeft()).toBeInstanceOf(South);
  });
  it('turns right to North', () => {
    const west = new West();
    expect(west.turnRight()).toBeInstanceOf(North);
  });
  it('moves forward by decrementing X', () => {
    const west = new West();
    expect(west.moveForward({ x: 1, y: 0 })).toEqual({ x: 0, y: 0 });
  });
  it('moves backward by incrementing X', () => {
    const west = new West();
    expect(west.moveBackward({ x: 0, y: 0 })).toEqual({ x: 1, y: 0 });
  });
});
