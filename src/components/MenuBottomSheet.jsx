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
        <div className={`menu-bottom-sheet${isOpen ? ' open' : ''}`}>
            <div className="menu-sheet-backdrop" onClick={onClose} />
            <div className="menu-sheet-content">
                <div className="menu-sheet-header">
                    <button className="menu-sheet-close" onClick={onClose}>
                        &#10005;
                    </button>
                </div>

                <div className="menu-sheet-section score">
                    <div className="score-title">Твой счёт</div>
                    <div className="score-amount-block">
                        <img
                            className="score-img"
                            src="/images/score.svg"
                            alt="Иконка очков"
                        />
                        <div className="score-amount">710 баллов</div>
                    </div>
                </div>

                <div
                    className={`menu-sheet-section superpower${isSuperpowerExpanded ? ' expanded' : ''}`}
                >
                    <div className="superpower-info">
                        <div className="superpower-title">
                            Активировать суперсилу
                        </div>
                        <div className="superpower-desc">
                            Выполни любое задание, чтобы получить много баллов
                        </div>
                        <div className="superpower-tasks">
                            {tasks.map((task) => (
                                <div key={task.id} className="task-item">
                                    <div className="task-icon">{task.icon}</div>
                                    <div className="task-text">{task.text}</div>
                                    <div className="task-arrow">→</div>
                                </div>
                            ))}
                        </div>

                        <button
                            className="superpower-btn"
                            onClick={toggleSuperpower}
                        >
                            {isSuperpowerExpanded
                                ? 'Свернуть ▲'
                                : 'Показать задания ▼'}
                        </button>
                    </div>
                    <img
                        className="superpower-img"
                        src="/images/superpower.svg"
                        alt="superpower"
                    />
                </div>

                <div className="menu-sheet-section prizes">
                    <div className="prizes-info">
                        <div className="prizes-title">Призы</div>
                        <div className="prizes-desc">
                            Чем выше твой рейтинг, тем больше шансов на выигрыш
                            приза
                        </div>
                    </div>
                    <div className="prizes-row">
                        <button className="prizes-btn">Подробнее</button>
                        <div className="prizes-score">
                            <span>⭐</span> {userScore} баллов
                        </div>
                    </div>
                </div>

                <div className="menu-sheet-section rating">
                    <div className="rating-title">Твой рейтинг</div>
                    <div className="rating-list">
                        <div className="rating-item">
                            <span>3. Другой игрок</span>
                            <span>
                                4612 <span className="rating-up">▲</span>
                            </span>
                        </div>
                        <div className="rating-item">
                            <span>5. Юзер</span>
                            <span>
                                4610 <span className="rating-up">▲</span>
                            </span>
                        </div>
                        <div className="rating-item">
                            <span>6. Другой игрок</span>
                            <span>
                                4602 <span className="rating-up">▲</span>
                            </span>
                        </div>
                    </div>
                    <div className="rating-row">
                        <button className="rating-btn">Подробнее</button>
                        <div className="rating-place">
                            {userPlace} место из {userTotal}
                        </div>
                    </div>
                </div>

                <div className="menu-sheet-footer">
                    <button
                        className="menu-help"
                        onClick={() => onNavigate('help')}
                    >
                        Помощь
                    </button>
                    <button
                        className="menu-play"
                        onClick={() => {
                            onClose();
                            onNavigate('play');
                        }}
                    >
                        Играть ▶
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MenuBottomSheet;
