import React, { useState, useEffect } from 'react';
import { getTopPlayers } from '../api/rating';

const Rating = () => {
    const [usersByLeague, setUsersByLeague] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersData = await getTopPlayers();
                setUsersByLeague(usersData);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (loading) return <p>Загрузка...</p>;
    if (error) return <p>Ошибка: {error}</p>;

    const renderTable = (leagueName, users) => (
        <div className="rating-container" key={leagueName}>
            <h2 className="rating-title">{leagueName.toUpperCase()}</h2>
            {users.length === 0 ? (
                <div>Пока никто не сыграл в этой лиге!</div> // Если в лиге нет игроков
            ) : (
                <table className="rating-table">
                    <thead>
                        <tr>
                            <th>№</th>
                            <th>Статус</th>
                            <th>Имя</th>
                            <th>Счет</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(({ name, score }, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td className="medal"></td>
                                <td>{name}</td>
                                <td>{score}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );

    return (
        <div>
            {Object.entries(usersByLeague).map(([league, users]) =>
                renderTable(league, users)
            )}
        </div>
    );
};

export default Rating;
