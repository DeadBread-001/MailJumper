import React, { useState, useEffect } from "react";
import {getTopPlayers} from "../api/rating";

export default function Rating() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка: {error}</p>;

  if (users.length === 0) {return (<div>Пока никто не сыграл!</div>)}
  return (
    <div className="rating-container">
      <h2 className="rating-title">Таблица лидеров</h2>
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
        {users
          .sort((a, b) => b.score - a.score)
          .map((user, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td className="medal"></td>
              <td>{user.name}</td>
              <td>{user.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
