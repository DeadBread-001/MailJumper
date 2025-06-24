import React from 'react';

/**
 * Компонент для отображения блоков с призами по схеме: длинный, два коротких, длинный, два коротких и т.д.
 * @param {Object} props
 * @param {Array} props.prizes - Массив призов
 * @returns {JSX.Element}
 */
const PrizeBlocks = ({ prizes = [] }) => {
    const blocks = [];
    let i = 0;
    while (i < prizes.length) {
        if (blocks.length % 2 === 0) {
            blocks.push({ type: 'long', items: [prizes[i]] });
            i += 1;
        } else {
            if (prizes.length - i >= 2) {
                blocks.push({
                    type: 'short',
                    items: [prizes[i], prizes[i + 1]],
                });
                i += 2;
            } else {
                blocks.push({ type: 'long', items: [prizes[i]] });
                i += 1;
            }
        }
    }

    return (
        <div className="prize-block">
            {blocks.map((block, idx) => {
                if (block.type === 'long') {
                    const prize = block.items[0];
                    return (
                        <div className="prize-block-long" key={`long-${idx}`}>
                            <div className="prize-block-content">
                                <div className="prize-block-title">
                                    {prize.name || 'Без названия'}
                                </div>
                                <div className="prize-block-desc">
                                    {prize.description || ''}
                                </div>
                            </div>
                            <div className="prize-block-img-wrapper">
                                <img
                                    className="prize-block-img"
                                    src={
                                        prize.photo ||
                                        '/images/image-placeholder.svg'
                                    }
                                    alt={prize.name || 'img'}
                                />
                            </div>
                        </div>
                    );
                } else if (block.type === 'short') {
                    return (
                        <div className="prize-block-row" key={`short-${idx}`}>
                            {block.items.map((prize, j) => (
                                <div
                                    className="prize-block-short"
                                    key={prize.id || j}
                                >
                                    <div className="prize-block-img-wrapper">
                                        <img
                                            className="prize-block-img"
                                            src={
                                                prize.photo ||
                                                '/images/image-placeholder.svg'
                                            }
                                            alt={prize.name || 'img'}
                                        />
                                    </div>
                                    <div className="prize-block-title">
                                        {prize.name || 'Без названия'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    );
                }
                return null;
            })}
        </div>
    );
};

export default PrizeBlocks;
