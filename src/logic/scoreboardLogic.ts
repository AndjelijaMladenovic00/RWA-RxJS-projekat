import { from, map, take } from "rxjs";
import { urlConst } from "../constants/url";
import { User } from "../models/user";

export function showScoreboard(id: Number) {
  const dataPromise: Promise<Response> = getData();

  from(dataPromise).pipe(
    take(1),
    map((x: Response) => {
      x.json().then((data: User[]) => {
        const sortedData: User[] = data
          .sort((a: User, b: User) => <number>a.highscore - <number>b.highscore)
          .slice(0, 10);
        sortedData.forEach((user: User) =>
          drawScore(user, data.indexOf(user) + 1)
        );
      });
    })
  );
}

function getData(): Promise<Response> {
  return fetch(urlConst.URL);
}

function drawScore(user: User, position: Number) {}
