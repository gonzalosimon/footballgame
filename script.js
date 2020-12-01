var canvas = document.getElementById("canvas");
var c = canvas.getContext("2d");
var out = document.getElementById("out");
window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

var init = requestAnimationFrame(start);
var player1 = new Player(425,300);
var player2 = new Player(300,150);
var player3 = new Player(300,450);
var player4 = new Player(30,300);
var player5 = new Player(770,300);
var player6 = new Player(800,475);
var player7 = new Player(800,150);
var player8 = new Player(1200,300);
ball = new Ball(600,300);
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
	player1 = new Player(425,300);
	player1.score = score1;
	player2 = new Player(300,150);
	player3 = new Player(300,450);
	player4 = new Player(30,300);
	player5 = new Player(770,300);
	player6 = new Player(800,475);
	player7 = new Player(800,150);
	player8 = new Player(1200,300);
	ball = new Ball(600,300);
	upDown = false;
	downDown = false;
	leftDown = false;
	rightDown = false;
}

function movePlayers(){
	player1.x += player1.xVel;
	player1.y += player1.yVel;
	player2.x += player2.xVel;
	player2.y += player2.yVel;
	player3.x += player3.xVel;
	player3.y += player3.yVel;
	player4.x += player4.xVel;
	player4.y += player4.yVel;
	player5.x += player5.xVel;
	player5.y += player5.yVel;
	player6.x += player6.xVel;
	player6.y += player6.yVel;
	player7.x += player7.xVel;
	player7.y += player7.yVel;
	player8.x += player8.xVel;
	player8.y += player8.yVel;
}

function checkPlayers_BallCollision(){
	var p1_ball_distance = getDistance(player1.x,player1.y,ball.x,ball.y) - player1.size - ball.size;
	if(p1_ball_distance < 0){
		collide(ball,player1);
	}
	var p2_ball_distance = getDistance(player2.x,player2.y,ball.x,ball.y) - player2.size - ball.size;
	if(p2_ball_distance < 0){
		collide(ball,player2);
	}
	var p3_ball_distance = getDistance(player3.x,player3.y,ball.x,ball.y) - player3.size - ball.size;
	if(p3_ball_distance < 0){
		collide(ball,player3);
	}
	var p4_ball_distance = getDistance(player4.x,player4.y,ball.x,ball.y) - player4.size - ball.size;
	if(p4_ball_distance < 0){
		collide(ball,player4);
	}
	var p5_ball_distance = getDistance(player5.x,player5.y,ball.x,ball.y) - player5.size - ball.size;
	if(p5_ball_distance < 0){
		collide(ball,player5);
	}
	var p6_ball_distance = getDistance(player6.x,player6.y,ball.x,ball.y) - player6.size - ball.size;
	if(p6_ball_distance < 0){
		collide(ball,player6);
	}
	var p7_ball_distance = getDistance(player7.x,player7.y,ball.x,ball.y) - player7.size - ball.size;
	if(p7_ball_distance < 0){
		collide(ball,player7);
	}
	var p8_ball_distance = getDistance(player8.x,player8.y,ball.x,ball.y) - player8.size - ball.size;
	if(p8_ball_distance < 0){
		collide(ball,player8);
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

	//player 1

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

	//player 2

	if(player2.x + player2.size > canvas.width){
		player2.x = canvas.width - player2.size;
		player2.xVel *= -0.5;
	}
	if(player2.x - player2.size < 0){
		player2.x = 0 + player2.size;
		player2.xVel *= -0.5;
	}
	if(player2.y + player2.size > canvas.height){
		player2.y = canvas.height - player2.size;
		player2.yVel *= -0.5;
	}
	if(player2.y - player2.size < 0){
		player2.y = 0 + player2.size;
		player2.yVel *= -0.5;
	}

	// player 3

	if(player3.x + player3.size > canvas.width){
		player3.x = canvas.width - player3.size;
		player3.xVel *= -0.5;
	}
	if(player3.x - player3.size < 0){
		player3.x = 0 + player3.size;
		player3.xVel *= -0.5;
	}
	if(player3.y + player3.size > canvas.height){
		player3.y = canvas.height - player3.size;
		player3.yVel *= -0.5;	
	}
	if(player3.y - player2.size < 0){
		player3.y = 0 + player3.size;
		player3.yVel *= -0.5;
	}

	// player 4

	if(player4.x + player4.size > canvas.width){
		player4.x = canvas.width - player4.size;
		player4.xVel *= -0.5;
	}
	if(player4.x - player4.size < 0){
		player4.x = 0 + player4.size;
		player4.xVel *= -0.5;
	}
	if(player4.y + player4.size > canvas.height){
		player4.y = canvas.height - player4.size;
		player4.yVel *= -0.5;
	}
	if(player4.y - player4.size < 0){
		player4.y = 0 + player4.size;
		player4.yVel *= -0.5;
	}

	// player 5

	if(player5.x + player5.size > canvas.width){
		player5.x = canvas.width - player5.size;
		player5.xVel *= -0.5;
	}
	if(player5.x - player5.size < 0){
		player5.x = 0 + player5.size;
		player5.xVel *= -0.5;
	}
	if(player5.y + player5.size > canvas.height){
		player5.y = canvas.height - player5.size;
		player5.yVel *= -0.5;
	}
	if(player5.y - player5.size < 0){
		player5.y = 0 + player5.size;
		player5.yVel *= -0.5;
	}

	//player 6

	if(player6.x + player6.size > canvas.width){
		player6.x = canvas.width - player6.size;
		player6.xVel *= -0.5;
	}
	if(player6.x - player6.size < 0){
		player6.x = 0 + player6.size;
		player6.xVel *= -0.5;
	}
	if(player6.y + player6.size > canvas.height){
		player6.y = canvas.height - player6.size;
		player6.yVel *= -0.5;
	}
	if(player6.y - player6.size < 0){
		player6.y = 0 + player6.size;
		player6.yVel *= -0.5;
	}

	//player 7

	if(player7.x + player7.size > canvas.width){
		player7.x = canvas.width - player7.size;
		player7.xVel *= -0.5;
	}
	if(player7.x - player7.size < 0){
		player7.x = 0 + player7.size;
		player7.xVel *= -0.5;
	}
	if(player7.y + player7.size > canvas.height){
		player7.y = canvas.height - player7.size;
		player7.yVel *= -0.5;
	}
	if(player7.y - player7.size < 0){
		player7.y = 0 + player7.size;
		player7.yVel *= -0.5;
	}

	//player 8

	if(player8.x + player8.size > canvas.width){
		player8.x = canvas.width - player8.size;
		player8.xVel *= -0.5;
	}
	if(player8.x - player8.size < 0){
		player8.x = 0 + player8.size;
		player8.xVel *= -0.5;
	}
	if(player8.y + player8.size > canvas.height){
		player8.y = canvas.height - player8.size;
		player8.yVel *= -0.5;
	}
	if(player8.y - player8.size < 0){
		player8.y = 0 + player8.size;
		player8.yVel *= -0.5;
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
	c.fillStyle = "blue"; //player color
	c.beginPath();
	c.arc(player1.x,player1.y,player1.size,0,Math.PI*2);
	c.fill();
	c.closePath();

	c.beginPath();
	c.fillStyle = "blue";
	c.arc(player2.x,player2.y,player2.size,0,Math.PI*2);
	c.fill();
	c.closePath();

	c.beginPath();
	c.fillStyle = "blue";
	c.arc(player3.x,player3.y,player3.size,0,Math.PI*2);
	c.fill();
	c.closePath();

	c.beginPath();
	c.fillStyle = "blue";
	c.arc(player4.x,player4.y,player4.size,0,Math.PI*2);
	c.fill();
	c.closePath();

	c.beginPath();
	c.fillStyle = "red";
	c.arc(player5.x,player5.y,player5.size,0,Math.PI*2);
	c.fill();
	c.closePath();

	c.beginPath();
	c.fillStyle = "red";
	c.arc(player6.x,player6.y,player6.size,0,Math.PI*2);
	c.fill();
	c.closePath();

	c.beginPath();
	c.fillStyle = "red";
	c.arc(player7.x,player7.y,player7.size,0,Math.PI*2);
	c.fill();
	c.closePath();

	c.beginPath();
	c.fillStyle = "red";
	c.arc(player8.x,player8.y,player8.size,0,Math.PI*2);
	c.fill();
	c.closePath();


	c.restore();
}

function renderGates(){
// right gate
	c.save();
	c.beginPath();
	c.moveTo(0,200);
	c.lineTo(0,400);
	c.strokeStyle = "white";
	c.lineWidth = 50;
	c.stroke();
	c.closePath();
// left gate
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