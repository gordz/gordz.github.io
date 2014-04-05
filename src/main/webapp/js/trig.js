/**
* Library to assist with trigonometry related functions.
**/
var Trig = {
		toDegrees: function(radians) {
			// 2 PI rads = 360 degrees
			// 1 rad = 180 / PI degrees
			return radians * (180 / Math.PI);
		},

		toRadians: function(degrees) {
			// 360 degrees = 2 PI radians
			// 1 degree = PI / 180 radians
			return degrees * (Math.PI / 180);
		},

		hypot: function() {
			var sumOfSquares = 0;
			for (var i = 0; i < arguments.length; i++) {
				var square = Math.pow(arguments[i], 2);
				sumOfSquares += square;
			}
			return Math.sqrt(sumOfSquares);
		}
};
