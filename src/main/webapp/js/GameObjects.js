function AAEmplacement(position) {
	var spawned = new Date();
	var lastFire = spawned.getTime();

	this.updatePosition = function(time) {
		if (time - lastFire > randomInteger(400,800)) {
			lastFire = time;
			var target = {x: randomInteger(0, canvas.width), y: randomInteger(200, 400)};
			this.fireAABullet(target);
		}
	};

	this.fireAABullet = function(coordinate) {
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
}

function Explosion(centre, maxRadius) {
	var speed = 50;
	this.maxRadius = maxRadius;
	var centre = centre;
	var startTime = new Date().getTime();
	var radius = 0;
	var alive = true;
	
	this.updatePosition = function(time) {
		        			
		var elapsed = time - startTime;
		//console.log("Time: " + time + ", elapsed: " + elapsed);;
		if (radius < maxRadius) {
			radius = speed * (elapsed / 1000)
			context.globalCompositeOperation = "source-over";
			
			var rg = context.createRadialGradient (centre.x, centre.y, 10, centre.x, centre.y, maxRadius);
			rg.addColorStop (0, 'yellow');
			rg.addColorStop (1, 'red');
			context.fillStyle = rg;

			context.beginPath();
			context.arc(centre.x, centre.y, radius, 0, 2 * Math.PI, true);
			context.fill();
		} else {
			this.destroy();
		}
	}
	
	this.hasCollided = function(missile) {
		if (alive) {
			var missilePosition = missile.currentPosition;
			var distanceToMissile = Trig.hypot((missilePosition.x - centre.x), (missilePosition.y - centre.y));
			//console.log("Raduis: " + radius + ", Distance to missile: " + distanceToMissile);
			if (distanceToMissile <= radius) {
				return true;
			}
		}
	};
	
	this.destroy = function() {
		alive = false;
	};
	
	this.isAlive = function() {
		return alive;
	};
}


function Missile(startCoord) {
	  var startCoord = {x: startCoord.x, y: startCoord.y};
	  console.log("Start coordinate: " + JSON.stringify(startCoord));
	  var endCoord = {x: randomInteger(0, context.canvas.width), y: context.canvas.height};
	  console.log("End coordinate: " + JSON.stringify(endCoord));
	  var rAngle = Math.abs(Math.atan((startCoord.x - endCoord.x) / (startCoord.y - context.canvas.height)));	  
	  console.log("Angle: " + Trig.toDegrees(rAngle));
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

