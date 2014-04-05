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

function Explosion(position, maxRadius) {
	this.maxRadius = maxRadius;
	this.spawned = new Date();
	this.radius = 0;
	this.alive = true;
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
	  	 var yDisplacement = Math.abs(distance) * Math.cos(this._rAngle);
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

