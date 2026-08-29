# Change Proposal: Implement Mars Rover Kata

## Goal
Implement a solution for the Mars Rover Kata, complying with strict TDD (Test-Driven Development) and Hexagonal Architecture principles.

## Why
This implements the core requirements of the Kata, allowing a Rover to move across a spherical grid (planet) and stop upon encountering obstacles. The chosen architecture decouples the state of the vehicle from the rules of the terrain.

## Non-goals (YAGNI)
- **NO Pathfinding**: The Rover will not try to find an alternative route if an obstacle is encountered.
- **NO Map Memorization**: The Navigator will not store or build a map of discovered obstacles (Fog of War).
- **NO User Interface**: This is a backend-only domain kata.
- **NO Generic Terrain Complexity**: Obstacles are static points; there are no varied terrain costs or complex geometry.
