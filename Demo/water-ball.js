class WaterBall {
	constructor() {
		this.option = {
			el: '',

			border: 0
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
	*/
	drawARC (x, y, R, sAngle, eAngle, counterclockwise, style) {

		this.setCtxState(style);

		this.ctx.arc(x, y, R, sAngle, eAngle, counterclockwise);
		this.ctx.stroke();
		this.ctx.fill();
		this.ctx.restore();
	}

	init(option) {

	}

	setOption(option) {

		this.option = this.extendObj(this.option, option)

		this.canvas = document.querySelector(option.el);
		this.ctx = this.canvas.getContext('2d');
		this.R = this.option.R || Math.min(this.canvas.width, this.canvas.height) / 2;

		this.drawARC(this.R, this.R, this.R * .9, 0, Math.PI * 2, false, {
			lineWidth: this.option.border,
			fillStyle: 'transparent'
		})

		this.drawARC(this.R, this.R, this.R * .9 - this.option.border - 2, 0, Math.PI * 2, false, {
			lineWidth: 0,
			fillStyle: 'green'
		})

		this.ctx.beginPath();
		this.ctx.moveTo(0, 300);
		this.ctx.lineTo(0, 150);
		this.ctx.bezierCurveTo(0, 150, 200, 190, 300, 150);
		this.ctx.lineTo(300, 150);
		this.ctx.lineTo(300, 300);

		this.ctx.stroke();
		this.ctx.fill();


	}
}