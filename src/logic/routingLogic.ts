import { drawLoginPage } from "../components/loginPage";
import { User } from "../models/user";
import { route$ } from "./router";

export function gotoRoute(page: Number, user?: User) {
  switch (page) {
    case 0: {
      drawLoginPage(route$);
      break;
    }
    case 1: {
      document.body.innerHTML = "";
      console.log(user);
    }
  }
}
