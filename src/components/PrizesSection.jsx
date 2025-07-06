import React from 'react';

/**
 * Компонент раздела призов.
 * @param {Object} props
 * @param {Function} props.onShowPrizeRules - Функция для открытия страницы правил призов
 * @returns {JSX.Element}
 */
const PrizesSection = ({ onShowPrizeRules }) => (
    <div className="menu-bottom-sheet__section menu-bottom-sheet__prizes">
        <div className="menu-bottom-sheet__prizes-info">
            <div className="menu-bottom-sheet__prizes-title">Призы</div>
            <div className="menu-bottom-sheet__prizes-desc">
                Чем выше твой рейтинг, тем больше шансов на выигрыш приза
            </div>
        </div>
        <div className="menu-bottom-sheet__prizes-row">
            <button
                className="menu-bottom-sheet__prizes-btn"
                onClick={onShowPrizeRules}
            >
                Подробнее
            </button>
        </div>
    </div>
);

export default PrizesSection;
