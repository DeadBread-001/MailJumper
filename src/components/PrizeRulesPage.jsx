import React from 'react';
import PrizeBlocks from './PrizeBlocks';

/**
 * Компонент страницы правил призов.
 * @param {Object} props
 * @param {Function} props.onBack - Функция для возврата назад
 * @param {Function} props.onShowModal - Функция для открытия модального окна с правилами
 * @returns {JSX.Element}
 */
const PrizeRulesPage = ({ onBack, onShowModal }) => (
    <div className="prize-rules-container">
        <div className="prize-rules-header">
            <button className="prize-rules-back" onClick={onBack}>
                <img src="/images/back.svg" alt="Назад" />
            </button>
            <span className="prize-rules-title">Призы</span>
        </div>
        <div className="prize-rules-description">
            Описание того как происходит розыгрыш
            <br />и как повысить шансы на выигрыш
        </div>
        <div className="prize-rules-link" onClick={onShowModal}>
            Подробные правила
        </div>
        <PrizeBlocks />
    </div>
);

export default PrizeRulesPage;
