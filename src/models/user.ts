export class User {
  constructor(
    private _id: number,
    private _username: string,
    private _highscore: number
  ) {}

  get username(): string {
    return this._username;
  }

  get highscore(): number {
    return this._highscore;
  }

  set highscore(newHighscore: number) {
    this._highscore = newHighscore;
  }

  get id(): number {
    return this._id;
  }
}
