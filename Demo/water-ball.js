class WaterBall {
	constructor() {
		this.option = {
			el: '',

			border: 0,
			wave: [700, 1000],
			waveObj: []
		}
	}


	/*
		添加 json 合并功能
	*/
	extendObj(obj, obj2) {
		let findObj = function(_obj, _obj2) {

			for (let key in _obj2) {

				if (typeof _obj2[key] == 'object') {
					if ( !_obj.hasOwnProperty(key) ) {

						_obj[key] = _obj2[key]
					} else {
						// get 组合过的
						_obj[key] = findObj(_obj[key], _obj2[key])
					}
					
				}
				else {
					_obj[key] = _obj2[key]
				}

			}

			return _obj
		}


		return findObj(obj, obj2)	
	}

	setCtxState ( styleOption ) {
		this.ctx.save();
		this.ctx.beginPath();

		for ( let i in styleOption) {
			this.ctx[i] = styleOption[i]
		}
	}

	/*
		@style [object] 样式 
		eg: {lineWidth: 2,fillStyle: 'transparent'}
		@hasStroke 是否有边框
	*/
	drawARC (x, y, R, sAngle, eAngle, counterclockwise, style, hasStroke = false) {

		this.setCtxState(style);

		this.ctx.arc(x, y, R, sAngle, eAngle, counterclockwise);
		if (hasStroke)
			this.ctx.stroke();
		this.ctx.fill();
		this.ctx.restore();
	}

	/*
		绘制波浪
	*/
	drawWave ( deg ) {

		this.ctx.save();
		this.ctx.beginPath();
		this.ctx.fillStyle = `rgba(76, 175, 80, .5)`;
		// this.ctx.globalCompositeOperation = "source-atop"

		this.ctx.moveTo(0, 300);
		this.ctx.lineTo(0, 150);
		this.ctx.bezierCurveTo(0, 150, 200, 190, 300, 150);
		this.ctx.lineTo(300, 150);
		this.ctx.lineTo(300, 300);

		this.ctx.beginPath();
		this.ctx.moveTo(0, 300);
		this.ctx.lineTo(0, 150);

		let perDrg = Math.PI / 180;
		// 总宽度得到的波浪个数
		let step = 1*  360 / this.width;
		let waterHeight = 10;


		for (let i = 0; i <= 300; i++) {

			let y = 150 + waterHeight * Math.sin( (i + deg) * step * perDrg);

			this.ctx.lineTo(i, y);

		}

		this.ctx.lineTo(300, 150);
		this.ctx.lineTo(300, 300);

		this.ctx.fill();
		this.ctx.restore();
	}

	animate () {

		let _self = this;
		let startDeg = 0;

		let run = function() {

			_self.ctx.clearRect(0, 0, _self.width, _self.height);

			for (let i = 0; i < 2; i++) {


				let _wave = _self.option.waveObj[i];
				_wave.x = _wave.x > _self.width ? 0 : _wave.x;

				_self.drawWave( _wave.x );

				_wave.x+= (_wave.speed/1000)
			}

			_self.drawARC(_self.R, _self.R, _self.R * .9 - _self.option.border - 2, 0, Math.PI * 2, false, {
				lineWidth: 0,
				globalCompositeOperation: 'destination-in',
				fillStyle: '#fff'
			})

			_self.drawARC(_self.R, _self.R, _self.R * .9, 0, Math.PI * 2, false, {
				lineWidth: _self.option.border,
				fillStyle: 'transparent'
			}, true);

			requestAnimationFrame( run )

		}

		run()

	}

	init(option) {

	}


	setOption(option) {

		let _ = this;

		let Wave = function(speed) {
			this.speed = speed;
			this.x = ~~ (Math.random() * _.width);
		}

		_.option = _.extendObj(_.option, option)

		_.canvas = document.querySelector(option.el);
		_.ctx = _.canvas.getContext('2d');
		_.width = parseInt(_.canvas.style.width || window.getComputedStyle(_.canvas, null).width);
		_.height = parseInt(_.canvas.style.height || window.getComputedStyle(_.canvas, null).height);
		_.R = _.option.R || Math.min(_.canvas.width, _.canvas.height) / 2;

		_.option.wave.map((val) => {
			_.option.waveObj.push( new Wave(val) )
		})

		_.animate()

	}
}