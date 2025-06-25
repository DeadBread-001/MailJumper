import React from 'react';

/**
 * Компонент для отображения счета пользователя.
 * @param {Object} props
 * @param {number} props.userScore - Счет пользователя
 * @returns {JSX.Element}
 */
const ScoreSection = ({ userScore }) => (
    <div className="menu-bottom-sheet__section menu-bottom-sheet__score">
        <div className="menu-bottom-sheet__score-title">Твой счёт</div>
        <div className="menu-bottom-sheet__score-amount-block">
            <img
                className="menu-bottom-sheet__score-img"
                src="/images/score.svg"
                alt="Иконка очков"
            />
            <div className="menu-bottom-sheet__score-amount">
                {userScore} баллов
            </div>
        </div>
    </div>
);

export default ScoreSection;
