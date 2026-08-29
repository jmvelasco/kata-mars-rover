# Implementation Tasks: Mars Rover

## Pre-requisites
- `[x]` Setup basic Jest test environment scaffolding in `src/`.

## Block 1: Rover State & Rotation (No Planet/Navigator Needed)
- `[x]` **Test (REASON)**: Rover receives an empty command string, stays in initial position.
- `[x]` **Test (REASON)**: Rover rotates Left (`L`) once. (N -> W)
- `[x]` **Test (REASON)**: Rover rotates Right (`R`) once. (N -> E)
- `[x]` **Test (REASON)**: Rover rotates 360 degrees (e.g., `LLLL` or `RRRR`) and returns to original direction.

## Block 2: Movement & Navigator Integration (Boundless Planet)
- `[x]` **Test (REASON)**: Implement basic `Planet` (no bounds checking yet) and inject into `Navigator`.
- `[x]` **Test (REASON)**: Rover moves Forward (`M`) facing North (Y+1).
- `[x]` **Test (REASON)**: Rover moves Backward (`B`) facing North (Y-1).
- `[x]` **Test (REASON)**: Rover moves Forward facing East (X+1).

## Block 3: Wrapping (Planet Boundaries)
- `[x]` **Test (REASON)**: Rover crosses North edge (Y > max). Appears at Y = 0.
- `[x]` **Test (REASON)**: Rover crosses South edge (Y < 0). Appears at Y = max.
- `[x]` **Test (REASON)**: Rover crosses East edge (X > max). Appears at X = 0.
- `[x]` **Test (REASON)**: Rover crosses West edge (X < 0). Appears at X = max.

## Block 4: Obstacles & Result Pattern
- `[x]` **Test (REASON)**: Introduce `Obstacle` at specific coordinate in `Planet`.
- `[ ]` **Test (REASON)**: `Navigator` returns `success: false, reason: 'OBSTACLE'` when trying to move to obstacle coordinate.
- `[ ]` **Test (REASON)**: Rover encounters obstacle, stops sequence, and returns `"X:x:y:D"` report format.
