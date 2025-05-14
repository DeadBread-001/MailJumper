import React from 'react';

const RatingSection = ({ onShowRatingPage }) => (
    <div className="menu-bottom-sheet__section menu-bottom-sheet__rating">
        <div className="menu-bottom-sheet__rating-title">Рейтинг</div>
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
            <button
                className="menu-bottom-sheet__rating-btn"
                onClick={onShowRatingPage}
            >
                Подробнее
            </button>
        </div>
    </div>
);

export default RatingSection;
