export const timeConvert = {
  /**
   * Конвертирует время из секунд в часы.
   * @function
   * @private
   * @param {number} durationInSec - Длительность времени в секундах.
   * @return {number} - Длительность времени в часах.
   */
  intoHours: (durationInSec) => intoHours(durationInSec),
  /**
   * Конвертирует время из секунд в минуты.
   * @function
   * @private
   * @param {number} durationInSec - Длительность времени в секундах.
   * @return {number} - Длительность времени в минутах.
   */
  intoMinutes: (durationInSec) => intoMinutes(durationInSec),
  /**
   * Форматирует время в текстовый формат (часы и минуты).
   * @function
   * @private
   * @param {number} durationInSec - Длительность времени в секундах.
   * @return {string} - Текстовое представление времени в формате "часы минуты".
   */
  timeIntoText: (durationInSec) => timeIntoText(durationInSec),
  /**
   * Форматирует полную дату в год
   * @private
   * @param {string} rawDate - Полная дата в виде строки
   * @return {string} - значение года
   */
  dateIntoYear: (rawDate) => dateIntoYear(rawDate),
  /**
   * Форматирует полную дату в День Месяц Год
   * @private
   * @param {string} rawDate - Полная дата в виде строки
   * @return {string} - значение года
   */
  dateIntoDayMonthYear: (rawDate) => dateIntoDayMonthYear(rawDate),
};

const intoHours = (durationInSec) => {
  return Math.floor(durationInSec / 3600);
};

const intoMinutes = (durationInSec) => {
  return Math.floor((durationInSec % 3600) / 60);
};

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

export const formatTime = (time) => {
  let seconds = Math.floor(time % 60);
  let minutes = Math.floor(time / 60) % 60;
  let hours = Math.floor(time / 3600);

  seconds = seconds < 10 ? "0" + seconds : seconds;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  hours = hours < 10 ? "0" + hours : hours;

  if (!hours) {
    return `${minutes}:${seconds}`;
  }
  return `${hours}:${minutes}:${seconds}`;
};

const dateIntoYear = (rawDate) => {
  return rawDate.substring(0, 4);
};

const dateIntoDayMonthYear = (rawDate) => {
  const date = new Date(rawDate);

  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  const months = [
    "Января",
    "Февраля",
    "Марта",
    "Апреля",
    "Мая",
    "Июня",
    "Июля",
    "Августа",
    "Сентября",
    "Октября",
    "Ноября",
    "Декабря",
  ];

  const monthName = months[monthIndex];

  return `${day} ${monthName} ${year}`;
};
