
function colorFul(id, colors) {
	var canvas = document.getElementById(id);
	var ctx = canvas.getContext('2d');
	var startColor = endColor = {};
	var gradientSpeed = 0.002;
	var step = 0;

	// color table indices for: 
	// current color left
	// next color left
	// current color right
	// next color right
	var colorIndices = [0,1,2,3];

	var getColor = {
		num: function() {
			return parseInt(Math.random()*255);
		},
		rgb: function() {
			return 'rgb('+this.num+','+this.num+','+this.num+')';
		}
	}

	var animate = function() {

		var gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);

		var changeColor = function() {
			startColor.r = parseInt(startColor.r + gradientSpeed);
			startColor.g = parseInt(startColor.g + gradientSpeed);
			startColor.b = parseInt(startColor.b + gradientSpeed);

			return 'rgb('+startColor.r+','+startColor.g+','+startColor.b+')';
		}

		var c0_0 = colors[colorIndices[0]];
		var c0_1 = colors[colorIndices[1]];
		var c1_0 = colors[colorIndices[2]];
		var c1_1 = colors[colorIndices[3]];

		var istep = 1 - step;
		var r1 = Math.round(istep * c0_0[0] + step * c0_1[0]);
		var g1 = Math.round(istep * c0_0[1] + step * c0_1[1]);
		var b1 = Math.round(istep * c0_0[2] + step * c0_1[2]);
		var color1 = "rgb("+r1+","+g1+","+b1+")";

		var r2 = Math.round(istep * c1_0[0] + step * c1_1[0]);
		var g2 = Math.round(istep * c1_0[1] + step * c1_1[1]);
		var b2 = Math.round(istep * c1_0[2] + step * c1_1[2]);
		var color2 = "rgb("+r2+","+g2+","+b2+")";


		gradient.addColorStop(0, color1);
		gradient.addColorStop(1, color2);

		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		
		step += gradientSpeed;
  
		if ( step >= 1 ) {
			step %= 1;
		    colorIndices[0] = colorIndices[1];
		    colorIndices[2] = colorIndices[3];
    
		    //pick two new target color indices
		    //do not pick the same as the current one
			colorIndices[1] = ( colorIndices[1] + Math.floor( 1 + Math.random() * (colors.length - 1))) % colors.length;
			colorIndices[3] = ( colorIndices[3] + Math.floor( 1 + Math.random() * (colors.length - 1))) % colors.length;
		}

		requestAnimationFrame(animate)
	}

	window.requestAnimationFrame =  window.requestAnimationFrame ||
                					window.webkitRequestAnimationFrame ||
                					window.mozRequestAnimationFrame ||
                					window.msRequestAnimationFrame ||
                					function(callback) {
                    					return window.setTimeout(callback, 1000/60)
                					}; 

	requestAnimationFrame(animate)

}

