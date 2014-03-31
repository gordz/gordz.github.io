var Shapes = {
		strokeTriangle: function(a, b, c) {
			context.beginPath();
			context.moveTo(a.x, a.y);
			context.lineTo(b.x, b.y);
			context.lineTo(c.x, c.y);
			context.closePath();
			context.stroke();
		},

		drawHorizontalRandomJagged: function(context, minY, maxY, minPoints, maxPoints) {
			var numPoints = randomInteger(minPoints, maxPoints);
			console.log("numPoints: " + numPoints);

			// Generate random points.
			var points = [];
			for (var i = 0; i < numPoints; i++) {
				var x = Math.ceil(Math.random() * context.canvas.width);
				var y = randomInteger(minY, maxY);
				points.push({ x: x, y: y});
			}

			// Sort by x co-ordinate.
			points.sort(function(a, b) { 
				return a.x - b.x;
			});

			// Start at x = 0	
			context.beginPath();
			context.moveTo(0, randomInteger(minY, maxY));
			points.forEach(function(point) {
				context.lineTo(Number.toInteger(point.x), Number.toInteger(point.y));
			});
			// Finish at x = canvas width.
			context.lineTo(context.canvas.width, randomInteger(minY, maxY));

			// Close to form polygon.
			context.lineTo(context.canvas.width, context.canvas.height);
			context.lineTo(0, context.canvas.height);
			context.closePath();

			// Fill with a gradient.
			var gradient = context.createLinearGradient(0, minY, 0, context.canvas.height);
			gradient.addColorStop(0, '#009900');
			gradient.addColorStop(0.25, '#336600');
			gradient.addColorStop(0.50, '#7A5229');
			gradient.addColorStop(0.75,'#493119');
			context.fillStyle = gradient;
			context.fill();
		}
};