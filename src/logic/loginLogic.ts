import {
  combineLatest,
  debounceTime,
  fromEvent,
  map,
  Observable,
  takeUntil,
  Subject,
  from,
  switchMap,
  take,
} from "rxjs";
import { loginData } from "../models/loginData";
import { User } from "../models/user";
import { urlConst } from "../constants/url";
import { route$ } from "./router";

let loginInfo: loginData = { email: null, password: null };

export function initLoginPage(router: Subject<[number, User | null]>) {
  const controlFlow$: Subject<string> = new Subject();

  const email$: Observable<string> = createEmailObservable(controlFlow$);
  const password$: Observable<string> = createPasswordObservable(controlFlow$);

  const login$: Observable<[string, string]> = combineLatest([
    email$,
    password$,
  ]).pipe(takeUntil(controlFlow$));

  const loginButton: HTMLElement = document.getElementById("loginButton");

  setUpLoginButton(<HTMLButtonElement>loginButton, controlFlow$);

  const loginSubscription = login$.subscribe((values: string[]) => {
    loginInfo.email = values[0];
    loginInfo.password = values[1];

    changeButtonProperties(<HTMLButtonElement>loginButton);
  });
}

function createEmailObservable(
  controlFlow$: Subject<string>
): Observable<string> {
  const emailInput: HTMLElement = document.getElementById("emailInput");
  return fromEvent(emailInput, "input").pipe(
    debounceTime(200),
    map((event: InputEvent) => (<HTMLInputElement>event.target).value),
    takeUntil(controlFlow$)
  );
}

function createPasswordObservable(
  controlFlow$: Subject<string>
): Observable<string> {
  const passwordInput: HTMLElement = document.getElementById("passwordInput");
  return fromEvent(passwordInput, "input").pipe(
    debounceTime(200),
    map((event: InputEvent) => (<HTMLInputElement>event.target).value),
    takeUntil(controlFlow$)
  );
}

function changeButtonProperties(button: HTMLButtonElement) {
  if (
    loginInfo.email != null &&
    loginInfo.email != "" &&
    loginInfo.password != null &&
    loginInfo.password != ""
  ) {
    button.style.visibility = "visible";
    button.style.pointerEvents = "all";
  } else {
    button.style.visibility = "hidden";
    button.style.pointerEvents = "none";
  }
}

function getUser(email: string, password: string): Observable<User[]> {
  const userPromise: Promise<User[]> = fetch(
    `${urlConst.URL}?email=${email}&password=${password}`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("User not found!");
      } else {
        return response.json();
      }
    })
    .catch((error) => showErrorMessage());

  return from(userPromise).pipe(take(1));
}

function showErrorMessage() {
  const errorLabel = document.getElementById("errorLabel");
  errorLabel.style.visibility = "visible";
}

function setUpLoginButton(
  button: HTMLButtonElement,
  controlFlow$: Subject<string>
) {
  button.style.visibility = "hidden";
  button.style.pointerEvents = "none";

  fromEvent(button, "click")
    .pipe(switchMap(() => getUser(loginInfo.email, loginInfo.password)))
    .subscribe((users: User[]) => checkUserAndLogin(users[0], controlFlow$));
}

function checkUserAndLogin(user: User, controlFlow$: Subject<string>) {
  if (
    user != null &&
    user != undefined &&
    "email" in user &&
    "password" in user
  ) {
    controlFlow$.next("Closing...");
    controlFlow$.complete();
    route$.next([1, user]);
  } else {
    showErrorMessage();
  }
}
