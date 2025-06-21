import React from 'react';

/**
 * Заголовок нижнего меню с кнопкой закрытия.
 * @param {Object} props
 * @param {Function} props.onClose - Функция закрытия меню
 * @returns {JSX.Element}
 */
const MenuBottomSheetHeader = ({ onClose }) => (
    <div className="menu-bottom-sheet__header">
        <button className="menu-bottom-sheet__close" onClick={onClose}></button>
    </div>
);

export default MenuBottomSheetHeader;
