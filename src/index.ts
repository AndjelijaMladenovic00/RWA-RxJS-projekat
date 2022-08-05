import { Subject } from "rxjs";
import { drawLoginPage } from "./components/loginPage";
import { route$ } from "./logic/router";
import { gotoRoute } from "./logic/routingLogic";
import { User } from "./models/user";

route$.subscribe((pageAndUser: [Number, User | null]) =>
  gotoRoute(...pageAndUser)
);

drawLoginPage(route$);
