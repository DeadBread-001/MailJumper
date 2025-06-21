import { fetchRequest, IP } from './fetch';

/**
 * Получает топ игроков для конкретного пользователя с его позицией.
 * @param {string} vkid - VK ID пользователя
 * @param {number} count - Количество игроков для получения
 * @returns {Promise<{users: Array, current_pos: number}>} Данные рейтинга
 * @throws {Error} Если произошла ошибка или некорректный формат данных
 */
export async function getTopPlayersForUser(vkid, count) {
    const url = IP + `profile/${vkid}/rating?count=${count}`;
    const data = await fetchRequest(url, 'GET');
    if (data.Status === 200 && Array.isArray(data.Data?.users)) {
        return {
            users: data.Data.users,
            current_pos: data.Data.current_pos,
        };
    } else {
        throw new Error('Некорректный формат данных');
    }
}

/**
 * Получает общий топ игроков.
 * @param {number} count - Количество игроков для получения
 * @returns {Promise<{users: Array}>} Данные рейтинга
 * @throws {Error} Если произошла ошибка или некорректный формат данных
 */
export async function getTopPlayers(count) {
    const url = IP + `game/rating/top?count=${count}`;
    const data = await fetchRequest(url, 'GET');
    if (data.Status === 200 && Array.isArray(data.Data?.users)) {
        return {
            users: data.Data.users,
        };
    } else {
        throw new Error('Некорректный формат данных');
    }
}

/**
 * Получает лучший счет пользователя.
 * @param {string} vkid - VK ID пользователя
 * @returns {Promise<number|undefined>} Лучший счет пользователя
 */
export async function getScore(vkid) {
    const url = IP + `profile/${vkid}/score`;
    const data = await fetchRequest(url, 'GET');
    if (data.Status === 200) {
        return data.Data.score;
    }
}
