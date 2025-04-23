import { fetchRequest, IP } from './fetch';

export async function signin(userData) {
    const url = IP + `auth/signin`;
    const data = await fetchRequest(url, 'POST', userData);
    if (data.Status === 200) {
        return data.Data;
    } else {
        throw new Error('Ошибка при отправке результата');
    }
}

export async function check(userData) {
    const url = IP + `auth/check`;
    const data = await fetchRequest(url, 'POST', userData);
    if (data.Status === 200) {
        return data.Data;
    } else {
        throw new Error('Ошибка при отправке результата');
    }
}

export async function logout(userData) {
    const url = IP + `auth/logout`;
    const data = await fetchRequest(url, 'POST', userData);
    if (data.Status !== 200) {
        throw new Error('Ошибка при отправке результата');
    }
}
