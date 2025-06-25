/**
 * Класс для управления платформами в игре.
 */
export class Platform {
    /**
     * Создает новую платформу.
     * @param {Object} game - Объект игры
     * @param {number} lowerY - Нижняя граница Y для размещения
     * @param {number} upperY - Верхняя граница Y для размещения
     * @param {string} type - Тип платформы ('blue' для движущихся)
     * @param {Object} resourceLoader - Загрузчик ресурсов
     */
    constructor(game, lowerY, upperY, type, resourceLoader) {
        this.game = game;
        this.baseWidth = 101;
        this.baseHeight = 58;

        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
            const scale = window.innerWidth / 500;
            this.sizeMultiplier = scale * (0.9 + Math.random() * 0.2);
        } else {
            this.sizeMultiplier = 0.9 + Math.random() * 0.2;
        }

        this.width = this.baseWidth * this.sizeMultiplier;
        this.height = this.baseHeight * this.sizeMultiplier;

        this.type = type;
        this.x = Math.floor(Math.random() * (this.game.width - this.width + 1));
        this.y = this.calc_Y(upperY, lowerY);
        this.vx = this.type === 'blue' ? this.game.object_vx : 0;

        this.cloudNumber = Math.floor(Math.random() * 5) + 1;
        this.image = resourceLoader.getImage(`cloud${this.cloudNumber}`);

        this.isFlipped = Math.random() > 0.5;

        this.scoreImage = resourceLoader.getImage('score');
        this.showScore = false;
        this.scoreOpacity = 0;
        this.scoreY = 0;
        this.hasBeenJumpedOn = false;

        this.markedForDeletion = false;
    }

    /**
     * Обновляет состояние платформы.
     * @param {number} deltaTime - Время с последнего обновления
     */
    update(deltaTime) {
        if (this.type === 'blue') {
            if (this.x < 0 || this.x > this.game.width - this.width)
                this.vx *= -1;
        }

        this.x += this.vx * deltaTime * this.game.speedMultiplier;
        this.y += this.game.vy * deltaTime * this.game.speedMultiplier;

        if (this.showScore) {
            this.scoreY -= 2 * deltaTime * this.game.speedMultiplier;
            this.scoreOpacity -= 0.02 * deltaTime * this.game.speedMultiplier;
            if (this.scoreOpacity <= 0) {
                this.showScore = false;
            }
        }

        if (this.y >= this.game.height) {
            this.markedForDeletion = true;
        }
    }

    /**
     * Отрисовывает платформу на канвасе.
     * @param {CanvasRenderingContext2D} context - Контекст канваса
     */
    draw(context) {
        context.save();
        context.translate(this.x + this.width / 2, this.y + this.height / 2);
        if (this.isFlipped) {
            context.scale(-1, 1);
        }
        context.drawImage(
            this.image,
            -this.width / 2,
            -this.height / 2,
            this.width,
            this.height
        );

        if (this.showScore) {
            context.globalAlpha = this.scoreOpacity;
            context.drawImage(this.scoreImage, -15, this.scoreY, 50, 50);
            context.globalAlpha = 1;
        }
        context.restore();
    }

    /**
     * Вычисляет Y-координату для размещения платформы.
     * @param {number} upperY - Верхняя граница
     * @param {number} lowerY - Нижняя граница
     * @returns {number} Y-координата платформы
     */
    calc_Y(upperY, lowerY) {
        if (!this.game.platforms.length) {
            return (
                Math.floor(Math.random() * (upperY - (upperY - 200) + 1)) +
                (upperY - 200)
            );
        } else {
            return (
                this.game.platforms[0].y -
                (Math.floor(
                    Math.random() *
                        (this.game.platform_gap -
                            (this.game.platform_gap - 100) +
                            1)
                ) +
                    (this.game.platform_gap - 100))
            );
        }
    }

    /**
     * Запускает эффект начисления очков при прыжке на платформу.
     */
    triggerScoreEffect() {
        if (!this.hasBeenJumpedOn) {
            this.showScore = true;
            this.scoreOpacity = 1;
            this.scoreY = -this.height / 2;
            this.hasBeenJumpedOn = true;
            this.game.score += this.game.superpowerActive ? 10 : 5;
        }
    }
}
