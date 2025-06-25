/**
 * Класс для управления фоном игры.
 */
export class Background {
    /**
     * Создает новый экземпляр фона.
     * @param {Object} game - Объект игры
     * @param {Object} resourceLoader - Загрузчик ресурсов
     */
    constructor(game, resourceLoader) {
        this.game = game;
        this.width = this.game.width;
        this.height = this.game.height;
        this.resourceLoader = resourceLoader;
        this.x = 0;
        this.y = 0;
    }

    /**
     * Обновляет позицию фона.
     * @param {number} deltaTime - Время с последнего обновления
     */
    update(deltaTime) {
        if (this.y > this.height) {
            this.y = 0;
            this.game.add_platforms(-this.height, -15);
            this.game.change_difficulty();
        } else {
            this.y += this.game.vy * deltaTime * this.game.speedMultiplier;
        }
    }

    /**
     * Отрисовывает фон на канвасе.
     * @param {CanvasRenderingContext2D} context - Контекст канваса
     */
    draw(context) {
        const image = this.game.superpowerActive
            ? this.resourceLoader.getImage('backgroundPower')
            : this.resourceLoader.getImage('background');
        context.drawImage(image, this.x, this.y, this.width, this.height);
        context.drawImage(
            image,
            this.x,
            this.y - this.height + 1,
            this.width,
            this.height
        );
    }
}
