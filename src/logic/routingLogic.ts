import { drawGameplayPage } from "../components/gameplayPage";
import { drawLoginPage } from "../components/loginPage";
import { User } from "../models/user";
import { route$ } from "./router";
import { drawScoreboard } from "../components/scoreboardPage";

export function gotoRoute(page: Number, user?: User) {
  switch (page) {
    case 0: {
      drawLoginPage(route$);
      break;
    }
    case 1: {
      drawGameplayPage(route$, user);
      break;
    }
    case 2: {
      drawScoreboard(route$, user);
      break;
    }
  }
}
