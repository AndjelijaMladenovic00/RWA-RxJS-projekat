export class User {
  constructor(
    private _id: Number,
    private _username: String,
    private _highscore: Number
  ) {}

  get username(): String {
    return this._username;
  }

  get highscore(): Number {
    return this._highscore;
  }

  set highscore(newHighscore: Number) {
    this._highscore = newHighscore;
  }

  get id(): Number {
    return this._id;
  }
}
