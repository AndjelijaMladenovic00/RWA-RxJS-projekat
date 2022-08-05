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
  const headerContainer = document.createElement("div");
  headerContainer.className = "headerContainter";

  const headerSubContainerLeft = document.createElement("div");
  headerSubContainerLeft.className = "headerSubContainerLeft";
  headerContainer.appendChild(headerSubContainerLeft);

  const headerSubContainerRight = document.createElement("div");
  headerSubContainerRight.className = "headerSubContainerRight";
  headerContainer.appendChild(headerSubContainerRight);

  const scoreboardButton = document.createElement("button");
  scoreboardButton.className = "scoreboardButton";
  scoreboardButton.textContent = "Scoreboard";
  scoreboardButton.id = "scoreboardButton";
  headerSubContainerLeft.appendChild(scoreboardButton);

  const logoutButton = document.createElement("button");
  logoutButton.className = "logoutButton";
  logoutButton.textContent = "Log out";
  logoutButton.id = "logoutButton";
  headerSubContainerLeft.appendChild(logoutButton);

  drawUserInfo(user, headerSubContainerRight);

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
