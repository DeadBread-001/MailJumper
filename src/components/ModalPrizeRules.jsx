import React from 'react';

/**
 * Модальное окно с правилами розыгрыша призов.
 * @param {Object} props
 * @param {Function} props.onClose - Функция закрытия модального окна
 * @param {boolean} props.isOpen - Открыто ли модальное окно
 * @returns {JSX.Element}
 */
const ModalPrizeRules = ({ onClose, isOpen }) => (
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
                <div>
                    Описание того как происходит розыгрыш и как повысить шансы
                    на выигрыш
                </div>
                <div>
                    Описание того как происходит розыгрыш и как повысить шансы
                    на выигрыш
                </div>
                <div>
                    Описание того как происходит розыгрыш и как повысить шансы
                    на выигрыш
                </div>
                <div>
                    Акция с XXX по XXX.{' '}
                    <span style={{ color: '#1877F2', cursor: 'pointer' }}>
                        Подробные условия
                    </span>
                </div>
            </div>
        </div>
    </div>
);

export default ModalPrizeRules;
