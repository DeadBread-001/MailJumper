import { getSelectedCharacter } from '../characterData';

export class Player {
    constructor(game) {
        this.game = game;
        this.sizeModifier = 0.2;
        this.bodyWidth = 395 * this.sizeModifier;
        this.bodyHeight = 332 * this.sizeModifier;

        this.hatWidth = 395 * this.sizeModifier;
        this.hatHeight = 156 * this.sizeModifier;

        this.width = this.bodyWidth;
        this.height = this.bodyHeight + this.hatHeight;
        this.x =
            this.game.platforms
                .filter((platform) => platform.type === 'green')
                .slice(-1)[0].x + 6;
        this.y =
            this.game.platforms
                .filter((platform) => platform.type === 'green')
                .slice(-1)[0].y - this.height;
        this.min_y = this.game.height / 2 - 30;
        this.min_vy = -18;
        this.max_vy = this.game.platforms[0].height;
        this.vy = this.min_vy;
        this.weight = 0.5;
        this.vx = 0;
        this.max_vx = 8;

        const { body, hat } = getSelectedCharacter();

        this.bodyImage = new Image();
        this.bodyImage.src = `/images/${body}`;

        this.hatImage = new Image();
        this.hatImage.src = `/images/${hat}`;
    }

    update(inputHandler, deltaTime) {
        this.x += this.vx * deltaTime * this.game.speedMultiplier;

        if (inputHandler.keys.includes('ArrowLeft')) {
            this.vx = -this.max_vx;
        } else if (inputHandler.keys.includes('ArrowRight')) {
            this.vx = this.max_vx;
        } else this.vx = 0;

        if (this.x < -this.width / 2) this.x = this.game.width - this.width / 2;
        if (this.x + this.width / 2 > this.game.width) this.x = -this.width / 2;

        if (this.vy > this.weight) {
            let platformType = this.onPlatform();
            if (platformType === 'green') {
                this.vy = this.min_vy;
            }
        }

        if (this.vy < this.max_vy)
            this.vy += this.weight * deltaTime * this.game.speedMultiplier;

        if (this.y > this.min_y || this.vy > this.weight)
            this.y += this.vy * deltaTime * this.game.speedMultiplier;

        if (this.y <= this.min_y && this.vy < this.weight)
            this.game.vy = -this.vy;
        else this.game.vy = 0;

        if (this.collision()) {
            this.game.gameOver = true;
        }

        if (this.y > this.game.height && !this.game.gameOver) {
            this.game.gameOver = true;
        }
    }

    draw(context) {
        context.drawImage(
            this.hatImage,
            this.x,
            this.y,
            this.hatWidth,
            this.hatHeight
        );
        context.drawImage(
            this.bodyImage,
            this.x,
            this.y + this.hatHeight,
            this.bodyWidth,
            this.bodyHeight
        );
    }

    collision() {
        let result = false;
        let playerHitBox = {
            x: this.x + 15,
            y: this.y,
            width: this.width - 30,
            height: this.height,
        };
        return result;
    }

    onPlatform() {
        let type = null;
        let playerHitBox = {
            x: this.x + 15,
            y: this.y,
            width: this.width - 30,
            height: this.height,
        };

        this.game.platforms.forEach((platform) => {
            const X_test =
                (playerHitBox.x > platform.x &&
                    playerHitBox.x < platform.x + platform.width) ||
                (playerHitBox.x + playerHitBox.width > platform.x &&
                    playerHitBox.x + playerHitBox.width <
                        platform.x + platform.width);
            const Y_test =
                platform.y - (playerHitBox.y + playerHitBox.height) <= 0 &&
                platform.y - (playerHitBox.y + playerHitBox.height) >=
                    -platform.height;

            if (X_test && Y_test) {
                type = platform.type;
            }
        });

        return type;
    }
}
