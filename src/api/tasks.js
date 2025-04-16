import {fetchRequest, IP} from "./fetch";


export async function getTasks() {
  const url = IP + "/api/v1/shop/tasks";
  const data = await fetchRequest(url, "GET");
  if (data.Status === 200) {
    return data.Data.tasks;
  } else {
    throw new Error("Некорректный формат данных");
  }
}
