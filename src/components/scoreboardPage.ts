import { fromEvent, Subject, take } from "rxjs";
import { User } from "../models/user";
import { showScoreboard } from "../logic/scoreboardLogic";

export function drawScoreboard(router: Subject<[Number, User]>, user: User) {
  document.body.innerHTML = "";
  drawScoreboardHeader(router, user);
  showScoreboard(user.id);
}

function drawScoreboardHeader(router: Subject<[Number, User]>, user: User) {
  const headerContainer: HTMLDivElement = document.createElement("div");
  headerContainer.className = "headerContainer";

  const headerSubContainerLeft: HTMLDivElement = document.createElement("div");
  headerSubContainerLeft.className = "headerSubContainer";
  headerContainer.appendChild(headerSubContainerLeft);

  const backToGameButton: HTMLButtonElement = document.createElement("button");
  backToGameButton.id = "backToGameButton";
  backToGameButton.textContent = "Back to game";
  backToGameButton.className = "button";
  headerSubContainerLeft.appendChild(backToGameButton);

  const headerSubContainerMiddle: HTMLDivElement =
    document.createElement("div");
  headerSubContainerMiddle.className = "headerSubContainer";
  headerContainer.appendChild(headerSubContainerMiddle);

  const scoreboardLabel: HTMLLabelElement = document.createElement("label");
  scoreboardLabel.textContent = "SCOREBOARD";
  scoreboardLabel.className = "minorTitle";
  headerSubContainerMiddle.appendChild(scoreboardLabel);

  const headerSubContainerRight: HTMLDivElement = document.createElement("div");
  headerSubContainerRight.className = "headerSubContainer";
  headerContainer.appendChild(headerSubContainerRight);

  const logoutButton: HTMLButtonElement = document.createElement("button");
  logoutButton.id = "logoutButton";
  logoutButton.className = "button";
  logoutButton.textContent = "Log out";
  headerSubContainerRight.appendChild(logoutButton);

  document.body.appendChild(headerContainer);

  setUpButtons(router, user);
}

function setUpButtons(router: Subject<[Number, User]>, user: User) {
  const backToGameButton: HTMLElement =
    document.getElementById("backToGameButton");

  fromEvent(backToGameButton, "click")
    .pipe(take(1))
    .subscribe(() => {
      router.next([1, user]);
    });

  const logoutButton: HTMLElement = document.getElementById("logoutButton");

  fromEvent(logoutButton, "click")
    .pipe(take(1))
    .subscribe(() => {
      router.next([0, null]);
    });
}
