import {fetchRequest, IP} from "./fetch";


export async function sendScore(params) {
  const url = IP + `profile/${params.name}/rating`;
  const data = await fetchRequest(url, "POST", {score: params.score});
  if (data.Status !== 200) {
    throw new Error("Ошибка при отправке результата");
  }
}
