describe("Trig", function() {
	it("should calculate the hypotenuse of a right angle triangle", function() {
		var hypotenuse = Trig.hypot(3, 4);
		expect(hypotenuse).toEqual(5);
	});
	
	it("should convert radians to degrees", function() {
		expect(Trig.toDegrees(2 * Math.PI)).toEqual(360);
	});
	
	it("should convert degrees to radians", function() {
		expect(Trig.toRadians(360)).toEqual(2 * Math.PI);
	});
	
});