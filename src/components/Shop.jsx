// import React, { useState, useEffect } from 'react';
// import { getProducts, getPromocodes } from '../api/shop';
// import { timeConvert } from '../utils/timeConvert';
//
// const Shop = () => {
//     const [promoCodes, setPromoCodes] = useState([
//         {
//             id: 1,
//             name: 'Скидка 20% где-то',
//             company: '',
//             photo_link: '',
//             description: 'Получите скидку на подписку где-нибудь.',
//             price: 100,
//             count: 0,
//             code: '',
//             active_to: '31.12.2025',
//             activation_link: '#',
//         },
//         {
//             id: 2,
//             name: 'Промокод на VK Music',
//             company: '',
//             photo_link: '',
//             description: 'Получите месяц подписки бесплатно',
//             price: 150,
//             count: 0,
//             code: '',
//             active_to: '31.12.2025',
//             activation_link: '#',
//         },
//     ]);
//
//     const [items, setItems] = useState([
//         {
//             id: 1,
//             name: 'Фирменная футболка',
//             photo_link: '',
//             description:
//                 'Мерч с логотипом Mail. Очень длинное описание, чтобы проверить, как будет выглядеть карточка с большим количеством текста.',
//             price: 500,
//             count: 0,
//             activation_link: '#',
//         },
//         {
//             id: 2,
//             name: 'Бустер в игре',
//             photo_link: '',
//             description: 'Ускорение на 1 час.',
//             price: 50,
//             count: 0,
//             activation_link: '#',
//         },
//         {
//             id: 3,
//             name: 'Кружка Mail.ru',
//             photo_link: '',
//             description: 'Фирменная кружка с логотипом.',
//             price: 300,
//             count: 0,
//             activation_link: '#',
//         },
//     ]);
//
//     const [userCoins] = useState(1200);
//
//     useEffect(() => {
//         const fetchData = async () => {
//             const [productsData, promocodesData] = await Promise.all([
//                 getProducts(),
//                 getPromocodes(),
//             ]);
//             setItems(productsData);
//             setPromoCodes(promocodesData);
//         };
//
//         fetchData();
//     }, []);
//
//     const renderPrizeCard = (prize, isPromoCode = false) => (
//         <div
//             key={prize.id}
//             className={`prize-card ${userCoins >= prize.price ? 'available' : 'locked'}`}
//         >
//             <div className="prize-header">
//                 <h3>{prize.name}</h3>
//             </div>
//             <p className="prize-description">{prize.description}</p>
//             <div className="prize-details">
//                 {isPromoCode && (
//                     <div className="promo-info">
//                         <span className="expiry-date">
//                             Срок действия:{' '}
//                             {timeConvert.dateIntoDayMonthYear(prize.active_to)}
//                         </span>
//                         <a href={prize.activation_link} className="info-link">
//                             Подробнее
//                         </a>
//                     </div>
//                 )}
//             </div>
//             <div className="prize-cost">
//                 <div className="cost-item">
//                     <img
//                         src="/images/coin.png"
//                         alt="Монеты"
//                         className="coins-icon"
//                     />
//                     <span>{prize.price}</span>
//                 </div>
//             </div>
//             <button
//                 className={`buy-button ${userCoins >= prize.price ? 'available' : 'locked'}`}
//                 disabled={userCoins < prize.price}
//             >
//                 {userCoins >= prize.price ? 'Купить' : 'Недостаточно монет'}
//             </button>
//         </div>
//     );
//
//     return (
//         <div className="shop-container">
//             <div className="shop-header">
//                 <h1>Магазин</h1>
//                 <div className="user-stats">
//                     <div className="stat-item">
//                         <img
//                             src="/images/coin.png"
//                             alt="Монеты"
//                             className="coins-icon"
//                         />
//                         <span>{userCoins}</span>
//                     </div>
//                 </div>
//             </div>
//
//             <div className="prizes-grid">
//                 {promoCodes.map((promo) => renderPrizeCard(promo, true))}
//                 {items.map((item) => renderPrizeCard(item))}
//             </div>
//         </div>
//     );
// };
//
// export default Shop;
