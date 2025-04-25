import React, { useState, useEffect, useRef } from 'react';
import { getTopPlayers } from '../api/rating';

const Rating = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const usernameSpanRef = useRef(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersData = await getTopPlayers();
                setUsers(usersData);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        if (!usernameSpanRef.current) return;

        const currentUsername = usernameSpanRef.current.textContent;

        const tableRows = document.querySelectorAll('.rating-table tbody tr');
        tableRows.forEach((row) => {
            const nameCell = row.cells[2]; // Третья колонка - имя
            if (nameCell.textContent === currentUsername) {
                row.classList.add('highlight');
            }
        });
    }, [users]);

    if (loading) return <p>Загрузка...</p>;
    if (error) return <p>Ошибка: {error}</p>;

    return (
      <div className="rating-container">
          <span className="username" ref={usernameSpanRef}>ИмяТекущегоПользователя</span>

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
