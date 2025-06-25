import { fetchRequest, IP } from './fetch';

/**
 * Выполняет вход пользователя через VK ID.
 * @param {Object} userData - Данные для входа.
 * @returns {Promise<Object>} Данные пользователя
 * @throws {Error} Если произошла ошибка при отправке результата
 */
export async function signin(userData) {
    const url = IP + `auth/signin`;
    const data = await fetchRequest(url, 'POST', userData);
    if (data.Status === 200) {
        return data.Data;
    } else {
        throw new Error('Ошибка при отправке результата');
    }
}

/**
 * Проверяет авторизацию пользователя.
 * @returns {Promise<Object>} Данные пользователя
 * @throws {Error} Если произошла ошибка при отправке результата
 */
export async function check() {
    const url = IP + `auth/check`;
    const data = await fetchRequest(url, 'POST');
    if (data.Status === 200) {
        return data.Data;
    } else {
        throw new Error('Ошибка при отправке результата');
    }
}

/**
 * Выполняет выход пользователя.
 * @param {Object} userData - Данные пользователя
 * @returns {Promise<void>}
 * @throws {Error} Если произошла ошибка при отправке результата
 */
export async function logout(userData) {
    const url = IP + `auth/logout`;
    const data = await fetchRequest(url, 'POST', userData);
    if (data.Status !== 200) {
        throw new Error('Ошибка при отправке результата');
    }
}
