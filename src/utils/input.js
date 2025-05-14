export class InputHandler {
    constructor(game) {
        this.game = game;
        this.keys = [];
        this.keyDownHandler = (e) => {
            if (
                (e.key == 'ArrowLeft' || e.key == 'ArrowRight') &&
                !this.keys.includes(e.key)
            ) {
                this.keys.push(e.key);
            }
            if (e.key == 'Enter' && game.isAuthenticated) {
                this.game.gameStart = true;
            }
        };
        this.keyUpHandler = (e) => {
            if (
                (e.key == 'ArrowLeft' || e.key == 'ArrowRight') &&
                this.keys.includes(e.key)
            ) {
                this.keys.splice(this.keys.indexOf(e.key), 1);
            }
        };
        window.addEventListener('keydown', this.keyDownHandler);
        window.addEventListener('keyup', this.keyUpHandler);
    }
    destroy() {
        window.removeEventListener('keydown', this.keyDownHandler);
        window.removeEventListener('keyup', this.keyUpHandler);
    }
    reset() {
        this.keys = [];
    }
}
