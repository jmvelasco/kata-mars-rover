import { Command } from './Command';
import { Coordinates } from './Coordinates';
import { MissionReport } from './MissionReport';
import { Planet } from './Planet';
import { Position } from './Position';

export class Rover {
  private currentPosition: Position;

  static land(landingPosition: Position, planet: Planet): Rover {
    const landingCell = planet.resolve(landingPosition.cell());

    if (planet.hasObstacleAt(landingCell)) {
      throw new Error('Cannot land on a cell occupied by an obstacle');
    }

    return new Rover(landingPosition.movedTo(landingCell), planet);
  }

  private constructor(
    landingPosition: Position,
    private readonly planet: Planet
  ) {
    this.currentPosition = landingPosition;
  }

  position(): Position {
    return this.currentPosition;
  }

  execute(commands: Command[]): MissionReport {
    const report = this.reportOfExecutingAll(commands, this.currentPosition);
    this.currentPosition = report.position;

    return report;
  }

  private reportOfExecutingAll(commands: Command[], from: Position): MissionReport {
    if (commands.length === 0) {
      return new MissionReport(from);
    }

    const [nextCommand, ...remainingCommands] = commands;
    const report = this.reportOfExecuting(nextCommand, from);

    if (report.isBlocked()) {
      return report;
    }

    return this.reportOfExecutingAll(remainingCommands, report.position);
  }

  private reportOfExecuting(command: Command, from: Position): MissionReport {
    const outcomeOf: Record<Command, () => MissionReport> = {
      [Command.TurnLeft]: () => new MissionReport(from.turnedLeft()),
      [Command.TurnRight]: () => new MissionReport(from.turnedRight()),
      [Command.MoveForward]: () => this.reportOfMovingTo(from.cellAhead(), from),
      [Command.MoveBackward]: () => this.reportOfMovingTo(from.cellBehind(), from),
    };

    return outcomeOf[command]();
  }

  private reportOfMovingTo(target: Coordinates, from: Position): MissionReport {
    const landing = this.planet.resolve(target);

    if (this.planet.hasObstacleAt(landing)) {
      return new MissionReport(from, landing);
    }

    return new MissionReport(from.movedTo(landing));
  }
}
