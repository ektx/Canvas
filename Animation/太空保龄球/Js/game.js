jQuery(document).ready(function($) {
	var canvas = $("#gameCanvas");
	var context = canvas.get(0).getContext("2d");

	var canvasWidth = canvas.width();
	var canvasHeight = canvas.height();

	// 游戏设置
	var playgeme;

	// 创建圆形平台对象
	// 平台原点
	var platformX;
	var platformY;
	// 外半径，整个平台区域
	var platformOuterRadius;
	// 内半径，实际放置小行星的区域
	var platformInnerRadius;

	platformX = canvasWidth/2;
	platformY = 150;
	platformOuterRadius = 100;
	platformInnerRadius = 75;

	var asteroids;

	// 玩家使用小行星
	var player;
	var playerOrginalX;
	var playerOrginalY;

	// 事件监听器
	var playerSelected;			// 用户是否在使用小行星
	var playerMaxAbsVelocity;
	var playerVeocityDampener;
	var powerX;
	var powerY;

	// 分数
	var score;


	var Asteroid = function(x, y, radius, mass, friction) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.mass = mass;
		this.friction = friction;
		this.vX = 0;
		this.vY = 0;
		this.player = false;
	}



	var ui = $("#gameUI");
	var uiIntro = $("#gameIntro");
	var uiStats = $("#gameStats");
	var uiComplete = $("#gameComplete");
	var uiPlay = $("#gamePlay");
	var uiReset = $("#gameReset");
	var uiRemaining = $("#gameRemaining");
	var uiScore = $(".gameScore");

	function resetPlayer() {
		player.x = playerOrginalX;
		player.y = playerOrginalY;
		player.vX = 0;
		player.vY = 0;
	}

	// 重置和启动游戏
	function startGame() {
		uiScore.html("0");
		uiStats.show();
		// 初始游戏设置
		playgeme = false;

		asteroids = new Array();

		playerSelected = false;		// 设置用户没有使用小行星
		playerMaxAbsVelocity = 30;	// 
		playerVeocityDampener = 0.3;
		powerX = -1;
		powerY = -1;

		// 设置默认分数
		score = 0;


		// 玩家使用小行星信息
		var pRadius = 15;	// 声名半径
		var pMass = 10;		// 声名质量
		var pFriction = 0.97;	// 声名摩擦力
		playerOrginalX = canvasWidth/2;			// 小球位置 x
		playerOrginalY = canvasHeight - 100;	// 小球位置 y
		player = new Asteroid(playerOrginalX, playerOrginalY, pRadius, pMass, pFriction);
		player.player = true;
		asteroids.push(player);

		var outerRing = 8; 	// 外圈上的在小行星数目
		var ringCount = 3;	// 圈数
		var ringSpacing = (platformInnerRadius/(ringCount -1));	//每个圈之间的距离

		for (var r = 0; r < ringCount; r++) {
			var currentRing = 0;		// 当前圈上的小行星数目
			var angle = 0;				// 每个小行星之间的角度
			var ringRadius = 0;

			// 判断是否是最里层的圈
			if (r == ringCount - 1) {
				currentRing = 1;
			} else {
				currentRing = outerRing - (r*3);
				angle = 360/currentRing;
				ringRadius = platformInnerRadius - (ringSpacing*r);
			}

			for (var a = 0; a < currentRing; a++) {
				var x = 0;
				var y = 0;

				if(r == ringCount -1) {
					x = platformX;
					y = platformY;
				} else {
					x = platformX + (ringRadius*Math.cos((angle*a)*(Math.PI/180)));
					y = platformY + (ringRadius*Math.sin((angle*a)*(Math.PI/180)));
				};

				var radius = 10;
				var mass = 5;
				var friction = 0.95;
				asteroids.push(new Asteroid(x, y, radius, mass, friction));
			}
		};

		uiRemaining.html(asteroids.length - 1);

		$(window).mousedown(function(e) {
			if (!playerSelected && player.x == playerOrginalX && player.y == playerOrginalY) {
				var canvasOffset = canvas.offset();
				var canvasX = Math.floor(e.pageX - canvasOffset.left);
				var canvasY = Math.floor(e.pageY - canvasOffset.top);

				if (!playgeme) {
					playgeme = true;
					animate();
				};

				var dX = player.x - canvasX;
				var dY = player.y - canvasY;
				var distance = Math.sqrt((dX * dX) + (dY * dY));
				var padding = 5;

				if (distance < player.radius + padding) {
					powerX = player.x;
					powerY = player.y;
					playerSelected = true;
				}
			}	
		});
		$(window).mousemove(function(e) {
			var canvasOffset = canvas.offset();
			var canvasX = Math.floor(e.pageX - canvasOffset.left);
			var canvasY = Math.floor(e.pageY - canvasOffset.top);

			var dX = canvasX - player.x;
			var dY = canvasY - player.y;
			var distance = Math.sqrt((dX * dX) + (dY * dY));

			if (distance*playerVeocityDampener < playerMaxAbsVelocity) {
				powerX = canvasX;
				powerY = canvasY;
			} else {
				var ratio = playerMaxAbsVelocity / (distance * playerVeocityDampener);
				powerX = player.x + (dX * ratio);
				powerY = player.y + (dY * ratio);
			}
		});
		$(window).mouseup(function(e) {
			if (playerSelected) {
				var dX = powerX - player.x;
				var dY = powerY - player.y;

				player.vX = -(dX * playerVeocityDampener);
				player.vY = -(dY * playerVeocityDampener);

				// 更新分数 
				uiScore.html(++score);
			};

			playerSelected = false;
			powerX = -1;
			powerY = -1;
		});

		// 开始动画
		animate();

	};

	// 初始化游戏环境
	function init() {
		uiStats.hide();
		uiComplete.hide();

		uiPlay.click(function(e) {
			e.preventDefault();
			uiIntro.hide();
			startGame();
		});

		uiReset.click(function(e) {
			e.preventDefault();
			uiComplete.hide();
			startGame();
		})
	}

	// 动画循环，游戏的趣味就在这里
	function animate() {
		// 清除画布
		context.clearRect(0, 0, canvasWidth, canvasHeight);

		// 绘制出圆形平台
		context.fillStyle = "rgb(100, 100, 100)";
		context.beginPath();
		context.arc(platformX, platformY, platformOuterRadius, 0, Math.PI*2, true);
		context.closePath();
		context.fill();

		if (playerSelected) {
			context.strokeStyle = "rgb(255, 255, 255)";
			context.lineWidth = 3;
			context.beginPath();
			context.moveTo(player.x, player.y);
			context.lineTo(powerX, powerY);
			context.closePath();
			context.stroke();
		}

		context.fillStyle = "rgb(255, 255, 255)";

		// 临时数组，存储平台掉落小行星
		var deadAsteroids = new Array();
		var asteroidsLength = asteroids.length;
		for (var i = 0; i < asteroidsLength; i++) {
			var tmpAsteroid = asteroids[i];

			for (var j = i+1; j < asteroidsLength; j++) {
				var tmpAsteroidB = asteroids[j];

				var dX = tmpAsteroidB.x - tmpAsteroid.x;
				var dY = tmpAsteroidB.y - tmpAsteroid.y;
				var distance = Math.sqrt((dX * dX) + (dY * dY));

				if (distance < tmpAsteroidB.radius + tmpAsteroidB.radius) {
					var angle = Math.atan2(dY, dX);
					var sine = Math.sin(angle);
					var cosine = Math.cos(angle);

					// 旋转小行星的位置
					var x = 0;
					var y = 0;

					// 旋转小行星B的位置
					var xB = dX * cosine + dY * sine;
					var yB = dY * cosine - dX * sine;

					// 旋转小行星的速度
					var vX = tmpAsteroid.vX * cosine + tmpAsteroid.vY *sine;
					var vY = tmpAsteroid.vY * cosine - tmpAsteroid.vX *sine;

					// 旋转小行星B的速度
					var vXb = tmpAsteroidB.vX * cosine + tmpAsteroidB.vY *sine;
					var vYb = tmpAsteroidB.vY * cosine - tmpAsteroidB.vX *sine;

					// 保持动量
					var vTotal = vX - vXb;
					vX = ((tmpAsteroid.mass - tmpAsteroidB.mass) * vX + 2 * tmpAsteroidB.mass * vXb) / (tmpAsteroid.mass + tmpAsteroidB.mass);
					vXb = vTotal + vX;

					// 将小行星分开
					xB = x + (tmpAsteroid.radius + tmpAsteroidB.radius);

					// 转回小行星的位置
					tmpAsteroid.x = tmpAsteroid.x + (x * cosine - y * sine);
					tmpAsteroid.y = tmpAsteroid.y + (y * cosine + x * sine);

					tmpAsteroidB.x = tmpAsteroid.x + (xB * cosine - yB * sine);
					tmpAsteroidB.y = tmpAsteroid.y + (yB * cosine + xB * sine);

					// 转回小行星的速度
					tmpAsteroid.vX = vX * cosine - vY * sine;
					tmpAsteroid.vY = vY * cosine + vX * sine;

					tmpAsteroidB.vX = vXb * cosine - vYb * sine;
					tmpAsteroidB.vY = vYb * cosine + vXb * sine;
				}
			};

			// 计算新位置
			tmpAsteroid.x += tmpAsteroid.vX;
			tmpAsteroid.y += tmpAsteroid.vY;

			// 摩擦力
			if (Math.abs(tmpAsteroid.vX) > 0.1) {
				tmpAsteroid.vX *= tmpAsteroid.friction;
			} else {
				tmpAsteroid.vX = 0;
			};
			if (Math.abs(tmpAsteroid.vY) > 0.1) {
				tmpAsteroid.vY * tmpAsteroid.friction;
			} else {
				tmpAsteroid.vY = 0;
			}

			if (!tmpAsteroid.player) {
				var dXp = tmpAsteroid.x - platformX;
				var dYp = tmpAsteroid.y - platformY;
				var distanceP = Math.sqrt((dXp * dXp) + (dYp * dYp));

				if (distanceP > platformOuterRadius) {
					if (tmpAsteroid.radius > 0) {
						tmpAsteroid.radius -= 2;
					} else {
						deadAsteroids.push(tmpAsteroid);
					};
				};
			};
		
			// 检查玩家小行星的位置
			if (player.x != playerOrginalX && player.y != playerOrginalY) {
				if (player.vX == 0 && player.vY == 0) {
					resetPlayer();
				} else if (player.x + player.radius < 0) {
					resetPlayer();
				} else if (player.x - player.radius > canvasWidth) {
					resetPlayer();
				} else if (player.y + player.radius < 0) {
					resetPlayer();
				} else if (player.y - player.radius > canvasHeight) {
					resetPlayer();
				};
			};

			context.beginPath();
			context.arc(tmpAsteroid.x, tmpAsteroid.y, tmpAsteroid.radius, 0, Math.PI*2, true);
			context.closePath();
			context.fill();
		};

		var deadAsteroidsLength = deadAsteroids.length;
		if (deadAsteroidsLength > 0) {
			for (var di = 0; di < deadAsteroidsLength; di++) {
				var tmpDeadAsteroid = deadAsteroids[di];
				asteroids.splice(asteroids.indexOf(tmpDeadAsteroid), 1);
			}

			var remaining = asteroids.length - 1;
			uiRemaining.html(remaining);

			if (remaining == 0) {
				// 获胜
				playgeme = false;
				uiStats.hide();
				uiComplete.show();

				$(window).unbind("mousedown");
				$(window).unbind("mouseup");
				$(window).unbind("mousemove");
			}
		}

		if (playgeme) {
			setTimeout(animate, 33);
		}
	}

	init();
});