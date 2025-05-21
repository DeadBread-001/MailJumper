import React from 'react';

const RatingSection = ({ onShowRatingPage, ratingData = [], loading, currentPos }) => {
    if (loading) {
        return (
            <div className="menu-bottom-sheet__section menu-bottom-sheet__rating">
                <div className="menu-bottom-sheet__rating-title">Рейтинг</div>
                <div className="menu-bottom-sheet__rating-list">
                    <div className="menu-bottom-sheet__rating-item">Загрузка...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="menu-bottom-sheet__section menu-bottom-sheet__rating">
            <div className="menu-bottom-sheet__rating-title">Рейтинг</div>
            <div className="menu-bottom-sheet__rating-list">
                {ratingData.map((player, index) => (
                    <div
                        key={index+1}
                        className={`menu-bottom-sheet__rating-item${currentPos === index ? ' menu-bottom-sheet__rating-item_current' : ''}`}
                    >
                        <span>{index + 1}. {player.name}</span>
                        <span>
                            {player.score}{' '}
                            <img
                                src="/images/score.svg"
                                alt="score"
                                className="menu-bottom-sheet__rating-score-icon"
                            />
                        </span>
                    </div>
                ))}
            </div>
            <div className="menu-bottom-sheet__rating-row">
                <button
                    className="menu-bottom-sheet__rating-btn"
                    onClick={onShowRatingPage}
                >
                    Подробнее
                </button>
            </div>
        </div>
    );
};

export default RatingSection;
