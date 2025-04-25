import { useEffect } from 'react';
import { Background } from '../utils/background';
import { Player } from '../utils/player';
import { InputHandler } from '../utils/input';
import { Enemy } from '../utils/enemy';
import { Platform } from '../utils/platform';
import { Money } from '../utils/money';
import { sendScore } from '../api/game';
import { check } from '../api/auth';
import CharacterSelection from './CharacterSelection';

const GameCanvas = () => {
    useEffect(() => {
        const canvas = document.querySelector('#canvas1');
        const ctx = canvas.getContext('2d');
        canvas.width = 532;
        canvas.height = 850;

        class Game {
            constructor(width, height) {
                this.width = width;
                this.height = height;
                this.vy = 0;
                this.gameOver = false;
                this.gameStart = false;
                this.platforms = [];
                this.enemies = [];
                this.money = [];
                this.level = 0;
                this.score = 0;
                this.coins = 0;
                this.enemyChance = 0;
                this.enemyMaxChance = 50;
                this.moneyChance = 15;
                this.moneyMaxChance = 30;
                this.object_vx = 3;
                this.object_max_vx = 6;
                this.platform_gap = 85;
                this.platform_max_gap = 175;
                this.blue_white_platform_chance = 0;
                this.blue_white_platform_max_chance = 85;
                this.add_platforms(0, this.height - 15);
                this.add_broken_platforms(0, this.height - 15);
                this.add_platforms(-this.height, -15);
                this.add_broken_platforms(-this.height, -15);
                this.background = new Background(this);
                this.player = new Player(this);
                this.inputHandler = new InputHandler(this);
                this.isAuthenticated = false;
                this.checkingAuth = true;
                this.askForPlayerName();

                window.addEventListener('auth_success', () => {
                    this.askForPlayerName();
                });

                window.addEventListener('logout', () => {
                    this.askForPlayerName();
                });
            }

            async askForPlayerName() {
                try {
                    const userData = await check();
                    this.playerName = userData.vkid;
                    this.isAuthenticated = true;
                } catch (error) {
                    this.isAuthenticated = false;
                } finally {
                    this.checkingAuth = false;
                }
            }

            update() {
                if (!this.isAuthenticated) return;

                this.background.update();

                this.platforms.forEach((platform) => {
                    platform.update();
                });

                this.player.update(this.inputHandler);

                this.enemies.forEach((enemy) => {
                    enemy.update();
                });

                this.money.forEach((coin) => {
                    coin.update();
                    if (
                        this.player.x < coin.x + coin.width &&
                        this.player.x + this.player.width > coin.x &&
                        this.player.y < coin.y + coin.height &&
                        this.player.y + this.player.height > coin.y
                    ) {
                        coin.markedForDeletion = true;
                        this.coins++;
                    }
                });

                this.platforms = this.platforms.filter(
                    (platform) => !platform.markedForDeletion
                );
                this.enemies = this.enemies.filter(
                    (enemy) => !enemy.markedForDeletion
                );
                this.money = this.money.filter(
                    (coin) => !coin.markedForDeletion
                );
            }

            draw(context) {
                this.background.draw(context);

                if (!this.gameStart) {
                    context.font = 'bold 25px Helvetica';
                    context.fillStyle = 'black';
                    context.textAlign = 'center';
                    if (this.checkingAuth) {
                        context.fillText(
                            'ЗАГРУЗКА...',
                            this.width * 0.5,
                            this.height * 0.5
                        );
                    } else if (!this.isAuthenticated) {
                        context.fillText(
                            'НЕОБХОДИМА АВТОРИЗАЦИЯ',
                            this.width * 0.5,
                            this.height * 0.45
                        );
                        context.fillText(
                            'ВОЙДИТЕ ЧЕРЕЗ VK ID',
                            this.width * 0.5,
                            this.height * 0.55
                        );
                    } else {
                        context.fillText(
                            'PRESS ENTER TO START',
                            this.width * 0.5,
                            this.height * 0.5
                        );
                    }
                } else {
                    this.platforms.forEach((platform) => {
                        platform.draw(context);
                    });

                    this.money.forEach((coin) => {
                        coin.draw(context);
                    });

                    this.player.draw(context);

                    this.enemies.forEach((enemy) => {
                        enemy.draw(context);
                    });

                    context.fillStyle = 'black';
                    context.font = '20px Arial';
                    context.textAlign = 'start';
                    context.fillText(`Score: ${this.score}`, 20, 40);
                    context.fillText(`Coins: ${this.coins}`, 20, 70);

                    if (this.gameOver) {
                        context.font = 'bold 25px Helvetica';
                        context.fillStyle = 'red';
                        context.textAlign = 'center';
                        context.fillText(
                            `GAME OVER`,
                            this.width * 0.5,
                            this.height * 0.5
                        );
                        sendScore({
                            name: this.playerName,
                            score: this.score,
                            money: this.coins,
                        });
                    }
                }
            }

            add_enemy() {
                this.enemies.push(new Enemy(this));
            }

            add_platforms(lowerY, upperY) {
                do {
                    let type = 'green';
                    if (Math.random() < this.blue_white_platform_chance / 100) {
                        type = Math.random() < 0.5 ? 'blue' : 'white';
                    }

                    const platform = new Platform(this, lowerY, upperY, type);
                    this.platforms.unshift(platform);

                    if (Math.random() < this.moneyChance / 100) {
                        const coinX = Math.random() * (this.width - 40);
                        const offsetY = Math.random() * 20 - 80;
                        const coinY = platform.y + offsetY;
                        const coin = new Money(this, coinX, coinY);
                        this.money.push(coin);
                    }
                } while (this.platforms[0].y >= lowerY);
            }

            add_broken_platforms(lowerY, upperY) {
                let num = Math.floor(Math.random() * (5 + 1));

                for (let i = 0; i < num; i++) {
                    const platform = new Platform(
                        this,
                        lowerY,
                        upperY,
                        'brown'
                    );
                    this.platforms.push(platform);

                    if (Math.random() < this.moneyChance / 200) {
                        const coinX = Math.random() * (this.width - 40);
                        const offsetY = Math.random() * 20 - 80;
                        const coinY = platform.y + offsetY;
                        const coin = new Money(this, coinX, coinY);
                        this.money.push(coin);
                    }
                }
            }

            change_difficulty() {
                this.level++;
                if (this.platform_max_gap > this.platform_gap) {
                    this.platform_gap += 5;
                }
                if (
                    this.blue_white_platform_max_chance >
                    this.blue_white_platform_chance
                ) {
                    this.blue_white_platform_chance += 1;
                }
                if (
                    this.level % 8 === 0 &&
                    this.object_max_vx > this.object_vx
                ) {
                    this.object_vx++;
                }
                if (
                    this.level % 5 === 0 &&
                    this.enemyMaxChance > this.enemyChance
                ) {
                    this.enemyChance += 5;
                }
                if (
                    this.level % 3 === 0 &&
                    this.moneyMaxChance > this.moneyChance
                ) {
                    this.moneyChance += 2;
                }
            }
        }

        const game = new Game(canvas.width, canvas.height);

        function animate() {
            const fps = 60;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (game.gameStart) game.update();
            game.draw(ctx);
            if (!game.gameOver)
                setTimeout(() => {
                    requestAnimationFrame(animate);
                }, 1000 / fps);
        }

        animate();

        return () => {
            window.removeEventListener('auth_success', game.askForPlayerName);
            window.removeEventListener('logout', game.askForPlayerName);
        };
    }, []);

    /*
    return (
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <canvas id="canvas1"></canvas>
            <div>
                <CharacterSelection />
            </div>
        </div>
    );
    */

    return (
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
          <canvas id="canvas1"></canvas>
      </div>
    );

};

export default GameCanvas;
