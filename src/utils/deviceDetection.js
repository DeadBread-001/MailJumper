/**
 * Определяет тип устройства пользователя (mobile или desktop).
 * @returns {string} 'mobile' или 'desktop'
 */
export const getDeviceType = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile =
        /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
            userAgent
        );

    if (isMobile) {
        return 'mobile';
    } else {
        return 'desktop';
    }
};

/**
 * Проверяет, является ли устройство мобильным (телефон или планшет).
 * @returns {boolean}
 */
export const isMobileDevice = () => {
    return getDeviceType() === 'mobile';
};

/**
 * Проверяет, является ли устройство десктопом.
 * @returns {boolean}
 */
export const isDesktopDevice = () => {
    return getDeviceType() === 'desktop';
};

/**
 * Возвращает ключ для localStorage для статуса онбординга в зависимости от типа устройства.
 * @returns {string}
 */
export const getOnboardingKey = () => {
    const deviceType = getDeviceType();
    return `onboardingCompleted_${deviceType}`;
};

/**
 * Возвращает ключ для localStorage для типа управления в зависимости от типа устройства.
 * @returns {string}
 */
export const getControlTypeKey = () => {
    const deviceType = getDeviceType();
    return `controlType_${deviceType}`;
};
