var canvas = document.getElementById("canvas");
var c = canvas.getContext("2d");
var redteam_score = document.getElementById("redteam_score");
var blueteam_score = document.getElementById("blueteam_score");
window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
var init = requestAnimationFrame(start);

let blueteam = 0;
let redteam = 0;

let players=[ 
  //blue
  new Player(435, 300), new Player(300, 150), new Player(300, 450), 
  new Player(180, 285), new Player(30, 290), 
  
  //red
  new Player(770, 300), new Player(800, 475), 
  new Player(800, 150), new Player(1170, 300), new Player(1000, 305), 

];	


ball = new Ball(600, 300);
var upDown = false;
var downDown = false;
var leftDown = false;
var rightDown = false;

function start(){
  clear(); renderBackground(); checkPlayers_PLayersCollision(); renderGates(); checkKeyboardStatus(); checkPlayersBounds(); checkBallBounds(); checkPlayers_BallCollision();
  movePlayers(); moveBall(); renderPlayers(); renderBall();

  blueteam_score.innerHTML = "Blue Team Score: " + blueteam; 
  redteam_score.innerHTML = "Red Team Score: " + redteam; 
  requestAnimationFrame(start);
}


function Ball(x, y) {
  this.x = x;
  this.y = y;
  this.xVel = 0;
  this.yVel = 0;
  this.decel = 0.03;
  this.size = 8;
}

function Player(x, y) {
  this.x = x;
  this.y = y;
  this.size = 18;
  this.xVel = 0;
  this.yVel = 0;
  this.accel = 0.55;
  this.decel = 0.55;
  this.maxSpeed = 3;
}

function reset() {
  
  // //blue team restore players positions
  // players[0].x = 435;
  // players[0].y = 300;

  // players[1].x = 300;
  // players[1].y = 150 
  
  // players[2].x = 300
  // players[2].y = 450
  
  // players[3].x = 180
  // players[3].y = 285
  
  // players[4].x = 30
  // players[4].y = 290

  // //red team restore players positions
  // players[5].x = 770;
  // players[5].y = 300;
  
  // players[6].x = 800;
  // players[6].y = 475 
  
  // players[7].x = 800
  // players[7].y = 150
  
  // players[8].x = 1170
  // players[8].y = 300
  
  // players[9].x = 1000
  // players[9].y = 305

  players=[ 
    //blue
    new Player(435, 300), new Player(300, 150), new Player(300, 450), 
    new Player(180, 285), new Player(30, 290), 
    
    //red
    new Player(770, 300), new Player(800, 475), 
    new Player(800, 150), new Player(1170, 300), new Player(1000, 305), 
  
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
    var ball_distance = getDistance(players[i].x, players[i].y, ball.x, ball.y) - players[i].size - ball.size;
    if (ball_distance < 0) {
      collide(ball, players[i]);
    }
  }
}

function checkPlayers_PLayersCollision() {
  //Collision blue player with another blue player
  for (let k = 0; k < 5; k++) {
  for (let i = 1; i < 5; i++) {
  var player_distance = getDistance(players[k].x, players[k].y, players[i].x, players[i].y) - players[k].size - players[i].size;
  if(i===k) {i++}
  else if (player_distance < 0) {
    collide(players[k], players[i]);
  }
 }
}
// Collision red player with another red player
for (let k = 5; k < 10; k++) {
for (let i = 6; i < 10; i++) {
  var player_distance = getDistance(players[k].x, players[k].y, players[i].x, players[i].y) - players[k].size - players[i].size;
  if(i===k) {i++}
  else if (player_distance < 0) {
    collide(players[k], players[i]);
  }
} }
// Collision blue player with a red player
  for (let i = 0; i < 5; i++) {
    for (let j = 5; j < 10; j++) {
    var player_distance = getDistance(players[i].x, players[i].y, players[j].x, players[j].y) - players[i].size - players[j].size;
    if(i===j) {i++}
    else if (player_distance < 0) {
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

function checkKeyboardStatus() {
  if (upDown) {
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

  if (downDown) {
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
  if (leftDown) {
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
  if (rightDown) {
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
};

function renderBall() {
  c.save();
	c.beginPath();
	c.fillStyle = "brown";
	c.arc(ball.x,ball.y,ball.size,0,Math.PI*2);
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
  for (let i = 5; i < 10 ; i++) {
    c.beginPath();
    c.fillStyle = "red";
    c.arc(players[i].x, players[i].y, players[i].size, 0, Math.PI * 2);
    c.fill();
    c.closePath();
  }
  c.restore();
}

function renderGates() {
  // left gate
  c.save();
  c.beginPath();
  c.moveTo(0, 200);
  c.lineTo(0, 400);
  c.strokeStyle = "white";
  c.lineWidth = 30;
  c.stroke();
  c.closePath();
  // right gate
  c.beginPath();
  c.moveTo(canvas.width, 200);
  c.lineTo(canvas.width, 400);
  c.strokeStyle = "white";
  c.lineWidth = 30;
  c.stroke();
  c.closePath();
  c.restore();
}

function renderBackground() {
  c.save();
  c.fillStyle = "rgb(112, 197, 73)";
  c.fillRect(0, 0, canvas.width, canvas.height);
  c.strokeStyle = "rgba(255,255,255,0.6)";
  c.beginPath();
  c.arc(canvas.width / 2, canvas.height / 2, 75, 0, Math.PI * 2);
  c.closePath();
  c.lineWidth = 5;
  c.stroke();
  c.restore();
}

function clear() {
  c.clearRect(0, 0, canvas.width, canvas.height);
}


