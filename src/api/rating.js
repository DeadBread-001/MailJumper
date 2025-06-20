import { fetchRequest, IP } from './fetch';

export async function getTopPlayers() {
    const url = IP + 'game/rating/top';
    const data = await fetchRequest(url, 'GET');
    if (data.Status === 200 && data.Data?.users) {
        const transformedData = {};
        data.Data.users.forEach(({ league, users }) => {
            transformedData[league] = users;
        });
        return transformedData;
    } else {
        throw new Error('Некорректный формат данных');
    }
}
