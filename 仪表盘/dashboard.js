/*
Dashboard 仪表盘
------------------------------------------------
说明：

dashboard('canvas', {
	R: 100, // 半径
	bgColor: '#32424f', // 表盘颜色
	// 进度条
	progress: {
		txt: 90,            // 进度
		font: '60px arial', // 大小，字体，
		top: -5,            // 向上位移
		left: -15,          // 向下位移
		color: '#c00',      // 文字颜色
		barColor: '#c00',   // 进度条颜色,默认蓝色
		barW: 30,			// 进度条宽
		barBG: false		// 进度条背景是否显示
		barBgColor: '#eee'  // 进度条背景色
	},
	// 百分号
	per: {
		top: 10,
		left: 0
	},
	// 二级标题
	subtitle: {
		txt: '这是测试',	// 内容
		font: '30px arial',	// 大小，字体
		color: '#C30',		// 颜色
		top: 0,				// 向上位移
		left: 0				// 向下位移
	},
	// 开始位置
	start: 90,
	// 进度条方向 true 为逆时针, false 为顺时针（默认）
	anticlockwise: true
});
*/

function dashboard(id, board) {
	var canvas = document.getElementById(id);
	var ctx = canvas.getContext('2d');

	// 半径
	var R = board.R || 100;
	// 方向
	var anticlockwise = board.anticlockwise || false;
	// 进度条宽
	var progress = board.progress || {};
	// 进度, 0-100
	var proTxt = progress.txt || 0;
	var lineW = progress.barW || 0;

	// 起启位置
	var start = board.start || 0;

	var barBgColor = progress.barBgColor || '#eee';
	
	var end = proTxt/100 * 360;
	var endDeg = 0;
	var startDeg = Math.PI * (start / 180) || 0;

	// 绘制文字 
	var drawFont = function(txt, color, font, top, left) {
		left = left || 0;
		top = top || 0;

		ctx.fillStyle = color || '#FFF';
		ctx.font = font || '14px Arial';
		ctx.textAlign = 'center';
		ctx.fillText(txt, canvas.width/2 + left, canvas.height/2+ top);
	}

	var drawBar = function(x, y, r, s, e, ant, c) {
		ctx.strokeStyle = c;
		ctx.beginPath();
		ctx.arc(x, y, r, s, e, ant);
		ctx.lineWidth = lineW;
		ctx.stroke();
	}

	// 优化 100% 时无法出现进度条
	if (end == 360) anticlockwise = false;

	if (anticlockwise) {
		endDeg = Math.PI * ( (360 - end + start) / 180);
	} else {
		endDeg = Math.PI * (end / 180) + startDeg
	}

	ctx.clearRect(0, 0, canvas.width, canvas.height);


	// 中心盘
	var x = canvas.width/2;
	var y = canvas.height/2;

	ctx.fillStyle = board.bgColor || '#09f';
	ctx.beginPath();
	ctx.arc(x, y, R, 0, Math.PI*2, false);
	ctx.lineWidth = R - lineW;
	ctx.fill();
	

	//* 进度条

	// 进度条颜色
	var lineColor = progress.barColor || '#09f';
	// 进度条背景
	if (progress.barBG) {
		drawBar(x, y, R+ lineW/2, 0, Math.PI*2, false, barBgColor);
	}
	// 进度条
	drawBar(x, y, R+ lineW/2, startDeg, endDeg, anticlockwise, lineColor);


	// 提示文字
	var subT = board.subtitle || {};
	var subTxt =  subT.txt || '';
	var subFont = subT.font;
	var subC = subT.color;
	var subTxtSize = Number(subFont.match(/\d+(?=px)/)[0]);
	var subTop = subT.top || 0;
	var subL = subT.left || 0;
	drawFont(subTxt, subC, subFont, subTxtSize+subT.top, subL);

	// 进度文字
	drawFont(proTxt, progress.color, progress.font, progress.top, progress.left);

	// %
	var perSize = Number(progress.font.match(/\d+(?=px)/)[0]);
	var perFont = progress.font.replace(perSize, perSize/2);
	var per = board.per || {};
	var perT = per.top  || 0;
	var perL = per.left || 0;

	var perMoveX = 0;
	switch ( (proTxt+'').length ) {
		case 1:
			perMoveX = perSize/2;
			break;

		case 2:
			perMoveX = perSize;
			break;

		case 3:
			perMoveX = perSize/2*3;
			break;

		case 4:
			perMoveX = perSize*2;
			break;

		case 5:
			perMoveX = perSize/2*5;
	}

	drawFont('%', progress.color, perFont, perT - perSize/2, perL + perMoveX/2 )

}