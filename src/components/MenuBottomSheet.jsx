import React, { useState } from 'react';

const MenuBottomSheet = ({
    isOpen,
    onClose,
    onNavigate,
    userPlace,
    userScore,
    userRank,
    userTasks,
    userTotal,
}) => {
    const [isSuperpowerExpanded, setIsSuperpowerExpanded] = useState(false);

    const toggleSuperpower = () => {
        setIsSuperpowerExpanded(!isSuperpowerExpanded);
    };

    const tasks = [
        {
            id: 1,
            text: 'Включить автозагрузку в приложении Облака',
            icon: '⚡',
        },
        {
            id: 2,
            text: 'Включить уведомления в приложении Почты',
            icon: '📫',
        },
        {
            id: 3,
            text: 'Посмотреть сторис в приложении Облака',
            icon: '👀',
        },
    ];

    return (
        <div
            className={`menu-bottom-sheet${isOpen ? ' menu-bottom-sheet_open' : ''}`}
        >
            <div className="menu-bottom-sheet__backdrop" onClick={onClose} />
            <div className="menu-bottom-sheet__content">
                <div className="menu-bottom-sheet__header">
                    <button
                        className="menu-bottom-sheet__close"
                        onClick={onClose}
                    >
                        &#10005;
                    </button>
                </div>

                <div className="menu-bottom-sheet__section menu-bottom-sheet__score">
                    <div className="menu-bottom-sheet__score-title">
                        Твой счёт
                    </div>
                    <div className="menu-bottom-sheet__score-amount-block">
                        <img
                            className="menu-bottom-sheet__score-img"
                            src="/images/score.svg"
                            alt="Иконка очков"
                        />
                        <div className="menu-bottom-sheet__score-amount">
                            710 баллов
                        </div>
                    </div>
                </div>

                <div
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
                            onClick={toggleSuperpower}
                        >
                            <span className="menu-bottom-sheet__superpower-btn-content">
                                {isSuperpowerExpanded
                                    ? 'Свернуть'
                                    : 'Показать задания'}
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

                <div className="menu-bottom-sheet__section menu-bottom-sheet__prizes">
                    <div className="menu-bottom-sheet__prizes-info">
                        <div className="menu-bottom-sheet__prizes-title">
                            Призы
                        </div>
                        <div className="menu-bottom-sheet__prizes-desc">
                            Чем выше твой рейтинг, тем больше шансов на выигрыш
                            приза
                        </div>
                    </div>
                    <div className="menu-bottom-sheet__prizes-row">
                        <button className="menu-bottom-sheet__prizes-btn">
                            Подробнее
                        </button>
                    </div>
                </div>

                <div className="menu-bottom-sheet__section menu-bottom-sheet__rating">
                    <div className="menu-bottom-sheet__rating-title">
                        Рейтинг
                    </div>
                    <div className="menu-bottom-sheet__rating-list">
                        <div className="menu-bottom-sheet__rating-item">
                            <span>352. Другой игрок</span>
                            <span>
                                710{' '}
                                <img
                                    src="/images/score.svg"
                                    alt="score"
                                    className="menu-bottom-sheet__rating-score-icon"
                                />
                            </span>
                        </div>
                        <div className="menu-bottom-sheet__rating-item menu-bottom-sheet__rating-item_current">
                            <span>353. Твой результат</span>
                            <span>
                                612{' '}
                                <img
                                    src="/images/score.svg"
                                    alt="score"
                                    className="menu-bottom-sheet__rating-score-icon"
                                />
                            </span>
                        </div>
                        <div className="menu-bottom-sheet__rating-item">
                            <span>354. Другой игрок</span>
                            <span>
                                598{' '}
                                <img
                                    src="/images/score.svg"
                                    alt="score"
                                    className="menu-bottom-sheet__rating-score-icon"
                                />
                            </span>
                        </div>
                    </div>
                    <div className="menu-bottom-sheet__rating-row">
                        <button className="menu-bottom-sheet__rating-btn">
                            Подробнее
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MenuBottomSheet;
