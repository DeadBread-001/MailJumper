export class InputHandler {
    constructor(game, controlType = 'arrows') {
        this.game = game;
        this.controlType = controlType;
        this.keys = [];
        this.mouseX = null;
        this.handleClick = (e) => {
            if (this.controlType === 'click') {
                const rect =
                    game.canvasRect ||
                    document.querySelector('#canvas1').getBoundingClientRect();
                const x = e.clientX - rect.left;
                if (x < rect.width / 2) {
                    this.keys = ['ArrowLeft'];
                } else {
                    this.keys = ['ArrowRight'];
                }
                setTimeout(() => {
                    this.keys = [];
                }, 120);
            }
        };
        this.handleMouseDown = (e) => {
            if (this.controlType === 'click') {
                const rect =
                    game.canvasRect ||
                    document.querySelector('#canvas1').getBoundingClientRect();
                const x = e.clientX - rect.left;
                if (x < rect.width / 2) {
                    this.keys = ['ArrowLeft'];
                } else {
                    this.keys = ['ArrowRight'];
                }
            }
        };
        this.handleMouseUp = (e) => {
            if (this.controlType === 'click') {
                this.keys = [];
            }
        };
        this.handleMouseLeave = (e) => {
            if (this.controlType === 'click') {
                this.keys = [];
            }
        };
        this.keyDownHandler = (e) => {
            if (
                (e.key === 'ArrowLeft' || e.key === 'ArrowRight') &&
                !this.keys.includes(e.key)
            ) {
                this.keys.push(e.key);
            }
            if (e.key === 'Enter' && game.isAuthenticated) {
                this.game.gameStart = true;
            }
        };
        this.keyUpHandler = (e) => {
            if (
                (e.key === 'ArrowLeft' || e.key === 'ArrowRight') &&
                this.keys.includes(e.key)
            ) {
                this.keys.splice(this.keys.indexOf(e.key), 1);
            }
        };
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.destroy();

        if (this.controlType === 'arrows') {
            window.addEventListener('keydown', this.keyDownHandler);
            window.addEventListener('keyup', this.keyUpHandler);
        } else if (this.controlType === 'click') {
            const canvas = document.querySelector('#canvas1');
            if (canvas) {
                canvas.addEventListener('click', this.handleClick);
                canvas.addEventListener('mousedown', this.handleMouseDown);
                canvas.addEventListener('mouseup', this.handleMouseUp);
                canvas.addEventListener('mouseleave', this.handleMouseLeave);
            }
        }
    }

    setControlType(controlType) {
        this.controlType = controlType;
        this.keys = [];
        this.setupEventListeners();
    }

    destroy() {
        window.removeEventListener('keydown', this.keyDownHandler);
        window.removeEventListener('keyup', this.keyUpHandler);
        const canvas = document.querySelector('#canvas1');
        if (canvas) {
            canvas.removeEventListener('click', this.handleClick);
            canvas.removeEventListener('mousedown', this.handleMouseDown);
            canvas.removeEventListener('mouseup', this.handleMouseUp);
            canvas.removeEventListener('mouseleave', this.handleMouseLeave);
        }
    }

    reset() {
        this.keys = [];
    }
}
