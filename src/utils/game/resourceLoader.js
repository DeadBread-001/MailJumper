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
    }

    loadImage(key, src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.loadedImages[key] = img;
                this.loadedCount++;
                resolve(img);
            };
            img.onerror = () =>
                reject(new Error(`Failed to load image: ${src}`));
            img.src = src;
        });
    }

    async loadAll() {
        const promises = Object.entries(this.images).map(([key, src]) =>
            this.loadImage(key, src)
        );

        try {
            await Promise.all(promises);
            return true;
        } catch (error) {
            console.error('Error loading images:', error);
            return false;
        }
    }

    getImage(key) {
        return this.loadedImages[key];
    }

    getProgress() {
        return (this.loadedCount / this.totalImages) * 100;
    }
}
