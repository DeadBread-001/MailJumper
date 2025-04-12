import {fetchRequest, IP} from "./fetch";

export const saveProduct = async (productData, isEdit, productType) => {
  let endpoint = isEdit ? "product/update" : "product/add";
  let body = {product: productData};

  if (productType === "promocode") {
    endpoint = isEdit ? "promocode/update" : "promocode/add";
    body = {promocode: productData}
  }

  const url = IP + `/api/v1/shop/${endpoint}`;
  const data = await fetchRequest(url, "POST", body);

  if (data.Status !== 200) {
    throw new Error("Ошибка при отправке результата");
  }
};

export const deleteProduct = async (id, productType) => {
  const endpoint = productType === "promocode" ? "promocode" : "product";


  const url = IP + `/api/v1/shop/${endpoint}/delete`;
  const data = await fetchRequest(url, "POST",  {id: id});

  if (data.Status !== 200) {
    throw new Error("Ошибка при отправке результата");
  }

};
