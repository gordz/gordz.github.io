function AAEmplacement(position) {
	var spawned = new Date();
	var lastFire = spawned.getTime();
}

AAEmplacement.prototype.updatePosition = function(time) {
	if (time - lastFire > randomInteger(400,800)) {
		lastFire = time;
		var target = {x: randomInteger(0, canvas.width), y: randomInteger(200, 400)};
		this.fireAABullet(target);
	}
};


AAEmplacement.prototype.fireAABullet = function(coordinate) {
	var x = coordinate.x;
	var y = coordinate.y;


	//console.log("Firing AA to position: x = " + x + ", y = " + y);
	context.beginPath();
	context.moveTo(500, 1000);
	context.lineTo(x, y);
	context.stroke();

	// Draw explosion
	explosions.push(new Explosion({x: x, y: y}, 20));
};


function Base(position) {
	this.position = position;
	
};

Base.prototype.draw = function(context) {
	context.fillStyle = "brown";
	context.beginPath();
	var midpoint = Math.floor(context.canvas.width / 2);
	context.moveTo(midpoint - 15, 700);
	context.lineTo(midpoint - 5, 680);
	context.lineTo(midpoint + 5, 680);
	context.lineTo(midpoint + 15, 700);
	context.closePath();
	context.fill();
};


function Explosion(position, maxRadius) {
	this.maxRadius = maxRadius;
	this.radius = 0;
	this.alive = true;
	this.spawned = new Date();
	this.position = position;
	this.speed = 50;
};

Explosion.prototype.updatePosition = function(time) {
	var elapsed = time - this.spawned.getTime();
	//console.log("Time: " + time + ", elapsed: " + elapsed);;
	if (this.radius < this.maxRadius) {
		this.radius = this.speed * (elapsed / 1000);
		context.globalCompositeOperation = "source-over";
		
		var rg = context.createRadialGradient (this.position.x, this.position.y, 10, this.position.x, this.position.y, this.maxRadius);
		rg.addColorStop (0, 'yellow');
		rg.addColorStop (1, 'red');
		context.fillStyle = rg;
		context.beginPath();
		context.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI, true);
		context.fill();
	} else {
		this.destroy();
	}
};

Explosion.prototype.isAlive = function() {
	return this.alive;
};

Explosion.prototype.destroy = function() {
	this.alive = false;
};

Explosion.prototype.hasCollided = function(missile) {
	if (this.alive) {
		var missilePosition = missile.currentPosition;
		var distanceToMissile = Trig.hypot((missilePosition.x - this.position.x), (missilePosition.y - this.position.y));
		if (distanceToMissile <= this.radius) {
			return true;
		}
	}
};


function Missile(startCoord) {
	  this.startCoord = {x: startCoord.x, y: startCoord.y};
	  this.endCoord = {x: randomInteger(0, context.canvas.width), y: context.canvas.height};
	  this.rAngle = Math.abs(Math.atan((startCoord.x - this.endCoord.x) / (startCoord.y - context.canvas.height)));	  
	  this.currentPosition = {x: startCoord.x, y: startCoord.y};
	  this.speed = randomInteger(30,90);
	  this.alive = true;
	  this.spawned = new Date();

	  // Determine speed & direction
	  if (startCoord.x > this.endCoord.x) {
		  this.speed = -this.speed;
	  }
}

Missile.prototype.updatePosition = function(time) {
	if (this.alive) { 
		 var distance = ((time - this.spawned.getTime()) / 1000) * this.speed;
	  	 var xDisplacement = distance * Math.sin(this.rAngle);
	  	 var yDisplacement = Math.abs(distance) * Math.cos(this.rAngle);
	  	 this.currentPosition = {x: this.startCoord.x + xDisplacement, y: this.startCoord.y + yDisplacement};
	  	  	
	  	 context.beginPath();
	  	 context.lineWidth = 3;
	  	 context.moveTo(this.startCoord.x, this.startCoord.y);
	  	 context.lineTo(this.currentPosition.x, this.currentPosition.y);
	  	 context.stroke();
	  	 context.closePath();
	}
};

Missile.prototype.destroy = function() {
	this.alive = false;
	explosions.push(new Explosion({x: this.currentPosition.x, y: this.currentPosition.y}, 60));
};

Missile.prototype.isAlive = function() {
	return this.alive;
};

function Mirv(startCoord) {
	  var startCoord = {x: startCoord.x, y: startCoord.y};
	  var endCoord = {x: randomInteger(0, context.canvas.width), y: context.canvas.height};
	  var rAngle = Math.abs(Math.atan((startCoord.x - endCoord.x) / (startCoord.y - context.canvas.height)));	  
	  this.currentPosition = {x: startCoord.x, y: startCoord.y};
	  var distance = 0;
	  var speed = randomInteger(50,90);
	  var alive = true;
	  var spawned = new Date();
	  var burstHeight = randomInteger(50,300);
	
	  // Determine speed & direction
	  if (startCoord.x > endCoord.x) {
		  speed = -speed;
	  }
	  
	  
	  this.updatePosition = function(time) {
		  if (alive) {
			  if (this.currentPosition.y > burstHeight) {
				  alive = false;
				  for (var i = 0; i < 3; i++) {
					  missiles.push(new Missile(this.currentPosition));
				  }
			  } else {
		 	distance = ((time - spawned.getTime()) / 1000) * speed;
	  	  	var xDisplacement = distance * Math.sin(rAngle);
	  	  	var yDisplacement = Math.abs(distance) * Math.cos(rAngle);
	  	 	this.currentPosition = {x: startCoord.x + xDisplacement, y: startCoord.y + yDisplacement};
	  	  	
	  	  	context.beginPath();
	  	  	context.lineWidth = 3;
	  	  	context.moveTo(startCoord.x, startCoord.y);
	  	  	context.lineTo(this.currentPosition.x, this.currentPosition.y);
	  	  	context.stroke();
	  	  	context.closePath();
			  }
		 }
	  };
	  
	  this.destroy = function() {
		  alive = false;
		  explosions.push(new Explosion({x: this.currentPosition.x, y: this.currentPosition.y}, 60));
	  };
	  
	  this.isAlive = function() {
		  return alive;
	  };
}

function SmallBullet(start, end) {
	var speed = 300;
	var origin = start;
	var target = end;
	var spawned = new Date();
	var rAngle = Math.abs(Math.atan((origin.x - target.x) / (origin.y - target.y)));	 
	this.alive = true;
	
	// Determine speed & direction
	if (start.x > end.x) {
		speed = -speed;
	}
	
	this.updatePosition = function(time) {
		  if (this.alive) {
		 	distance = ((time - spawned.getTime()) / 1000) * speed;
	  	  	var xDisplacement = distance * Math.sin(rAngle);
	  	  	var yDisplacement = Math.abs(distance) * Math.cos(rAngle);
	  	 	
	  	  	if (speed < 0) {
	  	  		this.position = {x: Math.max(origin.x + xDisplacement, target.x), y: Math.max(origin.y - yDisplacement, target.y)};
	  	  	} else {
	  	  		this.position = {x: Math.min(origin.x + xDisplacement, target.x), y: Math.max(origin.y - yDisplacement, target.y)};
	  	  	}
	  	 
	 	  	context.beginPath();
	 	  	context.arc(this.position.x, this.position.y, 3, 0, 2 * Math.PI, true);
	 	  	context.fillStyle = "red";
	 	  	context.fill();	 
	 	  	
	 	  	if (this.position.x == target.x && this.position.y == target.y) {
	 	  		explosions.push(new Explosion(this.position, 60));
	 	  		this.destroy();
	 	  	}
	 	  }
	  };
}

SmallBullet.prototype.destroy = function() {
	this.alive = false;
};

SmallBullet.prototype.isAlive = function() {
	return this.alive;
};



function Emp(startCoord) {
	  this.spawned = new Date();
	  this.speed = 700;
	  this.alive = true;
	  this.centre = startCoord;
	  this.radius = 0;
};

Emp.prototype.updatePosition = function(time) {
	if (this.alive) {
		this.radius = this.speed * ((time - this.spawned.getTime()) / 1000);
		context.beginPath();
		context.arc(this.startCoord.x, this.startCoord.y, this.radius, 0, 2 * Math.PI, true);
		context.stroke();
	}		  
};

Emp.prototype.hasCollided = function(missile) {
  	if (this.alive) {
  		var missilePosition = missile.currentPosition;
  		var distanceToMissile = Trig.hypot((missilePosition.x - this.centre.x), (missilePosition.y - this.centre.y));
  		if (distanceToMissile <= this.radius) {
  			return true;
  		}
  	}
};

function Background() {
	 this.background = null;
};

Background.prototype.draw = function(context) {
	 if (this.background == null) {
		 this.drawSky(context);
		 this.drawGround(context);
		 this.drawSun(context);
	 	 this.background = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
	 } else {
		 context.putImageData(this.background, 0, 0, context.canvas.width, context.canvas.height);
	 }
};

Background.prototype.drawSky = function(context) {
	context.fillStyle = "#0099FF";	//sky blue.
	context.fillRect(0, 0, context.canvas.width, context.canvas.height);
};

Background.prototype.drawGround = function(context) {
	// Fill with a gradient.
	var gradient = context.createLinearGradient(0, 700, 0, context.canvas.height);
	gradient.addColorStop(0, '#009900');
	gradient.addColorStop(0.10, '#336600');
	gradient.addColorStop(0.50, '#7A5229');
	gradient.addColorStop(0.75,'#493119');
	context.fillStyle = gradient;
	context.fillRect(0, 700, context.canvas.width, context.canvas.height);
};

Background.prototype.drawSun = function(context) {
	var rg = context.createRadialGradient (80, 80, 20, 120, 120, 110);
	rg.addColorStop (0, 'yellow');
	rg.addColorStop (1, 'red');

	context.fillStyle = rg;
	context.beginPath();
	context.arc (120,120,110,0,2*Math.PI,false);
	context.fill();
	context.closePath();     	
};


function Jet(position) {
	this.alive = true;
	this.speed = 120;
	this.position = position;
	this.spawned = new Date();
	this.lastMoved = new Date();
};


Jet.prototype.draw = function(context) {
	context.fillStyle = "black";
	context.lineWidth = 1;
	context.beginPath();
	context.moveTo(this.position.x,this.position.y);
	context.lineTo(this.position.x + 30, this.position.y);
	context.lineTo(this.position.x + 22, this.position.y - 5);
	context.lineTo(this.position.x + 40, this.position.y - 15);
	context.closePath();
	context.stroke();
	context.fill();
};


Jet.prototype.updatePosition = function(context, time) {
	var elapsed = time - this.lastMoved.getTime();
	this.lastMoved = new Date(time);
	var distance = this.speed * (elapsed / 1000);
	this.position.x = this.position.x - distance;
	
	this.draw(context);
	this.fire(context, time);
};

Jet.prototype.fire = function(context, time) {
	if (randomInteger(0, 100) > 95) {
		jetBullets.push(new JetBullet({x: this.position.x + 5, y: this.position.y + 2}));
	}
};

function JetBullet(start) {
	this.verticalAcceleration = 50;
	this.spawned = new Date();
	this.position = start;
	this.velocity = 0;
	this.alive = true;
};

JetBullet.prototype.updatePosition = function(context, time) {
	if (this.position.y > 700) {
		this.alive = false;
	} else {
		var elapsed = time - this.spawned.getTime();
		var yVelocity = this.verticalAcceleration * (elapsed / 1000);
		var yDistance = yVelocity * (elapsed / 1000);
		context.beginPath();
		context.arc(this.position.x, this.position.y + yDistance, 2, 0, 2 * Math.PI, true);
		context.fillStyle = "red";
		context.fill();
	}
};

JetBullet.prototype.destroy = function() {
	this.alive = false;
};

JetBullet.prototype.isAlive = function() {
	return this.alive;
};

