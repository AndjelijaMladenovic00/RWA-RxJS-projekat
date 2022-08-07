import { Subject } from "rxjs";
import { User } from "../models/user";

export const route$ = new Subject<[Number, User | null]>();

document.body.onclose = () => {
  route$.next([4, null]);
  route$.complete();
};
