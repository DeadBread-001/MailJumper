/**
 * Утилиты для конвертации и форматирования времени.
 */
export const timeConvert = {
    /**
     * Конвертирует время из секунд в часы.
     * @param {number} durationInSec - Длительность времени в секундах
     * @returns {number} Длительность времени в часах
     */
    intoHours: (durationInSec) => intoHours(durationInSec),
    /**
     * Конвертирует время из секунд в минуты.
     * @param {number} durationInSec - Длительность времени в секундах
     * @returns {number} Длительность времени в минутах
     */
    intoMinutes: (durationInSec) => intoMinutes(durationInSec),
    /**
     * Форматирует время в текстовый формат (часы и минуты).
     * @param {number} durationInSec - Длительность времени в секундах
     * @returns {string} Текстовое представление времени в формате "часы минуты"
     */
    timeIntoText: (durationInSec) => timeIntoText(durationInSec),
    /**
     * Извлекает год из полной даты.
     * @param {string} rawDate - Полная дата в виде строки
     * @returns {string} Значение года
     */
    dateIntoYear: (rawDate) => dateIntoYear(rawDate),
    /**
     * Форматирует полную дату в формат "День Месяц Год".
     * @param {string} rawDate - Полная дата в виде строки
     * @returns {string} Отформатированная дата
     */
    dateIntoDayMonthYear: (rawDate) => dateIntoDayMonthYear(rawDate),
};

/**
 * Конвертирует секунды в часы.
 * @param {number} durationInSec - Длительность в секундах
 * @returns {number} Длительность в часах
 */
const intoHours = (durationInSec) => {
    return Math.floor(durationInSec / 3600);
};

/**
 * Конвертирует секунды в минуты (остаток от часов).
 * @param {number} durationInSec - Длительность в секундах
 * @returns {number} Длительность в минутах
 */
const intoMinutes = (durationInSec) => {
    return Math.floor((durationInSec % 3600) / 60);
};

/**
 * Форматирует время в текстовый формат.
 * @param {number} durationInMin - Длительность в минутах
 * @returns {string} Отформатированное время
 */
const timeIntoText = (durationInMin) => {
    const hours = Math.floor(durationInMin / 60);
    const minutes = durationInMin % 60;

    if (!hours) {
        return `${minutes}мин`;
    }

    if (!minutes) {
        return `${hours}ч`;
    }

    return `${hours}ч ${minutes}мин`;
};

/**
 * Форматирует время в формат MM:SS или HH:MM:SS.
 * @param {number} time - Время в секундах
 * @returns {string} Отформатированное время
 */
export const formatTime = (time) => {
    let seconds = Math.floor(time % 60);
    let minutes = Math.floor(time / 60) % 60;
    let hours = Math.floor(time / 3600);

    seconds = seconds < 10 ? '0' + seconds : seconds;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    hours = hours < 10 ? '0' + hours : hours;

    if (!hours) {
        return `${minutes}:${seconds}`;
    }
    return `${hours}:${minutes}:${seconds}`;
};

/**
 * Извлекает год из строки даты.
 * @param {string} rawDate - Строка даты
 * @returns {string} Год
 */
const dateIntoYear = (rawDate) => {
    return rawDate.substring(0, 4);
};

/**
 * Форматирует дату в русский формат "День Месяц Год".
 * @param {string} rawDate - Строка даты
 * @returns {string} Отформатированная дата на русском языке
 */
const dateIntoDayMonthYear = (rawDate) => {
    const date = new Date(rawDate);

    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    const months = [
        'Января',
        'Февраля',
        'Марта',
        'Апреля',
        'Мая',
        'Июня',
        'Июля',
        'Августа',
        'Сентября',
        'Октября',
        'Ноября',
        'Декабря',
    ];

    const monthName = months[monthIndex];

    return `${day} ${monthName} ${year}`;
};
