import { fetchRequest, IP } from './fetch';

/**
 * Отправляет результат (очки) пользователя на сервер.
 * @param {Object} params - Параметры (name, score)
 * @returns {Promise<void>}
 * @throws {Error} Если произошла ошибка при отправке результата
 */
export async function sendScore(params) {
    const url = IP + `profile/${params.name}/rating`;
    const data = await fetchRequest(url, 'POST', { score: params.score });
    if (data.Status !== 200) {
        throw new Error('Ошибка при отправке результата');
    }
}

/**
 * Получает количество суперсил пользователя.
 * @param {string} vkid - VK ID пользователя
 * @returns {Promise<number>} Количество суперсил
 * @throws {Error} Если произошла ошибка или некорректный формат данных
 */
export async function getSuperpower(vkid) {
    const url = IP + `profile/${vkid}/superpowers`;
    const data = await fetchRequest(url, 'GET');
    if (data.Status === 200) {
        return data.Data.superpowers;
    } else {
        throw new Error('Некорректный формат данных');
    }
}

/**
 * Использует суперсилу для пользователя.
 * @param {string} vkid - VK ID пользователя
 * @returns {Promise<number>} Статус ответа
 * @throws {Error} Если произошла ошибка или некорректный формат данных
 */
export async function useSuperpower(vkid) {
    const url = IP + `profile/${vkid}/superpower/use`;
    const data = await fetchRequest(url, 'POST');
    if (data.Status === 200) {
        return data.Status;
    } else {
        throw new Error('Некорректный формат данных');
    }
}
