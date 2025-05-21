import React, { useEffect, useState } from 'react';
import { getTopPlayersForUser, getTopPlayers } from '../api/rating';

const RatingPage = ({ onBack, vkid }) => {
    const [ratingData, setRatingData] = useState([]);
    const [topData, setTopData] = useState([]);
    const [currentPos, setCurrentPos] = useState(null);

    useEffect(() => {
        const fetchRating = async () => {
            try {
                const data = await getTopPlayers(100);
                setTopData(data.users);
                if (vkid) {
                    const data = await getTopPlayersForUser(vkid, 2);
                    setRatingData(data.users);
                    setCurrentPos(data.current_pos);
                }
            } catch (err) {
                console.error('Ошибка при получении данных:', err);
            }
        };
        fetchRating();
    }, []);

    return (
        <div className="rating-page-container">
            <div className="rating-page-header">
                <button className="rating-page-back" onClick={onBack}>
                    <img src="/images/back.svg" alt="Назад" />
                </button>
                <span className="rating-page-title">Рейтинг</span>
            </div>
            <div className="rating-main-block">
                <div className="rating-main-title">Рейтинг</div>
                <div className="rating-main-list">
                    {ratingData.map((player, index) => (
                        <div
                            key={index + 1}
                            className={`rating-main-item${currentPos === index ? ' rating-main-item_current' : ''}`}
                        >
                            <span>
                                {index + 1}. {player.name}
                            </span>
                            <span>
                                {player.score}{' '}
                                <img
                                    src="/images/score.svg"
                                    alt="score"
                                    className="rating-main-score-icon"
                                />
                            </span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="rating-top100-block">
                <div className="rating-top100-title">Топ-100 игроков</div>
                <div className="rating-top100-list">
                    {ratingData.map((player, index) => (
                        <div key={index + 1} className={'rating-top100-item'}>
                            <span>
                                {index + 1}. {player.name}
                            </span>
                            <span>
                                {player.score}{' '}
                                <img
                                    src="/images/score.svg"
                                    alt="score"
                                    className="rating-main-score-icon"
                                />
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RatingPage;
