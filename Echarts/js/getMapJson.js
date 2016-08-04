
function getMapJson (optionObj) {
	var url = optionObj.url;
	var regName = optionObj.regName;
	var id = optionObj.id;
	var mapPath = optionObj.mapPath || '../map/';
	var mapRoute = optionObj.route || false;

	if (!mapRoute) {
		$.ajax({
			url: mapPath+'mapRoute.json',
			type: 'get',
			dataType: 'json'
		})
		.done(function(route) {
			console.log(route);
			url = mapPath + route[regName];
			getMap(url, regName, id)
		})
		.fail(function(err) {
			console.error('Not Find mapPath')
		})
		
	}

}


function getMap(url, regName, id) {
	var colorArr = ['#f44336','#E91E63','#9C27B0','#673AB7','#3F51B5','#2196F3','#03A9F4','#00BCD4','#009688','#4CAF50','#8BC34A','#FF9800'];
	var colorLen = colorArr.length;
	
	var myEChart = echarts.init(document.getElementById(id));

	var resetMapInfo = function(json) {
		console.log(json)

		// 基于准备好的 dom, 初始化 echarts 实例
		echarts.registerMap(regName, json)
		var idata = [];

		// 随机颜色
		for (var i = 0; i < json.features.length; i++) {
			idata[i] = {
				name : json.features[i].properties.name,
				itemStyle: {
					normal: {
						areaColor: colorArr[parseInt(Math.random() * colorLen)]
					}
				}
			}
		}

		return idata;
		
	};

	var getInfoFromUrl = function (_url, _name, _type) {
		$.get(_url).done(function(data) {

			echarts.registerMap(_name, data);

			if (!_type) {

				if (!window.MYECHARTBACK) {
					MYECHARTBACK = [
						{
							name: _name,
							url: url
						}
					]
				} else {
					MYECHARTBACK.push({
						name: _name,
						url: url
					})
				}

				
			} else {
				MYECHARTBACK.pop()
			}

			// back btn status 
			if (MYECHARTBACK.length > 0) {
				$('.back-map-btns button:first-child').removeAttr('disabled');
				
			} else {
				$('.back-map-btns button:first-child').attr('disabled', 'disabled');

			}

			// echarts.registerMap(_name.toLocaleLowerCase(), data);
			
			url = _url;
			
			// 指定图表的配置和数据
			option = {
			    series: [
			        {
			            name: _name,
			            // center: data.features[0].properties.cp,
			            zoom: 1,
			            mapType: _name.toLocaleLowerCase(),
			            data: resetMapInfo(data)
			        }
			    ]
			};

			myEChart.setOption(option);
		})
		.fail(function(err) {
			console.log(err)
		})
	};

	
	/*
		事件处理
		---------------------------------------
	*/
	$(window).resize(function() {
		myEChart.resize();
		console.log(url)
	})

	// 追加返回操作HTML
	$('#'+id).append(generateBackMod);

	// 返回操作事件
	$('#'+id).on('click', 'button',  function(e) {
		var _ = $(this);
		var _type = _.attr('data-type');

		if (_type === 'back') {
			var _backInfo = MYECHARTBACK[MYECHARTBACK.length -1];
			var _menu = $(this).next();

			getInfoFromUrl(_backInfo.url, _backInfo.name, _type);
			if (_menu.hasClass('current')) _menu.click();
		}
		// menu btn
		else {
			if(window.MYECHARTBACK && MYECHARTBACK.length > 0) {
				var listBox = $('.back-map-menu');
				var listLen = listBox.find('li').length;

				if (listLen !== MYECHARTBACK.length) {
					console.log(listLen);
					var h = '';

					for (var i = 0; i < MYECHARTBACK.length; i++) {
						h += '<li>'+ MYECHARTBACK[i].name + '</li>'
					}

					listBox.html(h)
				}

				$(this).toggleClass('current');
				listBox.toggle();
			}
		}
	})
	.on('click', '.back-map-menu li', function() {
		var _index = $(this).index();

		getInfoFromUrl( MYECHARTBACK[_index].url, MYECHARTBACK[_index].name, 'back');

		console.log(_index,  MYECHARTBACK[_index] );
		MYECHARTBACK.splice(_index, MYECHARTBACK.length - _index, '');

		console.log(MYECHARTBACK)

		$(this).parents('ul.back-map-menu').hide()
		.prev().find('button:last-child').toggleClass('current');
	});



	myEChart.showLoading();

	$.ajax({
		url: url,
		type: 'get',
		dataType: 'json'
	})
	.done(function(mapJson) {
		
		myEChart.hideLoading();

		// 指定图表的配置和数据
		var option = {
		    tooltip: {
		        trigger: 'item',
		        formatter: '{b}'
		    },
		    roam: false,
		    scaleLimit: {
		    	min: .5
		    },
		    series: [
		        {
		            name: regName,
		            type: 'map',
		            mapType: regName,
		            selectedMode : 'single',
		            animationDurationUpdate: 1000,
		            label: {
		                normal: {
		                    show: true
		                },
		                emphasis: {
		                    show: true,
		                    textStyle: {
		                    	color: '#c30'
		                    }
		                }
		            },
		            itemStyle: {
		            	emphasis: {
		            		areaColor: '#FFEB3B'
		            	}
		            },
		            data: resetMapInfo(mapJson)
		        }
		    ]
		};

		myEChart.setOption(option);


		myEChart.on('click', function(params) {

			console.log(params)
			// params.seriesName = params.name.

			var _url = url.replace('.json', '/'+params.name+'.json');

			var _menu = $('.back-map-btns button:last-child');

			if (_menu.hasClass('current')) _menu.click();

			// 更新数据
			getInfoFromUrl(_url, url.substring(url.lastIndexOf('/')+ 1, url.length - 5))
			// getMap(_url, params.name.toLocaleLowerCase(), id)

		})

		
	})
	.fail(function(err) {
		myEChart.hideLoading();

		console.log('没有找到您要的地图信息！')
	})
}


function generateBackMod() {
	var html = '<div class="back-map-mod map-right">';
	html += '<div class="back-map-btns"><button data-type="back" disabled="disabled">Back</button><button>Menu</button></div>';
	html += '<ul class="back-map-menu"></ul>';

	return html;
}