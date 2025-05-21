import { fetchRequest, IP } from './fetch';

export async function getTopPlayersForUser(vkid, count) {
    const url = IP + `profile/${vkid}/rating?count=${count}`;
    const data = await fetchRequest(url, 'GET');
    if (data.Status === 200 && Array.isArray(data.Data?.users)) {
        return {
            users: data.Data.users,
            current_pos: data.Data.current_pos
        };
    } else {
        throw new Error('Некорректный формат данных');
    }
}

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

export async function getScore(vkid) {
    const url = IP + `profile/${vkid}/score`;
    const data = await fetchRequest(url, 'GET');
    if (data.Status === 200) {
        return data.Data.score;
    }
}
