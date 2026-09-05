> **Standing working agreement for every task below** — 📏 `.claude/rules/tdd.md`, 🧪 `.claude/rules/testing-standards.md`, ✂️ `.claude/rules/coding-standards.md`, 📝 `.claude/rules/commit-strategy.md`, 🏛️ `.claude/skills/backend-hexagonal`:
>
> - Every behaviour task is one full cycle: 🤔 REASON → 🔴 RED → 🟢 GREEN → 🔵 REFACTOR → 🔄 RE-EVALUATE.
> - 📝 One commit per phase: `test(red): …`, `test(green): …`, and `test(refactor): …` only when the refactor is meaningfully separate. Never mix RED and GREEN.
> - 🎨 Run `bun run format:fix` on every code change, and ✅ `bun run validate` after finishing each task.
> - 🧪 Tests in `src/core/tests/unit/`, named as business rules (`describe('The Rover')`), AAA with blank lines between sections, no mocks.
> - 🏛️ `src/core` keeps **zero external dependencies** at every step.

## 1. Test bed and case list

- [x] 1.1 📁 Create `src/core/tests/unit/` following 🧪 `testing-standards.md` on test location. Leave `src/core/sum.ts` and `src/tests/sum.test.ts` untouched — 🚫 deleting an existing test requires explicit Tech Lead approval.
- [x] 1.2 🤔 REASON — write the ordered case list as a TODO comment inside the test file, per 📏 `tdd.md` step 0. The list is the seven blocks below; it is a temporary tracking artifact and gets removed in task 9.1.

## 2. Position and turning

- [x] 2.1 🔴🟢 The rover reports the position it was placed at. 📏 TPP expected: `nil → constant`. Spec: `rover-navigation` — *The rover reports its position*.
- [x] 2.2 🔴🟢 The rover turns left from north. 📏 TPP expected: `constant → constant+`. ⚠️ Do **not** reach for a modulo ring yet — 📐 YAGNI and the Golden Rule of GREEN.
- [x] 2.3 🔴🟢 The rover turns left from every orientation. Spec: `rover-navigation` — *Turning left rotates 90 degrees counter-clockwise*.
- [x] 2.4 🔴🟢 The rover turns right from north.
- [x] 2.5 🔴🟢 Four right turns restore the original orientation.
- [x] 2.6 🔵 REFACTOR checkpoint — ✂️ `coding-standards`: is orientation knowledge duplicated? Apply the Rule of Three: abstract only if the same knowledge has appeared three times. If not, leave it and say so.
- [x] 2.7 ✅ `bun run compile` before marking the group done.

## 3. Moving forward and backward

- [x] 3.1 🔴🟢 The rover moves forward one cell facing north (`N` increases `y`). Spec: `rover-navigation` — *Moving forward advances one cell*.
- [x] 3.2 🔴🟢 The rover moves forward in every orientation. ⚠️ The orientation knowledge now lives in turning **and** in displacement — watch for the smell.
- [x] 3.3 🔴🟢 The rover moves backward one cell facing north.
- [x] 3.4 🔴🟢 The rover moves backward in every orientation.
- [x] 3.5 🔵 REFACTOR — the duplication has now appeared three times. Per 🎯 `design.md` — *What the TDD cycle decides*, resolve it here: ordered ring, `Direction` value object with behaviour, or vector table. Choose from the code in front of you, keep the suite green, commit as `test(refactor):`.
- [x] 3.6 ✅ `bun run compile` before marking the group done.

## 4. Sequences and state persistence

- [x] 4.1 🔴🟢 An empty sequence leaves the rover untouched. 📏 TPP: the degenerate case first.
- [x] 4.2 🔴🟢 A sequence is executed command by command in order.
- [x] 4.3 🔴🟢 A second sequence continues from where the first one ended. Spec: `rover-navigation` — *The rover keeps its position between sequences*. 🏛️ This is the one place the entity mutates: a single private reassignment, value objects stay immutable.
- [x] 4.4 🔵 REFACTOR checkpoint — ✂️ `coding-standards` on CQS: the mutation must be confined; every calculation around it stays pure.
- [x] 4.5 ✅ `bun run compile` before marking the group done.

## 5. The spherical surface

- [x] 5.1 🔴🟢 Introduce the surface with independent width and height; a coordinate inside the grid resolves unchanged. 🔵 Then thread the surface through rover construction, keeping every earlier test green — behaviour is unchanged, so update call sites only, never assertions.
- [x] 5.2 🔴🟢 Crossing the north edge reappears on the south one. Spec: `spherical-grid` — *Crossing an edge reappears on the opposite one*.
- [x] 5.3 🔴🟢 Crossing the east, south and west edges.
- [x] 5.4 🔴🟢 Moving backward also wraps.
- [x] 5.5 🔴🟢 Each axis wraps around its own length on a non-square surface.
- [x] 5.6 🔴🟢 Coordinates beyond an edge are normalised when the rover is placed, including negative ones. Spec: `spherical-grid` — *No coordinate is ever outside the surface*. 🎯 `design.md`: the same rule serves movement and placement — no range validation is added.
- [x] 5.7 🔵 REFACTOR checkpoint — ✂️ Law of Demeter and Tell-Don't-Ask: the rover must not know the grid dimensions; the surface must not know about orientations.
- [x] 5.8 ✅ `bun run compile` before marking the group done.

## 6. Obstacles

- [x] 6.1 🔴🟢 An obstacle directly ahead stops the advance and the rover keeps the last valid cell. Spec: `obstacle-detection` — *An obstacle prevents the rover from entering a cell*.
- [x] 6.2 🔴🟢 The report of a blocked sequence carries the obstacle coordinates. 🎯 `design.md`: an obstacle is business data, never an exception. ⚠️ Documented CQS exception — `execute` mutates and returns.
- [x] 6.3 🔴🟢 A block discards every remaining command, turns included.
- [x] 6.4 🔴🟢 An obstacle behind stops the retreat.
- [x] 6.5 🔴🟢 An obstacle across a connected edge also blocks. ⚠️ The bug this catches: resolving occupancy **before** wrapping passes 6.1 and fails here.
- [x] 6.6 🔴🟢 A completed sequence reports no obstacle.
- [x] 6.7 🔴🟢 A surrounded rover can still turn — turning is never blocked.
- [x] 6.8 🔴🟢 A blocked rover can turn away and move in a later sequence; no sticky blocked state.
- [x] 6.9 🔵 REFACTOR — resolve the early-abort iteration shape left open in 🎯 `design.md`: `for...of` with `break` (✂️ `coding-standards` §12, readability first) or recursion (📏 TPP #9, pure). ⚠️ A `reduce` that keeps iterating over a blocked rover lies about the intent — reject it.
- [x] 6.10 ✅ `bun run compile` before marking the group done.

## 7. Guarded placement

- [x] 7.1 🔴🟢 Placing the rover on an occupied cell is refused. ✂️ `coding-standards` on classes: private constructor plus a factory method, since real validation now exists.
- [x] 7.2 🔴🟢 The refusal considers the wrapped coordinates, so `(6, 6)` on a 5x5 surface is refused when `(1, 1)` is occupied.
- [x] 7.3 ✅ `bun run compile` before marking the group done.

## 8. Command parsing at the boundary

- [x] 8.1 🔴🟢 Text made only of `L`, `R`, `M` and `B` yields the same commands in order. Spec: `command-parsing` — *Recognised command vocabulary*. 🏛️ Earlier tests pass typed command lists directly and stay valid; the factory only adds a text entry point.
- [x] 8.2 🔴🟢 Empty text yields an empty sequence and is not rejected.
- [x] 8.3 🔴🟢 An unknown character rejects the whole sequence and the rover does not move.
- [x] 8.4 🔴🟢 The rejection identifies the offending character.
- [x] 8.5 🔴🟢 `F` and lowercase letters are unknown characters. ✂️ `coding-standards`: one concept, one name — `M` is the only forward command.
- [x] 8.6 🔵 REFACTOR checkpoint — ✂️ no magic strings: the command type is a literal union, and the rover's signature accepts only already-valid commands.
- [x] 8.7 ✅ `bun run compile` before marking the group done.

## 9. Closing the cycle

- [ ] 9.1 🧹 Remove the TODO case list from the test files — 📏 `tdd.md` step 4: a temporary tracking artifact, not documentation.
- [ ] 9.2 🔵 Final REFACTOR pass against ✂️ `coding-standards`: function size and single responsibility, guard clauses, affirmative conditions, no collection mutation, constants close to their use.
- [ ] 9.3 🏛️ Verify the architectural invariant: `src/core` still imports nothing external. No ports, no adapters, no application layer were introduced — 📐 YAGNI, per `proposal.md` — Non-goals.
- [ ] 9.4 ✅ Run `bun run validate` (compile + lint + test) and confirm the 80% coverage threshold in `jest.config.js` is met.
- [ ] 9.5 👀 Run the `code-reviewer` subagent, as required by 📘 `CLAUDE.md` — *Commands and Subagents*, and address its findings.
- [ ] 9.6 📋 Report back to the Tech Lead: decisions taken during the REFACTOR steps (3.5, 6.9) and anything the cycle revealed that the specs did not anticipate.
