

function Colorful(id, colorArr) {

	var step = 0;
	var colorIndices = [0,1,2,3];

	//transition speed
	var gradientSpeed = 0.002;
	var isIe9 = /msie 9/i.test(navigator.userAgent);

	id = document.getElementById(id);

	function updateGradient() {
	  
		var c0_0 = colorArr[colorIndices[0]];
		var c0_1 = colorArr[colorIndices[1]];
		var c1_0 = colorArr[colorIndices[2]];
		var c1_1 = colorArr[colorIndices[3]];

		var istep = 1 - step;
		var r1 = Math.round(istep * c0_0[0] + step * c0_1[0]);
		var g1 = Math.round(istep * c0_0[1] + step * c0_1[1]);
		var b1 = Math.round(istep * c0_0[2] + step * c0_1[2]);
		var color1 = "rgb("+r1+","+g1+","+b1+")";

		var r2 = Math.round(istep * c1_0[0] + step * c1_1[0]);
		var g2 = Math.round(istep * c1_0[1] + step * c1_1[1]);
		var b2 = Math.round(istep * c1_0[2] + step * c1_1[2]);
		var color2 = "rgb("+r2+","+g2+","+b2+")";

		id.style.background = "linear-gradient(to left, "+color1+" 0%, "+color2+" 100%)";

		if (isIe9) {

			id.style.filter = "progid:DXImageTransform.Microsoft.gradient( startColorstr='"+color1+"', endColorstr='"+color2+"',GradientType=1)"
		}
	  
		step += gradientSpeed;

		if ( step >= 1 ) {
		    step %= 1;
		    colorIndices[0] = colorIndices[1];
		    colorIndices[2] = colorIndices[3];
	    
		    colorIndices[1] = ( colorIndices[1] + Math.floor( 1 + Math.random() * (colorArr.length - 1))) % colorArr.length;
		    colorIndices[3] = ( colorIndices[3] + Math.floor( 1 + Math.random() * (colorArr.length - 1))) % colorArr.length;
	    
		}
	}

	setInterval(updateGradient, 100);
}
