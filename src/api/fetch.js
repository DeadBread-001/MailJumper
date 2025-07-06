// export const IP = 'http://127.0.0.1:3001/api/v1/';
export const IP = 'https://mail-jumper.ru/api/v1/';

let csrfToken = null;
export function setCSRFToken(token) {
    csrfToken = token;
}
export function getCSRFToken() {
    return csrfToken;
}

/**
 * Универсальная функция для выполнения HTTP-запросов к API.
 * @param {string} url - URL для запроса
 * @param {string} [method='GET'] - HTTP метод
 * @param {Object|FormData|null} [body=null] - Тело запроса
 * @param {Object} [headers={}] - Дополнительные заголовки
 * @param {string} [contentType='application/json'] - Тип контента
 * @returns {Promise<Object>} Ответ от сервера в формате JSON
 * @throws {Error} Если произошла ошибка при выполнении запроса
 */
export const fetchRequest = async (
    url,
    method = 'GET',
    body = null,
    headers = {},
    contentType = 'application/json'
) => {
    try {
        const options = {
            method,
            headers: { ...headers },
            credentials: 'include',
        };

        if (csrfToken) {
            options.headers['X-CSRF-Token'] = csrfToken;
        }

        if (body instanceof FormData || contentType === 'multipart/form-data') {
            options.body = body;
        } else if (body !== null) {
            options.headers['Content-Type'] = contentType;
            options.body = JSON.stringify(body);
        }

        const response = await fetch(url, options);

        const newToken = response.headers.get('X-CSRF-Token');
        if (newToken) {
            setCSRFToken(newToken);
        }

        if (!response.ok) {
            throw new Error(
                `Ошибка при выполнении запроса: ${response.status}`
            );
        }

        return await response.json();
    } catch (error) {
        console.error('Произошла ошибка:', error.message);
        throw error;
    }
};
