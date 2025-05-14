import React from 'react';

const SuperpowerSection = ({
    isSuperpowerExpanded,
    setIsSuperpowerExpanded,
    tasks,
    superpowerRef,
}) => (
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
                            key={task.id}
                            className="menu-bottom-sheet__task-item"
                            style={{ '--index': idx }}
                        >
                            <div className="menu-bottom-sheet__task-icon">
                                <img
                                    src="/images/cloudTask.svg"
                                    alt="task icon"
                                />
                            </div>
                            <div className="menu-bottom-sheet__task-content">
                                <div className="menu-bottom-sheet__task-text">
                                    {task.text}
                                </div>
                                {idx === 0 && (
                                    <div className="menu-bottom-sheet__task-label">
                                        ежедневное задание
                                    </div>
                                )}
                            </div>
                            <div className="menu-bottom-sheet__task-arrow">
                                &rarr;
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <button
                className={`menu-bottom-sheet__superpower-btn${isSuperpowerExpanded ? ' menu-bottom-sheet__superpower-btn_expanded' : ''}`}
                onClick={() => setIsSuperpowerExpanded(!isSuperpowerExpanded)}
            >
                <span className="menu-bottom-sheet__superpower-btn-content">
                    {isSuperpowerExpanded ? 'Свернуть' : 'Показать задания'}
                    <img
                        src="/images/arrow.svg"
                        alt="arrow"
                        className={`menu-bottom-sheet__superpower-arrow${isSuperpowerExpanded ? ' menu-bottom-sheet__superpower-arrow_rotated' : ''}`}
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

export default SuperpowerSection;
