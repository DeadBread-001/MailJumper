export class Money {
    constructor(game, x, y) {
        this.game = game;
        this.width = 40;
        this.height = 40;
        this.x = x;
        this.y = y;
        this.markedForDeletion = false;
        this.imageLoaded = false;
        this.image = new Image();

        this.image.onload = () => {
            this.imageLoaded = true;
        };

        this.image.onerror = () => {
            this.imageLoaded = false;
        };

        this.image.src = '/images/coin.webp';
    }

    update() {
        this.y += this.game.vy;
        if (this.y > this.game.height) {
            this.markedForDeletion = true;
        }
    }

    draw(context) {
        if (this.imageLoaded) {
            try {
                context.drawImage(
                    this.image,
                    this.x,
                    this.y,
                    this.width,
                    this.height
                );
            } catch (error) {
                this.drawFallback(context);
            }
        } else {
            this.drawFallback(context);
        }
    }

    drawFallback(context) {
        context.fillStyle = 'gold';
        context.strokeStyle = '#b8860b';
        context.lineWidth = 4;

        context.beginPath();
        context.arc(
            this.x + this.width / 2,
            this.y + this.height / 2,
            this.width / 2,
            0,
            Math.PI * 2
        );
        context.fill();
        context.stroke();

        context.fillStyle = '#b8860b';
        context.font = 'bold 20px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(
            '$',
            this.x + this.width / 2,
            this.y + this.height / 2
        );
    }
}
