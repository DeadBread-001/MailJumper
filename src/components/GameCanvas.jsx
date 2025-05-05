import React, { useEffect, useState, useRef } from 'react';
import { Background } from '../utils/game/background';
import { Player } from '../utils/game/player';
import { InputHandler } from '../utils/input';
import { Platform } from '../utils/game/platform';
import { sendScore } from '../api/game';
import { check } from '../api/auth';
import CharacterSelection from './CharacterSelection';
import MenuBottomSheet from './MenuBottomSheet';
import AuthVKID from './AuthVKID';
import '../styles/menuBottomSheet.scss';
import '../styles/gameCanvas.scss';

const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 765;

const GameCanvas = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [gamePaused, setGamePaused] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [checkingAuth, setCheckingAuth] = useState(true);
    const animationRef = useRef(null);
    const gameInstance = useRef(null);
    const containerRef = useRef(null);
    const lastTimeRef = useRef(0);
    const autoPaused = useRef(false);

    const isActuallyPaused = gamePaused || autoPaused.current;

    useEffect(() => {
        const checkAuth = async () => {
            try {
                await check();
                setIsAuthenticated(true);
            } catch {
                setIsAuthenticated(false);
            } finally {
                setCheckingAuth(false);
            }
        };
        checkAuth();
    }, []);

    useEffect(() => {
        if (!isAuthenticated) return;
        const canvas = document.querySelector('#canvas1');
        const ctx = canvas.getContext('2d');
        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;

        class Game {
            constructor(width, height) {
                this.width = width;
                this.height = height;
                this.vy = 0;
                this.gameOver = false;
                this.gameStart = false;
                this.platforms = [];
                this.level = 0;
                this.score = 0;
                this.object_vx = 3;
                this.object_max_vx = 6;
                this.platform_gap = 85;
                this.platform_max_gap = 175;
                this.add_platforms(0, this.height - 15);
                this.add_platforms(-this.height, -15);
                this.background = new Background(this);
                this.player = new Player(this);
                this.inputHandler = new InputHandler(this);
                this.speedMultiplier = 60;
                this.playerName = '';
                this.askForPlayerName();
                this.scoreSent = false;

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

            update(deltaTime) {
                if (!this.isAuthenticated) return;

                this.background.update(deltaTime);
                this.platforms.forEach((platform) =>
                    platform.update(deltaTime)
                );
                this.player.update(this.inputHandler, deltaTime);

                this.platforms = this.platforms.filter(
                    (platform) => !platform.markedForDeletion
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

                    this.player.draw(context);

                    context.fillStyle = 'black';
                    context.font = '20px Arial';
                    context.textAlign = 'start';
                    context.fillText(`Score: ${this.score}`, 20, 40);

                    if (this.gameOver) {
                        context.font = 'bold 25px Helvetica';
                        context.fillStyle = 'red';
                        context.textAlign = 'center';
                        context.fillText(
                            `GAME OVER`,
                            this.width * 0.5,
                            this.height * 0.5
                        );
                        if (!this.scoreSent) {
                            sendScore({
                                name: this.playerName,
                                score: this.score,
                            });
                            this.scoreSent = true;
                        }
                    }
                }
            }

            add_platforms(lowerY, upperY) {
                do {
                    let type = 'green';

                    const platform = new Platform(this, lowerY, upperY, type);
                    this.platforms.unshift(platform);
                } while (this.platforms[0].y >= lowerY);
            }

            change_difficulty() {
                this.level++;
                if (this.platform_max_gap > this.platform_gap) {
                    this.platform_gap += 5;
                }
                if (
                    this.level % 8 === 0 &&
                    this.object_max_vx > this.object_vx
                ) {
                    this.object_vx++;
                }
            }
        }

        let game = gameInstance.current;
        if (!game) {
            game = new Game(canvas.width, canvas.height);
            gameInstance.current = game;
        }

        function animate(timestamp) {
            if (!lastTimeRef.current) lastTimeRef.current = timestamp;
            let deltaTime = (timestamp - lastTimeRef.current) / 1000;
            lastTimeRef.current = timestamp;

            if (deltaTime > 0.1) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                game.draw(ctx);
                animationRef.current = requestAnimationFrame(animate);
                return;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const isActuallyPaused = gamePaused || autoPaused.current;
            if (game.gameStart && !isActuallyPaused) game.update(deltaTime);
            game.draw(ctx);
            animationRef.current = requestAnimationFrame(animate);
        }

        animationRef.current = requestAnimationFrame(animate);

        // --- Автопауза при потере фокуса ---
        const handleBlur = () => {
            autoPaused.current = true;
        };
        const handleFocus = () => {
            lastTimeRef.current = 0;
            autoPaused.current = false;
        };
        window.addEventListener('blur', handleBlur);
        window.addEventListener('focus', handleFocus);

        return () => {
            if (animationRef.current)
                cancelAnimationFrame(animationRef.current);
            window.removeEventListener('auth_success', game.askForPlayerName);
            window.removeEventListener('logout', game.askForPlayerName);
            window.removeEventListener('blur', handleBlur);
            window.removeEventListener('focus', handleFocus);
        };
    }, [gamePaused, isAuthenticated]);

    useEffect(() => {
        if (menuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [menuOpen]);

    const handlePause = () => {
        setMenuOpen(true);
        setGamePaused(true);
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
    const handleCloseMenu = () => {
        setMenuOpen(false);
        setGamePaused(false);
    };
    const handleNavigate = (section) => {
        // Здесь можно реализовать переходы по разделам меню
        // Например, через react-router или window.location
    };

    if (checkingAuth) {
        return (
            <div
                style={{
                    width: '100vw',
                    height: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                Загрузка...
            </div>
        );
    }
    if (!isAuthenticated) {
        return (
            <div
                style={{
                    width: '100vw',
                    height: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background:
                        'linear-gradient(180deg, #eaf6ff 0%, #cbe7ff 100%)',
                }}
            >
                <div
                    style={{
                        background: '#fff',
                        borderRadius: 16,
                        boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
                        padding: 32,
                        minWidth: 320,
                        textAlign: 'center',
                    }}
                >
                    <h2 style={{ marginBottom: 24 }}>Вход через VK ID</h2>
                    <AuthVKID onLoginSuccess={() => window.location.reload()} />
                </div>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="game-canvas-container">
            <canvas id="canvas1" className="game-canvas"></canvas>
            {!menuOpen && (
                <button
                    className="pause-btn"
                    onClick={handlePause}
                    aria-label="Пауза"
                >
                    &#10073;&#10073;
                </button>
            )}
            <MenuBottomSheet
                isOpen={menuOpen}
                onClose={handleCloseMenu}
                onNavigate={handleNavigate}
                userPlace={353}
                userScore={710}
                userRank={353}
                userTasks={5}
                userTotal={6589}
            />
        </div>
    );
};

export default GameCanvas;
