import React, { useState, useMemo, useEffect } from 'react';
import { getTasks } from '../api/tasks';
// import { getTasks } from '../api/tasks';

const Tasks = () => {
    const [tasks, setTasks] = useState([
        {
            id: 1,
            name: 'Нажать кнопку "Выполнить"',
            description: 'Нажмите на кнопку "Выполнить"',
            link: '#',
            status: 'active',
        },
        {
            id: 2,
            name: 'Включить push-уведомления',
            description: 'Получайте уведомления о важных событиях',
            link: '#',
            status: 'active',
        },
        {
            id: 3,
            name: 'Скачать суперапп',
            description: 'Установите приложение Mail.ru на свой телефон',
            link: '#',
            status: 'locked',
        },
        {
            id: 4,
            name: 'Посмотреть сторис в Облаке',
            description: 'Просмотрите 3 сторис в Облаке Mail.ru',
            link: '#',
            status: 'active',
        },
        {
            id: 5,
            name: 'Посмотреть сторис в супераппе',
            description: 'Просмотрите 3 сторис в приложении Mail.ru',
            link: '#',
            status: 'active',
        },
        {
            id: 6,
            name: 'Пригласить друга',
            description: 'Пригласите друга в игру и получите бонус',
            link: '#',
            status: 'active',
        },
    ]);

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
        if (task.id === 1) {
            setTasks((prevTasks) =>
                prevTasks.map((t) =>
                    t.id === 1 ? { ...t, status: 'completed' } : t
                )
            );
            return;
        }
        if (task.status === 'active' && task.link) {
            window.open(task.link, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <div className="tasks-container">
            <div className="tasks-header">
                <h1>Задания</h1>
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
                        <button
                            className={`task-button ${task.status}`}
                            disabled={task.status === 'locked'}
                            onClick={() => handleTaskClick(task)}
                        >
                            {task.status === 'completed'
                                ? 'Выполнено'
                                : task.status === 'active'
                                  ? 'Выполнить'
                                  : 'Заблокировано'}
                            {/*Выполнить*/}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Tasks;
