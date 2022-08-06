import {
  debounceTime,
  distinct,
  forkJoin,
  fromEvent,
  interval,
  map,
  merge,
  Observable,
  Subject,
  take,
  takeUntil,
  zip,
} from "rxjs";
import { CurrentGameState } from "../models/currentGameState";
import { User } from "../models/user";
import { gameSetup } from "../enums/gameSetup";

export function initGameplay(
  router: Subject<[Number, User | null]>,
  user: User
) {
  let gameState: CurrentGameState = new CurrentGameState();
  gameState.player = user;

  setUpGame("beginning", gameState);
}

function setUpGame(setup: gameSetup, gameState: CurrentGameState) {
  setUpView(setup);
  setUpLogic(gameState);
}

function setUpView(setup: gameSetup) {
  if (setup === "beginning") {
    setVisibilityOn("boxesLabel");
    setVisibilityOn("boxesExplanationLabel");
    setVisibilityOn("playerInputLabel");

    let buttonId: string = "";
    for (let i = 1; i <= 7; i++) {
      buttonId = "inputButton" + i;
      setVisibilityOff(buttonId);
      disableButton(buttonId);
    }

    setVisibilityOff("startButton");
    disableButton("startButton");

    setVisibilityOff("playAgainButton");
    disableButton("playAgainButton");

    const lastNumberLabel: HTMLElement = document.getElementById("lastNumber");
    lastNumberLabel.textContent = "";

    const numbersLabel: HTMLElement = document.getElementById("numbers");
    numbersLabel.textContent = "";
  } else if (setup === "playing") {
    setVisibilityOff("boxesLabel");
    setVisibilityOff("boxesExplanationLabel");
    setVisibilityOff("playerInputLabel");

    setVisibilityOff("startButton");
    disableButton("startButton");
  } else {
    setVisibilityOn("playAgainButton");
    enableButton("playAgainButton");
  }
}

function setVisibilityOn(id: string) {
  const element: HTMLElement = document.getElementById(id);
  element.style.visibility = "visible";
}

function setVisibilityOff(id: string) {
  const element: HTMLElement = document.getElementById(id);
  element.style.visibility = "hidden";
}

function disableButton(id: string) {
  const button: HTMLElement = document.getElementById(id);
  button.style.pointerEvents = "none";
}

function enableButton(id: string) {
  const button: HTMLElement = document.getElementById(id);
  button.style.pointerEvents = "all";
}

function setUpLogic(gameState: CurrentGameState) {
  const controlFlow$: Subject<String> = new Subject();

  const observableArray: Observable<Number>[] = makeOkObservables(controlFlow$);

  forkJoin(observableArray)
    .pipe(take(1))
    .subscribe((numberArray: Number[]) => {
      gameState.playerNumbers = numberArray;
      setUpStartButton(controlFlow$, gameState);
    });
}

function makeOkObservables(
  controlFlow$: Subject<String>
): Observable<Number>[] {
  let observableArray: Observable<Number>[] = [];
  let inputId: string = "";
  let buttonId: string = "";

  for (let i = 1; i <= 7; i++) {
    inputId = "inputBox" + i;
    buttonId = "inputButton" + i;

    const inputBox: HTMLInputElement = <HTMLInputElement>(
      document.getElementById(inputId)
    );
    const inputButton: HTMLButtonElement = <HTMLButtonElement>(
      document.getElementById(buttonId)
    );

    fromEvent(inputBox, "input")
      .pipe(
        debounceTime(100),
        map((event: InputEvent) => parseInt(inputBox.value)),
        takeUntil(controlFlow$)
      )
      .subscribe((inputNumber: Number) => {
        if (checkInput(inputNumber)) {
          setVisibilityOn(inputButton.id);
          enableButton(inputButton.id);
        } else {
          setVisibilityOff(inputButton.id);
          disableButton(inputButton.id);
        }
      });

    inputButton.onclick = (event: MouseEvent) => {
      setVisibilityOff(inputButton.id);
      disableButton(inputButton.id);
      inputBox.disabled = true;
    };

    const click$: Observable<Number> = fromEvent(inputButton, "click").pipe(
      takeUntil(controlFlow$),
      map((event: Event) => parseInt(inputBox.value)),
      take(1)
    );

    observableArray.push(click$);
  }

  return observableArray;
}

function checkInput(inputNumber: Number): boolean {
  if (inputNumber > 0 && inputNumber < 40) return true;
  else return false;
}

function setUpStartButton(
  controlFlow$: Subject<String>,
  gameState: CurrentGameState
) {
  setVisibilityOn("startButton");
  enableButton("startButton");

  const startButton: HTMLButtonElement = <HTMLButtonElement>(
    document.getElementById("startButton")
  );

  fromEvent(startButton, "click")
    .pipe(take(1))
    .subscribe(() => {
      setUpGame("playing", gameState);
      startSpinning(controlFlow$, gameState);
    });
}

function startSpinning(
  controlFlow$: Subject<String>,
  gameState: CurrentGameState
) {
  const observableArray: Observable<[Number, Number]>[] =
    makeNumberObservables(controlFlow$);

  const lastNumber: HTMLLabelElement = <HTMLLabelElement>(
    document.getElementById("lastNumber")
  );
  const numbers: HTMLLabelElement = <HTMLLabelElement>(
    document.getElementById("numbers")
  );

  const number$ = <Observable<[Number, Number]>>(
    merge(observableArray).pipe(take(21))
  );

  number$.subscribe((values: [Number, Number]) => {
    lastNumber.textContent = values[0] + "";
    if (numbers.textContent === "") {
      numbers.textContent = values[0] + "";
    } else {
      numbers.textContent += "," + values[0];
    }
    showLatestBox(values[1]);
  });
}

function makeNumberObservables(
  controlFlow$: Subject<String>
): Observable<[Number, Number]>[] {
  let observableArray: Observable<[Number, Number]>[] = [];

  for (let i = 1; i <= 7; i++) {
    observableArray.push(
      interval(Math.random() * 10000)
        .pipe(
          map((x: Number) => Math.floor(Math.random() * 39) + 1),
          distinct(),
          takeUntil(controlFlow$)
        )
        .pipe(map((x: Number) => [x, i]))
    );
  }

  return observableArray;
}

function showLatestBox(id: Number) {}
