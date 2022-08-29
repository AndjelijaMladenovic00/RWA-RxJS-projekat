import { Subject } from "rxjs";
import { User } from "../models/user";

export const route$ = new Subject<[number, User | null]>();

document.body.onclose = () => {
  route$.next([4, null]);
  route$.complete();
};
