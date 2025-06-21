import React, { useState } from 'react';
import { completeTask } from '../api/tasks';

/**
 * Компонент раздела суперспособностей с заданиями.
 * @param {Object} props
 * @param {boolean} props.isSuperpowerExpanded - Развернут ли раздел
 * @param {Function} props.setIsSuperpowerExpanded - Функция для переключения состояния
 * @param {Array} props.tasks - Список доступных заданий
 * @param {React.RefObject} props.superpowerRef - Ссылка на элемент для прокрутки
 * @param {string} props.vkid - VK ID пользователя
 * @returns {JSX.Element}
 */
const SuperpowerSection = ({
    isSuperpowerExpanded,
    setIsSuperpowerExpanded,
    tasks,
    superpowerRef,
    vkid,
}) => {
    /**
     * Множество выполненных заданий.
     */
    const [completedTasks, setCompletedTasks] = useState(new Set());

    /**
     * Обрабатывает клик по заданию для его выполнения.
     * @param {string} taskToken - Токен задания
     */
    const handleTaskClick = async (taskToken) => {
        try {
            const response = await completeTask({ token: taskToken }, vkid);
            if (response.Status === 200) {
                setCompletedTasks((prev) => new Set([...prev, taskToken]));
            }
        } catch (error) {
            console.error('Error completing task:', error);
        }
    };

    return (
        <div
            ref={superpowerRef}
            className={`menu-bottom-sheet__section menu-bottom-sheet__superpower${isSuperpowerExpanded ? ' menu-bottom-sheet__superpower_expanded' : ''}`}
        >
            <div className="menu-bottom-sheet__superpower-info">
                <div className="menu-bottom-sheet__superpower-title">
                    Активировать суперсилу
                </div>
                <div className="menu-bottom-sheet__superpower-desc">
                    Выполни любое задание, чтобы получить много баллов
                </div>
                <div className="menu-bottom-sheet__superpower-tasks-wrapper">
                    <div className="menu-bottom-sheet__superpower-tasks">
                        {tasks.map((task, idx) => (
                            <div
                                key={task.token || idx}
                                className={`menu-bottom-sheet__task-item${completedTasks.has(task.token) ? ' menu-bottom-sheet__task-item_completed' : ''}`}
                                style={{ '--index': idx }}
                                onClick={() =>
                                    !completedTasks.has(task.token) &&
                                    handleTaskClick(task.token)
                                }
                            >
                                <div className="menu-bottom-sheet__task-icon">
                                    <img
                                        src={
                                            task.icon || '/images/cloudTask.svg'
                                        }
                                        alt="task icon"
                                    />
                                </div>
                                <div className="menu-bottom-sheet__task-content">
                                    <div className="menu-bottom-sheet__task-text">
                                        {task.description}
                                    </div>
                                    {/*{task.description && (*/}
                                    {/*    <div className="menu-bottom-sheet__task-label">*/}
                                    {/*        {task.description}*/}
                                    {/*    </div>*/}
                                    {/*)}*/}
                                </div>
                                <div className="menu-bottom-sheet__task-arrow">
                                    <img
                                        src="/images/arrow-black.svg"
                                        alt="arrow"
                                        className="menu-bottom-sheet__task-arrow-img"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <button
                    className={`menu-bottom-sheet__superpower-btn${isSuperpowerExpanded ? ' menu-bottom-sheet__superpower-btn_expanded' : ''}`}
                    onClick={() =>
                        setIsSuperpowerExpanded(!isSuperpowerExpanded)
                    }
                >
                    <span className="menu-bottom-sheet__superpower-btn-content">
                        {isSuperpowerExpanded ? 'Свернуть' : 'Показать задания'}
                        <img
                            src={
                                isSuperpowerExpanded
                                    ? '/images/arrow-black.svg'
                                    : '/images/arrow.svg'
                            }
                            alt="arrow"
                            className="menu-bottom-sheet__superpower-arrow"
                            style={{
                                transition:
                                    'transform 0.3s ease, opacity 0.3s ease',
                            }}
                        />
                    </span>
                </button>
            </div>
            <img
                className="menu-bottom-sheet__superpower-img"
                src="/images/superpower.svg"
                alt="superpower"
            />
        </div>
    );
};

export default SuperpowerSection;
