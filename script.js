var canvas = document.getElementById("game");
var context = canvas.getContext("2d");
playSound("crowd");
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
var upon_theGoal = ((canvas.height / 2) - 73)
var down_theGoal = ((canvas.height / 2) + 73)

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
      ? (document.getElementById("showmute").innerHTML = "Unmute")
      : (document.getElementById("showmute").innerHTML = "Mute");
  });
});

var showCredits = function () {
  document.getElementById("theHead").style.display = "none";
  document.getElementById("aboutBtn").style.display = "none";
  document.getElementById("newGame").style.display = "none";
  document.getElementById("settings").style.display = "none";
  document.getElementById("credits").style.display = "block";
  document.getElementById("backBtn").style.display = "block";
  document.getElementById("settingsBtn").style.display = "none";
};

var showModes = function () {
  document.getElementById("theHead").style.display = "none";
  document.getElementById("aboutBtn").style.display = "none";
  document.getElementById("newGame").style.display = "none";
  document.getElementById("credits").style.display = "none";
  document.getElementById("settings").style.display = "none";
  document.getElementById("backBtn").style.display = "block";
  document.getElementById("settingsBtn").style.display = "none";
};

var showSettings = function () {
  document.getElementById("theHead").style.display = "none";
  document.getElementById("aboutBtn").style.display = "none";
  document.getElementById("newGame").style.display = "none";
  document.getElementById("credits").style.display = "none";
  document.getElementById("settings").style.display = "block";
  document.getElementById("backBtn").style.display = "block";
  document.getElementById("settingsBtn").style.display = "none";
};

var goBack = function () {
  document.getElementById("theHead").style.display = "block";
  document.getElementById("newGame").style.display = "block";
  document.getElementById("aboutBtn").style.display = "block";
  document.getElementById("settingsBtn").style.display = "block";
  document.getElementById("backBtn").style.display = "none";
  document.getElementById("credits").style.display = "none";
  document.getElementById("settings").style.display = "none";
};

quickMatch = () => {
  document.getElementById("theHead").style.display = "none";
  document.getElementById("aboutBtn").style.display = "none";
  document.getElementById("newGame").style.display = "none";
  document.getElementById("credits").style.display = "none";
  document.getElementById("settings").style.display = "none";
  document.getElementById("backBtn").style.display = "none";
  document.getElementById("settingsBtn").style.display = "none";

  instructions.style.display = "block";
  canvas.style.display = "block";
  let blueteam_score = document.getElementById("blueteam_score");
  let redteam_score = document.getElementById("redteam_score");

  //Render functions
  clear();
  renderBackground();
  renderPlayers();
  renderBall();

  //Moves functions
  movePlayers();
  moveBall();
  keyboardMoves();
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
    this.size = 12;
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
  new Player(canvas.width / 3, canvas.height / 2),
  new Player(30, 300),

  //red
  new Player((canvas.width / 3) * 2,  canvas.height - canvas.height / 2),
  new Player(1170, 300),
];

ball = new Ball(canvas.width / 2, canvas.height / 2);

// Bounce functions
const delay = (ms) => new Promise((res) => setTimeout(res, ms));
function reset() {
  players = [
    //blue
    new Player(canvas.width / 2, canvas.height / 4),
    new Player(30, 300),

    //red
    new Player(canvas.width / 2, canvas.height - canvas.height / 4),
    new Player(1170, 300),
  ];

  ball = new Ball(canvas.width / 2, canvas.height / 2);
  up = false;
  down = false;
  left = false;
  right = false;
  shoot = false;
  run = false;
  restart = false;
}

function players_Ball_Collision() {
  for (let i = 0; i < 4; i++) {
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
  for (let k = 0; k < 2; k++) {
    for (let i = 1; i < 2; i++) {
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
  for (let k = 2; k < 4; k++) {
    for (let i = 3; i < 4; i++) {
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
  for (let i = 0; i < 2; i++) {
    for (let j = 2; j < 4; j++) {
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
    if (ball.y > canvas.height / 2 - 73 && ball.y < down_theGoal) {
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
    if (ball.y > upon_theGoal && ball.y < down_theGoal) {
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
  for (let i = 0; i < 4; i++) {
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
  for (let i = 0; i < 4; i++) {
    players[i].x += players[i].xVel;
    players[i].y += players[i].yVel;
  }
}

function keyboardMoves() {
  var dx = (players[0].x - ball.x) / players[0].size;
  var dy = (players[0].y - ball.y) / players[0].size;
  function playerShoot() {
    ball.xVel = 3 * -dx;
    ball.yVel = 3 * -dy;
    players[0].xVel = dx;
    players[0].yVel = dy;
    console.log("Shoots");
  }

  for (let i = 0; i < 4; i++) {
    //this var will allow me to shoot if the player is able to (if the player is close enough)
    var isAble =
      getDistance(players[0].x, players[0].y, ball.x, ball.y) -
      players[0].size -
      ball.size;

    if (isAble < 15) {
      if (shoot) {
        playerShoot();
      }
    }
  }

  if (run) {
    players[0].maxSpeed = 3;
  } else {
    players[0].maxSpeed = 2;
  }

  if (up) {
    if (players[0].yVel > -players[0].maxSpeed) {
      players[0].yVel -= players[0].accel;
    } else {
      players[0].yVel = -players[0].maxSpeed;
    }
  } else {
    if (players[0].yVel < 0) {
      players[0].yVel += players[0].decel;
      if (players[0].yVel > 0) players[0].yVel = 0;
    }
  }

  if (down) {
    if (players[0].yVel < players[0].maxSpeed) {
      players[0].yVel += players[0].accel;
    } else {
      players[0].yVel = players[0].maxSpeed;
    }
  } else {
    if (players[0].yVel > 0) {
      players[0].yVel -= players[0].decel;
      if (players[0].yVel < 0) players[0].yVel = 0;
    }
  }
  if (left) {
    if (players[0].xVel > -players[0].maxSpeed) {
      players[0].xVel -= players[0].accel;
    } else {
      players[0].xVel = -players[0].maxSpeed;
    }
  } else {
    if (players[0].xVel < 0) {
      players[0].xVel += players[0].decel;
      if (players[0].xVel > 0) players[0].xVel = 0;
    }
  }
  if (right) {
    if (players[0].xVel < players[0].maxSpeed) {
      players[0].xVel += players[0].accel;
    } else {
      players[0].xVel = players[0].maxSpeed;
    }
  } else {
    if (players[0].xVel > 0) {
      players[0].xVel -= players[0].decel;
      if (players[0].xVel < 0) players[0].xVel = 0;
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
  if (e.keyCode === 90) {
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
  if (e.keyCode === 90) {
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
  for (let i = 0; i < 2; i++) {
    context.beginPath();
    context.fillStyle = "blue"; //player color
    context.arc(players[i].x, players[i].y, players[i].size, 0, Math.PI * 2);
    context.fill();
    context.closePath();
  }
  for (let i = 2; i < 4; i++) {
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
  context.fillStyle = "#bbbbbb";
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
  context.arc(canvas.width / 2, canvas.height / 2, 53, 0, 2 * Math.PI, false);
  context.stroke();
  context.closePath();
  //Mid point
  context.beginPath();
  context.arc(canvas.width / 2, canvas.height / 2, 2, 0, 2 * Math.PI, false);
  context.fill();
  context.closePath();

  //Home penalty box

  context.beginPath();
  context.rect(0, (canvas.height - 146) / 2, 44, 146);
  context.stroke();
  context.closePath();

  //Home goal
  context.beginPath();
  context.moveTo(1, canvas.height / 2 - 73);
  context.lineTo(1, canvas.height / 2 + 73);
  context.lineWidth = 5;
  context.stroke();
  context.closePath();
  context.lineWidth = 1;

  //Home penalty point
  context.beginPath();
  context.arc(88, canvas.height / 2, 1, 0, 2 * Math.PI, true);
  context.fill();
  context.closePath();

  //Away goal box
  context.beginPath();
  context.rect(canvas.width - 44, (canvas.height - 146) / 2, 44, 146);
  context.stroke();
  context.closePath();
  //Away goal
  context.beginPath();
  context.moveTo(canvas.width - 1, canvas.height / 2 - 73);
  context.lineTo(canvas.width - 1, canvas.height / 2 + 73);
  context.lineWidth = 5;
  context.stroke();
  context.closePath();
  context.lineWidth = 1;
  //Away penalty point
  context.beginPath();
  context.arc(canvas.width - 88, canvas.height / 2, 1, 0, 2 * Math.PI, true);
  context.fill();
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
  context.clearRect(0, 0, canvas.width, canvas.height);down_theGoal
}

// Testing
// This function will make the players move in different directions
function directions() {
  
  // Making goalkeepers cover their position
  function converPosition() {
    players[1].y--;
    players[3].y++;
    if (players[1].y < canvas.height / 2 - 70) {
      var dy = (players[1].y - (players[1].y - 25)) / players[1].size;
      players[1].yVel = dy;
    }
    if (players[1].y > canvas.height / 2 + 70) {
      var dy = (players[1].y - (players[1].y - 25)) / players[1].size;
      players[1].yVel = -dy;
    }
  
    if (players[3].y < canvas.height / 2 - 70) {
      var dy = (players[3].y - (players[3].y - 25)) / players[3].size;
      players[3].yVel = dy;
    }
    if (players[3].y > canvas.height / 2 + 70) {
      var dy = (players[3].y - (players[3].y - 25)) / players[3].size;
      players[3].yVel = -dy;
    }
  
    // A limit for the goalkeeper in the x-axis
    if (players[3].x < 825) {
      var dx = (players[3].x - (players[3].x - 25)) / players[3].size;
      players[3].xVel = dx;
    }
  
    if (players[1].x > 75) {
      var dx = (players[1].x - (players[1].x - 25)) / players[1].size;
      players[1].xVel = -dx;
    }  
  
  }

  //making the blue goalkeeper go after the ball when it's close enough
  function goalkeeperDirections() {
    var dx = (players[1].x - ball.x) / players[1].size;
    var dy = (players[1].y - ball.y) / players[1].size;

  var ball_distance =
    getDistance(players[1].x, players[1].y, ball.x, ball.y) -
    players[1].size -
    ball.size;

  // if the player is close to the ball he will go for it
  if (ball_distance < 100) {
    console.log("Goalkeeper player is looking for the ball");
    players[1].xVel = -dx;
    players[1].yVel = -dy;
  }
    if(ball_distance < 5){
      console.log("throws the ball!");
      ball.xVel = 3 * - dx;
      ball.yVel = 0.15 - dy;
      players[1].x = 3 * dx;
    }
  }



  // Making the player[2] follow the ball and making the player[2] score a goal
 
 function forwardDirections() {
  var dx = (players[2].x - ball.x) / players[2].size;
  var dy = (players[2].y - ball.y) / players[2].size;

  var ball_distance =
    getDistance(players[2].x, players[2].y, ball.x, ball.y) -
    players[2].size -
    ball.size;

  // if the red player is close to the ball he will go for it
  if (ball_distance < 100) {
    players[2].xVel = -dx;
    players[2].yVel = -dy;
    console.log("Red player is looking for the ball");

    // if the player is in the right position to shoot and score a goal, the he will do it
    if (players[2].y < down_theGoal && players[2].y > 175 && players[2].x < 100) {
      console.log("Red team player is ready to shoot!");
      ball.xVel = 2 * -dx;
      ball.yVel = -dy + 0.05;
      players[2].x = players[2].x + dx; 
    }
    // check if player is going in the right direction, if is not then fix it

    // Here I check if the player goes in the right direction related to axis x

    if (players[2].x > 400) {
      console.log("not in the right direction axis x");
      players[2].x = players[2].x + 5;
      ball.x = ball.x - 5;
    }
    if (players[2].x < 150) {
      players[2].x = players[2].x - 5;
      ball.x = ball.x + 5;
      if (players[2].y > down_theGoal) {
        ball.y = ball.y - 3;
      } else if (players[2].y < upon_theGoal) {
        ball.y = ball.y + 3;
      }
    }
    // Here I check if the player goes in the right direction related to axis y
    if (players[2].y < 150 || players[2].y > 300) {
      console.log("not in the right direction axis y");
      if (players[2].y < upon_theGoal) {
        ball.y++;
        ball.x++;
      } else if (players[2].y > down_theGoal) {
        players[2].y - 10;
        ball.y--;
      }
    }
  }

 }
 
 converPosition()
 forwardDirections();
 goalkeeperDirections();
}

