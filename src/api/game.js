import { fetchRequest, IP } from './fetch';

export async function sendScore(params) {
    const url = IP + `profile/${params.name}/rating`;
    const data = await fetchRequest(url, 'POST', { score: params.score });
    if (data.Status !== 200) {
        throw new Error('Ошибка при отправке результата');
    }
}

export async function getSuperpower(vkid) {
    const url = IP + `profile/${vkid}/superpowers`;
    const data = await fetchRequest(url, 'GET');
    if (data.Status === 200) {
        return data.Data.superpowers;
    } else {
        throw new Error('Некорректный формат данных');
    }
}

export async function useSuperpower(vkid) {
    const url = IP + `profile/${vkid}/superpower/use`;
    const data = await fetchRequest(url, 'POST');
    if (data.Status === 200) {
        return data.Status;
    } else {
        throw new Error('Некорректный формат данных');
    }
}
