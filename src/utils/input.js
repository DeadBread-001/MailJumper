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

        this.handleClick = (e) => {
            if (this.controlType === 'click' || this.controlType === 'touch') {
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

        this.handleTouchStart = (e) => {
            if (this.controlType === 'touch') {
                e.preventDefault();
                this.touchStartTime = Date.now();
                this.isTouchHolding = false;

                const rect =
                    game.canvasRect ||
                    document.querySelector('#canvas1').getBoundingClientRect();
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
                    document.querySelector('#canvas1').getBoundingClientRect();
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

        this.handleDeviceMotion = (e) => {
            if (this.controlType === 'tilt') {
                const acceleration = e.accelerationIncludingGravity;
                if (acceleration) {
                    this.tiltX = acceleration.x;

                    if (this.tiltX > this.tiltThreshold) {
                        this.keys = ['ArrowRight'];
                    } else if (this.tiltX < -this.tiltThreshold) {
                        this.keys = ['ArrowLeft'];
                    } else {
                        this.keys = [];
                    }
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
            if (
                window.DeviceMotionEvent &&
                typeof window.DeviceMotionEvent.requestPermission === 'function'
            ) {
                window.DeviceMotionEvent.requestPermission()
                    .then((permissionState) => {
                        if (permissionState === 'granted') {
                            window.addEventListener(
                                'devicemotion',
                                this.handleDeviceMotion
                            );
                        }
                    })
                    .catch(console.error);
            } else {
                window.addEventListener(
                    'devicemotion',
                    this.handleDeviceMotion
                );
            }
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
        window.removeEventListener('devicemotion', this.handleDeviceMotion);

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
