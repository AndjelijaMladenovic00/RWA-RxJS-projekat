import { Subject } from "rxjs";
import { User } from "../models/user";

export const route$ = new Subject<[Number, User | null]>();
