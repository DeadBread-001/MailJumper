import React from 'react';
import { timeConvert } from '../utils/timeConvert';

/**
 * Модальное окно с правилами розыгрыша призов.
 * @param {Object} props
 * @param {Function} props.onClose - Функция закрытия модального окна
 * @param {boolean} props.isOpen - Открыто ли модальное окно
 * @param {Object} [props.rules] - Информация о розыгрыше (details, from, to)
 * @returns {JSX.Element}
 */
const ModalPrizeRules = ({ onClose, isOpen, rules }) => (
    <div
        className={`bottom-modal-overlay${isOpen ? ' bottom-modal-overlay_open' : ' bottom-modal-overlay_close'}`}
        onClick={onClose}
    >
        <div
            className={`bottom-modal${isOpen ? ' bottom-modal_open' : ' bottom-modal_close'}`}
            onClick={(e) => e.stopPropagation()}
        >
            <div className="bottom-modal-header">
                <span>Правила розыгрыша</span>
                <button className="bottom-modal-close" onClick={onClose}>
                    ×
                </button>
            </div>
            <div className="bottom-modal-content">
                <div style={{ marginBottom: 16 }}>
                    {rules?.details ||
                        'Подробная информация о розыгрыше будет доступна позже.'}
                </div>
                {rules?.from && rules?.to && (
                    <div style={{ color: '#666', fontSize: 15 }}>
                        Период проведения:{' '}
                        {timeConvert.dateIntoDDMMYY(rules.from)} —{' '}
                        {timeConvert.dateIntoDDMMYY(rules.to)}
                    </div>
                )}
            </div>
        </div>
    </div>
);

export default ModalPrizeRules;
