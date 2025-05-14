import React from 'react';

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
