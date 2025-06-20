import { fetchRequest, IP } from './fetch';

export const saveTask = async (taskData, isEdit) => {
    let endpoint = isEdit ? 'task/update' : 'task/add';
    let body = { task: taskData };

    const url = IP + `admin/${endpoint}`;
    const data = await fetchRequest(url, 'POST', body);

    if (data.Status !== 200) {
        throw new Error('Ошибка при отправке результата');
    }
};

export const deleteTask = async (id) => {
    const url = IP + `admin/task/delete`;
    const data = await fetchRequest(url, 'POST', { id: id });

    if (data.Status !== 200) {
        throw new Error('Ошибка при отправке результата');
    }
};

export async function getTasks() {
    const url = IP + 'admin/tasks';
    const data = await fetchRequest(url, 'GET');
    if (data.Status === 200) {
        return data.Data.tasks;
    } else {
        throw new Error('Некорректный формат данных');
    }
}
