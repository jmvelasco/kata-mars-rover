import { Command } from './Command';
import { Coordinates } from './Coordinates';
import { MissionReport } from './MissionReport';
import { Planet } from './Planet';
import { Position } from './Position';

export class Rover {
  private currentPosition: Position;

  constructor(
    landingPosition: Position,
    private readonly planet: Planet
  ) {
    this.currentPosition = landingPosition.movedTo(planet.resolve(landingPosition.cell()));
  }

  position(): Position {
    return this.currentPosition;
  }

  execute(commands: Command[]): MissionReport {
    let report = new MissionReport(this.currentPosition);

    commands.forEach((command) => {
      report = this.reportOfExecuting(command, report.position);
      this.currentPosition = report.position;
    });

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
