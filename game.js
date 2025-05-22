let ball;
let ballRadius = 10;
let ballSpeed = 5;
let walls = [];
let bumpers = [];
let score = 0;
let leftFlipper, rightFlipper;

function setup() {
  let canvas = createCanvas(400, 600);
  canvas.parent("game-container");
  resetBall();
  defineWalls();
  defineBumpers();
  defineFlippers();
}

function draw() {
  background(10, 10, 40);
  drawField();
  moveBall();
  drawBall();
  drawBumpers();
  drawFlippers();
  drawScore();
}

function resetBall() {
  ball = {
    x: width / 2,
    y: height - 100,
    dx: random([-1, 1]) * ballSpeed,
    dy: -ballSpeed
  };
}

function drawField() {
  noFill();
  stroke(80, 80, 255);
  strokeWeight(4);
  rect(10, 10, width - 20, height - 20);
}

function defineWalls() {
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

  for (let wall of walls) {
    let [x1, y1, x2, y2] = wall;
    if (x1 === x2) {
      if (abs(ball.x - x1) < ballRadius && ball.y > min(y1, y2) && ball.y < max(y1, y2)) {
        ball.dx *= -1;
      }
    } else if (y1 === y2) {
      if (abs(ball.y - y1) < ballRadius && ball.x > min(x1, x2) && ball.x < max(x1, x2)) {
        ball.dy *= -1;
      }
    }
  }

  // palette collision
  checkFlipperCollision(leftFlipper, -1);
  checkFlipperCollision(rightFlipper, 1);

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
    score += 100;
  }
}

function drawScore() {
  fill(255);
  textSize(18);
  textAlign(CENTER);
  text("SCORE : " + score, width / 2, 30);
}

// === FLIPPERS ===

function defineFlippers() {
  leftFlipper = {
    x: width / 2 - 50,
    y: height - 30,
    angle: -PI / 6,
    active: false
  };

  rightFlipper = {
    x: width / 2 + 50,
    y: height - 30,
    angle: PI / 6,
    active: false
  };
}

function drawFlippers() {
  stroke(255);
  strokeWeight(6);
  noFill();

  drawFlipper(leftFlipper, -1);
  drawFlipper(rightFlipper, 1);
}

function drawFlipper(f, side) {
  push();
  translate(f.x, f.y);
  rotate(f.active ? side * PI / 4 : side * PI / 6);
  line(0, 0, side * 40, 0);
  pop();
}

function checkFlipperCollision(f, side) {
  let fx = f.x + cos(f.angle) * side * 40;
  let fy = f.y + sin(f.angle) * side * 40;
  let d = dist(ball.x, ball.y, fx, fy);
  if (d < ballRadius + 10 && f.active) {
    let angle = atan2(ball.y - f.y, ball.x - f.x);
    ball.dx = cos(angle) * ballSpeed;
    ball.dy = sin(angle) * ballSpeed;
  }
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) fActive(leftFlipper, true);
  if (keyCode === RIGHT_ARROW) fActive(rightFlipper, true);
}

function keyReleased() {
  if (keyCode === LEFT_ARROW) fActive(leftFlipper, false);
  if (keyCode === RIGHT_ARROW) fActive(rightFlipper, false);
}

function fActive(flipper, active) {
  flipper.active = active;
}
