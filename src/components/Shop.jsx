import React, { useState } from 'react';
import '../styles/shop.scss';

const Shop = () => {
  const [prizes] = useState([
    {
      id: 1,
      name: 'Скидка 20% где-то',
      description: 'Получите скидку на подписку где-нибудь.',
      cost: 100,
      type: 'promo',
      expires: '31.12.2025',
      activationLink: '#',
    },
    {
      id: 2,
      name: 'Фирменная футболка',
      description: 'Мерч с логотипом Mail. Очень длинное описание, чтобы проверить, как будет выглядеть карточка с большим количеством текста.',
      cost: 500,
      type: 'merch',
    },
    {
      id: 3,
      name: 'Бустер в игре',
      description: 'Ускорение на 1 час.',
      cost: 50,
      type: 'booster',
    },
  ]);

  const [userCoins] = useState(1200);

  return (
    <div className="shop-container">
      <div className="shop-header">
        <h1>Магазин</h1>
        <div className="user-stats">
          <div className="stat-item">
            <img src="/images/coin.webp" alt="Монеты" className="coins-icon" />
            <span>{userCoins}</span>
          </div>
        </div>
      </div>

      <div className="prizes-grid">
        {prizes.map((prize) => (
          <div key={prize.id} className={`prize-card ${userCoins >= prize.cost ? 'available' : 'locked'}`}>
            <div className="prize-header">
              <h3>{prize.name}</h3>
              <span className="prize-type">{prize.type}</span>
            </div>
            <p className="prize-description">{prize.description}</p>
            <div className="prize-details">
              {prize.type === 'promo' && (
                <div className="promo-info">
                  <span className="expiry-date">Срок действия: {prize.expires}</span>
                  <a href={prize.activationLink} className="info-link">
                    Подробнее
                  </a>
                </div>
              )}
            </div>
            <div className="prize-cost">
              <div className="cost-item">
                <img src="/images/coin.webp" alt="Монеты" className="coins-icon" />
                <span>{prize.cost}</span>
              </div>
            </div>
            <button
              className={`buy-button ${userCoins >= prize.cost ? 'available' : 'locked'}`}
              disabled={userCoins < prize.cost}
            >
              {userCoins >= prize.cost ? 'Купить' : 'Недостаточно монет'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;
