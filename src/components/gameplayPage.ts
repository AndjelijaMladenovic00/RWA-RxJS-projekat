import { Subject } from "rxjs";
import { initGameplay } from "../logic/gameplayLogic";
import { User } from "../models/user";

export function drawGameplayPage(
  router: Subject<[Number, User | null]>,
  user: User
) {
  console.log(user);
  document.body.innerHTML = "";
  drawHeader(user);
  drawGameplay();

  initGameplay(router);
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

  const scoreboardButton = document.createElement("button");
  scoreboardButton.className = "button";
  scoreboardButton.textContent = "Scoreboard";
  scoreboardButton.id = "scoreboardButton";
  headerSubContainerLeft.appendChild(scoreboardButton);

  const logoutButton = document.createElement("button");
  logoutButton.className = "button";
  logoutButton.textContent = "Log out";
  logoutButton.id = "logoutButton";
  headerSubContainerRight.appendChild(logoutButton);

  drawUserInfo(user, headerSubContainerMiddle);

  document.body.appendChild(headerContainer);
}

function createUserInfoRow(
  label: string,
  data: String | Number,
  id: string
): HTMLDivElement {
  const rowDiv = document.createElement("div");
  rowDiv.className = "userInfoRow";

  const rowLabel = document.createElement("label");
  rowLabel.className = "userInfoRowLabel";
  rowLabel.textContent = label;
  rowDiv.appendChild(rowLabel);

  const rowDataLabel = document.createElement("label");
  rowDataLabel.textContent = "" + data;
  rowDataLabel.id = id;
  rowDataLabel.className = "userInfoDataLabel";
  rowDiv.appendChild(rowDataLabel);

  console.log(data);

  return rowDiv;
}

function drawUserInfo(user: User, container: HTMLDivElement) {
  container.appendChild(
    createUserInfoRow("Username:", user.username, "username")
  );
  container.appendChild(
    createUserInfoRow("Highscore:", user.highscore, "highscore")
  );
  container.appendChild(createUserInfoRow("Current score:", 0, "currentScore"));
}

function drawGameplay() {}
