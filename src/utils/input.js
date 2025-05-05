export class InputHandler {
    constructor(game) {
        this.keys = [];
        this.game = game;

        window.addEventListener('keydown', (e) => {
            if (
                (e.key == 'ArrowLeft' || e.key == 'ArrowRight') &&
                !this.keys.includes(e.key)
            ) {
                this.keys.push(e.key);
            }
            if (e.key == 'Enter' && game.isAuthenticated) {
                this.game.gameStart = true;
            }
        });

        window.addEventListener('keyup', (e) => {
            if (
                (e.key == 'ArrowLeft' || e.key == 'ArrowRight') &&
                this.keys.includes(e.key)
            ) {
                this.keys.splice(this.keys.indexOf(e.key), 1);
            }
        });
    }
}
