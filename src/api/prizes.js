import { fetchRequest, IP } from './fetch';

/**
 * Получает список призов на розыгрыш и информацию о розыгрыше
 * @returns {Promise} Данные о призах
 * @throws {Error} Если произошла ошибка или некорректный формат данных
 */
export async function getPrizes() {
    const url = IP + `shop/gifts/giftaway`;
    const data = await fetchRequest(url, 'GET');
    if (data.Status === 200) {
        return data.Data;
    } else {
        throw new Error('Некорректный формат данных');
    }
}
