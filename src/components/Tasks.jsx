import React, { useState, useMemo } from 'react';
import '../styles/tasks.scss';

const Tasks = () => {
  // Заглушка для данных
  const [tasks] = useState([
    {
      id: 1,
      title: 'Включить автозагрузку в Облаке',
      description: 'Настройте автоматическую загрузку файлов в Облако Mail.ru',
      reward: {
        coins: 100
      },
      status: 'completed',
      category: 'cloud'
    },
    {
      id: 2,
      title: 'Включить push-уведомления',
      description: 'Получайте уведомления о важных событиях',
      reward: {
        coins: 50
      },
      status: 'active',
      category: 'notifications'
    },
    {
      id: 3,
      title: 'Скачать суперапп',
      description: 'Установите приложение Mail.ru на свой телефон',
      reward: {
        coins: 200
      },
      status: 'locked',
      category: 'app'
    },
    {
      id: 4,
      title: 'Посмотреть сторис в Облаке',
      description: 'Просмотрите 3 сторис в Облаке Mail.ru',
      reward: {
        coins: 75
      },
      status: 'active',
      category: 'cloud'
    },
    {
      id: 5,
      title: 'Посмотреть сторис в супераппе',
      description: 'Просмотрите 3 сторис в приложении Mail.ru',
      reward: {
        coins: 75
      },
      status: 'active',
      category: 'app'
    },
    {
      id: 6,
      title: 'Пригласить друга',
      description: 'Пригласите друга в игру и получите бонус',
      reward: {
        coins: 150
      },
      status: 'active',
      category: 'social'
    }
  ]);

  const [userProgress] = useState({
    currentCoins: 150
  });

  const progress = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'completed').length;
    const progressPercentage = (completedTasks / totalTasks) * 100;

    return {
      total: totalTasks,
      completed: completedTasks,
      percentage: progressPercentage
    };
  }, [tasks]);

  return (
    <div className="tasks-container">
      <div className="tasks-header">
        <h1>Задания</h1>
        <div className="user-stats">
          <div className="stat-item">
            <img src="/images/coin.webp" alt="Монеты" className="coins-icon" />
            <span>{userProgress.currentCoins}</span>
          </div>
        </div>
      </div>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${progress.percentage}%` }}
        />
        <div className="progress-text">
          {progress.completed} из {progress.total} заданий выполнено
        </div>
      </div>

      <div className="tasks-grid">
        {tasks.map(task => (
          <div key={task.id} className={`task-card ${task.status}`}>
            <div className="task-header">
              <h3>{task.title}</h3>
              <span className="task-category">{task.category}</span>
            </div>
            <p className="task-description">{task.description}</p>
            <div className="task-rewards">
              <div className="reward-item">
                <img src="/images/coin.webp" alt="Монеты" className="coins-icon" />
                <span>{task.reward.coins}</span>
              </div>
            </div>
            <button
              className={`task-button ${task.status}`}
              disabled={task.status === 'locked'}
            >
              {task.status === 'completed' ? 'Выполнено' :
               task.status === 'active' ? 'Выполнить' : 'Заблокировано'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;
