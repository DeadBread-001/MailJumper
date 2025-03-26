import React, { useState, useEffect } from "react";
import "../styles/rating.css";

export default function Rating() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://127.0.0.1:80/api/v1/game/rating/top", {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Ошибка загрузки данных");
        }

        const data = await response.json();
        if (data.Status === 200 && data.Data?.users) {
          setUsers(data.Data.users);
        } else {
          throw new Error("Некорректный формат данных");
        }
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
