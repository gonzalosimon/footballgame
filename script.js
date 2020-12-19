var canvas = document.getElementById("game");
var context = canvas.getContext("2d");

canvas.style.display = "none";

window.requestAnimationFrame =
  window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.msRequestAnimationFrame;

var up = false;
var down = false;
var left = false;
var right = false;
var shoot = false;
var run = false;
var restart = false;
function updateHTML(elmId, value) {
  var elem = document.getElementById(elmId);
  if(typeof elem !== 'undefined' && elem !== null) {
    elem.innerHTML = value;
  }
}
function playSound(sound) {
  var crowd = document.getElementById("crowd");
  crowd.volume = 0.25; // setting the volume to 25% because the sound is loud
  if (crowd.paused) {
    // if crowd is paused
    crowd.play();
  } else {
    crowd.pause();
  }
}

$(function () {
  $("#sound-icon").on("click", function () {
    $(this).toggleClass("fa-volume-up fa-volume-off");
    $(this).hasClass("fa-volume-off")
      ? console.log("Muting sound")
      : console.log("Unmuting Sound");
  });
});

var showCredits = function () {
  document.getElementById("theHead").style.display = "none";
  document.getElementById("aboutBtn").style.display = "none";
  document.getElementById("newGame").style.display = "none";
  document.getElementById("credits").style.display = "block";
  document.getElementById("backBtn").style.display = "block";
};

var goBack = function () {
  document.getElementById("backBtn").style.display = "none";
  document.getElementById("credits").style.display = "none";
  document.getElementById("theHead").style.display = "block";
  document.getElementById("newGame").style.display = "block";
  document.getElementById("aboutBtn").style.display = "block";
};

quickMatch = () => {
  instructions.style.display = "block";
  canvas.style.display = "block";

  var userChoice = 0;
  let blueteam_score = document.getElementById("blueteam_score");
  let redteam_score = document.getElementById("redteam_score");

  document.getElementById("backBtn").style.display = "none";
  document.getElementById("credits").style.display = "none";
  document.getElementById("theHead").style.display = "none";
  document.getElementById("newGame").style.display = "none";
  document.getElementById("aboutBtn").style.display = "none";
  if (restart) {
    console.log("restarting match");
    reset();
  }
  //Render functions
  clear();
  renderBackground();
  renderPlayers();
  renderBall();

  //Moves functions
  movePlayers();
  moveBall();
  keyboardMoves(userChoice);
  directions();

  //Bounce functions
  players_Ball_Collision();
  playersCollision();
  playersBounds();
  ballBounds();

  blueteam_score.innerHTML = "Blue Team Score: " + blueteam;
  redteam_score.innerHTML = "Red Team Score: " + redteam;
  requestAnimationFrame(quickMatch);
};

class Ball {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.xVel = 0;
    this.yVel = 0;
    this.decel = 0.1;
    this.size = 5;
  }
}

class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 15;
    this.xVel = 0;
    this.yVel = 0;
    this.accel = 2;
    this.decel = 2;
    this.maxSpeed = 2;
  }
}

let blueteam = 0;
let redteam = 0;

let players = [
  //blue
  new Player(450, 325),
  new Player(300, 100),
  new Player(300, 500),
  new Player(200, 300),
  new Player(30, 300),

  //red
  new Player(750, 275),
  new Player(900, 500),
  new Player(900, 100),
  new Player(1000, 300),
  new Player(1170, 300),
];

ball = new Ball(600, 300);

// Bounce functions
const delay = (ms) => new Promise((res) => setTimeout(res, ms));
function reset() {
  players = [
    //blue
    new Player(450, 300),
    new Player(300, 100),
    new Player(300, 500),
    new Player(200, 300),
    new Player(30, 300),

    //red
    new Player(750, 300),
    new Player(900, 500),
    new Player(900, 100),
    new Player(1000, 300),
    new Player(1170, 300),
  ];

  ball = new Ball(600, 300);

  up = false;
  down = false;
  left = false;
  right = false;
}

if (restart) {
  console.log("restarting match");
  reset();
}

function players_Ball_Collision() {
  for (let i = 0; i < 10; i++) {
    var ball_distance =
      getDistance(players[i].x, players[i].y, ball.x, ball.y) -
      players[i].size -
      ball.size;
    if (ball_distance < 0) {
      collideforBall(ball, players[i]);
    }
  }
}

function playersCollision() {
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
        collideforPlayers(players[k], players[i]);
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
        collideforPlayers(players[k], players[i]);
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
        collideforPlayers(players[i], players[j]);
      }
    }
  }
}

function collideforBall(cir1, cir2) {
  var dx = (cir1.x - cir2.x) / cir1.size;
  var dy = (cir1.y - cir2.y) / cir1.size;
  cir1.xVel = dx;
  cir1.yVel = dy;
  cir2.xVel = -dx;
  cir2.yVel = -dy;
}

function collideforPlayers(cir1, cir2) {
  var dx = (cir1.x - cir2.x) / cir1.size;
  var dy = (cir1.y - cir2.y) / cir1.size;
  cir1.xVel = dx;
  cir1.yVel = dy;
  cir2.xVel = -dx;
  cir2.yVel = -dy;
}

function getDistance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

function wait(ms) {
  var start = new Date().getTime();
  var end = start;
  while (end < start + ms) {
    end = new Date().getTime();
  }
}

const ballBounds = async () => {
  // for the x (axis) parts of the field
  //if it's the goal gate
  // this means a point for the blue team
  if (ball.x + ball.size > canvas.width) {
    if (ball.y > 225 && ball.y < 375) {
      blueteam++;
      reset();
      console.log("goal for the blueteam");
      return;
    }
    // if it's not a goal gate
    ball.x = canvas.width - ball.size;
    ball.xVel *= -1.5;
  }
  //if it's the goal gate
  // this means a point for the red team
  if (ball.x - ball.size < 0) {
    if (ball.y > 225 && ball.y < 375) {
      redteam++;
      reset();
      console.log("goal for the redteam");
      return;
    }
    ball.x = 0 + ball.size;
    ball.xVel *= -1.5;
  }

  // for the y (axis) parts of the field
  if (ball.y + ball.size > canvas.height) {
    ball.y = canvas.height - ball.size;
    ball.yVel *= -1.5;
  }

  if (ball.y - ball.size < 0) {
    ball.y = 0 + ball.size;
    ball.yVel *= -1.5;
  }
};

function playersBounds() {
  for (let i = 0; i < 10; i++) {
    if (players[i].x + players[i].size > canvas.width) {
      players[i].x = canvas.width - players[i].size;
      players[i].xVel *= -0.2;
    }
    if (players[i].x - players[i].size < 0) {
      players[i].x = 0 + players[i].size;
      players[i].xVel *= -0.2;
    }
    if (players[i].y + players[i].size > canvas.height) {
      players[i].y = canvas.height - players[i].size;
      players[i].yVel *= -0.2;
    }
    if (players[i].y - players[i].size < 0) {
      players[i].y = 0 + players[i].size;
      players[i].yVel *= -0.2;
    }
  }
}

// Moves Functions

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

function movePlayers() {
  for (let i = 0; i < 10; i++) {
    players[i].x += players[i].xVel;
    players[i].y += players[i].yVel;
  }
}

function keyboardMoves(userChoice) {
  var dx = (players[userChoice].x - ball.x) / players[userChoice].size;
  var dy = (players[userChoice].y - ball.y) / players[userChoice].size;
  function playerShoot() {
    ball.xVel = 3 * -dx;
    ball.yVel = 3 * -dy;
    players[userChoice].xVel = dx;
    players[userChoice].yVel = dy;
    console.log("Shoots");
  }

  for (let i = 0; i < 10; i++) {
    //this var will allow me to shoot if the player is able to (if the player is close enough)
    var isAble =
      getDistance(
        players[userChoice].x,
        players[userChoice].y,
        ball.x,
        ball.y
      ) -
      players[userChoice].size -
      ball.size;

    if (isAble < 15) {
      if (shoot) {
        setTimeout(playerShoot(), 4000);
      }
    }
  }

  if (run) {
    players[userChoice].maxSpeed = 3;
  } else {
    players[userChoice].maxSpeed = 2;
  }

  if (up) {
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

  if (down) {
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
  if (left) {
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
  if (right) {
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
    up = false;
  }
  if (e.keyCode === 37) {
    left = false;
  }
  if (e.keyCode === 40) {
    down = false;
  }
  if (e.keyCode === 39) {
    right = false;
  }
  if (e.keyCode === 88) {
    shoot = false;
  }
  if (e.keyCode === 67) {
    run = false;
  }
  if (e.keyCode === 82) {
    restart = false;
  }
};

document.onkeydown = function (e) {
  if (e.keyCode === 38) {
    up = true;
  }
  if (e.keyCode === 37) {
    left = true;
  }
  if (e.keyCode === 40) {
    down = true;
  }
  if (e.keyCode === 39) {
    right = true;
  }
  if (e.keyCode === 88) {
    shoot = true;
  }
  if (e.keyCode === 67) {
    run = true;
  }
  if (e.keyCode === 82) {
    restart = true;
  }
};

// Render Functions

function renderBall() {
  context.save();
  context.beginPath();
  context.fillStyle = "brown";
  context.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
  context.fill();
  context.closePath();
  context.restore();
}

function renderPlayers() {
  for (let i = 0; i < 5; i++) {
    context.beginPath();
    context.fillStyle = "blue"; //player color
    context.arc(players[i].x, players[i].y, players[i].size, 0, Math.PI * 2);
    context.fill();
    context.closePath();
  }
  for (let i = 5; i < 10; i++) {
    context.beginPath();
    context.fillStyle = "red";
    context.arc(players[i].x, players[i].y, players[i].size, 0, Math.PI * 2);
    context.fill();
    context.closePath();
  }

  context.restore();
}

function renderBackground() {
  context.save();

  // Outer lines
  context.beginPath();
  context.rect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#6AB219";
  context.fill();
  context.lineWidth = 1;
  context.strokeStyle = "#FFF";
  context.stroke();
  context.closePath();

  context.fillStyle = "#FFF";

  // Mid line
  context.beginPath();
  context.moveTo(canvas.width / 2, 0);
  context.lineTo(canvas.width / 2, canvas.height);
  context.stroke();
  context.closePath();

  //Mid circle
  context.beginPath();
  context.arc(canvas.width / 2, canvas.height / 2, 73, 0, 2 * Math.PI, false);
  context.stroke();
  context.closePath();
  //Mid point
  context.beginPath();
  context.arc(canvas.width / 2, canvas.height / 2, 2, 0, 2 * Math.PI, false);
  context.fill();
  context.closePath();

  //Home penalty box
  context.beginPath();
  context.rect(0, (canvas.height - 322) / 2, 132, 322);
  context.stroke();
  context.closePath();

  context.beginPath();
  context.rect(0, (canvas.height - 146) / 2, 44, 146);
  context.stroke();
  context.closePath();
  //Home goal
  context.beginPath();
  context.moveTo(1, canvas.height / 2 - 22);
  context.lineTo(1, canvas.height / 2 + 22);
  context.lineWidth = 2;
  context.stroke();
  context.closePath();
  context.lineWidth = 1;

  //Home penalty point
  context.beginPath();
  context.arc(88, canvas.height / 2, 1, 0, 2 * Math.PI, true);
  context.fill();
  context.closePath();
  //Home half circle
  context.beginPath();
  context.arc(88, canvas.height / 2, 73, 0.29 * Math.PI, 1.71 * Math.PI, true);
  context.stroke();
  context.closePath();
  //Away penalty box
  context.beginPath();
  context.rect(canvas.width - 132, (canvas.height - 322) / 2, 132, 322);
  context.stroke();
  context.closePath();
  //Away goal box
  context.beginPath();
  context.rect(canvas.width - 44, (canvas.height - 146) / 2, 44, 146);
  context.stroke();
  context.closePath();
  //Away goal
  context.beginPath();
  context.moveTo(canvas.width - 1, canvas.height / 2 - 22);
  context.lineTo(canvas.width - 1, canvas.height / 2 + 22);
  context.lineWidth = 2;
  context.stroke();
  context.closePath();
  context.lineWidth = 1;
  //Away penalty point
  context.beginPath();
  context.arc(canvas.width - 88, canvas.height / 2, 1, 0, 2 * Math.PI, true);
  context.fill();
  context.closePath();
  //Away half circle
  context.beginPath();
  context.arc(
    canvas.width - 88,
    canvas.height / 2,
    73,
    0.71 * Math.PI,
    1.29 * Math.PI,
    false
  );
  context.stroke();
  context.closePath();

  //Home L corner
  context.beginPath();
  context.arc(0, 0, 12, 0, 0.5 * Math.PI, false);
  context.stroke();
  context.closePath();
  //Home R corner
  context.beginPath();
  context.arc(0, canvas.height, 12, 0, 2 * Math.PI, true);
  context.stroke();
  context.closePath();
  //Away R corner
  context.beginPath();
  context.arc(canvas.width, 0, 12, 0.5 * Math.PI, 1 * Math.PI, false);
  context.stroke();
  context.closePath();
  //Away L corner
  context.beginPath();
  context.arc(
    canvas.width,
    canvas.height,
    12,
    1 * Math.PI,
    1.5 * Math.PI,
    false
  );
  context.stroke();
  context.closePath();
  context.restore();
}

function clear() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

// Testing
// This function will make the players move in different directions
function directions() {
  // Making goalkeepers cover their position
  players[4].y--;
  players[9].y++;
  if (players[4].y < 225) {
    var dy = (players[4].y - (players[4].y - 25)) / players[4].size;
    players[4].yVel = dy;
  }
  if (players[4].y > 375) {
    var dy = (players[4].y - (players[4].y - 25)) / players[4].size;
    players[4].yVel = -dy;
  }

  if (players[9].y < 225) {
    var dy = (players[9].y - (players[9].y - 25)) / players[9].size;
    players[9].yVel = dy;
  }
  if (players[9].y > 375) {
    var dy = (players[9].y - (players[9].y - 25)) / players[9].size;
    players[9].yVel = -dy;
  }

  // Making players covering a position move in a direction

  var player_distanceblue =
    getDistance(players[1].x, players[1].y, players[2].x, players[2].y) -
    players[1].size -
    players[2].size;

  var player_distancered =
    getDistance(players[6].x, players[6].y, players[7].x, players[7].y) -
    players[6].size -
    players[7].size;

  players[6].y--;
  players[7].y++;
  players[1].y++;
  players[2].y--;

  if (players[1].y + players[1].size < 80) {
    players[1].y = 80 - players[1].size;
    players[1].yVel *= -0.2;
  }
  if (players[2].y + players[2].size > 500) {
    players[2].y = 500 - players[2].size;
    players[2].yVel *= -0.2;
  }
  if (players[6].y + players[6].size > 500) {
    players[6].y = 500 - players[6].size;
    players[6].yVel *= -0.2;
  }
  if (players[7].y + players[7].size < 80) {
    players[7].y = 80 - players[7].size;
    players[7].yVel *= -0.2;
  }

  if (player_distanceblue < 50) {
    var dx = (players[1].x - players[2].x) / players[1].size;
    var dy = (players[1].y - players[2].y) / players[1].size;
    players[1].xVel = 0.5 * dx;
    players[1].yVel = 0.5 * dy;
    players[2].xVel = 0.5 * -dx;
    players[2].yVel = 0.5 * -dy;
  }

  if (player_distancered < 75) {
    var dx = (players[6].x - players[7].x) / players[6].size;
    var dy = (players[6].y - players[7].y) / players[6].size;
    players[6].xVel = 0.5 * dx;
    players[6].yVel = 0.5 * dy;
    players[7].xVel = 0.5 * -dx;
    players[7].yVel = 0.5 * -dy;
  }

  // Making the player [5] follow the ball and making the player [5] score a goal
  var dx = (players[5].x - ball.x) / players[5].size;
  var dy = (players[5].y - ball.y) / players[5].size;
  var ball_distance =
    getDistance(players[5].x, players[5].y, ball.x, ball.y) -
    players[5].size -
    ball.size;

  // if the red player is close to the ball he will go for it
  if (ball_distance < 125) {
    players[5].xVel = -dx;
    players[5].yVel = -dy;
    console.log("Red player is looking for the ball");

    // if the player is in the right position to shoot and score a goal, the he will do it
    if (players[5].y < 375 && players[5].y > 175 && players[5].x < 235) {
      console.log("Red team player is ready to shoot!");
      ball.xVel = 3 * -dx;
      ball.yVel = -dy + 0.05;
    }
    // check if player is going in the right direction, if is not then fix it

    // Here I check if the player goes in the right direction related to axis x

    if (players[5].x > 1000) {
      console.log("not in the right direction axis x");

      players[5].x = players[5].x + 5;
      ball.x = ball.x - 5;
    }
    if (players[5].x < 100) {
      console.log("not in the right direction axis x");
      ball.x = ball.x + 5;
    }
    // Here I check if the player goes in the right direction related to axis y
    if (players[5].y < 150 || players[5].y > 500) {
      console.log("not in the right direction axis y");
      if (players[5].y < 225) {
        ball.y++;
        ball.x++;
      } else if (players[5].y > 375) {
        players[5].y - 20;
        ball.y--;
      }
      if (players[5].x < 110) {
        if (players.y < 275) {
          players[5].y--;
          ball.y--;
          ball.x--;
        }
      }
      if (players[5].x < 110) {
        if (players.y > 375) {
          players[5].y--;
          ball.y++;
        }
      }
    }
  }
}
