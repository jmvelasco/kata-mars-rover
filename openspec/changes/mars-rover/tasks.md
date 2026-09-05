## 1. Scaffolding

- [x] 1.1 Remove placeholder files (`src/core/sum.ts`, `src/tests/sum.test.ts`) and create `src/tests/unit/rover.test.ts` with an empty describe block. Verify `bun run validate` passes with zero tests. 🔧 *coding-standards, testing-standards*

## 2. Direction Value Object

> 📐 TDD: REASON → RED → GREEN → REFACTOR → RE-EVALUATE
> 📏 Rules: coding-standards (rich model, Tell Don't Ask), tdd (TPP)
> 📖 Spec: `specs/rover/commands/spec.md` — turn behavior

- [x] 2.1 🔴🟢 Create `Direction` VO — turning right from N yields E. Create `src/core/direction.ts` with minimum to pass. Verify test passes.
- [x] 2.2 🔴🟢 Turn right cycles through all four directions (E→S, S→W, W→N). Verify tests pass.
- [x] 2.3 🔴🟢 Turn left from N yields W. Verify test passes.
- [x] 2.4 🔴🟢 Turn left cycles through all four directions. Verify tests pass.
- [x] 2.5 🔴🟢 Direction provides a movement delta — N returns (0,+1), E returns (+1,0), S returns (0,−1), W returns (−1,0). Verify tests pass.
- [x] 2.6 🔵 Refactor Direction if needed — review naming, remove duplication. Verify tests remain green.
- [x] 2.7 Run `bun run format:fix` and `bun run validate` to confirm compilation, lint, and tests. 🔧 *format, validate*

## 3. Coordinate Value Object

> 📐 TDD: REASON → RED → GREEN → REFACTOR → RE-EVALUATE
> 📏 Rules: coding-standards (VO equality, immutability)
> 📖 Spec: `specs/rover/initialization/spec.md` — coordinate representation

- [x] 3.1 🔴🟢 Create `Coordinate` VO — stores x, y and supports equality comparison. Create `src/core/coordinate.ts`. Verify test passes.
- [x] 3.2 🔴🟢 Coordinate can add a delta (dx, dy) and return a new Coordinate. Verify test passes.
- [x] 3.3 🔵 Refactor if needed. Verify tests remain green.
- [x] 3.4 Run `bun run format:fix` and `bun run validate`. 🔧 *format, validate*

## 4. MarsMap Value Object

> 📐 TDD: REASON → RED → GREEN → REFACTOR → RE-EVALUATE
> 📏 Rules: coding-standards (SRP), design D4
> 📖 Spec: `specs/rover/wrapping/spec.md`, `specs/rover/obstacle-detection/spec.md`

- [ ] 4.1 🔴🟢 Create `MarsMap` VO — wraps a coordinate that exceeds the northern boundary (y ≥ height → y wraps to 0). Create `src/core/marsMap.ts`. Verify test passes.
- [ ] 4.2 🔴🟢 Wrapping works for all four boundaries (east, south, west, including negative values). Verify tests pass.
- [ ] 4.3 🔴🟢 MarsMap detects obstacles — `hasObstacle(coordinate)` returns true when the coordinate is occupied. Verify test passes.
- [ ] 4.4 🔵 Refactor if needed. Verify tests remain green.
- [ ] 4.5 Run `bun run format:fix` and `bun run validate`. 🔧 *format, validate*

## 5. Rover — Initialization and Turns

> 📐 TDD: REASON → RED → GREEN → REFACTOR → RE-EVALUATE
> 📏 Rules: coding-standards (mutable entity, constructor), design D1/D6, commit-strategy
> 📖 Spec: `specs/rover/initialization/spec.md`, `specs/rover/commands/spec.md`

- [ ] 5.1 🔴🟢 Create `Rover` entity — constructed with position (0,0,N) and a MarsMap, exposes its current position. Create `src/core/rover.ts`. Verify test passes.
- [ ] 5.2 🔴🟢 Rover turns right (execute "R") — position changes from N to E. Verify test passes.
- [ ] 5.3 🔴🟢 Rover turns left (execute "L") — position changes from N to W. Verify test passes.
- [ ] 5.4 🔵 Refactor if needed. Verify tests remain green.
- [ ] 5.5 Run `bun run format:fix` and `bun run validate`. 🔧 *format, validate*

## 6. Rover — Movement (No Wrapping, No Obstacles)

> 📐 TDD: REASON → RED → GREEN → REFACTOR → RE-EVALUATE
> 📏 Rules: tdd (TPP progression), coding-standards
> 📖 Spec: `specs/rover/commands/spec.md` — move forward/backward

- [ ] 6.1 🔴🟢 Rover moves forward (execute "M") facing N — position goes from (0,0) to (0,1). Verify test passes.
- [ ] 6.2 🔴🟢 Rover moves forward facing E — position goes from (0,0) to (1,0). Verify test passes.
- [ ] 6.3 🔴🟢 Rover moves forward facing S and W — verify each delta. Verify tests pass.
- [ ] 6.4 🔴🟢 Rover moves backward (execute "B") facing N — position goes from (0,1) to (0,0). Verify test passes.
- [ ] 6.5 🔴🟢 Rover executes a command sequence ("MMRM") — final position is (1,2,E). Verify test passes.
- [ ] 6.6 🔴🟢 Rover maintains state across separate execute calls — "MM" then "RM" yields (1,2,E). Verify test passes.
- [ ] 6.7 🔵 Refactor if needed. Verify tests remain green.
- [ ] 6.8 Run `bun run format:fix` and `bun run validate`. 🔧 *format, validate*

## 7. Rover — Wrapping

> 📐 TDD: REASON → RED → GREEN → REFACTOR → RE-EVALUATE
> 📏 Rules: tdd, design D4
> 📖 Spec: `specs/rover/wrapping/spec.md`

- [ ] 7.1 🔴🟢 Rover wraps north — at (0,4) facing N on 5×5 grid, "M" yields (0,0,N). Verify test passes.
- [ ] 7.2 🔴🟢 Rover wraps east — at (4,0) facing E on 5×5 grid, "M" yields (0,0,E). Verify test passes.
- [ ] 7.3 🔴🟢 Rover wraps south — at (0,0) facing S on 5×5 grid, "M" yields (0,4,S). Verify test passes.
- [ ] 7.4 🔴🟢 Rover wraps west — at (0,0) facing W on 5×5 grid, "M" yields (4,0,W). Verify test passes.
- [ ] 7.5 🔴🟢 Rover wraps backward — at (0,0) facing N on 5×5 grid, "B" yields (0,4,N). Verify test passes.
- [ ] 7.6 🔵 Refactor if needed. Verify tests remain green.
- [ ] 7.7 Run `bun run format:fix` and `bun run validate`. 🔧 *format, validate*

## 8. Rover — Obstacle Detection

> 📐 TDD: REASON → RED → GREEN → REFACTOR → RE-EVALUATE
> 📏 Rules: tdd, design D5 (discriminated union), coding-standards (CQS)
> 📖 Spec: `specs/rover/obstacle-detection/spec.md`

- [ ] 8.1 🔴🟢 Introduce `ExecutionResult` — successful execution returns `{ status: 'ok' }`. Retrofit existing execute() to return this type. Verify all existing tests pass (update assertions as needed).
- [ ] 8.2 🔴🟢 Rover stops before obstacle — at (0,0) facing N with obstacle at (0,1), "M" yields position (0,0,N) and result `{ status: 'obstacle', obstacle: (0,1) }`. Verify test passes.
- [ ] 8.3 🔴🟢 Rover aborts remaining commands — obstacle at (0,2), "MMRM" yields position (0,1,N), reports obstacle at (0,2). Verify test passes.
- [ ] 8.4 🔴🟢 Turns succeed near obstacles — obstacle at (0,1), "R" yields (0,0,E) with status 'ok'. Verify test passes.
- [ ] 8.5 🔵 Refactor if needed. Verify tests remain green.
- [ ] 8.6 Run `bun run format:fix` and `bun run validate`. 🔧 *format, validate*

## 9. Cleanup

- [ ] 9.1 Remove any TODO list comments from test files. Verify `bun run validate` passes. 🔧 *tdd rule: remove TODO list after completion*
- [ ] 9.2 Final `bun run validate` — all compilation, lint, and tests green. 🔧 *validate*
