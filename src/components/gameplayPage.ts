import { Subject } from "rxjs";
import { initGameplay } from "../logic/gameplayLogic";
import { User } from "../models/user";

export function drawGameplayPage(
  router: Subject<[number, User | null]>,
  user: User
) {
  document.body.innerHTML = "";
  drawHeader(user);
  drawGameplay();

  initGameplay(router, user);
}

function drawHeader(user: User) {
  const headerContainer: HTMLDivElement = document.createElement("div");
  headerContainer.className = "headerContainer";

  const headerSubContainerLeft: HTMLDivElement = document.createElement("div");
  headerSubContainerLeft.className = "headerSubContainer";
  headerContainer.appendChild(headerSubContainerLeft);

  const headerSubContainerMiddle: HTMLDivElement =
    document.createElement("div");
  headerSubContainerMiddle.className = "headerSubContainer";
  headerContainer.appendChild(headerSubContainerMiddle);

  const headerSubContainerRight: HTMLDivElement = document.createElement("div");
  headerSubContainerRight.className = "headerSubContainer";
  headerContainer.appendChild(headerSubContainerRight);

  const scoreboardButton: HTMLButtonElement = document.createElement("button");
  scoreboardButton.className = "button";
  scoreboardButton.textContent = "Scoreboard";
  scoreboardButton.id = "scoreboardButton";
  headerSubContainerLeft.appendChild(scoreboardButton);

  const logoutButton: HTMLButtonElement = document.createElement("button");
  logoutButton.className = "button";
  logoutButton.textContent = "Log out";
  logoutButton.id = "logoutButton";
  headerSubContainerRight.appendChild(logoutButton);

  drawUserInfo(user, headerSubContainerMiddle);

  document.body.appendChild(headerContainer);
}

function createUserInfoRow(
  label: string,
  data: string | number,
  id: string
): HTMLDivElement {
  const rowDiv: HTMLDivElement = document.createElement("div");
  rowDiv.className = "userInfoRow";

  const rowLabel: HTMLLabelElement = document.createElement("label");
  rowLabel.className = "userInfoRowLabel";
  rowLabel.textContent = label;
  rowDiv.appendChild(rowLabel);

  const rowDataLabel: HTMLLabelElement = document.createElement("label");
  rowDataLabel.textContent = "" + data;
  rowDataLabel.id = id;
  rowDataLabel.className = "userInfoDataLabel";
  rowDiv.appendChild(rowDataLabel);

  return rowDiv;
}

function drawUserInfo(user: User, container: HTMLDivElement) {
  container.appendChild(
    createUserInfoRow("Username:", user.username, "username")
  );
  container.appendChild(
    createUserInfoRow("Highscore:", user.highscore, "highscore")
  );
  container.appendChild(
    createUserInfoRow("Current highest:", 0, "currentHighest")
  );
}

function drawGameplay() {
  drawBoxes();
  drawNumbersDisplay();
  drawPlayerInputBoxes();
  drawStartAndPlayAgainButton();
}

function drawBoxes() {
  const boxesMainContainer: HTMLDivElement = document.createElement("div");
  boxesMainContainer.className = "boxesMainContainer";

  const boxesLabel: HTMLLabelElement = document.createElement("label");
  boxesLabel.id = "boxesLabel";
  boxesLabel.className = "minorTitle";
  boxesLabel.textContent = "The boxes are ready for you to play!";
  boxesMainContainer.appendChild(boxesLabel);

  const boxesExplanationLabel: HTMLLabelElement =
    document.createElement("label");
  boxesExplanationLabel.className = "boxesExplanationLabel";
  boxesExplanationLabel.id = "boxesExplanationLabel";
  boxesExplanationLabel.textContent =
    "When you start the game, a random number between 1-39 will be chosen from each box. Numbers can repeat between boxes. There will be 21 number in total!";
  boxesMainContainer.appendChild(boxesExplanationLabel);

  const boxesContainer: HTMLDivElement = document.createElement("div");
  boxesContainer.className = "boxesContainer";
  boxesMainContainer.appendChild(boxesContainer);

  let id: string = "";

  for (let i = 1; i <= 7; i++) {
    id = "box" + i;
    drawBox(id, boxesContainer);
  }

  document.body.appendChild(boxesMainContainer);
}

function drawNumbersDisplay() {
  const numbersContainer: HTMLDivElement = document.createElement("div");
  numbersContainer.className = "numbersContainer";

  const lastNumberLabel: HTMLLabelElement = document.createElement("label");
  lastNumberLabel.className = "minorTitle";
  lastNumberLabel.id = "lastNumber";
  numbersContainer.appendChild(lastNumberLabel);

  const numbersLabel: HTMLLabelElement = document.createElement("label");
  numbersLabel.className = "numbers";
  numbersLabel.id = "numbers";
  numbersContainer.appendChild(numbersLabel);

  const scoreLabel: HTMLLabelElement = document.createElement("label");
  scoreLabel.className = "minorTitle";
  scoreLabel.id = "score";
  numbersContainer.appendChild(scoreLabel);

  document.body.appendChild(numbersContainer);
}

function drawPlayerInputBoxes() {
  const playerInputContainer: HTMLDivElement = document.createElement("div");
  playerInputContainer.className = "playerInputContainer";

  const playerInputLabel: HTMLLabelElement = document.createElement("label");
  playerInputLabel.id = "playerInputLabel";
  playerInputLabel.className = "minorTitle";
  playerInputLabel.textContent = "Insert your numbers!";
  playerInputContainer.appendChild(playerInputLabel);

  const playerInputBoxesContainer: HTMLDivElement =
    document.createElement("div");
  playerInputBoxesContainer.className = "boxesContainer";

  let idBox: string = "";
  let idButton: string = "";

  for (let i = 1; i <= 7; i++) {
    idBox = "inputBox" + i;
    idButton = "inputButton" + i;
    drawInputBox(idBox, idButton, playerInputBoxesContainer);
  }

  playerInputContainer.appendChild(playerInputBoxesContainer);

  document.body.appendChild(playerInputContainer);
}

function drawBox(id: string, container: HTMLDivElement) {
  const box: HTMLButtonElement = document.createElement("button");
  box.id = id;
  box.className = "box-inactive";
  container.appendChild(box);
}

function drawInputBox(
  idBox: string,
  idButton: string,
  container: HTMLDivElement
) {
  const inputBoxContainer: HTMLDivElement = document.createElement("div");
  inputBoxContainer.className = "inputBoxContainer";

  const inputBox: HTMLInputElement = document.createElement("input");
  inputBox.setAttribute("type", "number");
  inputBox.className = "inputBox";
  inputBox.id = idBox;
  inputBoxContainer.appendChild(inputBox);

  const inputButton: HTMLButtonElement = document.createElement("button");
  inputButton.textContent = "OK";
  inputButton.className = "inputButton";
  inputButton.id = idButton;
  inputBoxContainer.appendChild(inputButton);

  container.appendChild(inputBoxContainer);
}

function drawStartAndPlayAgainButton() {
  const startButtonContainer: HTMLDivElement = document.createElement("div");
  startButtonContainer.className = "playerInputContainer";

  const startButton: HTMLButtonElement = document.createElement("button");
  startButton.textContent = "START";
  startButton.className = "startAndPlayAgainButton";
  startButton.id = "startButton";

  startButtonContainer.appendChild(startButton);

  const playAgainButton: HTMLButtonElement = document.createElement("button");
  playAgainButton.textContent = "PLAY AGAIN";
  playAgainButton.className = "startAndPlayAgainButton";
  playAgainButton.id = "playAgainButton";

  startButtonContainer.appendChild(playAgainButton);

  document.body.appendChild(startButtonContainer);
}
