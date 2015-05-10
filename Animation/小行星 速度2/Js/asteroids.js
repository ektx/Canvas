$(document).ready(function() {
	var canvas = $('#canvas');
	var context = canvas.get(0).getContext('2d');
	
	var canvasWidth = canvas.width();
	var canvasHeight = canvas.height();

	$(window).resize(resizeCanvas);
	
	function resizeCanvas() {
		canvas.attr('width', $(window).get(0).innerWidth);
		canvas.attr('height', $(window).get(0).innerHeight);
	}

	resizeCanvas();

	var playAnimation = true;

	var startButton = $('#startAnimation');
	var stopButton = $('#stopAnimation');

	stopButton.hide();
	startButton.click(function() {
		$(this).hide();
		stopButton.show();

		playAnimation = true;
		animate();
	});

	stopButton.click(function() {
		$(this).hide();
		startButton.show();

		playAnimation = false;
	});

	var Asteroids = function(x, y, radius, vX, vY) {
		this.x = x;
		this.y = y;
		this.radius = radius;

		this.vX = vX;
		this.vY = vY;
	};

	var asteroids = new Array();

	for (var i = 0; i<50; i++) {
		var x = 110+(Math.random()*(canvasWidth-40));
		var y = 100+(Math.random()*(canvasHeight-40));
		var radius = 5+Math.random()*50;
		var vX = Math.random()*4-2;
		var vY = Math.random()*4-2;

		asteroids.push(new Asteroids(x, y, radius, vX, vY));
	}
	
	function animate() {
		var canvasWidth = canvas.width();
		var canvasHeight = canvas.height();
		
		context.clearRect(0,0, canvasWidth, canvasHeight);
		context.fillStyle = "rgb(255, 255, 255)";

		var asteroidsLength = asteroids.length;
		for (var i = 0; i < asteroidsLength; i++) {
			var tmpAsteroid = asteroids[i];

			tmpAsteroid.x += tmpAsteroid.vX;
			tmpAsteroid.y += tmpAsteroid.vY;

			context.beginPath();
			context.arc(tmpAsteroid.x, tmpAsteroid.y, tmpAsteroid.radius, 0, Math.PI*2, false);
			context.closePath();
			context.fill();

			if (tmpAsteroid.x - tmpAsteroid.radius < 0) {
				tmpAsteroid.x - tmpAsteroid.radius;
				tmpAsteroid.vX *= -1;
			} else if (tmpAsteroid.x + tmpAsteroid.radius > canvasWidth) {
				tmpAsteroid.x = canvasWidth - tmpAsteroid.radius;
				tmpAsteroid.vX *= -1;
			}
			if (tmpAsteroid.y - tmpAsteroid.radius < 0) {
				tmpAsteroid.y - tmpAsteroid.radius;
				tmpAsteroid.vY *= -1;
			} else if (tmpAsteroid.y + tmpAsteroid.radius > canvasHeight) {
				tmpAsteroid.y = canvasHeight - tmpAsteroid.radius;
				tmpAsteroid.vY *= -1;
			}
		}

		if (playAnimation) {
			// 1000 / 30 = 33 一秒钟，出现30帧动画，每个约用时33毫秒
			setTimeout(animate, 33);
		}
	}
});