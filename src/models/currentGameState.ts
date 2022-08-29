import { User } from "./user";

export class CurrentGameState {
  player: User | null = null;
  playerNumbers: number[] = [];
  gameNumbers: number[] = [];
  currentHighestScore: number = 0;

  constructor() {}
}
