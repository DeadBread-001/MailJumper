import { fetchRequest, IP } from './fetch';

export async function getTasks() {
    const url = IP + 'admin/tasks';
    const data = await fetchRequest(url, 'GET');
    if (data.Status === 200) {
        return data.Data.tasks;
    } else {
        throw new Error('Некорректный формат данных');
    }
}

export async function completeTask(token, vkid) {
    const url = IP + `${vkid}/task`;
    const data = await fetchRequest(url, 'POST', token);
    if (data.Status === 200) {
        return data.Data;
    } else {
        throw new Error('Некорректный формат данных');
    }
}
