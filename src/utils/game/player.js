import { getSelectedCharacter } from '../characterData';

export class Player {
    constructor(game, resourceLoader) {
        this.game = game;
        this.sizeModifier = 1;
        this.width = 86.8320083618164 * this.sizeModifier;
        this.height = 92.63623046875 * this.sizeModifier;
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
        this.rotation = 0;
        this.direction = 1;
        this.isJumping = false;

        this.image = resourceLoader.getImage('byte');
    }

    update(inputHandler, deltaTime) {
        this.x += this.vx * deltaTime * this.game.speedMultiplier;

        if (inputHandler.keys.includes('ArrowLeft')) {
            this.vx = -this.max_vx;
            this.direction = -1;
        } else if (inputHandler.keys.includes('ArrowRight')) {
            this.vx = this.max_vx;
            this.direction = 1;
        } else this.vx = 0;

        if (this.x < -this.width / 2) this.x = this.game.width - this.width / 2;
        if (this.x + this.width / 2 > this.game.width) this.x = -this.width / 2;

        if (this.vy < 0) {
            this.rotation = Math.max(this.rotation - 2, -30);
        } else if (this.vy > 0) {
            this.rotation = Math.min(this.rotation + 2, 30);
        } else {
            if (this.rotation > 0) {
                this.rotation = Math.max(this.rotation - 1, 0);
            } else if (this.rotation < 0) {
                this.rotation = Math.min(this.rotation + 1, 0);
            }
        }

        if (this.vy > this.weight) {
            let platformType = this.onPlatform();
            if (platformType === 'green') {
                this.vy = this.min_vy;
                this.isJumping = true;
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
        context.save();
        context.translate(this.x + this.width / 2, this.y + this.height / 2);
        const adjustedRotation =
            this.direction === 1 ? this.rotation : -this.rotation;
        context.rotate((adjustedRotation * Math.PI) / 180);
        context.scale(this.direction, 1);
        context.drawImage(
            this.image,
            -this.width / 2,
            -this.height / 2,
            this.width,
            this.height
        );
        context.restore();
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
                    -platform.height / 2;

            if (X_test && Y_test) {
                type = platform.type;
                if (type === 'green') {
                    platform.triggerScoreEffect();
                }
            }
        });

        return type;
    }
}
