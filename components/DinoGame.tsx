
import React, { useEffect, useRef, useState } from 'react';

interface DinoGameProps {
  onGameOver?: (score: number) => void;
  onToggleExpand?: () => void;
}

export const DinoGame: React.FC<DinoGameProps> = ({ onGameOver, onToggleExpand }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    const fetchScore = async () => {
      const userId = localStorage.getItem('dyslearn-device-id');
      if (userId) {
         try {
           const controller = new AbortController();
           setTimeout(() => controller.abort(), 2000);
           const r = await fetch(`/api/user/${userId}`, { signal: controller.signal });
           const res = await r.json();
           if (res.success && res.data) {
               setHighScore(res.data.dino_highscore || 0);
           }
         } catch (e) { /* backend offline, use default score 0 */ }
      }
    };
    fetchScore();
  }, []);

  const gameState = useRef({
    dino: {
      x: 50,
      y: 150,
      width: 40,
      height: 40,
      dy: 0,
      jumpForce: 12,
      gravity: 0.6,
      isJumping: false,
    },
    obstacles: [] as { x: number; y: number; width: number; height: number; type: 'cactus' | 'rock' | 'bird' }[],
    frame: 0,
    speed: 5,
    score: 0,
    spawnTimer: 0,
    nextSpawn: 100,
  });

  const [showRules, setShowRules] = useState(true);
  const showRulesRef = useRef(true);

  const setShowRulesSync = (val: boolean) => {
    showRulesRef.current = val;
    setShowRules(val);
  };

  const jump = () => {
    if (showRulesRef.current) return;
    if (!gameState.current.dino.isJumping && gameStarted && !isGameOver) {
      gameState.current.dino.dy = -gameState.current.dino.jumpForce;
      gameState.current.dino.isJumping = true;
    }
    if (!gameStarted) {
      startGame();
    }
    if (isGameOver) {
      restartGame();
    }
  };

  const toggleFullScreen = () => {
    if (onToggleExpand) {
      onToggleExpand();
    } else {
      const element = canvasRef.current?.parentElement;
      if (!element) return;
      if (!document.fullscreenElement) {
        element.requestFullscreen().catch(err => {
          console.error(`Error attempting to enable full-screen mode: ${err.message}`);
        });
      } else {
        document.exitFullscreen();
      }
    }
  };

  const startGame = () => {
    setShowRulesSync(false);
    setGameStarted(true);
    setIsGameOver(false);
    setScore(0);
    gameState.current.score = 0;
    gameState.current.obstacles = [];
    gameState.current.speed = 5;
    gameState.current.frame = 0;
    gameState.current.spawnTimer = 0;
    gameState.current.nextSpawn = 100;
    gameState.current.dino.y = 150;
    gameState.current.dino.dy = 0;
    gameState.current.dino.isJumping = false;
  };

  const restartGame = () => {
    startGame();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault();
        if (showRulesRef.current) {
          startGame();
        } else {
          jump();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStarted, isGameOver, showRules]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const update = () => {
      if (!gameStarted || isGameOver || showRules) return;

      const state = gameState.current;
      const { dino, obstacles } = state;

      // Update Dino
      dino.y += dino.dy;
      dino.dy += dino.gravity;

      if (dino.y > 150) {
        dino.y = 150;
        dino.dy = 0;
        dino.isJumping = false;
      }

      // Update Obstacles
      state.spawnTimer++;
      if (state.spawnTimer >= state.nextSpawn) {
        state.spawnTimer = 0;
        // Decrease spawn interval over time
        state.nextSpawn = Math.max(50, 100 - Math.floor(state.score / 200) * 5);
        
        const rand = Math.random();
        let type: 'cactus' | 'rock' | 'bird' = 'cactus';
        let y = 160;
        let width = 20;
        let height = 30;

        if (state.score > 120 && rand > 0.7) {
          type = 'bird';
          y = 100 + Math.random() * 40; // Birds fly at different heights
          width = 30;
          height = 20;
        } else if (state.score > 60 && rand > 0.4) {
          type = 'rock';
          y = 175;
          width = 25;
          height = 15;
        }

        obstacles.push({ x: canvas.width, y, width, height, type });
      }

      for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].x -= state.speed;

        // Collision Detection
        // Shrink hitbox slightly for better feel
        const hitboxPadding = 5;
        if (
          dino.x + hitboxPadding < obstacles[i].x + obstacles[i].width - hitboxPadding &&
          dino.x + dino.width - hitboxPadding > obstacles[i].x + hitboxPadding &&
          dino.y + hitboxPadding < obstacles[i].y + obstacles[i].height - hitboxPadding &&
          dino.y + dino.height - hitboxPadding > obstacles[i].y + hitboxPadding
        ) {
          setIsGameOver(true);
          if (state.score > highScore) {
            setHighScore(state.score);
            const userId = localStorage.getItem('dyslearn-device-id');
            if (userId) {
              fetch(`/api/user/${userId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ dino_highscore: state.score })
              }).catch(e => console.error(e));
            }
          }
          if (onGameOver) onGameOver(state.score);
        }

        if (obstacles[i].x + obstacles[i].width < 0) {
          obstacles.splice(i, 1);
          state.score += 10;
          setScore(state.score);
          if (state.score % 100 === 0) {
            state.speed += 0.2; // Slower speed increase for better balance
          }
        }
      }

      state.frame++;
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const state = gameState.current;
      const { dino, obstacles } = state;

      // Draw Ground
      ctx.beginPath();
      ctx.moveTo(0, 190);
      ctx.lineTo(canvas.width, 190);
      ctx.strokeStyle = '#666';
      ctx.stroke();

      // Draw Dino (Pixel-art style)
      ctx.fillStyle = '#555';
      // Body
      ctx.fillRect(dino.x + 10, dino.y, 20, 30);
      ctx.fillRect(dino.x, dino.y + 10, 10, 20);
      ctx.fillRect(dino.x + 30, dino.y + 5, 10, 15);
      // Legs (Animation)
      const legOffset = Math.sin(state.frame * 0.2) * 3;
      if (!dino.isJumping) {
        ctx.fillRect(dino.x + 12, dino.y + 30, 5, 10 + legOffset);
        ctx.fillRect(dino.x + 23, dino.y + 30, 5, 10 - legOffset);
      } else {
        ctx.fillRect(dino.x + 12, dino.y + 30, 5, 10);
        ctx.fillRect(dino.x + 23, dino.y + 30, 5, 10);
      }
      
      // Eye
      ctx.fillStyle = 'white';
      ctx.fillRect(dino.x + 32, dino.y + 8, 3, 3);

      // Draw Obstacles
      obstacles.forEach(obs => {
        if (obs.type === 'cactus') {
          ctx.fillStyle = '#2d5a27';
          // Main stem
          ctx.fillRect(obs.x + 7, obs.y, 6, obs.height);
          // Left arm
          ctx.fillRect(obs.x, obs.y + 10, 7, 5);
          ctx.fillRect(obs.x, obs.y + 5, 3, 5);
          // Right arm
          ctx.fillRect(obs.x + 13, obs.y + 15, 7, 5);
          ctx.fillRect(obs.x + 17, obs.y + 10, 3, 5);
        } else if (obs.type === 'rock') {
          ctx.fillStyle = '#777';
          ctx.beginPath();
          ctx.moveTo(obs.x, obs.y + obs.height);
          ctx.lineTo(obs.x + obs.width / 2, obs.y);
          ctx.lineTo(obs.x + obs.width, obs.y + obs.height);
          ctx.fill();
          // Detail
          ctx.fillStyle = '#555';
          ctx.fillRect(obs.x + 5, obs.y + 10, 5, 2);
        } else if (obs.type === 'bird') {
          ctx.fillStyle = '#333';
          // Body
          ctx.fillRect(obs.x + 5, obs.y + 5, 20, 10);
          // Wings (Animation)
          const wingPos = Math.sin(state.frame * 0.3) > 0 ? -10 : 10;
          ctx.fillRect(obs.x + 10, obs.y + 5 + wingPos, 5, 10);
          // Beak
          ctx.fillStyle = '#f39c12';
          ctx.fillRect(obs.x + 25, obs.y + 8, 5, 3);
        }
      });

      if (!gameStarted) {
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Press Space to Start', canvas.width / 2, canvas.height / 2);
      }

      if (isGameOver) {
        ctx.fillStyle = 'rgba(255,0,0,0.3)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 20);
        ctx.font = '16px Arial';
        ctx.fillText(`Score: ${state.score}`, canvas.width / 2, canvas.height / 2 + 10);
        ctx.fillText('Press Space to Restart', canvas.width / 2, canvas.height / 2 + 40);
      }

      animationFrameId = requestAnimationFrame(() => {
        update();
        draw();
      });
    };

    draw();

    return () => cancelAnimationFrame(animationFrameId);
  }, [gameStarted, isGameOver, highScore]);

  return (
    <div className="flex flex-col items-center p-4 bg-[var(--bg-primary)] rounded-xl border border-[var(--border-color)] shadow-inner relative overflow-hidden">
      <div className="flex justify-between w-full mb-2 text-xs font-bold text-[var(--text-secondary)]">
        <span>HI: {highScore}</span>
        <div className="flex items-center gap-2">
          <span>SCORE: {score}</span>
          <button onClick={toggleFullScreen} className="p-1 hover:bg-[var(--bg-secondary)] rounded transition-colors" title="Full Screen">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
        </div>
      </div>
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={260}
          height={200}
          className="bg-white dark:bg-gray-900 rounded-lg cursor-pointer touch-none"
          onClick={jump}
        />
        {showRules && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-4 text-white rounded-lg text-center">
            <h3 className="text-lg font-bold mb-2 text-[var(--accent-color)]">Dino Adventure</h3>
            <ul className="text-[10px] space-y-1 mb-4 opacity-90">
              <li>• Press SPACE or TAP to jump</li>
              <li>• Avoid Cacti, Rocks (60 pts), and Birds (120 pts)</li>
              <li>• The game gets faster as you score!</li>
            </ul>
            <button 
              onClick={startGame}
              className="px-4 py-2 bg-[var(--accent-color)] rounded-full text-xs font-bold hover:scale-105 transition-transform"
            >
              START GAME
            </button>
          </div>
        )}
      </div>
      <p className="mt-3 text-[10px] text-[var(--text-secondary)] opacity-60 text-center">
        Use SPACE or TAP to jump. Avoid the obstacles!
      </p>
    </div>
  );
};
