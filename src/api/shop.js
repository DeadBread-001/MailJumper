import {fetchRequest, IP} from "./fetch";


export async function getProducts() {
  const url = IP + "/api/v1/shop/products";
  const data = await fetchRequest(url, "GET");
  if (data.Status === 200) {
    return data.Data.products;
  } else {
    throw new Error("Некорректный формат данных");
  }
}

export async function getPromocodes() {
  const url = IP + "/api/v1/shop/promocodes";
  const data = await fetchRequest(url, "GET");
  if (data.Status === 200) {
    return data.Data.promocodes;
  } else {
    throw new Error("Некорректный формат данных");
  }
}
