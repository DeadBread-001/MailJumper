import React from 'react';

const MenuBottomSheetHeader = ({ onClose }) => (
    <div className="menu-bottom-sheet__header">
        <button className="menu-bottom-sheet__close" onClick={onClose}></button>
    </div>
);

export default MenuBottomSheetHeader;
