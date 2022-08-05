import { User } from "./user";

export class CurrentGameState {
  player: User | null = null;
  playerNumbers: Number[] = [];
  gameNumbers: Number[] = [];
  currentScore: Number = 0;

  constructor() {}
}
