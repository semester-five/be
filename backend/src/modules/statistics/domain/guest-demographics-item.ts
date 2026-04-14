export class GuestDemographicsItem {
  constructor(
    public readonly ageGroup: string,
    public readonly maleCount: number,
    public readonly femaleCount: number,
    public readonly unknownCount: number,
    public readonly totalSessions: number,
  ) {}
}
