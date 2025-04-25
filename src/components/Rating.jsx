import React, { useState, useEffect } from 'react';
import { getTopPlayers } from '../api/rating';

const Rating = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersData = await getTopPlayers(); // Уже получаем массив пользователей
                setUsers(usersData);
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

    return (
      <div className="rating-container">
          <h2 className="rating-title">РЕЙТИНГ ИГРОКОВ</h2>
          {users.length === 0 ? (
            <div>Пока никто не сыграл!</div>
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
};

export default Rating;
