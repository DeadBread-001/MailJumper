import React, { useEffect, useState } from 'react';
import PrizeBlocks from './PrizeBlocks';
import { getTopPlayers, getTopPlayersForUser } from '../api/rating';
import { getPrizes } from '../api/prizes';

/**
 * Компонент страницы правил призов.
 * @param {Object} props
 * @param {Function} props.onBack - Функция для возврата назад
 * @param {Function} props.onShowModal - Функция для открытия модального окна с правилами
 * @returns {JSX.Element}
 */
const PrizeRulesPage = ({ onBack, onShowModal }) => {
    const [prizesData, setPrizesData] = useState([]);
    const [giftawayRules, setGiftawayRules] = useState([]);

    useEffect(() => {
        const fetchGiftaway = async () => {
            try {
                const data = await getPrizes();
                setPrizesData(data.gifts);
                setGiftawayRules(data.info);
            } catch (err) {
                console.error('Ошибка при получении данных:', err);
            }
        };
        fetchGiftaway();
    }, []);

    return (
        <div className="prize-rules-container">
            <div className="prize-rules-header">
                <button className="prize-rules-back" onClick={onBack}>
                    <img src="/images/back.svg" alt="Назад" />
                </button>
                <span className="prize-rules-title">Призы</span>
            </div>
            <div className="prize-rules-description">
                {giftawayRules.description}
            </div>
            <div
                className="prize-rules-link"
                onClick={() => onShowModal(giftawayRules)}
            >
                Подробные правила
            </div>
            <PrizeBlocks prizes={prizesData} />
        </div>
    );
};

export default PrizeRulesPage;
