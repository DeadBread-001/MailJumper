import React, { useEffect, useState, useRef } from 'react';
import { Background } from '../utils/game/background';
import { Player } from '../utils/game/player';
import { InputHandler } from '../utils/input';
import { Platform } from '../utils/game/platform';
import { sendScore, getSuperpower, useSuperpower } from '../api/game';
import { check } from '../api/auth';
import CharacterSelection from './CharacterSelection';
import MenuBottomSheet from './MenuBottomSheet';
import AuthVKID from './AuthVKID';
import Onboarding from './Onboarding';
import '../styles/menuBottomSheet.scss';
import '../styles/gameCanvas.scss';
import { ResourceLoader } from '../utils/game/resourceLoader';
import muteIcon from '../../public/images/mute.svg';
import unmuteIcon from '../../public/images/unmute.svg';
import { getScore } from '../api/rating';
import {
    getOnboardingKey,
    getControlTypeKey,
    getDeviceType,
} from '../utils/deviceDetection';

const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 765;

/**
 * Главный компонент игрового экрана. Управляет состоянием игры, онбордингом, меню, суперсилой и т.д.
 * @returns {JSX.Element}
 */
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
    const [bestScore, setBestScore] = useState(0);
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
    const resourceLoader = useRef(null);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [controlType, setControlType] = useState(
        () => localStorage.getItem(getControlTypeKey()) || ''
    );
    const [superpowerActive, setSuperpowerActive] = useState(false);
    const [superpowerAvailable, setSuperpowerAvailable] = useState(true);
    const superpowerDuration = 10000; // 10 секунд
    const superpowerTimeoutRef = useRef(null);
    const [soundEnabled, setSoundEnabled] = useState(() => {
        const stored = localStorage.getItem('soundEnabled');
        return stored === null ? true : stored === 'true';
    });
    const [vkid, setVkid] = useState(null);
    const [superpowerCount, setSuperpowerCount] = useState(0);
    const [showMotionPermission, setShowMotionPermission] = useState(false);
    const [motionPermissionError, setMotionPermissionError] = useState('');

    useEffect(() => {
        resourceLoader.current = new ResourceLoader();
    }, []);

    const isActuallyPaused = gamePaused;

    /**
     * Проверяет авторизацию пользователя и статус онбординга.
     * @async
     */
    const checkAuth = async () => {
        try {
            const userData = await check();
            setIsAuthenticated(true);
            setVkid(userData.vkid);

            if (userData.vkid) {
                try {
                    const serverBestScore = await getScore(userData.vkid);
                    if (serverBestScore !== undefined) {
                        setBestScore(serverBestScore);
                    }
                } catch (error) {
                    console.error('Error loading best score:', error);
                }
            }

            const hasCompletedOnboarding =
                localStorage.getItem(getOnboardingKey()) === 'true';
            setShowOnboarding(!hasCompletedOnboarding);
        } catch {
            setIsAuthenticated(false);
        } finally {
            setCheckingAuth(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    useEffect(() => {
        if (!isAuthenticated || checkingAuth) return;

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
    }, [isAuthenticated, checkingAuth, showOnboarding]);

    useEffect(() => {
        if (!isAuthenticated || isLoading || showOnboarding) return;
        const canvas = document.querySelector('#canvas1');
        const ctx = canvas.getContext('2d');

        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        } else {
            canvas.width = CANVAS_WIDTH;
            canvas.height = CANVAS_HEIGHT;
        }

        if (!gameInstance.current) {
            /**
             * Класс основной игровой логики (движок).
             */
            class Game {
                /**
                 * @param {number} width - Ширина канваса
                 * @param {number} height - Высота канваса
                 */
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
                /**
                 * Сброс состояния игры.
                 */
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
                /**
                 * Запрос имени игрока (vkid).
                 * @async
                 */
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
                /**
                 * Обновление состояния игры.
                 * @param {number} deltaTime
                 */
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
                /**
                 * Отрисовка игры.
                 * @param {CanvasRenderingContext2D} context
                 */
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

                            if (this.score > bestScore) {
                                setBestScore(this.score);
                            }

                            if (this.playerName) {
                                getScore(this.playerName)
                                    .then((score) => {
                                        if (score !== undefined) {
                                            setBestScore(score);
                                        }
                                        setShowDeathScreen(true);
                                    })
                                    .catch(() => {
                                        setShowDeathScreen(true);
                                    });
                            } else {
                                setShowDeathScreen(true);
                            }
                        }
                    }
                }
                /**
                 * Добавление платформ.
                 * @param {number} lowerY
                 * @param {number} upperY
                 */
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
                /**
                 * Изменение сложности.
                 */
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
            gameInstance.current = new Game(canvas.width, canvas.height);
        }
        if (!inputHandler.current) {
            inputHandler.current = new InputHandler(
                gameInstance.current,
                controlType
            );
            gameInstance.current.inputHandler = inputHandler.current;
        }

        /**
         * Анимация игрового цикла.
         * @param {number} timestamp
         */
        function animate(timestamp) {
            if (!lastTimeRef.current) lastTimeRef.current = timestamp;
            let deltaTime = (timestamp - lastTimeRef.current) / 1000;
            lastTimeRef.current = timestamp;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const isActuallyPaused = gamePaused;
            if (gameInstance.current.gameStart && !isActuallyPaused)
                gameInstance.current.update(deltaTime);
            gameInstance.current.draw(ctx);
            setCurrentScore(gameInstance.current.score);
            animationRef.current = requestAnimationFrame(animate);
        }

        animationRef.current = requestAnimationFrame(animate);

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
        };
    }, [isAuthenticated, isLoading, gamePaused, showOnboarding, controlType]);

    useEffect(() => {
        if (inputHandler.current && controlType) {
            inputHandler.current.setControlType(controlType);
        }
    }, [controlType]);

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

    /**
     * Обработка паузы.
     */
    const handlePause = () => {
        setMenuOpen(true);
        setGamePaused(true);
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
        }
    };
    /**
     * Закрытие меню.
     */
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

    /**
     * Перезапуск игры.
     */
    const handleRestart = () => {
        gameInstance.current.reset();
        setShowDeathScreen(false);
    };
    /**
     * Открытие меню.
     */
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

    useEffect(() => {
        if (!showOnboarding) {
            setControlType(localStorage.getItem(getControlTypeKey()) || '');
        }
    }, [showOnboarding]);

    useEffect(() => {
        const fetchSuperpowerCount = async () => {
            try {
                if (!vkid) return;
                const count = await getSuperpower(vkid);
                setSuperpowerCount(count);
            } catch (error) {
                console.error('Error fetching superpower count:', error);
            }
        };

        if (isAuthenticated && !isLoading && vkid) {
            fetchSuperpowerCount();
        }
    }, [isAuthenticated, isLoading, vkid]);

    /**
     * Активация суперсилы.
     * @async
     */
    const handleActivateSuperpower = async () => {
        try {
            if (!vkid) return;
            const response = await useSuperpower(vkid);
            if (response === 200) {
                setSuperpowerActive(true);
                setSuperpowerAvailable(false);
                if (superpowerTimeoutRef.current)
                    clearTimeout(superpowerTimeoutRef.current);
                superpowerTimeoutRef.current = setTimeout(() => {
                    setSuperpowerActive(false);
                    setSuperpowerAvailable(true);
                }, superpowerDuration);
                setSuperpowerCount((prev) => prev - 1);
            }
        } catch (error) {
            console.error('Error activating superpower:', error);
        }
    };

    useEffect(() => {
        if (gameInstance.current) {
            gameInstance.current.superpowerActive = superpowerActive;
        }
    }, [superpowerActive]);

    useEffect(() => {
        if (gameInstance.current) {
            gameInstance.current.soundEnabled = soundEnabled;
        }
    }, [soundEnabled]);

    useEffect(() => {
        localStorage.setItem('soundEnabled', soundEnabled);
    }, [soundEnabled]);

    useEffect(() => {
        const handleResize = () => {
            if (!gameInstance.current) return;

            const canvas = document.querySelector('#canvas1');
            const isMobile = window.innerWidth <= 768;

            if (isMobile) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                gameInstance.current.width = window.innerWidth;
                gameInstance.current.height = window.innerHeight;
            } else {
                canvas.width = CANVAS_WIDTH;
                canvas.height = CANVAS_HEIGHT;
                gameInstance.current.width = CANVAS_WIDTH;
                gameInstance.current.height = CANVAS_HEIGHT;
            }

            gameInstance.current.reset();
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    /**
     * Сбросить онбординг для текущего устройства.
     */
    const resetOnboarding = () => {
        localStorage.removeItem(getOnboardingKey());
        setShowOnboarding(true);
    };

    useEffect(() => {
        window.resetOnboarding = resetOnboarding;

        window.getOnboardingData = () => {
            return {
                deviceType: getDeviceType(),
                onboardingCompleted: localStorage.getItem(getOnboardingKey()),
                controlType: localStorage.getItem(getControlTypeKey()),
            };
        };
    }, []);

    const recreateInputHandler = (type) => {
        if (inputHandler.current) {
            inputHandler.current.destroy();
        }
        inputHandler.current = new InputHandler(gameInstance.current, type);
        if (gameInstance.current) {
            gameInstance.current.inputHandler = inputHandler.current;
        }
    };

    const requestMotionPermission = async () => {
        setMotionPermissionError('');
        if (
            typeof DeviceMotionEvent !== 'undefined' &&
            typeof DeviceMotionEvent.requestPermission === 'function'
        ) {
            try {
                const response = await DeviceMotionEvent.requestPermission();
                if (response === 'granted') {
                    setShowMotionPermission(false);
                    setControlType('tilt');
                    recreateInputHandler('tilt');
                } else {
                    setMotionPermissionError(
                        'Доступ к датчикам движения не разрешён.'
                    );
                }
            } catch (e) {
                setMotionPermissionError(
                    'Ошибка при запросе разрешения на доступ к датчикам движения.'
                );
            }
        } else {
            setShowMotionPermission(false);
            setControlType('tilt');
            recreateInputHandler('tilt');
        }
    };

    const handleOnboardingFinish = (selectedControlType) => {
        setShowOnboarding(false);
        if (selectedControlType === 'tilt') {
            setShowMotionPermission(true);
        } else if (selectedControlType) {
            setControlType(selectedControlType);
            recreateInputHandler(selectedControlType);
        }
    };

    useEffect(() => {
        if (
            inputHandler.current &&
            controlType &&
            inputHandler.current.controlType !== controlType
        ) {
            recreateInputHandler(controlType);
        }
    }, [controlType]);

    if (checkingAuth) {
        return <div className="auth-loading-screen">Загрузка...</div>;
    }

    if (!isAuthenticated) {
        return (
            <div
                className="auth-loading-screen"
                style={{
                    background:
                        'linear-gradient(180deg, #eaf6ff 0%, #cbe7ff 100%)',
                }}
            >
                <div className="auth-window">
                    <h2 style={{ marginBottom: 24 }}>Вход через VK ID</h2>
                    <AuthVKID
                        onLoginSuccess={() => {
                            setIsAuthenticated(true);
                            const hasCompletedOnboarding =
                                localStorage.getItem(getOnboardingKey()) ===
                                'true';
                            setShowOnboarding(!hasCompletedOnboarding);
                            setCheckingAuth(false);
                        }}
                    />
                </div>
            </div>
        );
    }
    if (isLoading) {
        return (
            <div className="resource-loading-screen">
                <div className="resource-window">
                    <h2 style={{ marginBottom: 24 }}>Загрузка игры</h2>
                    <div className="resource-progress-bar">
                        <div
                            className="resource-progress-bar-inner"
                            style={{ width: `${loadingProgress}%` }}
                        />
                    </div>
                    <div>{Math.round(loadingProgress)}%</div>
                </div>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="game-canvas-container">
            <div style={{ position: 'relative', display: 'inline-block' }}>
                <button
                    className="sound-toggle-btn"
                    onClick={() => setSoundEnabled((prev) => !prev)}
                >
                    <img
                        src={soundEnabled ? unmuteIcon : muteIcon}
                        alt={soundEnabled ? 'Звук включён' : 'Звук выключен'}
                    />
                </button>
                <div style={{ position: 'relative' }}>
                    <canvas id="canvas1" className="game-canvas"></canvas>
                    {showOnboarding && (
                        <Onboarding onFinish={handleOnboardingFinish} />
                    )}
                    {showMotionPermission && (
                        <div className="motion-permission-overlay">
                            <div className="motion-permission-window">
                                <h3>Доступ к датчикам движения</h3>
                                <p>
                                    Для управления наклоном разрешите доступ к
                                    датчикам движения вашего устройства.
                                </p>
                                {motionPermissionError && (
                                    <p
                                        style={{
                                            color: 'red',
                                            fontWeight: 600,
                                        }}
                                    >
                                        {motionPermissionError}
                                    </p>
                                )}
                                <div className="motion-permission-buttons">
                                    <button
                                        className="motion-permission-btn motion-permission-btn--allow"
                                        onClick={requestMotionPermission}
                                    >
                                        Разрешить
                                    </button>
                                    <button
                                        className="motion-permission-btn motion-permission-btn--deny"
                                        onClick={() =>
                                            setShowMotionPermission(false)
                                        }
                                    >
                                        Отмена
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="game-superpower-block">
                    <img
                        src="/images/superpower.svg"
                        alt="score"
                        className="game-superpower-icon"
                    />
                    <span className="game-superpower-value">
                        {superpowerCount}
                    </span>
                </div>
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
                                src={
                                    lastScore > bestScore
                                        ? '/images/newRecordByte.svg'
                                        : '/images/scoreByte.svg'
                                }
                                alt="byte"
                                className="death-byte-img"
                            />
                            <div className="death-score-label-large">
                                {lastScore > bestScore
                                    ? 'Новый рекорд!'
                                    : 'Попробуешь побить рекорд?'}
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
                        {!superpowerActive &&
                            superpowerAvailable &&
                            !gamePaused &&
                            !showRatingPage && (
                                <button
                                    className={`game-canvas__superpower-btn`}
                                    onClick={handleActivateSuperpower}
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
                            style={superpowerActive ? { margin: '0 auto' } : {}}
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
