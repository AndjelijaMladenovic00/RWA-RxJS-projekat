import {
  debounceTime,
  distinct,
  forkJoin,
  fromEvent,
  interval,
  map,
  mergeWith,
  Observable,
  Subject,
  take,
  takeUntil,
} from "rxjs";
import { CurrentGameState } from "../models/currentGameState";
import { User } from "../models/user";
import { gameSetup } from "../enums/gameSetup";
import { urlConst } from "../constants/url";

export function initGameplay(
  router: Subject<[number, User | null]>,
  user: User
) {
  let gameState: CurrentGameState = new CurrentGameState();
  gameState.player = user;

  setUpGame("beginning", gameState);

  setUpButtons(router, gameState);
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
    setVisibilityOff("score");

    let buttonId: string = "";
    let inputId: string = "";
    for (let i = 1; i <= 7; i++) {
      buttonId = "inputButton" + i;
      setVisibilityOff(buttonId);
      disableButton(buttonId);

      inputId = "inputBox" + i;
      enableInput(inputId);

      const box: HTMLElement = document.getElementById("box" + i);
      box.className = "box-inactive";
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
    setVisibilityOn("score");
  }
}

function enableInput(id: string) {
  const inputBox: HTMLInputElement = <HTMLInputElement>(
    document.getElementById(id)
  );
  inputBox.disabled = false;
  inputBox.value = "";
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
  const controlFlow$: Subject<string> = new Subject();

  const observableArray: Observable<number>[] = makeOkObservables(controlFlow$);

  forkJoin(observableArray)
    .pipe(take(1))
    .subscribe((numberArray: number[]) => {
      gameState.playerNumbers = numberArray;
      setUpStartButton(controlFlow$, gameState);
    });
}

function makeOkObservables(
  controlFlow$: Subject<String>
): Observable<number>[] {
  let observableArray: Observable<number>[] = [];
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
      .subscribe((inputNumber: number) => {
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

    const click$: Observable<number> = fromEvent(inputButton, "click").pipe(
      takeUntil(controlFlow$),
      map((event: Event) => parseInt(inputBox.value)),
      take(1)
    );

    observableArray.push(click$);
  }

  return observableArray;
}

function checkInput(inputNumber: number): boolean {
  if (inputNumber > 0 && inputNumber < 40) return true;
  else return false;
}

function setUpStartButton(
  controlFlow$: Subject<string>,
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
  controlFlow$: Subject<string>,
  gameState: CurrentGameState
) {
  const observableArray: Observable<[number, number]>[] =
    makeNumberObservables(controlFlow$);

  const lastNumber: HTMLLabelElement = <HTMLLabelElement>(
    document.getElementById("lastNumber")
  );
  const numbers: HTMLLabelElement = <HTMLLabelElement>(
    document.getElementById("numbers")
  );

  let number$: Observable<[number, number]> = observableArray[0];

  number$ = number$.pipe(mergeWith(...observableArray.slice(1)));

  number$
    .pipe(debounceTime(200), take(21))
    .subscribe((values: [number, number]) => {
      if (gameState.gameNumbers.length < 21) {
        lastNumber.textContent = values[0] + "";
        if (numbers.textContent === "") {
          numbers.textContent = values[0] + "";
        } else {
          numbers.textContent += ", " + values[0];
        }
        showLatestBox(values[1]);
        gameState.gameNumbers.push(values[0]);
        if (gameState.gameNumbers.length == 21) {
          endGame(controlFlow$, gameState);
        }
      }
    });
}

function makeNumberObservables(
  controlFlow$: Subject<string>
): Observable<[number, number]>[] {
  let observableArray: Observable<[number, number]>[] = [];

  for (let i = 1; i <= 7; i++) {
    observableArray.push(
      interval(Math.random() * 15000)
        .pipe(
          map((x: Number) => Math.floor(Math.random() * 39) + 1),
          distinct(),
          takeUntil(controlFlow$)
        )
        .pipe(map((x: number) => [x, i]))
    );
  }

  return observableArray;
}

function showLatestBox(id: number) {
  for (let i = 1; i <= 7; i++) {
    const box: HTMLElement = document.getElementById("box" + i);
    if (i != id) box.className = "box-inactive";
    else box.className = "box-active";
  }
}

function endGame(controlFlow$: Subject<string>, gameState: CurrentGameState) {
  const score: number = calculateScore(gameState);

  controlFlow$.next("Closing...");
  controlFlow$.complete();

  setUpView("end");

  updateInfo(score, gameState);
}

function calculateScore(gameState: CurrentGameState): number {
  gameState.gameNumbers.filter((x: number) =>
    gameState.playerNumbers.includes(x)
  );
  let score: number = 0;
  let hits: number = 0;

  gameState.gameNumbers.forEach((x: number) => {
    if (gameState.playerNumbers.includes(x)) {
      gameState.playerNumbers = gameState.playerNumbers.splice(
        gameState.playerNumbers.indexOf(x),
        1
      );
      hits++;
    }
  });

  for (let i = 0; i < hits; i++) {
    score += 2000 * Math.random();
  }

  score = Math.round(score);

  return score;
}

function updateInfo(score: number, gameState: CurrentGameState) {
  const scoreLabel: HTMLLabelElement = <HTMLLabelElement>(
    document.getElementById("score")
  );
  scoreLabel.textContent = "SCORE: " + score;

  if (gameState.currentHighestScore < score) {
    gameState.currentHighestScore = score;

    const currentHighestLabel: HTMLLabelElement = <HTMLLabelElement>(
      document.getElementById("currentHighest")
    );

    currentHighestLabel.textContent = score + "";

    if (score > gameState.player.highscore) {
      const highscoreLabel: HTMLLabelElement = <HTMLLabelElement>(
        document.getElementById("highscore")
      );

      highscoreLabel.textContent = score + "";

      gameState.player.highscore = score;
      updateScoreDB(gameState.player.id, score);
    }
  }
}

function updateScoreDB(id: number, score: number) {
  const body = { highscore: score };
  fetch(urlConst.URL + id, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((response: Response) => {
      if (!response.ok) throw new Error("PATCH error");
      else console.log("PATCH ok");
    })
    .catch((err: Error) => console.log(err));
}

function setUpButtons(
  router: Subject<[number, User | null]>,
  gameState: CurrentGameState
) {
  const playAgainButton: HTMLButtonElement = <HTMLButtonElement>(
    document.getElementById("playAgainButton")
  );

  playAgainButton.onclick = () => {
    gameState.playerNumbers = [];
    gameState.gameNumbers = [];
    setUpGame("beginning", gameState);
  };

  const scoreboardButton: HTMLButtonElement = <HTMLButtonElement>(
    document.getElementById("scoreboardButton")
  );

  scoreboardButton.onclick = () => {
    router.next([2, gameState.player]);
  };

  const logoutButtonL: HTMLButtonElement = <HTMLButtonElement>(
    document.getElementById("logoutButton")
  );

  logoutButtonL.onclick = () => {
    router.next([0, null]);
  };
}
