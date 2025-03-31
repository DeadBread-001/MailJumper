import React from 'react';

const Shop = () => {
  const prizes = [
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
      description: 'Мерч с логотипом Mail. Очень длинное описание, чтобы проверить, как будет выглядеть карточка с большим количеством текста и как кнопка останется внизу.',
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
  ];

  return (
      <div className="shop-container">
        <h1 className="shop-title">Магазин</h1>
        <div className="currency-info">
          <span>Ваши монеты: </span>
          <span className="coin-amount">1200</span>
          <img src="https://images.icon-icons.com/651/PNG/96/Icon_Business_Set_00003_A_icon-icons.com_59841.png"
               alt="coin" className="coin-icon"/>
        </div>
        <div className="prizes-grid">
          {prizes.map((prize) => (
              <div key={prize.id} className="prize-card">
                <h3 className="prize-name">{prize.name}</h3>
                <p className="prize-description">{prize.description}</p>
                <div className="prize-cost">
                  <span>{prize.cost}</span>
                  <img src="https://images.icon-icons.com/651/PNG/96/Icon_Business_Set_00003_A_icon-icons.com_59841.png"
                       alt="coin" className="coin-icon"/>
                </div>
                {prize.type === 'promo' && (
                    <div className="promo-details">
                      <p>Срок действия: {prize.expires}</p>
                      <a href={prize.activationLink} className="activation-link">
                        Подробнее
                      </a>
                    </div>
                )}
                <button className="buy-button">Купить</button>
              </div>
          ))}
        </div>
      </div>
  );
};

export default Shop;
