import { fetchRequest, IP } from './fetch';

/**
 * Сохраняет или обновляет задачу.
 * @param {Object} taskData - Данные задачи
 * @param {boolean} isEdit - Режим редактирования (true) или создания (false)
 * @returns {Promise<void>}
 * @throws {Error} Если произошла ошибка при отправке результата
 */
export const saveTask = async (taskData, isEdit) => {
    let endpoint = isEdit ? 'task/update' : 'task/add';
    let body = { task: taskData };

    const url = IP + `admin/${endpoint}`;
    const data = await fetchRequest(url, 'POST', body);

    if (data.Status !== 200) {
        throw new Error('Ошибка при отправке результата');
    }
};

/**
 * Удаляет задачу по ID.
 * @param {string|number} id - ID задачи
 * @returns {Promise<void>}
 * @throws {Error} Если произошла ошибка при отправке результата
 */
export const deleteTask = async (id) => {
    const url = IP + `admin/task/delete`;
    const data = await fetchRequest(url, 'POST', { id: id });

    if (data.Status !== 200) {
        throw new Error('Ошибка при отправке результата');
    }
};

/**
 * Получает список всех задач для администратора.
 * @returns {Promise<Array>} Список задач
 * @throws {Error} Если произошла ошибка или некорректный формат данных
 */
export async function getTasks() {
    const url = IP + 'admin/tasks';
    const data = await fetchRequest(url, 'GET');
    if (data.Status === 200) {
        return data.Data.tasks;
    } else {
        throw new Error('Некорректный формат данных');
    }
}


export const getGifts = async () => {
    const url = IP + 'admin/gifts';
    const data = await fetchRequest(url, 'GET');
    if (data.Status === 200) {
        return data.Data.giftaway.gifts;
    } else {
        throw new Error('Некорректный формат данных');
    }
};

export const deleteGift = async (id) => {
    const url = IP + `admin/gifts/delete`;
    const data = await fetchRequest(url, 'POST', { id: id });

    if (data.Status !== 200) {
        throw new Error('Ошибка при отправке результата');
    }
};


export const saveGift = async (giftData, isEdit) => {
    let endpoint = isEdit ? 'gifts/update' : 'gifts/add';
    let body = { gift: giftData };

    const url = IP + `admin/${endpoint}`;
    const data = await fetchRequest(url, 'POST', body);

    if (data.Status !== 200) {
        throw new Error('Ошибка при отправке результата');
    }
};
