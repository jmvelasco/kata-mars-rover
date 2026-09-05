import { Command } from './Command';
import { Coordinates } from './Coordinates';
import { MissionReport } from './MissionReport';
import { Planet } from './Planet';
import { Position } from './Position';

export class Rover {
  private currentPosition: Position;

  private constructor(
    landingPosition: Position,
    private readonly planet: Planet
  ) {
    this.currentPosition = landingPosition;
  }

  static land(landingPosition: Position, planet: Planet): Rover {
    const landingCell = planet.resolve(landingPosition.cell());

    if (planet.hasObstacleAt(landingCell)) {
      throw new Error('Cannot land on a cell occupied by an obstacle');
    }

    return new Rover(landingPosition.movedTo(landingCell), planet);
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
    let report = new MissionReport(from);

    for (const command of commands) {
      report = this.reportOfExecuting(command, report.position);

      if (report.isBlocked()) {
        break;
      }
    }

    return report;
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
