export const initGame = (canvas) => {
  const platformGap = 120;
  const platforms = [];
  const platformCount = Math.floor(canvas.height / platformGap);


  for (let i = 0; i < platformCount; i++) {
    platforms.push({
      x: Math.random() * (canvas.width - 100),
      y: canvas.height - i * platformGap,
      width: 100,
      height: 10,
    });
  }

  return {
    player: { x: 200, y: canvas.height - 150, vx: 0, vy: 0, width: 20, height: 20 },
    platforms,
    gravity: 0.5,
    jumpForce: -12,
    score: 0,
    canvasHeight: canvas.height,
    lastJumpTime: 0,
    jumpCooldown: 400,
    friction: 0.99,
    maxJumpHeight: 80,
    minJumpHeight: 50,
    maxHorizontalReach: 30,
    platformSpawnChance: 0.3,
    minDistanceBetweenPlatforms: 40,
    minHorizontalDistance: 50,
  };
};

export const updateGame = (ctx, state) => {
  const { player, platforms, gravity, jumpForce, canvasHeight, lastJumpTime, jumpCooldown, friction, minJumpHeight, maxJumpHeight, maxHorizontalReach, platformSpawnChance, minDistanceBetweenPlatforms, minHorizontalDistance } = state;

  // Обновление физики игрока
  player.vy += gravity;
  player.y += player.vy;
  player.x += player.vx;
  player.vx *= friction;

  if (player.x < 0) player.x = 0;
  if (player.x + player.width > ctx.canvas.width) player.x = ctx.canvas.width - player.width;

  const currentTime = Date.now();

  // Проверка столкновения с платформами
  platforms.forEach((platform) => {
    if (
        player.y + player.height > platform.y &&
        player.y + player.height < platform.y + platform.height + 5 &&
        player.x + player.width > platform.x &&
        player.x < platform.x + platform.width &&
        player.vy >= 0
    ) {
      player.y = platform.y - player.height;
      player.vy = jumpForce;
      if (currentTime - lastJumpTime > jumpCooldown) {
        state.lastJumpTime = currentTime;
      }
    }
  });

  // Прокрутка экрана
  if (player.y < canvasHeight / 2) {
    const shift = canvasHeight / 2 - player.y;
    player.y = canvasHeight / 2;
    platforms.forEach((p) => (p.y += shift));
    state.score += Math.floor(shift / 10);

    state.platforms = platforms.filter((p) => p.y < canvasHeight);

    const highestPlatform = platforms.reduce((highest, p) => (p.y < highest.y ? p : highest), platforms[0] || { x: player.x, y: player.y });
    if (Math.random() < platformSpawnChance) {
      let newY = highestPlatform.y - (minJumpHeight + Math.random() * (maxJumpHeight - minJumpHeight));
      let newX = Math.max(0, Math.min(player.x + Math.random() * maxHorizontalReach * 2 - maxHorizontalReach, ctx.canvas.width - 100));

      const isTooClose = platforms.some((p) =>
          Math.abs(p.y - newY) < minDistanceBetweenPlatforms ||
          (Math.abs(p.y - newY) < maxJumpHeight && Math.abs(p.x - newX) < minHorizontalDistance)
      );

      if (!isTooClose && newY > 0) {
        state.platforms.push({
          x: newX,
          y: newY,
          width: 100,
          height: 10,
        });
      }
    }
  }

  // Отрисовка
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.fillStyle = 'blue';
  ctx.fillRect(player.x, player.y, player.width, player.height);
  ctx.fillStyle = 'green';
  platforms.forEach((p) => ctx.fillRect(p.x, p.y, p.width, p.height));

  return state.score;
};
