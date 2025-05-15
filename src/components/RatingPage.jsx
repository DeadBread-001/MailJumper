import React from 'react';

const RatingPage = ({ onBack }) => (
    <div className="rating-page-container">
        <div className="rating-page-header">
            <button className="rating-page-back" onClick={onBack}>
                &#8592; Назад
            </button>
            <span className="rating-page-title">Рейтинг</span>
        </div>
        <div className="rating-main-block">
            <div className="rating-main-title">Рейтинг</div>
            <div className="rating-main-list">
                <div className="rating-main-item">
                    351. Другой игрок{' '}
                    <span className="rating-main-score">
                        826{' '}
                        <img
                            src="/images/score.svg"
                            alt="score"
                            className="rating-main-score-icon"
                        />
                    </span>
                </div>
                <div className="rating-main-item">
                    352. Другой игрок{' '}
                    <span className="rating-main-score">
                        710{' '}
                        <img
                            src="/images/score.svg"
                            alt="score"
                            className="rating-main-score-icon"
                        />
                    </span>
                </div>
                <div className="rating-main-item rating-main-item_current">
                    353. Твой результат{' '}
                    <span className="rating-main-score">
                        612{' '}
                        <img
                            src="/images/score.svg"
                            alt="score"
                            className="rating-main-score-icon"
                        />
                    </span>
                </div>
                <div className="rating-main-item">
                    354. Другой игрок{' '}
                    <span className="rating-main-score">
                        598{' '}
                        <img
                            src="/images/score.svg"
                            alt="score"
                            className="rating-main-score-icon"
                        />
                    </span>
                </div>
                <div className="rating-main-item">
                    355. Другой игрок{' '}
                    <span className="rating-main-score">
                        546{' '}
                        <img
                            src="/images/score.svg"
                            alt="score"
                            className="rating-main-score-icon"
                        />
                    </span>
                </div>
            </div>
        </div>
        <div className="rating-top100-block">
            <div className="rating-top100-title">Топ-100 игроков</div>
            <div className="rating-top100-list">
                <div className="rating-top100-item">
                    1. Другой игрок{' '}
                    <span className="rating-main-score">
                        598{' '}
                        <img
                            src="/images/score.svg"
                            alt="score"
                            className="rating-main-score-icon"
                        />
                    </span>
                </div>
                <div className="rating-top100-item">
                    2. Другой игрок{' '}
                    <span className="rating-main-score">
                        546{' '}
                        <img
                            src="/images/score.svg"
                            alt="score"
                            className="rating-main-score-icon"
                        />
                    </span>
                </div>
                <div className="rating-top100-item">
                    3. Другой игрок{' '}
                    <span className="rating-main-score">
                        546{' '}
                        <img
                            src="/images/score.svg"
                            alt="score"
                            className="rating-main-score-icon"
                        />
                    </span>
                </div>
                <div className="rating-top100-item">
                    4. Другой игрок{' '}
                    <span className="rating-main-score">
                        546{' '}
                        <img
                            src="/images/score.svg"
                            alt="score"
                            className="rating-main-score-icon"
                        />
                    </span>
                </div>
                <div className="rating-top100-item">
                    5. Другой игрок{' '}
                    <span className="rating-main-score">
                        546{' '}
                        <img
                            src="/images/score.svg"
                            alt="score"
                            className="rating-main-score-icon"
                        />
                    </span>
                </div>
            </div>
        </div>
    </div>
);

export default RatingPage;
