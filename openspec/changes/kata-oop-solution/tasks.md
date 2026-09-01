## 1. Domain Entities setup

- [ ] 1.1 Scaffold the `Position` Value Object. 📋 Applying `tdd.md` rule: create failing test for Position equality, make it pass. Verify: `bun test` passes.
- [ ] 1.2 Scaffold the `Direction` interface and its first concrete implementation (e.g., `North`). 🧩 Applying `coding-standards.md` (State pattern). Verify: Unit tests for North rotation and forward vector pass.
- [ ] 1.3 Complete the State pattern with `East`, `South`, and `West` classes. ♻️ Refactoring step to ensure all rotations return correct objects. Verify: All direction tests pass.

## 2. Core Movement and Grid

- [ ] 2.1 Scaffold the `Grid` class with wrapping logic. 📐 Applying `tdd.md` for positive wrapping math. Verify: Test wrapping moving North from top edge passes.
- [ ] 2.2 Add obstacle logic to `Grid`. 🚧 Verify: `hasObstacle` correctly identifies collisions based on coordinate matches.
- [ ] 2.3 Scaffold the `Rover` class to maintain `Position` and `Direction`, referencing `Grid`. 🚀 Verify: Rover initialization test passes.

## 3. Command Execution

- [ ] 3.1 Implement parsing and execution of Rotation commands (`L`, `R`) in `Rover`. 🔄 Applying `xp-methodology.md`. Verify: Rover correctly turns left and right in sequence.
- [ ] 3.2 Implement execution of Movement commands (`M`/`F`, `B`) in `Rover`. 🚶 Verify: Rover successfully advances and wraps around the grid.
- [ ] 3.3 Implement abort on Obstacle detection during command execution. 🛑 Verify: Rover stops at the last valid position and reports status when hitting an obstacle.

## 4. Final Validation and Polish

- [ ] 4.1 💅 Apply coding standards: run `bun run format:fix` and `bun run validate` to ensure compilation, linting, and tests pass.
- [ ] 4.2 🏗️ Run `bun run compile` to catch any broken imports and type errors before marking the change as complete.
