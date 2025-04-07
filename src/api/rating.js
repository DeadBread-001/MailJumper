import {fetchRequest, IP} from "./fetch";


export async function getTopPlayers() {
  const url = IP + "/api/v1/game/rating/top";
  const data = await fetchRequest(url, "GET");
  if (data.Status === 200 && data.Data?.users) {
    return data.Data.users;
  } else {
    throw new Error("Некорректный формат данных");
  }
}
