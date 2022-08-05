export class User {
  constructor(
    private _id: Number,
    private _username: String,
    private _highscore: Number
  ) {}

  get username() {
    return this._username;
  }

  get highscore() {
    return this._highscore;
  }

  set highscore(newHighscore: Number) {
    this._highscore = newHighscore;
  }
}
