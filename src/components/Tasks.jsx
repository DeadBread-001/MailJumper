import { useState, useMemo, useEffect } from 'react';
import { getTasks } from '../api/tasks';

const Tasks = () => {
    const [tasks, setTasks] = useState([
        {
            id: 1,
            title: 'Включить автозагрузку в Облаке',
            description:
                'Настройте автоматическую загрузку файлов в Облако Mail.ru',
            reward: 100,
            link: '#',
            status: 'completed',
        },
        {
            id: 2,
            title: 'Включить push-уведомления',
            description: 'Получайте уведомления о важных событиях',
            reward: 50,
            link: '#',
            status: 'active',
        },
        {
            id: 3,
            title: 'Скачать суперапп',
            description: 'Установите приложение Mail.ru на свой телефон',
            reward: 200,
            link: '#',
            status: 'locked',
        },
        {
            id: 4,
            title: 'Посмотреть сторис в Облаке',
            description: 'Просмотрите 3 сторис в Облаке Mail.ru',
            reward: 75,
            link: '#',
            status: 'active',
        },
        {
            id: 5,
            title: 'Посмотреть сторис в супераппе',
            description: 'Просмотрите 3 сторис в приложении Mail.ru',
            reward: 75,
            link: '#',
            status: 'active',
        },
        {
            id: 6,
            title: 'Пригласить друга',
            description: 'Пригласите друга в игру и получите бонус',
            reward: 150,
            link: '#',
            status: 'active',
        },
    ]);

    const [userProgress] = useState({
        currentCoins: 150,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const tasksData = await getTasks();
                setTasks(tasksData);
            } catch (err) {
                console.error('Ошибка при получении данных:', err);
            }
        };

        fetchData();
    }, []);

    const progress = useMemo(() => {
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(
            (task) => task.status === 'completed'
        ).length;
        const progressPercentage = (completedTasks / totalTasks) * 100;

        return {
            total: totalTasks,
            completed: completedTasks,
            percentage: progressPercentage,
        };
    }, [tasks]);

    const handleTaskClick = (task) => {
        if (task.status === 'active' && task.link) {
            window.open(task.link, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <div className="tasks-container">
            <div className="tasks-header">
                <h1>Задания</h1>
                <div className="user-stats">
                    <div className="stat-item">
                        <img
                            src="/images/coin.webp"
                            alt="Монеты"
                            className="coins-icon"
                        />
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
                {tasks.map((task) => (
                    <div
                        key={task.id}
                        className={`task-card ${task.status ? task.status : 'active'}`}
                    >
                        <div className="task-header">
                            <h3>{task.name}</h3>
                        </div>
                        <p className="task-description">{task.description}</p>
                        <div className="task-rewards">
                            <div className="reward-item">
                                <img
                                    src="/images/coin.webp"
                                    alt="Монеты"
                                    className="coins-icon"
                                />
                                <span>{task.reward}</span>
                            </div>
                        </div>
                        <button
                            className={`task-button ${task.status}`}
                            disabled={task.status === 'locked'}
                            onClick={() => handleTaskClick(task)}
                        >
                            {/*{task.status === 'completed' ? 'Выполнено' :*/}
                            {/*    task.status === 'active' ? 'Выполнить' : 'Заблокировано'}*/}
                            Выполнить
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Tasks;
