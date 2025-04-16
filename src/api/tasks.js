import {fetchRequest, IP} from "./fetch";


export async function getTasks() {
  const url = IP + "/api/v1/tasks";
  const data = await fetchRequest(url, "GET");
  if (data.Status === 200) {
    return data;
  } else {
    throw new Error("Некорректный формат данных");
  }
}
