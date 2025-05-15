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
import { ResourceLoader } from '../utils/game/resourceLoader';

const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 765;

const GameCanvas = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [gamePaused, setGamePaused] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [checkingAuth, setCheckingAuth] = useState(true);
    const [showRatingPage, setShowRatingPage] = useState(false);
    const [isSuperpowerExpanded, setIsSuperpowerExpanded] = useState(false);
    const [wasSuperpowerJustOpened, setWasSuperpowerJustOpened] =
        useState(false);
    const [showDeathScreen, setShowDeathScreen] = useState(false);
    const [lastScore, setLastScore] = useState(0);
    const [bestScore, setBestScore] = useState(() => {
        return Number(localStorage.getItem('bestScore') || 0);
    });
    const [currentScore, setCurrentScore] = useState(0);
    const [scoreBump, setScoreBump] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const animationRef = useRef(null);
    const gameInstance = useRef(null);
    const containerRef = useRef(null);
    const lastTimeRef = useRef(0);
    const autoPaused = useRef(false);
    const inputHandler = useRef(null);
    const resourceLoader = useRef(new ResourceLoader());

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

        const loadResources = async () => {
            const success = await resourceLoader.current.loadAll();
            if (success) {
                setIsLoading(false);
            }
        };

        const progressInterval = setInterval(() => {
            setLoadingProgress(resourceLoader.current.getProgress());
        }, 100);

        loadResources();

        return () => clearInterval(progressInterval);
    }, [isAuthenticated]);

    useEffect(() => {
        if (!isAuthenticated || isLoading) return;
        const canvas = document.querySelector('#canvas1');
        const ctx = canvas.getContext('2d');
        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;

        if (!gameInstance.current) {
            class Game {
                constructor(width, height) {
                    this.width = width;
                    this.height = height;
                    this.reset();
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
                reset() {
                    this.vy = 0;
                    this.gameOver = false;
                    this.gameStart = true;
                    this.platforms = [];
                    this.level = 0;
                    this.score = 0;
                    this.object_vx = 3;
                    this.object_max_vx = 6;
                    this.platform_gap = 200;
                    this.platform_max_gap = 300;
                    this.add_platforms(0, this.height - 15);
                    this.add_platforms(-this.height, -15);
                    this.background = new Background(
                        this,
                        resourceLoader.current
                    );
                    this.player = new Player(this, resourceLoader.current);
                    if (this.inputHandler) this.inputHandler.reset();
                    this.speedMultiplier = 60;
                    this.scoreSent = false;
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
                    this.platforms.forEach((platform) => {
                        platform.draw(context);
                    });
                    this.player.draw(context);
                    if (this.gameOver) {
                        if (!this.scoreSent) {
                            sendScore({
                                name: this.playerName,
                                score: this.score,
                            });
                            this.scoreSent = true;
                            setLastScore(this.score);
                            setShowDeathScreen(true);
                            if (this.score > bestScore) {
                                setBestScore(this.score);
                                localStorage.setItem('bestScore', this.score);
                            }
                        }
                    }
                }
                add_platforms(lowerY, upperY) {
                    let isFirstPlatform = this.platforms.length === 0;
                    do {
                        if (isFirstPlatform || Math.random() > 0.8) {
                            let type = 'green';
                            const platform = new Platform(
                                this,
                                lowerY,
                                upperY,
                                type,
                                resourceLoader.current
                            );
                            this.platforms.unshift(platform);
                            isFirstPlatform = false;
                        }
                    } while (
                        this.platforms.length > 0 &&
                        this.platforms[0].y >= lowerY
                        );
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
            gameInstance.current = new Game(CANVAS_WIDTH, CANVAS_HEIGHT);
        }
        if (!inputHandler.current) {
            inputHandler.current = new InputHandler(gameInstance.current);
            gameInstance.current.inputHandler = inputHandler.current;
        }

        function animate(timestamp) {
            if (!lastTimeRef.current) lastTimeRef.current = timestamp;
            let deltaTime = (timestamp - lastTimeRef.current) / 1000;
            lastTimeRef.current = timestamp;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const isActuallyPaused = gamePaused || autoPaused.current;
            if (gameInstance.current.gameStart && !isActuallyPaused)
                gameInstance.current.update(deltaTime);
            gameInstance.current.draw(ctx);
            setCurrentScore(gameInstance.current.score);
            animationRef.current = requestAnimationFrame(animate);
        }

        animationRef.current = requestAnimationFrame(animate);

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
            window.removeEventListener(
                'auth_success',
                gameInstance.current.askForPlayerName
            );
            window.removeEventListener(
                'logout',
                gameInstance.current.askForPlayerName
            );
            window.removeEventListener('blur', handleBlur);
            window.removeEventListener('focus', handleFocus);
        };
    }, [isAuthenticated, isLoading, gamePaused]);

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
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
        }
    };
    const handleCloseMenu = () => {
        setMenuOpen(false);
        setGamePaused(false);
        if (gameInstance.current) {
            gameInstance.current.gameStart = true;
            gameInstance.current.gameOver = false;
            if (!animationRef.current) {
                lastTimeRef.current = 0;
                animationRef.current = requestAnimationFrame(animate);
            }
        }
    };

    const handleRestart = () => {
        gameInstance.current.reset();
        setShowDeathScreen(false);
    };
    const handleMenu = () => {
        if (gameInstance.current) gameInstance.current.reset();
        setShowDeathScreen(false);
        setMenuOpen(true);
        setGamePaused(true);
    };

    useEffect(() => {
        if (scoreBump) return;
        setScoreBump(true);
        const timeout = setTimeout(() => setScoreBump(false), 250);
        return () => clearTimeout(timeout);
    }, [currentScore]);

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

    if (isLoading) {
        return (
            <div
                style={{
                    width: '100vw',
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
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
                    <h2 style={{ marginBottom: 24 }}>Загрузка игры</h2>
                    <div
                        style={{
                            width: '100%',
                            height: 8,
                            background: '#eee',
                            borderRadius: 4,
                            overflow: 'hidden',
                            marginBottom: 16,
                        }}
                    >
                        <div
                            style={{
                                width: `${loadingProgress}%`,
                                height: '100%',
                                background: '#b8fc75',
                                transition: 'width 0.3s ease',
                            }}
                        />
                    </div>
                    <div>{Math.round(loadingProgress)}%</div>
                </div>
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
            <div style={{ position: 'relative', display: 'inline-block' }}>
                <canvas id="canvas1" className="game-canvas"></canvas>
                <div className="game-score-block">
                    <img
                        src="/images/score.svg"
                        alt="score"
                        className="game-score-icon"
                    />
                    <span
                        className={`game-score-value${scoreBump ? ' game-score-value-bump' : ''}`}
                    >
                        {currentScore}
                    </span>
                </div>
                {showDeathScreen && (
                    <div className="death-screen-overlay">
                        <div className="death-screen-window">
                            <div className="death-score-top">
                                <img
                                    src="/images/score.svg"
                                    alt="score"
                                    className="death-score-icon-large"
                                />
                                <span className="death-score-value-large">
                                    {lastScore}
                                </span>
                            </div>
                            <img
                                src="/images/scoreByte.svg"
                                alt="byte"
                                className="death-byte-img"
                            />
                            <div className="death-score-label-large">
                                Попробуешь побить рекорд?
                            </div>
                            <div className="death-best-score-block">
                                <span className="death-best-score-label">
                                    Твой рекорд
                                </span>
                                <img
                                    src="/images/score.svg"
                                    alt="score"
                                    className="death-best-score-icon"
                                />
                                <span className="death-best-score-value">
                                    {bestScore}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div
                className={`game-canvas__controls${gamePaused ? ' game-canvas__controls_paused' : ''}`}
            >
                {showDeathScreen ? (
                    <>
                        <button className="death-menu-btn" onClick={handleMenu}>
                            В меню
                        </button>
                        <button
                            className="death-restart-btn"
                            onClick={handleRestart}
                        >
                            <img src="/images/restart.svg" alt="restart" />
                        </button>
                    </>
                ) : (
                    <>
                        {!gamePaused && !showRatingPage && (
                            <button
                                className={`game-canvas__superpower-btn${gamePaused ? ' game-canvas__superpower-btn_hidden' : ''}`}
                                onClick={() => {
                                    /* TODO: Здесь в общем сила активируется */
                                }}
                                aria-label="Активировать суперсилу"
                            >
                                <img
                                    src="/images/activatePower.svg"
                                    alt="Суперсила"
                                />
                                Активировать суперсилу
                            </button>
                        )}
                        <button
                            className={`game-canvas__pause-btn${gamePaused ? ' game-canvas__pause-btn_paused' : ''}${showRatingPage ? ' game-canvas__pause-btn_wide' : ''}`}
                            onClick={
                                showRatingPage
                                    ? () => {
                                        setShowRatingPage(false);
                                        setMenuOpen(true);
                                        setIsSuperpowerExpanded(false);
                                        setWasSuperpowerJustOpened(false);
                                        setTimeout(() => {
                                            setIsSuperpowerExpanded(true);
                                            setWasSuperpowerJustOpened(true);
                                        }, 300);
                                    }
                                    : gamePaused
                                        ? handleCloseMenu
                                        : handlePause
                            }
                            aria-label={
                                gamePaused
                                    ? showRatingPage
                                        ? 'Повысить шансы'
                                        : 'Играть'
                                    : 'Пауза'
                            }
                        >
                            {showRatingPage ? (
                                <>
                                    <span className="game-canvas__pause-btn-text">
                                        Повысить шансы
                                    </span>
                                    <img
                                        src="/images/play.svg"
                                        alt="Повысить шансы"
                                    />
                                </>
                            ) : gamePaused ? (
                                <>
                                    <span className="game-canvas__pause-btn-text">
                                        Играть
                                    </span>
                                    <img src="/images/play.svg" alt="Играть" />
                                </>
                            ) : (
                                <img src="/images/pause.svg" alt="Пауза" />
                            )}
                        </button>
                    </>
                )}
            </div>
            <MenuBottomSheet
                isOpen={menuOpen}
                onClose={handleCloseMenu}
                userPlace={353}
                userScore={710}
                userRank={353}
                userTasks={5}
                userTotal={6589}
                showRatingPage={showRatingPage}
                setShowRatingPage={setShowRatingPage}
                isSuperpowerExpanded={isSuperpowerExpanded}
                setIsSuperpowerExpanded={setIsSuperpowerExpanded}
                wasSuperpowerJustOpened={wasSuperpowerJustOpened}
                setWasSuperpowerJustOpened={setWasSuperpowerJustOpened}
            />
        </div>
    );
};

export default GameCanvas;