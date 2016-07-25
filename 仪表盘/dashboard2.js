/*
	Dashboard 仪表盘
	---------------------------------------------------
	@id 元素id
	@board: 设置信息

	示例：
	options = {
		bgColor: '#095',
		// 进度条
		progress: {
			value: 91.53,            // 进度
			barColor: '#c00',   // 进度条颜色,默认蓝色
			barW: 10,			// 进度条宽
			barBG: true,		// 进度条背景
			barBgColor: '#f90'
		},
		text: [
			{
				value: '91.53',
				color: '#fff',
				fontSize: '42px',
				top: -20,
				left: 0
			},
			{
				value: '%',
				color: '#fff',
				fontSize: '12px',
				top: -40,
				left: 60
			},
			{
				value: '说的什么好呢？',
				color: '#fff',
				fontSize: '24px',
				top: 40
			},
			{
				value: '说的什么好呢？',
				color: '#fff',
				fontSize: '12px',
				top: 60
			}
		],
		// 进度条方向 true 为逆时针, false 为顺时针（默认）
		anticlockwise: true
	},

	dashboard('canvas', options);
	---------------------------------------------------
	zwl <530675800@qq.com>					  2016/7/18	
*/

function dashboard(id, board) {

	var canvas = document.getElementById(id);
	var ctx = canvas.getContext('2d');
	// 方向
	var anticlockwise = board.anticlockwise || false;
	// 进度条
	var progress = board.progress || {};
	// 进度, 0-100
	var proTxt = progress.value || 0;
	var lineW = progress.barW || 0;
	var R = Math.min(canvas.width, canvas.height) / 2 - lineW -2;

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
		ctx.font = (font || '14px') +' "microsoft yahei","宋体",arial,tahoma,helvetica,sans-serif';
		ctx.textAlign = 'center';
		ctx.fillText(txt, canvas.width/2 + left, canvas.height/2+ top);
	}

	// 绘制进度条
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
	

	// 进度条颜色
	var lineColor = progress.barColor || '#09f';
	// 进度条背景
	if (progress.barBG) {
		drawBar(x, y, R+ lineW/2, 0, Math.PI*2, false, barBgColor);
	}
	// 进度条
	drawBar(x, y, R+ lineW/2, startDeg, endDeg, anticlockwise, lineColor);


	// 提示文字
	for (var i = 0; i < board.text.length; i++) {
		drawFont(
			board.text[i].value, 
			board.text[i].color, 
			board.text[i].fontSize, 
			board.text[i].top, 
			board.text[i].left
		);
	}

}


/*
	动画仪表
	---------------------------------------------------
	@id 元素id
	@board: 设置信息
	@duration: 动画时间 

	示例：
	options = {
		bgColor: '#095',
		// 进度条
		progress: {
			value: 91.53,            // 进度
			barColor: '#c00',   // 进度条颜色,默认蓝色
			barW: 10,			// 进度条宽
			barBG: true,		// 进度条背景
			barBgColor: '#f90'
		},
		text: [
			{
				value: '91.53',
				color: '#fff',
				fontSize: '42px',
				top: -20,
				left: 0
			},
			{
				value: '%',
				color: '#fff',
				fontSize: '12px',
				top: -40,
				left: 60
			},
			{
				value: '说的什么好呢？',
				color: '#fff',
				fontSize: '24px',
				top: 40
			},
			{
				value: '说的什么好呢？',
				color: '#fff',
				fontSize: '12px',
				top: 60
			}
		],
		// 进度条方向 true 为逆时针, false 为顺时针（默认）
		anticlockwise: true
	};

	var callback = function() {
		board.progress.value = newVal;
		board.text[0].value = newVal;

		return;
	}

	aniDashboard('canvas', options, 3000);
	---------------------------------------------------
	zwl <530675800@qq.com>					  2016/7/18	
*/
function aniDashboard(id, board, duration, callback) {

	// 总长度，这里我们设置为 100%
	var to = board.progress.value;

	// @delay: 动画帧数
	// @duration: 动画运行时间
	// @delta: 对进度操作,目前是固定动画效果
	// @step: 每一帧操作
	animate({
		delay: 10,
		duration: duration || 1000,
		delta: makeEaseOut(quad),
		step: function(delta) {

			var newVal = to * delta

			board = callback(board, newVal)

			dashboard(id, board)

		}
	})
}


function animate(opts) {

	var start = new Date
	
	var id = setInterval(function() {
		var timePassed = new Date - start;
		// 进程，已经完成了多少，从0到1
		var progress = timePassed / opts.duration


		if (progress > 1) progress = 1;
		var delta = opts.delta(progress)
		opts.step(delta)

		if (progress == 1) clearInterval(id)
	}, opts.delay || 10)
}


function quad(progress) {
	return Math.pow(progress, 5)
}

function makeEaseOut(delta) {
	return function(progress) {
		return 1 - delta(1 - progress)
	}
}
