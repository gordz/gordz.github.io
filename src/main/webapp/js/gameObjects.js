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
	this._maxRadius = maxRadius;
	this._spawned = new Date();
	this._radius = 0;
	this._alive = true;
	this._position = position;
	this._speed = 50;
};

Explosion.prototype.updatePosition = function(time) {
	var elapsed = time - this._spawned.getTime();
	//console.log("Time: " + time + ", elapsed: " + elapsed);;
	if (this._radius < this._maxRadius) {
		this._radius = this._speed * (elapsed / 1000);
		context.globalCompositeOperation = "source-over";
		
		var rg = context.createRadialGradient (this._position.x, this._position.y, 10, this._position.x, this._position.y, this._maxRadius);
		rg.addColorStop (0, 'yellow');
		rg.addColorStop (1, 'red');
		context.fillStyle = rg;
		context.beginPath();
		context.arc(this._position.x, this._position.y, this._radius, 0, 2 * Math.PI, true);
		context.fill();
	} else {
		this.destroy();
	}
};

Explosion.prototype.isAlive = function() {
	return this._alive;
};

Explosion.prototype.destroy = function() {
	this._alive = false;
};

Explosion.prototype.hasCollided = function(missile) {
	if (this._alive) {
		var missilePosition = missile.currentPosition;
		var distanceToMissile = Trig.hypot((missilePosition.x - this._position.x), (missilePosition.y - this._position.y));
		if (distanceToMissile <= this._radius) {
			return true;
		}
	}
};


function Missile(startCoord) {
	  var startCoord = {x: startCoord.x, y: startCoord.y};
	  var endCoord = {x: randomInteger(0, context.canvas.width), y: context.canvas.height};
	  var rAngle = Math.abs(Math.atan((startCoord.x - endCoord.x) / (startCoord.y - context.canvas.height)));	  
	  this.currentPosition = {x: startCoord.x, y: startCoord.y};
	  var distance = 0;
	  var speed = randomInteger(30,90);
	  var alive = true;
	  var spawned = new Date();

	  // Determine speed & direction
	  if (startCoord.x > endCoord.x) {
		  speed = -speed;
	  }
	  
	  
	  this.updatePosition = function(time) {
		  if (alive) { 			  
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
	  };
	  
	  this.destroy = function() {
		  alive = false;
		  explosions.push(new Explosion({x: this.currentPosition.x, y: this.currentPosition.y}, 60));
	  };
	  
	  this.isAlive = function() {
		  return alive;
	  };
}

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
	this._alive = true;
	
	// Determine speed & direction
	if (start.x > end.x) {
		speed = -speed;
	}
	
	this.updatePosition = function(time) {
		  if (this._alive) {
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
	this._alive = false;
};

SmallBuller.prototype.isAlive = function() {
	return this._alive;
}
