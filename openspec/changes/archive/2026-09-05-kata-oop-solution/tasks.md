## 1. Domain Entities setup

- [x] 1.1 Scaffold the `Position` Value Object. 📋 Applying `tdd.md` rule: create failing test for Position equality, make it pass. Verify: `bun test` passes.
- [x] 1.2 Scaffold the `Direction` interface and its first concrete implementation (e.g., `North`). 🧩 Applying `coding-standards.md` (State pattern). Verify: Unit tests for North rotation and forward vector pass.
- [x] 1.3 Complete the State pattern with `East`, `South`, and `West` classes. ♻️ Refactoring step to ensure all rotations return correct objects. Verify: All direction tests pass.

## 2. Core Movement and Grid

- [x] 2.1 Scaffold the `Grid` class with wrapping logic. 📐 Applying `tdd.md` for positive wrapping math. Verify: Test wrapping moving North from top edge passes.
- [x] 2.2 Add obstacle logic to `Grid`. 🚧 Verify: `hasObstacle` correctly identifies collisions based on coordinate matches.
- [x] 2.3 Scaffold the `Rover` class to maintain `Position` and `Direction`, referencing `Grid`. 🚀 Verify: Rover initialization test passes.

## 3. Command Execution

- [x] 3.1 Implement parsing and execution of Rotation commands (`L`, `R`) in `Rover`. 🔄 Applying `xp-methodology.md`. Verify: Rover correctly turns left and right in sequence.
- [x] 3.2 Implement execution of Movement commands (`M`/`F`, `B`) in `Rover`. 🚶 Verify: Rover successfully advances and wraps around the grid.
- [x] 3.3 Implement abort on Obstacle detection during command execution. 🛑 Verify: Rover stops at the last valid position and reports status when hitting an obstacle.

## 4. Final Validation and Polish

- [x] 4.1 Refactor any remaining smells. Apply coding standards (e.g., extracting branches to small dedicated functions). 🧹
- [x] 4.2 Validate the final solution with tests. Verify: Ensure 100% test pass rate.
- [x] 4.3 Clean up TODOs, scaffolding artifacts, and finalize. 🎉
