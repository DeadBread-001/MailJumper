/**
 * Доступные части персонажа для кастомизации.
 */
export const characterParts = {
    /** Доступные тела персонажа */
    bodies: ['body1.png', 'body2.png'],
    /** Доступные головные уборы */
    hats: ['hat1.png', 'hat2.png'],
};

/**
 * Получает выбранные части персонажа из localStorage.
 * @returns {Object} Объект с выбранными частями персонажа
 * @returns {string} returns.body - Выбранное тело персонажа
 * @returns {string} returns.hat - Выбранный головной убор
 */
export function getSelectedCharacter() {
    const body =
        localStorage.getItem('characterBody') || characterParts.bodies[0];
    const hat = localStorage.getItem('characterHat') || characterParts.hats[0];
    return { body, hat };
}

/**
 * Сохраняет выбранные части персонажа в localStorage.
 * @param {string} body - Название файла тела персонажа
 * @param {string} hat - Название файла головного убора
 */
export function setSelectedCharacter(body, hat) {
    localStorage.setItem('characterBody', body);
    localStorage.setItem('characterHat', hat);
}
