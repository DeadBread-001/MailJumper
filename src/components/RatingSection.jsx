import React from 'react';

/**
 * Компонент раздела рейтинга игроков.
 * @param {Object} props
 * @param {Function} props.onShowRatingPage - Функция для открытия страницы рейтинга
 * @param {Array} [props.ratingData=[]] - Данные рейтинга игроков
 * @param {boolean} props.loading - Состояние загрузки
 * @param {number|null} props.currentPos - Позиция текущего игрока в рейтинге
 * @returns {JSX.Element}
 */
const RatingSection = ({
    onShowRatingPage,
    ratingData = [],
    loading,
    currentPos,
}) => {
    if (loading) {
        return (
            <div className="menu-bottom-sheet__section menu-bottom-sheet__rating">
                <div className="menu-bottom-sheet__rating-title">Рейтинг</div>
                <div className="menu-bottom-sheet__rating-list">
                    <div className="menu-bottom-sheet__rating-item">
                        Загрузка...
                    </div>
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
                        key={player.pos}
                        className={`menu-bottom-sheet__rating-item${currentPos === index ? ' menu-bottom-sheet__rating-item_current' : ''}`}
                    >
                        <span>
                            {player.pos}. {player.name}
                        </span>
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
