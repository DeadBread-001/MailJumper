export const IP = "http://127.0.0.1:80";

export const fetchRequest = async (
  url,
  method = "GET",
  body = null,
  headers = {},
  contentType = "application/json"
) => {
  try {
    const options = {
      method,
      headers: { ...headers },
      credentials: "include",
    };

    if (body instanceof FormData || contentType === "multipart/form-data") {
      options.body = body;
    } else if (body !== null) {
      options.headers["Content-Type"] = contentType;
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`Ошибка при выполнении запроса: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Произошла ошибка:", error.message);
    throw error;
  }
};