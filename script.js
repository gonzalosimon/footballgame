var canvas = document.getElementById("canvas");
var c = canvas.getContext("2d");
var redteam_score = document.getElementById("redteam_score");
var blueteam_score = document.getElementById("blueteam_score");
window.requestAnimationFrame =
  window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.msRequestAnimationFrame;

let blueteam = 0;
let redteam = 0;

let players = [
  //blue
  new Player(435, 300),
  new Player(300, 150),
  new Player(300, 450),
  new Player(180, 285),
  new Player(30, 290),

  //red
  new Player(770, 300),
  new Player(800, 475),
  new Player(800, 150),
  new Player(1170, 300),
  new Player(1000, 305),
];

ball = new Ball(600, 300);
var upDown = false;
var downDown = false;
var leftDown = false;
var rightDown = false;
var shoot = false;
var pass = false;
var clicked = false;

function start() {
  var team;
  var userChoice = document.getElementById("input_id").value;
  //  document.getElementById('alert').innerHTML = 'You must select a player!';
  if (userChoice > 4) {
    team = "Red team";
  } else {
    team = "Blue team";
  }

  document.getElementById("info").innerHTML =
    "You are the player number " + userChoice + " of the " + team;
  console.log(userChoice);
  clear();
  renderBackground();
  checkPlayers_PLayersCollision();
  checkPlayersBounds();
  checkBallBounds();
  checkPlayers_BallCollision();
  movePlayers();
  moveBall();
  renderPlayers();
  renderBall();
  checkKeyboardStatus(userChoice);
  blueteam_score.innerHTML = "Blue Team Score: " + blueteam;
  redteam_score.innerHTML = "Red Team Score: " + redteam;
  requestAnimationFrame(start);
}

function Ball(x, y) {
  this.x = x;
  this.y = y;
  this.xVel = 0;
  this.yVel = 0;
  this.decel = 0.038;
  this.size = 6;
}

function Player(x, y) {
  this.x = x;
  this.y = y;
  this.size = 10;
  this.xVel = 0;
  this.yVel = 0;
  this.accel = 0.25;
  this.decel = 0.55;
  this.maxSpeed = 3.5;
}

function reset() {
  players = [
    //blue
    new Player(435, 300),
    new Player(300, 150),
    new Player(300, 450),
    new Player(180, 285),
    new Player(30, 290),

    //red
    new Player(770, 300),
    new Player(800, 475),
    new Player(800, 150),
    new Player(1170, 300),
    new Player(1000, 305),
  ];
  ball = new Ball(600, 300);
  upDown = false;
  downDown = false;
  leftDown = false;
  rightDown = false;
}

function movePlayers() {
  for (let i = 0; i < 10; i++) {
    players[i].x += players[i].xVel;
    players[i].y += players[i].yVel;
  }
}

function checkPlayers_BallCollision() {
  for (let i = 0; i < 10; i++) {
    var ball_distance =
      getDistance(players[i].x, players[i].y, ball.x, ball.y) -
      players[i].size -
      ball.size;
    if (ball_distance < 0) {
      collide(ball, players[i]);
    }
  }
}

function checkPlayers_PLayersCollision() {
  //Collision blue player with another blue player
  for (let k = 0; k < 5; k++) {
    for (let i = 1; i < 5; i++) {
      var player_distance =
        getDistance(players[k].x, players[k].y, players[i].x, players[i].y) -
        players[k].size -
        players[i].size;
      if (i === k) {
        i++;
      } else if (player_distance < 0) {
        collide(players[k], players[i]);
      }
    }
  }
  // Collision red player with another red player
  for (let k = 5; k < 10; k++) {
    for (let i = 6; i < 10; i++) {
      var player_distance =
        getDistance(players[k].x, players[k].y, players[i].x, players[i].y) -
        players[k].size -
        players[i].size;
      if (i === k) {
        i++;
      } else if (player_distance < 0) {
        collide(players[k], players[i]);
      }
    }
  }
  // Collision blue player with a red player
  for (let i = 0; i < 5; i++) {
    for (let j = 5; j < 10; j++) {
      var player_distance =
        getDistance(players[i].x, players[i].y, players[j].x, players[j].y) -
        players[i].size -
        players[j].size;
      if (i === j) {
        i++;
      } else if (player_distance < 0) {
        collide(players[i], players[j]);
      }
    }
  }
}

function collide(cir1, cir2) {
  var dx = (cir1.x - cir2.x) / cir1.size;
  var dy = (cir1.y - cir2.y) / cir1.size;
  cir2.xVel = -dx;
  cir2.yVel = -dy;
  cir1.xVel = dx;
  cir1.yVel = dy;
}

function getDistance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

function moveBall() {
  if (ball.xVel !== 0) {
    if (ball.xVel > 0) {
      ball.xVel -= ball.decel;
      if (ball.xVel < 0) ball.xVel = 0;
    } else {
      ball.xVel += ball.decel;
      if (ball.xVel > 0) ball.xVel = 0;
    }
  }

  if (ball.yVel !== 0) {
    if (ball.yVel > 0) {
      ball.yVel -= ball.decel;
      if (ball.yVel < 0) ball.yVel = 0;
    } else {
      ball.yVel += ball.decel;
      if (ball.yVel > 0) ball.yVel = 0;
    }
  }

  ball.x += ball.xVel;
  ball.y += ball.yVel;
}

function checkBallBounds() {
  // this means a point for the blue team
  if (ball.x + ball.size > canvas.width) {
    if (ball.y > 200 && ball.y < 400) {
      blueteam++;
      reset();
      return;
    }
    ball.x = canvas.width - ball.size;
    ball.xVel *= -1.5;
  }

  // this means a point for the red team
  if (ball.x + ball.size < 0) {
    if (ball.y > 200 && ball.y < 400) {
      redteam++;
      reset();
      return;
    }
    ball.x = canvas.width - ball.size;
    ball.xVel *= -1.5;
  }

  if (ball.y + ball.size > canvas.height) {
    ball.y = canvas.height - ball.size;
    ball.yVel *= -1.5;
  }
  if (ball.y - ball.size < 0) {
    ball.y = 0 + ball.size;
    ball.yVel *= -1.5;
  }
}

function checkPlayersBounds() {
  for (let i = 0; i < 9; i++) {
    if (players[i].x + players[i].size > canvas.width) {
      players[i].x = canvas.width - players[i].size;
      players[i].xVel *= -0.5;
    }
    if (players[i].x - players[i].size < 0) {
      players[i].x = 0 + players[i].size;
      players[i].xVel *= -0.5;
    }
    if (players[i].y + players[i].size > canvas.height) {
      players[i].y = canvas.height - players[i].size;
      players[i].yVel *= -0.5;
    }
    if (players[i].y - players[i].size < 0) {
      players[i].y = 0 + players[i].size;
      players[i].yVel *= -0.5;
    }
  }
}

function checkKeyboardStatus(userChoice) {
  if (shoot) {
    console.log("WorkingShoot");
  }
  if (pass) {
    console.log("WorkingPass");
  }

  if (upDown) {
    if (players[userChoice].yVel > -players[userChoice].maxSpeed) {
      players[userChoice].yVel -= players[userChoice].accel;
    } else {
      players[userChoice].yVel = -players[userChoice].maxSpeed;
    }
  } else {
    if (players[userChoice].yVel < 0) {
      players[userChoice].yVel += players[userChoice].decel;
      if (players[userChoice].yVel > userChoice) players[userChoice].yVel = 0;
    }
  }

  if (downDown) {
    if (players[userChoice].yVel < players[userChoice].maxSpeed) {
      players[userChoice].yVel += players[userChoice].accel;
    } else {
      players[userChoice].yVel = players[userChoice].maxSpeed;
    }
  } else {
    if (players[userChoice].yVel > 0) {
      players[userChoice].yVel -= players[userChoice].decel;
      if (players[userChoice].yVel < 0) players[userChoice].yVel = 0;
    }
  }
  if (leftDown) {
    if (players[userChoice].xVel > -players[userChoice].maxSpeed) {
      players[userChoice].xVel -= players[userChoice].accel;
    } else {
      players[userChoice].xVel = -players[userChoice].maxSpeed;
    }
  } else {
    if (players[userChoice].xVel < 0) {
      players[userChoice].xVel += players[userChoice].decel;
      if (players[userChoice].xVel > 0) players[userChoice].xVel = 0;
    }
  }
  if (rightDown) {
    if (players[userChoice].xVel < players[userChoice].maxSpeed) {
      players[userChoice].xVel += players[userChoice].accel;
    } else {
      players[userChoice].xVel = players[userChoice].maxSpeed;
    }
  } else {
    if (players[userChoice].xVel > 0) {
      players[userChoice].xVel -= players[userChoice].decel;
      if (players[userChoice].xVel < 0) players[userChoice].xVel = 0;
    }
  }
}

document.onkeyup = function (e) {
  if (e.keyCode === 38) {
    upDown = false;
  }
  if (e.keyCode === 37) {
    leftDown = false;
  }
  if (e.keyCode === 40) {
    downDown = false;
  }
  if (e.keyCode === 39) {
    rightDown = false;
  }
  if (e.keyCode === 88) {
    shoot = false;
  }
  if (e.keyCode === 90) {
    pass = false;
  }
};

document.onkeydown = function (e) {
  if (e.keyCode === 38) {
    upDown = true;
  }
  if (e.keyCode === 37) {
    leftDown = true;
  }
  if (e.keyCode === 40) {
    downDown = true;
  }
  if (e.keyCode === 39) {
    rightDown = true;
  }
  if (e.keyCode === 88) {
    shoot = true;
  }
  if (e.keyCode === 90) {
    pass = true;
  }
};

function renderBall() {
  c.save();
  c.beginPath();
  c.fillStyle = "brown";
  c.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
  c.fill();
  c.closePath();
  c.restore();
}

function renderPlayers() {
  c.save();
  for (let i = 0; i < 5; i++) {
    c.beginPath();
    c.fillStyle = "blue"; //player color
    c.arc(players[i].x, players[i].y, players[i].size, 0, Math.PI * 2);
    c.fill();
    c.closePath();
  }
  for (let i = 5; i < 10; i++) {
    c.beginPath();
    c.fillStyle = "red";
    c.arc(players[i].x, players[i].y, players[i].size, 0, Math.PI * 2);
    c.fill();
    c.closePath();
  }
  c.restore();
}

function renderBackground() {
  c.save();

  // Outer lines
  c.beginPath();
  c.rect(0, 0, canvas.width, canvas.height);
  c.fillStyle = "#a2ba36";
  c.fill();
  c.lineWidth = 1;
  c.strokeStyle = "#FFF";
  c.stroke();
  c.closePath();

  c.fillStyle = "#FFF";

  // Mid line
  c.beginPath();
  c.moveTo(canvas.width / 2, 0);
  c.lineTo(canvas.width / 2, canvas.height);
  c.stroke();
  c.closePath();

  //Mid circle
  c.beginPath();
  c.arc(canvas.width / 2, canvas.height / 2, 73, 0, 2 * Math.PI, false);
  c.stroke();
  c.closePath();
  //Mid point
  c.beginPath();
  c.arc(canvas.width / 2, canvas.height / 2, 2, 0, 2 * Math.PI, false);
  c.fill();
  c.closePath();

  //Home penalty box
  c.beginPath();
  c.rect(0, (canvas.height - 322) / 2, 132, 322);
  c.stroke();
  c.closePath();
  //Home goal box
  c.beginPath();
  c.rect(0, (canvas.height - 146) / 2, 44, 146);
  c.stroke();
  c.closePath();
  //Home goal
  c.beginPath();
  c.moveTo(1, canvas.height / 2 - 22);
  c.lineTo(1, canvas.height / 2 + 22);
  c.lineWidth = 2;
  c.stroke();
  c.closePath();
  c.lineWidth = 1;

  //Home penalty point
  c.beginPath();
  c.arc(88, canvas.height / 2, 1, 0, 2 * Math.PI, true);
  c.fill();
  c.closePath();
  //Home half circle
  c.beginPath();
  c.arc(88, canvas.height / 2, 73, 0.29 * Math.PI, 1.71 * Math.PI, true);
  c.stroke();
  c.closePath();

  //Away penalty box
  c.beginPath();
  c.rect(canvas.width - 132, (canvas.height - 322) / 2, 132, 322);
  c.stroke();
  c.closePath();
  //Away goal box
  c.beginPath();
  c.rect(canvas.width - 44, (canvas.height - 146) / 2, 44, 146);
  c.stroke();
  c.closePath();
  //Away goal
  c.beginPath();
  c.moveTo(canvas.width - 1, canvas.height / 2 - 22);
  c.lineTo(canvas.width - 1, canvas.height / 2 + 22);
  c.lineWidth = 2;
  c.stroke();
  c.closePath();
  c.lineWidth = 1;
  //Away penalty point
  c.beginPath();
  c.arc(canvas.width - 88, canvas.height / 2, 1, 0, 2 * Math.PI, true);
  c.fill();
  c.closePath();
  //Away half circle
  c.beginPath();
  c.arc(
    canvas.width - 88,
    canvas.height / 2,
    73,
    0.71 * Math.PI,
    1.29 * Math.PI,
    false
  );
  c.stroke();
  c.closePath();

  //Home L corner
  c.beginPath();
  c.arc(0, 0, 8, 0, 0.5 * Math.PI, false);
  c.stroke();
  c.closePath();
  //Home R corner
  c.beginPath();
  c.arc(0, canvas.height, 8, 0, 2 * Math.PI, true);
  c.stroke();
  c.closePath();
  //Away R corner
  c.beginPath();
  c.arc(canvas.width, 0, 8, 0.5 * Math.PI, 1 * Math.PI, false);
  c.stroke();
  c.closePath();
  //Away L corner
  c.beginPath();
  c.arc(canvas.width, canvas.height, 8, 1 * Math.PI, 1.5 * Math.PI, false);
  c.stroke();
  c.closePath();

  c.restore();
}

function clear() {
  c.clearRect(0, 0, canvas.width, canvas.height);
}
