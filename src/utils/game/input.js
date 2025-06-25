/**
 * Класс для обработки пользовательского ввода (клавиатура, мышь, touch, наклон).
 * Поддерживает разные типы управления: стрелки, клики мыши, touch, наклон устройства.
 */
export class InputHandler {
    /**
     * @param {Object} game - Экземпляр игры.
     * @param {string} controlType - Тип управления ('arrows', 'click', 'touch', 'tilt').
     */
    constructor(game, controlType = 'arrows') {
        this.game = game;
        this.controlType = controlType;
        this.keys = [];
        this.mouseX = null;
        this.tiltX = 0;
        this.tiltThreshold = 15;
        this.touchStartTime = 0;
        this.touchHoldThreshold = 150;
        this.isTouchHolding = false;
        this.gyro = null;
        this.gyroListener = null;

        this.handleClick = (e) => {
            if (this.controlType === 'click' || this.controlType === 'touch') {
                const rect =
                    game.canvasRect ||
                    document.querySelector('#canvas1')?.getBoundingClientRect();
                if (!rect) return;
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

        this.handleTouchStart = (e) => {
            if (this.controlType === 'touch') {
                e.preventDefault();
                this.touchStartTime = Date.now();
                this.isTouchHolding = false;

                const rect =
                    game.canvasRect ||
                    document.querySelector('#canvas1')?.getBoundingClientRect();
                if (!rect) return;
                const touch = e.touches[0];
                const x = touch.clientX - rect.left;

                if (x < rect.width / 2) {
                    this.keys = ['ArrowLeft'];
                } else {
                    this.keys = ['ArrowRight'];
                }

                setTimeout(() => {
                    if (this.keys.length > 0) {
                        this.isTouchHolding = true;
                    }
                }, this.touchHoldThreshold);
            }
        };

        this.handleTouchMove = (e) => {
            if (this.controlType === 'touch' && this.isTouchHolding) {
                e.preventDefault();
                const rect =
                    game.canvasRect ||
                    document.querySelector('#canvas1')?.getBoundingClientRect();
                if (!rect) return;
                const touch = e.touches[0];
                const x = touch.clientX - rect.left;

                if (x < rect.width / 2) {
                    this.keys = ['ArrowLeft'];
                } else {
                    this.keys = ['ArrowRight'];
                }
            }
        };

        this.handleTouchEnd = (e) => {
            if (this.controlType === 'touch') {
                e.preventDefault();
                this.keys = [];
                this.isTouchHolding = false;
                this.touchStartTime = 0;
            }
        };

        this.handleTouchCancel = (e) => {
            if (this.controlType === 'touch') {
                e.preventDefault();
                this.keys = [];
                this.isTouchHolding = false;
                this.touchStartTime = 0;
            }
        };

        this.handleMouseDown = (e) => {
            if (this.controlType === 'click') {
                const rect =
                    game.canvasRect ||
                    document.querySelector('#canvas1')?.getBoundingClientRect();
                if (!rect) return;
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

        this.handleDeviceOrientation = (e) => {
            if (this.controlType === 'tilt') {
                const tilt = e.gamma;
                this.tiltX = tilt;
                if (tilt > 10) {
                    this.keys = ['ArrowLeft'];
                } else if (tilt < 10) {
                    this.keys = ['ArrowRight'];
                } else {
                    this.keys = [];
                }
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

    /**
     * Устанавливает обработчики событий в зависимости от типа управления.
     * Очищает предыдущие обработчики.
     */
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
        } else if (this.controlType === 'touch') {
            const canvas = document.querySelector('#canvas1');
            if (canvas) {
                canvas.addEventListener('touchstart', this.handleTouchStart);
                canvas.addEventListener('touchmove', this.handleTouchMove);
                canvas.addEventListener('touchend', this.handleTouchEnd);
                canvas.addEventListener('touchcancel', this.handleTouchCancel);
            }
        } else if (this.controlType === 'tilt') {
            window.addEventListener(
                'deviceorientation',
                this.handleDeviceOrientation
            );
        }
    }

    /**
     * Меняет тип управления и пересоздаёт обработчики событий.
     * @param {string} controlType - Новый тип управления.
     */
    setControlType(controlType) {
        this.controlType = controlType;
        this.keys = [];
        this.isTouchHolding = false;
        this.touchStartTime = 0;
        this.setupEventListeners();
    }

    /**
     * Удаляет все обработчики событий.
     */
    destroy() {
        window.removeEventListener('keydown', this.keyDownHandler);
        window.removeEventListener('keyup', this.keyUpHandler);
        window.removeEventListener(
            'deviceorientation',
            this.handleDeviceOrientation
        );
        const canvas = document.querySelector('#canvas1');
        if (canvas) {
            canvas.removeEventListener('click', this.handleClick);
            canvas.removeEventListener('mousedown', this.handleMouseDown);
            canvas.removeEventListener('mouseup', this.handleMouseUp);
            canvas.removeEventListener('mouseleave', this.handleMouseLeave);
            canvas.removeEventListener('touchstart', this.handleTouchStart);
            canvas.removeEventListener('touchmove', this.handleTouchMove);
            canvas.removeEventListener('touchend', this.handleTouchEnd);
            canvas.removeEventListener('touchcancel', this.handleTouchCancel);
        }
    }

    /**
     * Сбрасывает внутреннее состояние управления.
     */
    reset() {
        this.keys = [];
        this.isTouchHolding = false;
        this.touchStartTime = 0;
    }
}
