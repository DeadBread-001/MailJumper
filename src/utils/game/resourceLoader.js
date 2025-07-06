/**
 * Класс для загрузки и управления игровыми ресурсами (изображения).
 */
export class ResourceLoader {
    /**
     * Создает новый загрузчик ресурсов.
     * @param {Object} [extraImages={}] - Дополнительные изображения для загрузки
     */
    constructor(extraImages = {}) {
        this.images = {
            background: '/images/background.png',
            backgroundPower: '/images/backgroundPower.png',
            byte: '/images/byte.svg',
            byteOnboarding: '/images/byteOnboarding.svg',
            score: '/images/score.svg',
            scoreByte: '/images/scoreByte.svg',
            restart: '/images/restart.svg',
            activatePower: '/images/activatePower.svg',
            play: '/images/play.svg',
            cloud1: '/images/cloud1.svg',
            cloud2: '/images/cloud2.svg',
            cloud3: '/images/cloud3.svg',
            cloud4: '/images/cloud4.svg',
            cloud5: '/images/cloud5.svg',
            ...extraImages,
        };
        this.loadedImages = {};
        this.totalImages = Object.keys(this.images).length;
        this.loadedCount = 0;
        this.failedImages = [];
    }

    /**
     * Загружает отдельное изображение.
     * @param {string} key - Ключ изображения
     * @param {string} src - URL изображения
     * @returns {Promise<HTMLImageElement>} Загруженное изображение
     */
    loadImage(key, src) {
        return new Promise((resolve, reject) => {
            const img = new Image();

            img.onload = () => {
                this.loadedImages[key] = img;
                this.loadedCount++;
                resolve(img);
            };

            img.onerror = (error) => {
                this.failedImages.push(src);
                setTimeout(() => {
                    const retryImg = new Image();
                    retryImg.onload = () => {
                        this.loadedImages[key] = retryImg;
                        this.loadedCount++;
                        resolve(retryImg);
                    };
                    retryImg.onerror = () => {
                        reject(
                            new Error(
                                `Failed to load image after retry: ${src}`
                            )
                        );
                    };
                    retryImg.src = src;
                }, 1000);
            };

            const timeout = setTimeout(() => {
                if (!img.complete) {
                    img.src = src;
                }
            }, 5000);

            img.onload = () => {
                clearTimeout(timeout);
                this.loadedImages[key] = img;
                this.loadedCount++;
                resolve(img);
            };

            img.src = src;
        });
    }

    /**
     * Загружает все изображения.
     * @returns {Promise<boolean>} true если загрузка прошла успешно
     */
    async loadAll() {
        const promises = Object.entries(this.images).map(([key, src]) =>
            this.loadImage(key, src)
        );

        try {
            await Promise.all(promises);
            if (this.failedImages.length > 0) {
                console.warn('Some images failed to load:', this.failedImages);
            }
            return true;
        } catch (error) {
            console.error('Error loading images:', error);
            return false;
        }
    }

    /**
     * Получает загруженное изображение по ключу.
     * @param {string} key - Ключ изображения
     * @returns {HTMLImageElement|undefined} Загруженное изображение
     */
    getImage(key) {
        const image = this.loadedImages[key];
        if (!image) {
            console.warn(`Image not found: ${key}`);
        }
        return image;
    }

    /**
     * Получает URL изображения по ключу.
     * @param {string} key - Ключ изображения
     * @returns {string|undefined} URL изображения
     */
    getImageUrl(key) {
        const image = this.images[key];
        if (!image) {
            console.warn(`Image URL not found: ${key}`);
        }
        return image;
    }

    /**
     * Получает прогресс загрузки в процентах.
     * @returns {number} Прогресс загрузки (0-100)
     */
    getProgress() {
        return (this.loadedCount / this.totalImages) * 100;
    }
}
