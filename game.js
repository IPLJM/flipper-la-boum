let ball;
let ballRadius = 10;
let ballSpeed = 5;
let walls = [];
let bumpers = [];

function setup() {
  let canvas = createCanvas(400, 600);
  canvas.parent("game-container");
  resetBall();
  defineWalls();
  defineBumpers();
}

function draw() {
  background(10, 10, 40); // ambiance space cadet

  drawField();
  moveBall();
  drawBall();
  drawBumpers();
}

function resetBall() {
  ball = {
    x: width / 2,
    y: height - 60,
    dx: random([-1, 1]) * ballSpeed,
    dy: -ballSpeed
  };
}

function drawField() {
  noFill();
  stroke(80, 80, 255);
  strokeWeight(4);
  rect(10, 10, width - 20, height - 20); // cadre principal

  // triangle flipper zone (décor basique)
  fill(30);
  noStroke();
  triangle(0, height, width / 2, height - 40, width, height);
}

function defineWalls() {
  // murs en format [x1, y1, x2, y2]
  walls = [
    [10, 10, width - 10, 10],
    [10, 10, 10, height - 10],
    [width - 10, 10, width - 10, height - 10],
    [10, height - 10, width - 10, height - 10],
  ];
}

function defineBumpers() {
  bumpers = [
    { x: width / 2, y: height / 3, r: 20 },
    { x: width / 3, y: height / 2, r: 15 },
    { x: width * 2 / 3, y: height / 2, r: 15 },
  ];
}

function drawBumpers() {
  fill(255, 0, 100);
  noStroke();
  for (let b of bumpers) {
    ellipse(b.x, b.y, b.r * 2);
    checkBumperCollision(b);
  }
}

function drawBall() {
  fill(255);
  noStroke();
  ellipse(ball.x, ball.y, ballRadius * 2);
}

function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  // collision avec murs
  for (let wall of walls) {
    let [x1, y1, x2, y2] = wall;
    if (x1 === x2) { // vertical
      if (abs(ball.x - x1) < ballRadius && ball.y > min(y1, y2) && ball.y < max(y1, y2)) {
        ball.dx *= -1;
      }
    } else if (y1 === y2) { // horizontal
      if (abs(ball.y - y1) < ballRadius && ball.x > min(x1, x2) && ball.x < max(x1, x2)) {
        ball.dy *= -1;
      }
    }
  }

  // si elle sort par le bas : reset
  if (ball.y > height + 20) {
    resetBall();
  }
}

function checkBumperCollision(b) {
  let d = dist(ball.x, ball.y, b.x, b.y);
  if (d < b.r + ballRadius) {
    let angle = atan2(ball.y - b.y, ball.x - b.x);
    ball.dx = cos(angle) * ballSpeed;
    ball.dy = sin(angle) * ballSpeed;
  }
}
