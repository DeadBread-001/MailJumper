import { fetchRequest, IP } from './fetch';

/**
 * Получает список доступных задач.
 * @returns {Promise<Array>} Список задач
 * @throws {Error} Если произошла ошибка или некорректный формат данных
 */
export async function getTasks() {
    const url = IP + 'shop/tasks';
    const data = await fetchRequest(url, 'GET');
    if (data.Status === 200) {
        return data.Data.tasks;
    } else {
        throw new Error('Некорректный формат данных');
    }
}

/**
 * Отмечает задачу как выполненную.
 * @param {string} token - Токен задачи
 * @param {string} vkid - VK ID пользователя
 * @returns {Promise<Object>} Результат выполнения
 * @throws {Error} Если произошла ошибка или некорректный формат данных
 */
export async function completeTask(token, vkid) {
    const url = IP + `${vkid}/task`;
    const data = await fetchRequest(url, 'POST', token);
    if (data.Status === 200) {
        return data;
    } else {
        throw new Error('Некорректный формат данных');
    }
}
