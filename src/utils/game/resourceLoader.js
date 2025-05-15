export class ResourceLoader {
    constructor() {
        this.images = {
            background: '/images/background.png',
            byte: '/images/byte.svg',
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
        };
        this.loadedImages = {};
        this.totalImages = Object.keys(this.images).length;
        this.loadedCount = 0;
        this.failedImages = [];
    }

    loadImage(key, src) {
        return new Promise((resolve, reject) => {
            const img = new Image();

            img.onload = () => {
                console.log(`Loaded image: ${src}`);
                this.loadedImages[key] = img;
                this.loadedCount++;
                resolve(img);
            };

            img.onerror = (error) => {
                console.error(`Failed to load image: ${src}`, error);
                this.failedImages.push(src);
                // Пробуем загрузить изображение еще раз
                setTimeout(() => {
                    const retryImg = new Image();
                    retryImg.onload = () => {
                        console.log(`Retry successful for: ${src}`);
                        this.loadedImages[key] = retryImg;
                        this.loadedCount++;
                        resolve(retryImg);
                    };
                    retryImg.onerror = () => {
                        console.error(`Retry failed for: ${src}`);
                        reject(
                            new Error(
                                `Failed to load image after retry: ${src}`
                            )
                        );
                    };
                    retryImg.src = src;
                }, 1000);
            };

            // Устанавливаем таймаут на загрузку
            const timeout = setTimeout(() => {
                if (!img.complete) {
                    console.warn(`Loading timeout for: ${src}`);
                    img.src = src; // Пробуем перезагрузить
                }
            }, 5000);

            img.onload = () => {
                clearTimeout(timeout);
                console.log(`Loaded image: ${src}`);
                this.loadedImages[key] = img;
                this.loadedCount++;
                resolve(img);
            };

            img.src = src;
        });
    }

    async loadAll() {
        console.log('Starting to load all images...');
        const promises = Object.entries(this.images).map(([key, src]) =>
            this.loadImage(key, src)
        );

        try {
            await Promise.all(promises);
            console.log('All images loaded successfully');
            if (this.failedImages.length > 0) {
                console.warn('Some images failed to load:', this.failedImages);
            }
            return true;
        } catch (error) {
            console.error('Error loading images:', error);
            return false;
        }
    }

    getImage(key) {
        const image = this.loadedImages[key];
        if (!image) {
            console.warn(`Image not found: ${key}`);
        }
        return image;
    }

    getProgress() {
        return (this.loadedCount / this.totalImages) * 100;
    }
}
