import { urlConst } from "../constants/url";
import { User } from "../models/user";

export function showScoreboard(id: number) {
  let users: User[] = [];

  const dataPromise: Promise<Response> = fetch(urlConst.URL, {
    method: "GET",
  });
  dataPromise
    .then((response: Response) => {
      if (!response.ok) {
        throw new Error("GET error");
      }

      response.json().then((data: User[]) => {
        users = data
          .sort((a: User, b: User) => a.highscore - b.highscore)
          .reverse()
          .slice(0, 10);

        users.forEach((user: User) => {
          drawScore(user, users.indexOf(user) + 1, id);
        });
      });
    })
    .catch((err: Error) => {
      console.log(err);
    });
}

function drawScore(user: User, position: number, id: number) {
  const scoreContainer: HTMLDivElement = document.createElement("div");
  scoreContainer.className = "scoreContainer";

  const usernameLabel: HTMLLabelElement = document.createElement("label");
  usernameLabel.textContent = position + ". " + user.username;
  usernameLabel.className = "minorTitle";
  scoreContainer.appendChild(usernameLabel);

  const scoreLabel: HTMLLabelElement = document.createElement("label");
  scoreLabel.textContent = user.highscore + "";
  scoreLabel.className = "minorTitle";
  scoreContainer.appendChild(scoreLabel);

  if (user.id == id) {
    usernameLabel.style.color = "red";
    scoreLabel.style.color = "red";
  }

  document.body.appendChild(scoreContainer);
}
