import { Subject } from "rxjs";
import { User } from "../models/user";

export function initGameplay(router: Subject<[Number, User | null]>) {}
