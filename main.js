const svg = document.querySelector('#field');
const players = document.querySelectorAll('.player');
const obstacles = document.querySelectorAll('.obstacle');
const state = {
  targets: [
    { x: 400, y: 300 }, // player 1 moves towards bottom right corner
    { x: 0, y: 0 }, // player 2 moves towards top left corner
    { x: 0, y: 300 }, // player 3 moves towards bottom left corner
    { x: 400, y: 0 }, // player 4 moves towards top right corner
  ],
  obstacles: [...obstacles].map((obstacle) => ({
    x: parseFloat(obstacle.getAttribute('cx')),
    y: parseFloat(obstacle.getAttribute('cy')),
  })),
  moving: true,
  speeds: { player1: 1, player2: 1.5, player3: 2, player4: 3 },
};

document.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase();
  if (key === 'q') {
    console.log('hit q');
    state.speeds.player1 = 2;
  } else if (key === 'w') {
    state.speeds.player2 = 3;
  } else if (key === 'e') {
    state.speeds.player3 = 4;
  } else if (key === 'r') {
    state.speeds.player4 = 6;
  } else if (key === ' ') {
    console.log(state);
  }
});

document.addEventListener('keyup', (event) => {
  const key = event.key.toLowerCase();
  if (key === 'q') {
    state.speeds.player1 = 1;
  } else if (key === 'w') {
    state.speeds.player2 = 1.5;
  } else if (key === 'e') {
    state.speeds.player3 = 2;
  } else if (key === 'r') {
    state.speeds.player4 = 3;
  }
});

svg.addEventListener('click', (event) => {
  const x = event.clientX - svg.getBoundingClientRect().left;
  const y = event.clientY - svg.getBoundingClientRect().top;

  state.targets.forEach((target, index) => {
    target.x = x;
    target.y = y;
  });
  state.moving = true;
});

function checkObstacleCollision(player, dx, dy) {
  const cx = parseFloat(player.getAttribute('cx')) + dx;
  const cy = parseFloat(player.getAttribute('cy')) + dy;
  const playerRadius = parseFloat(player.getAttribute('r'));
  const obstacleRadius = 10;
  const buffer = 3;

  for (let obstacle of obstacles) {
    const ox = parseFloat(obstacle.getAttribute('cx'));
    const oy = parseFloat(obstacle.getAttribute('cy'));
    const distance = Math.sqrt((ox - cx) ** 2 + (oy - cy) ** 2);

    if (distance < playerRadius + obstacleRadius + buffer) {
      return true;
    }
  }

  return false;
}

let positions = {};
const toKey = (pos) => JSON.stringify(pos);
const roundTo = (num, precision = 3) => Number(num.toFixed(precision));

function animate() {
  players.forEach((player, index) => {
    const speed = state.speeds[player.getAttribute('id')];
    const target = state.targets[index];
    const xDiff = target.x - parseFloat(player.getAttribute('cx'));
    const yDiff = target.y - parseFloat(player.getAttribute('cy'));
    const distance = Math.sqrt(xDiff ** 2 + yDiff ** 2);
    let angle = roundTo(Math.atan2(yDiff, xDiff));
    const xVelocity = state.moving ? speed * Math.cos(angle) : 0;
    const yVelocity = state.moving ? speed * Math.sin(angle) : 0;

    checkObstacleCollision(player, xVelocity, yVelocity);

    if (distance > speed) {
      let dx = xVelocity;
      let dy = yVelocity;

      while (checkObstacleCollision(player, dx, dy)) {
        angle = angle + Math.PI / 20;

        dx = speed * Math.cos(angle);
        dy = speed * Math.sin(angle);
      }

      player.setAttribute('cx', parseFloat(player.getAttribute('cx')) + dx);
      player.setAttribute('cy', parseFloat(player.getAttribute('cy')) + dy);
    }
  });

  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
