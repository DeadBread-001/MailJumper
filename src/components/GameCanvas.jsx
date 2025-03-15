import React, { useRef, useEffect, useState } from 'react';
import { initGame, updateGame } from '../utils/gameLogic';

const GameCanvas = () => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(localStorage.getItem('bestScore') || 0);
  const [gameOver, setGameOver] = useState(false);
  const gameStateRef = useRef(null);
  const [canvasHeight, setCanvasHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      setCanvasHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const startGame = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    gameStateRef.current = initGame(canvas);
    setScore(0);
    setGameOver(false);

    let animationFrameId;

    const update = () => {
      const newScore = updateGame(ctx, gameStateRef.current);
      setScore(newScore);

      if (newScore > bestScore) {
        setBestScore(newScore);
        localStorage.setItem('bestScore', newScore);
      }

      if (gameStateRef.current.player.y > gameStateRef.current.canvasHeight) {
        setGameOver(true);
        return;
      }

      animationFrameId = requestAnimationFrame(update);
    };
    update();

    return () => cancelAnimationFrame(animationFrameId);
  };

  useEffect(() => {
    const cleanup = startGame();

    const handleKeyDown = (e) => {
      if (gameStateRef.current) {
        if (e.key === 'a' || e.key === 'A') {
          gameStateRef.current.player.vx = -3;
        } else if (e.key === 'd' || e.key === 'D') {
          gameStateRef.current.player.vx = 3;
        }
      }
    };

    const handleKeyUp = (e) => {
      if (gameStateRef.current) {
        if (e.key === 'a' || e.key === 'A' || e.key === 'd' || e.key === 'D') {
          gameStateRef.current.player.vx = 0;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cleanup();
    };
  }, []);

  const restartGame = () => {
    startGame();
  };

  const resetBestScore = () => {
    setBestScore(0);
    localStorage.setItem('bestScore', 0);
  };

  return (
      <div>
        <div>Score: {score} | Best: {bestScore}</div>
        <canvas
            ref={canvasRef}
            width={400}
            height={canvasHeight}
            style={{ border: '1px solid black', width: '400px', height: '100vh' }}
        />
        {gameOver && (
            <div>
              <p>Game Over!</p>
              <button onClick={restartGame}>Restart</button>
              <button onClick={resetBestScore}>Reset Best Score</button>
            </div>
        )}
      </div>
  );
};

export default GameCanvas;
