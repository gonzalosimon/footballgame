var canvas = document.getElementById("canvas");
var c = canvas.getContext("2d");
var out = document.getElementById("out");
window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

var init = requestAnimationFrame(start);
var player1 = new Player(300,300);
var ball = new Ball(600,300);
var upDown = false;
var downDown = false;
var leftDown = false;
var rightDown = false;


function start(){
	clear();
	renderBackground();
	renderGates();
	checkKeyboardStatus();
	checkPlayersBounds();
	checkBallBounds();
	checkPlayers_BallCollision();
	movePlayers();
	moveBall();
	renderPlayers();
	renderBall();

	out.innerHTML = "Player 1 Score: " + player1.score;
	requestAnimationFrame(start);
}

function Ball(x,y){
	this.x = x;
	this.y = y;
	this.xVel = 0;
	this.yVel = 0;
	this.decel = 0.035;
	this.size = 10;
}

function Player(x,y){
	this.x = x;
	this.y = y;
	this.size = 25;
	this.xVel = 0;
	this.yVel = 0;
	this.score = 0;
	this.accel = 0.55;
	this.decel = 0.55;
	this.maxSpeed = 3;
}

function reset(){
	var score1 = player1.score;
	player1 = new Player(300,300);
	player1.score = score1;
  ball = new Ball(600,300);
	upDown = false;
	downDown = false;
	leftDown = false;
	rightDown = false;
}

function movePlayers(){
	player1.x += player1.xVel;
	player1.y += player1.yVel;
}

function checkPlayers_BallCollision(){
	var p1_ball_distance = getDistance(player1.x,player1.y,ball.x,ball.y) - player1.size - ball.size;
	if(p1_ball_distance < 0){
		collide(ball,player1);
	}
}

function collide(cir1,cir2){
	var dx = (cir1.x - cir2.x) / (cir1.size);
	var dy = (cir1.y - cir2.y) / (cir1.size);
	cir2.xVel = -dx;
	cir2.yVel = -dy;
	cir1.xVel = dx;
	cir1.yVel = dy;
}

function getDistance(x1,y1,x2,y2){
	return Math.sqrt(Math.pow(x1-x2,2)+Math.pow(y1-y2,2));
}

function moveBall(){
	if(ball.xVel !== 0){
		if(ball.xVel > 0){
			ball.xVel -= ball.decel;
			if(ball.xVel < 0) ball.xVel = 0;
		} else {
			ball.xVel += ball.decel;
			if(ball.xVel > 0) ball.xVel = 0;
		}
	}
	if(ball.yVel !== 0){
		if(ball.yVel > 0){
			ball.yVel -= ball.decel;
			if(ball.yVel < 0) ball.yVel = 0;
		} else {
			ball.yVel += ball.decel;
			if(ball.yVel > 0) ball.yVel = 0;
		}
	}
	ball.x += ball.xVel;
	ball.y += ball.yVel;
}

function checkBallBounds(){
	if(ball.x + ball.size > canvas.width){
		if(ball.y > 150 && ball.y < 350){
			player1.score++;
			reset();
			return;
		}
		ball.x = canvas.width - ball.size;
		ball.xVel *= -1.5;
	}
	if(ball.x - ball.size < 0){
		if(ball.y > 150 && ball.y < 350){
			player2.score++;
			reset();
			return;
		}
		ball.x = 0 + ball.size;
		ball.xVel *= -1.5;
	}
	if(ball.y + ball.size > canvas.height){
		ball.y = canvas.height - ball.size;
		ball.yVel *= -1.5;
	}
	if(ball.y - ball.size < 0){
		ball.y = 0 + ball.size;
		ball.yVel *= -1.5;
	}
}

function checkPlayersBounds(){
	if(player1.x + player1.size > canvas.width){
		player1.x = canvas.width - player1.size;
		player1.xVel *= -0.5;
	}
	if(player1.x - player1.size < 0){
		player1.x = 0 + player1.size;
		player1.xVel *= -0.5;
	}
	if(player1.y + player1.size > canvas.height){
		player1.y = canvas.height - player1.size;
		player1.yVel *= -0.5;
	}
	if(player1.y - player1.size < 0){
		player1.y = 0 + player1.size;
		player1.yVel *= -0.5;
	}
}

function checkKeyboardStatus(){
	if(upDown){
		if(player1.yVel > -player1.maxSpeed){
			player1.yVel -= player1.accel;	
		} else {
			player1.yVel = -player1.maxSpeed;
		}
	} else {
		if(player1.yVel < 0){
			player1.yVel += player1.decel;
			if(player1.yVel > 0) player1.yVel = 0;	
		}
	}
	if(downDown){
		if(player1.yVel < player1.maxSpeed){
			player1.yVel += player1.accel;	
		} else {
			player1.yVel = player1.maxSpeed;
		}
	} else {
		if(player1.yVel > 0){
			player1.yVel -= player1.decel;
			if(player1.yVel < 0) player1.yVel = 0;
		}
	}
	if(leftDown){
		if(player1.xVel > -player1.maxSpeed){
			player1.xVel -= player1.accel;	
		} else {
			player1.xVel = -player1.maxSpeed;
		}
	} else {
		if(player1.xVel < 0){
			player1.xVel += player1.decel;
			if(player1.xVel > 0) player1.xVel = 0;	
		}
	}
	if(rightDown){
		if(player1.xVel < player1.maxSpeed){
			player1.xVel += player1.accel;	
		} else {
			player1.xVel = player1.maxSpeed;
		}
	} else {
		if(player1.xVel > 0){
			player1.xVel -= player1.decel;
			if(player1.xVel < 0) player1.xVel = 0;
		}
	}
}

document.onkeyup = function(e){
	if(e.keyCode === 38){
		upDown = false;
	}
	if(e.keyCode === 37){
		leftDown = false;
	}
	if(e.keyCode === 40){
		downDown = false;
	}
	if(e.keyCode === 39){
		rightDown = false;
	}
}

document.onkeydown = function(e){
	if(e.keyCode === 38){
		upDown = true;
	}
	if(e.keyCode === 37){
		leftDown = true;
	}
	if(e.keyCode === 40){
		downDown = true;
	}
	if(e.keyCode === 39){
		rightDown = true;
	}
}

function renderBall(){
	c.save();
	c.beginPath();
	c.fillStyle = "white";
	c.arc(ball.x,ball.y,ball.size,0,Math.PI*2);
	c.fill();
	c.closePath();
	c.restore();
}

function renderPlayers(){
	c.save();
	c.fillStyle = "orange";
	c.beginPath();
	c.arc(player1.x,player1.y,player1.size,0,Math.PI*2);
	c.fill();
	c.closePath();
	c.restore();
}

function renderGates(){
	c.save();
	c.beginPath();
	c.moveTo(canvas.width,200);
	c.lineTo(canvas.width,400);
	c.strokeStyle = "white";
	c.lineWidth = 50;
	c.stroke();
	c.closePath();
	c.restore();
}

function renderBackground(){
	c.save();
	c.fillStyle = "rgb(165, 196, 125)";
	c.fillRect(0,0,canvas.width,canvas.height);
	c.strokeStyle = "rgba(255,255,255,0.6)";
	c.beginPath();
	c.arc(canvas.width/2,canvas.height/2,75,0,Math.PI*2);
	c.closePath();
	c.lineWidth = 5;
	c.stroke();
	c.restore();
}

function clear(){
	c.clearRect(0,0,canvas.width,canvas.height);
}