export class Platform {
    constructor(game, lowerY, upperY, type) {
        this.game = game;
        this.width = 90;
        this.height = 15;
        this.type = type;
        this.x = Math.floor(Math.random() * (this.game.width - this.width + 1));
        this.y = this.calc_Y(upperY, lowerY);
        this.vx = this.type === 'blue' ? this.game.object_vx : 0;
        this.image = new Image();
        this.image.src = `/images/${this.type}_platform.png`;
        this.markedForDeletion = false;
    }

    update(deltaTime) {
        if (this.type === 'blue') {
            if (this.x < 0 || this.x > this.game.width - this.width)
                this.vx *= -1;
        }

        this.x += this.vx * deltaTime * this.game.speedMultiplier;
        this.y += this.game.vy * deltaTime * this.game.speedMultiplier;

        if (this.y >= this.game.height) {
            this.markedForDeletion = true;
        }
    }

    draw(context) {
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    calc_Y(upperY, lowerY) {
        if (!this.game.platforms.length) {
            return (
                Math.floor(Math.random() * (upperY - (upperY - 100) + 1)) +
                (upperY - 100)
            );
        } else {
            return (
                this.game.platforms[0].y -
                (Math.floor(
                    Math.random() *
                        (this.game.platform_gap -
                            (this.game.platform_gap - 30) +
                            1)
                ) +
                    (this.game.platform_gap - 30))
            );
        }
    }
}
