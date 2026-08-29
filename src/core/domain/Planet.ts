export class Planet {
  constructor(
    public readonly width: number,
    public readonly height: number,
    public readonly obstacles: { x: number; y: number }[]
  ) {}
}
