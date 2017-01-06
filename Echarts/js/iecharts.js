/*
	iEcharts v0.11.3
*/

// echarts 自动大小调整
function resizeCharts(charts) {
	$(window).resize(function() {
		charts.resize()
	})

	// 新加对窗口变化的监控
	var _s;
	$(document).on('click',function(){
		clearTimeout(_s);
		_s = setTimeout(function() {
			charts.resize()
		}, 300)
	})
}


/*

	获取平均分布图片
	--------------------------------------------
	@id: 生成的元素
	@options: 传入的内容
	@version: 解决 2 3 共享问题

	Eg: 在 div 为 echart 中生成以下内容
	---------------------------------------------
	<div id="echart"></div>
	
	option = {
		x:{
			name: '平均活跃值',
			value: 150 // 
		},
		y: {
			name: '平均贡献值',
			value: 200,
			// 用于处理值过长的问题,默认宽为 30px
			width: '60px'
		},
		color: '#4bbcf6',
		formatter: function(params) {
			if (params.value.length > 1) {
	            return '活跃值: ' + params.value[0] + 'w <br/>贡献值: '
	               + params.value[1] + 'w ';
        		
        	} 
        	// 显示坐标
        	else {
        		return params.name
        	}
        },
        precision: 5, // 保留5位小数
		data: [
				{
					name:'舟山',
					value: [30,50]
				},
				{
					name:'杭州',
					value: [50,150]
				},
				{
					name:'上海',
					value: [120,50]
				}
			]
	}

	getAverageChart('echart', option);
	--------------------------------------------
	zwl <530675800@qq.com>             2017.1.6
*/
	function getAverageChart(id, options, version) {
		
		var myEchart = getVersionEC (id, version);

		var xyStyle = {
		            type : 'value',
		            scale:true,
		            splitLine: {
		            	show: false
		            },
		            axisLine: {
		            	show: false
		            },
		            axisLabel: {
		            	show: false
		            },
		            axisTick: {
		            	show: false
		            }
		        };

		option = {
		    grid: {
		        left: '0%',
		        right: options.y.width || '30px',
		        bottom: '0%',
		        containLabel: true
		    },
		    tooltip : {
		        trigger: 'axis',
		        showDelay : 0,
		        backgroundColor: 'rgba(255, 255, 255, .9)',
		        borderColor: options.color,
		        borderWidth: 1,
		        textStyle: {
		        	color: options.color
		        },
		        formatter : function (params) {
		        	return options.formatter(params)
		        },
		        axisPointer:{
		            show: true,
		            type : 'cross',
		            lineStyle: {
		                type : 'dashed',
		                width : 1
		            }
		        }
		    },
		    toolbox: {
		        feature: {
		            dataZoom: {},
		            brush: {
		                type: ['rect', 'polygon', 'clear']
		            }
		        }
		    },
		    brush: {
		    },
		    xAxis : [
		        xyStyle
		    ],
		    yAxis : [
		        xyStyle
		    ],
		    series : [
		        {
		            name:'',
		            symbol:'rect',
		            type:'scatter',
		            data: [
		            	[0,0],
		            	[0, options.y.value * 2],
		            	[options.x.value * 2, 0],
		            	[options.x.value * 2, options.y.value * 2]
		            ],
		            itemStyle: {
		            	normal: {
		            		color: options.color,
		            		opacity: 0
		            	}
		            },
		            markLine : {
		                lineStyle: {
		                    normal: {
		                        type: 'solid',
		                    }
		                },
		                precision: options.precision || 2,
		                data : [
		                    {
		                    	yAxis: options.y.value,
		                    	name: options.y.name
		                   	},
		                    { 
		                    	xAxis: options.x.value, 
		                    	name: options.x.name
		                    }
		                ]
		            }
		        },
		        {
			        label:{
			        	normal: {
				        	show: true,
				        	position: 'right',
			        		formatter: '{b}',
			        		textStyle: {
			        			color: '#333'
			        		}
			        	}
			        },
		            type:'scatter',
		            itemStyle: {
		            	normal: {
		            		color: options.color
		            	}
		            },
		            data: option.data
		        }
		    ]
		};

		myEchart.setOption(option);
	}

/*
	Echarts venn 图
	--------------------------------------------
	@id: 生成的元素
	@options: 传入的内容
	@version: 解决 2 3 共享问题

	Eg: 在 div 为 echart 中生成以下内容
	---------------------------------------------
	<div id="echart"></div>
	
	option = {
		title: {
		        text: '标题',
		        subtext: '副标题'
		    },
		// 鼠标放上效果
		hover: {
			borderWidth: 3, // [Number] 宽度
			borderColor: '#996699' // [color] 颜色
		},
		dataName: false, // 是否显示 data name
		// 数据[必填]
		data: [
                {
                	value: 100, 
                	name:'访问',
                	color: '#f90'
                },
                {
                	value:50, 
                	name:'咨询', 
                	color: '#c30'
                },
                {	
                	value:20, 
                	name:'公共',
                	color: '#09f'
                }
            ]
	}

	vennEcharts('echart', option, e2);
	--------------------------------------------
	zwl <530675800@qq.com>             2016.7.14
*/
function vennEcharts(id, options, version) {

	var venn = getVersionEC (id, version);
	var isShowDataName = !options.dataName ? options.dataName: true;
	var data = [];

	for (var i = 0; i < options.data.length; i++) {
		data.push( {
			name: options.data[i].name,
			value: options.data[i].value,
			itemStyle: {
				normal: {
					color: options.data[i].color,
				},
				emphasis: {
					color: options.data[i].color
				}
			}
		} );
	}

	option = {
	    title : options.title,
	    tooltip : {
	        trigger: 'item',
	        formatter: "{b}: {c}"
	    },
	    toolbox: {
	        show : false
	    },
	    calculable : false,
	    markPoin: {
	    	symbol: 'pin'
	    },
	    series : [
	        {
	            name: options.name,
	            type:'venn',
	            itemStyle: {
	                normal: {
	                    label: {
	                        show: isShowDataName,
	                        textStyle: {
	                            fontFamily: 'Arial, Verdana, sans-serif',
	                            fontSize: 16,
	                            fontStyle: 'italic',
	                            fontWeight: 'bolder'
	                        }
	                    },
	                    labelLine: {
	                        show: false,
	                        length: 10,
	                        lineStyle: {
	                            width: 1,
	                            type: 'solid'
	                        }
	                    }
	                },
	                emphasis: {
	                    borderWidth: options.hover.borderWidth,
	                    borderColor: options.hover.borderColor
	                }
	            },
	            data: data
	        }
	    ]
	};

	venn.setOption(option);
}


/*
	Echarts 线形图
	--------------------------------------------
	@id: 生成的元素
	@options: 传入的内容
	@version: 解决 2 3 共享问题

	Eg: 在 div 为 echart 中生成以下内容
	---------------------------------------------
	<div id="echart"></div>
	
	options = {
		title: {
			text: '标题',
			subtext: '副标题'
		},
		color: '#f90', // [color] 颜色
		formatter: function(params) {
			return // 你的鼠标提示功能
		},
		// 数据[必填]
		data: data
	}

	vennEcharts('echart', option, e3);
	--------------------------------------------
	zwl <530675800@qq.com>             2016.7.18
*/
function getLineCharts(id, options, version) {

	var myEchart = getVersionEC (id, version);
	var xType = 'category';

	var getXTime = function(data) {
		var XData = [];
		for (var i = 0; i < data.length; i++) {
			XData.push( data[i].value[0] )
		}
		return XData;
	}

	option = {
	    title: options.title,
	    grid: {
		        left: '1%',
		        right: '0%',
		        bottom: '1%',
		        top: '10%',
		        containLabel: true
		    },
	    tooltip: {
	        trigger: 'axis',
	        formatter: function (params) {
	            return options.formatter(params)
	        },
	        axisPointer: {
	            animation: false
	        }
	    },
	    xAxis: {
	        type: xType,
	        axisTick: {
	        	length: 5
	        },
	        splitLine: {
	            show: false
	        },
	        data: getXTime(options.data)
	    },
	    yAxis: {
	        type: 'value',
	        boundaryGap: [0, '100%'],
	        splitLine: {
	            show: true
	        },
	        axisLine: {
	        	show: false
	        },
	        axisTick: {
	        	length: 0
	        }
	    },
	    itemStyle: {
	    	normal: {
		    	color: options.color
	    		
	    	}
	    },
	    series: [{
	        type: 'line',
	        showSymbol: false,
	        hoverAnimation: true,
	        data: options.data
	    }]
	};

	myEchart.setOption(option);

	var updateData = function(data) {
		myEchart.setOption({
			xAxis: {
				data: getXTime(data)
			},
			series: [{
				data:  data
			}]
		})
	};

	return updateData
}



/*
	统一处理echarts 2 或 3的转换
	@id 元素
	@version 指定版本，默认使用最后调用的echarts
	-------------------------------------------------
	zwl <530675800@qq.com>             2016.7.14
*/
function getVersionEC (id, version) {
	var myEchart;

	if (version) {
		myEchart = version.init(document.getElementById(id));
	} else {
		myEchart = echarts.init(document.getElementById(id));
	}

	return myEchart;
}



/*
	堆叠条形图
	Eg: 在 div 为 echart 中生成以下内容
	@id 元素
	@options 传参
	@version 指定版本，默认使用最后调用的echarts
	-----------------------------------------------------
	<div id="echart"></div>

	var options = {
		x: {
			// x 轴上数据
			data: ['周一','周二','周三','周四','周五','周六','周日', '其它'],
			// 底线是否显示
			line: false,
			// x轴文字颜色
			color: '#f90'
		},
		y: {
			// 底线是否显示
			line: false
		},
		// 是否使用堆叠 
		stack: true,
		// 提示显示格式
		formatter: '{a} - {b} - {c}',
		// 图表显示区域,格式: [top, left, right, bottom, 是否显示x值]
		grid: [0, "0%", 0, "0%", 1],
		// 线宽
		barWidth: 10,
		// 数据 [必填]
		data: [
			{
				name: '直接访问',
				color: '#09f',
				data: [320, 302, 301, 334, 390, 330, 320]
			},
			{
	            name: '邮件营销',
	            color: '#06f',
	            data: [120, 132, 101, 134, 90, 230, 210]
	        },
	        {
	            name: '联盟广告',
	            color: '#f90',
	            data: [220, 182, 191, 234, 290, 330, 310]
	        },
	        {
	            name: '视频广告',
	            color: '#00f',
	            data: [150, 212, 201, 154, 190, 330, 410]
	        },
	        {
	            name: '搜索引擎',
	            color: '#ff0',
	            data: [820, 832, 901, 934, 1290, 1330, 1320]
	        }
		]
	}

	stackedColumnBar('echart', option)
	-----------------------------------------------------
	zwl <530675800@qq.com>                      2016.7.27
*/
function stackedColumnBar (id, options, version) {

	var myEcharts = getVersionEC (id, version);
	var grid = options.grid || [0, 0, 0, 0, 1];
	var newData = [];

	var getDef = function(val, def) {
		var result = false;
		if (val === undefined) {
			result = def
		} else {
			result = val
		}

		return result
	};

	for (var i = 0; i < options.data.length; i++) {
		newData[i] = {
			name: options.data[i].name,
			data: options.data[i].data,
			type: 'bar',
			stack: !options.stack ? null :'newData' ,
			barWidth: options.barWidth,
			label: {
				normal: {
					show: false
				}
			},
			itemStyle: {
				normal: {
					color: options.data[i].color
				}
			}
		}
	}

	options.data = newData

	var option = {
	    tooltip : {
	        trigger: 'axis',
	        axisPointer : {      
	            type : 'shadow'      
	        },
	        formatter: options.formatter
	    },
	    grid: {
	    	top: grid[0],
	        left: grid[1],
	        right: grid[2],
	        bottom: grid[3],
	        containLabel: grid[4]
	    },
	    xAxis:  {
	        type: 'category',
	        axisTick: {
	       		show: false
	        },
	        axisLine: {
	    		show:  getDef(options.x.line, true)
	        },
	        data: options.x.data
	        
	    },
	    yAxis: {
	        type: 'value',
	        axisLine: {
	    		show: getDef(options.y.line, true)   
	        },
	        axisTick: {
	       		show: false
	        },
	        axisLabel: {
	       		show: false
	        },
	        splitLine: {
	        	show: false
	        }
	    },
	    axisLabel: {
	    	textStyle: {
	    		color: options.x.color 
	    	}
	    },
	    series: options.data
	};

	myEcharts.setOption(option);
}

/*

		options = {
			// 简化了 legend 输入方案
			legend: {
				itemHeight: 10,
				itemWidth: 10,
				top: -2,
				icon: 'rect',
				textStyle: {
					color: '#666'
				}
			},
			xAxis: {
		        type: 'category',
		        boundaryGap: false,
		        splitLine: {
					show: true,
					lineStyle: {
						color: '#2f3033'
					}
				},
		        data:['1','2','3','4','5','6','7', '8', '9', '10', '11', '12']
			},
			yAxis: {
				type: 'value',
				axisTick: {
		       		show: false
		        },
				splitLine: {
					show: false
				},
				axisLine: {
					show: false
				}
			},
			lineSmooth: true,
            showSymbol: false,
			grid: [ '28px', '20px', '4%', '3%', 1 ],
			// 简化数据
			series: [
			        {
			            name:'大型企业',
			            color: '#2b8ac4',
			            data:[11, 11, 15, 13, 12, 13, 10, 15, 13, 12, 13, 10],
			        },
			        {
			            name:'中型企业',
			            color: '#f79601',
			            data:[1, 11, 1, 1, 12, 3, 0, 1, 1, 12, 3, 0],
			        },
			        {
			            name:'小型企业',
			            color: '#d8422a',
			            data:[1, 3, 2, 6, 4, 2, 1, 12, 5, 4, 2, 6],

			        },
			        {
			            name:'微型企业',
			            color: '#52ff62',
			            data:[1, 2, 2, 5, 3, 2, 0, 2, 5, 3, 2, 0],

			        }
			    ]
		}

		makeLineCharts('company-charts', options, e3)
*/
function makeLineCharts(id, options, version) {

	myEchart = getVersionEC (id, version);;
	options.legend.data = []

	options.series.forEach(function(value) {

		if ( options.lineSmooth ) {
			value.smooth = true
		}

		if ( !options.showSymbol ) {
			value.showSymbol= false
		}

		value.type = 'line';

		options.legend.data.push({
			name: value.name, 
			icon: options.legend.icon 
		});

		value.itemStyle = {
				normal: {
					color : value.color
				}
		};

	});


	option = { 
		tooltip : options.tooltip,
		grid: {
			top: options.grid[0],
			left: options.grid[1],
			right: options.grid[2],
			bottom: options.grid[3],
			containLabel: options.grid[4]
		},
	    legend: options.legend,
	    xAxis:  options.xAxis,
	    yAxis: options.yAxis,
	    series: options.series
	};

	myEchart.setOption(option);
};


//仪表盘
function makeGaugeCharts(id, options, version) {
	myEchart = getVersionEC (id, version);;

	var dfop = {
		backgroundColor: '#1b1b1b',
		tooltip : {
			formatter: "{a} <br/>{c} {b}"
		},
		toolbox: {
			show : false,
			feature : {
				mark : {show: true},
				restore : {show: true},
				saveAsImage : {show: true}
			}
		},
		series : [
			{
				name:'速度',
				type:'gauge',
				min:0,
				max:220,
				splitNumber:11,
				center : ['50%', '58%'],    // 默认全局居中
				radius: '100%',
				axisLine: {            // 坐标轴线
					lineStyle: {       // 属性lineStyle控制线条样式
						color: [[0.09, 'lime'],[0.82, '#1e90ff'],[1, '#ff4500']],
						width: 2,
						shadowColor : '#fff', //默认透明
						shadowBlur: 0
					}
				},
				axisLabel: {            // 坐标轴小标记
					textStyle: {       // 属性lineStyle控制线条样式
						fontSize: 12,
						fontWeight: 'bolder',
						color: '#fff',
						shadowColor : '#fff', //默认透明
						shadowBlur: 0
					}
				},
				axisTick: {            // 坐标轴小标记
					length :9,        // 属性length控制线长
					lineStyle: {       // 属性lineStyle控制线条样式
						color: 'auto',
						shadowColor : '#fff', //默认透明
						shadowBlur: 0
					}
				},
				splitLine: {           // 分隔线
					length :15,         // 属性length控制线长
					lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
						width: 2,
						color: '#fff',
						shadowColor : '#fff', //默认透明
						shadowBlur: 0
					}
				},
				pointer: {           // 分隔线
					shadowColor : '#fff', //默认透明
					shadowBlur: 5
				},
				title : {
					textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
						fontWeight: 'bolder',
						fontSize: 14,
						fontStyle: 'italic',
						color: '#fff',
						shadowColor : '#fff', //默认透明
						shadowBlur: 0
					}
				},
				detail : {
					backgroundColor: 'rgba(30,144,255,0.8)',
					borderWidth: 1,
					borderColor: '#fff',
					shadowColor : '#fff', //默认透明
					shadowBlur: 2,
					offsetCenter: [0, '50%'],       // x, y，单位px
					textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
						fontWeight: 'bolder',
						color: '#fff'
					}
				},
				data:[{value: 40, name: '全社会用电量'}]
			},
			{
				name:'消费价格总指数',
				type:'gauge',
				center : ['20%', '68%'],    // 默认全局居中
				radius : '68%',
				min:0,
				max:5,
				endAngle:45,
				splitNumber: 5,
				axisLine: {            // 坐标轴线
					lineStyle: {       // 属性lineStyle控制线条样式
						color: [[0.29, 'lime'],[0.86, '#1e90ff'],[1, '#ff4500']],
						width: 1,
						shadowColor : '#fff', //默认透明
						shadowBlur: 0
					}
				},
				axisLabel: {            // 坐标轴小标记
					textStyle: {       // 属性lineStyle控制线条样式
						fontWeight: 'bolder',
						color: '#fff'
					}
				},
				axisTick: {            // 坐标轴小标记
					length :8,        // 属性length控制线长
					lineStyle: {       // 属性lineStyle控制线条样式
						color: 'auto',
						shadowColor : '#fff', //默认透明
						shadowBlur: 0
					}
				},
				splitLine: {           // 分隔线
					length : 15,         // 属性length控制线长
					lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
						width: 2,
						color: '#fff'
					}
				},
				pointer: {
					width:5,
					shadowColor : '#fff', //默认透明
					shadowBlur: 5
				},
				title : {
					show: false,
					offsetCenter: [0, '-30%'],       // x, y，单位px
					textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
						fontWeight: 'bolder',
						fontStyle: 'italic',
						color: '#fff',
						shadowColor : '#fff', //默认透明
						shadowBlur: 0
					}
				},
				detail : {
					//backgroundColor: 'rgba(30,144,255,0.8)',
					// borderWidth: 1,
					borderColor: '#fff',
					shadowColor : '#fff', //默认透明
					shadowBlur: 5,
					width: 80,
					height:30,
					offsetCenter: [25, '20%'],       // x, y，单位px
					textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
						fontWeight: 'bolder',
						color: '#fff',
						fontSize: 20
					}
				},
				data:[{value: 1.7, name: ''}]
			},
			{
				name:'城镇',
				type:'gauge',
				center : ['80%', '62%'],    // 默认全局居中
				radius : '60%',
				min:0,
				max:2,
				startAngle:135,
				endAngle:45,
				splitNumber:2,
				axisLine: {            // 坐标轴线
					lineStyle: {       // 属性lineStyle控制线条样式
						color: [[0.2, 'lime'],[0.8, '#1e90ff'],[1, '#ff4500']],
						width: 1
					}
				},
				axisTick: {            // 坐标轴小标记
					length :12,        // 属性length控制线长
					lineStyle: {       // 属性lineStyle控制线条样式
						color: 'auto',
						shadowColor : '#fff', //默认透明
						shadowBlur: 0
					}
				},
				axisLabel: {
					textStyle: {       // 属性lineStyle控制线条样式
						color: '#fff',
						shadowColor : '#fff', //默认透明
						shadowBlur: 0
					},
					formatter:function(v){
						switch (v + '') {
							case '0' : return '低';
							case '1' : return '城镇';
							case '2' : return '高';
						}
					}
				},
				splitLine: {           // 分隔线
					length :15,         // 属性length控制线长
					lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
						width: 2,
						color: '#fff',
						shadowColor : '#fff', //默认透明
						shadowBlur: 0
					}
				},
				pointer: {
					width:2,
					shadowColor : '#fff', //默认透明
					shadowBlur: 5
				},
				title : {
					show: false
				},
				detail : {
					show: false
				},
				data:[{value: 3, name: '元'}]
			},
			{
				name:'农村',
				type:'gauge',
				center : ['80%', '62%'],    // 默认全局居中
				radius : '60%',
				min:0,
				max:2,
				startAngle:315,
				endAngle:225,
				splitNumber:2,
				axisLine: {            // 坐标轴线
					lineStyle: {       // 属性lineStyle控制线条样式
						color: [[0.2, 'lime'],[0.8, '#1e90ff'],[1, '#ff4500']],
						width: 1
					}
				},
				axisTick: {            // 坐标轴小标记
					show: false
				},
				axisLabel: {
					textStyle: {       // 属性lineStyle控制线条样式
						fontSize: 12,
						color: '#fff',
						shadowColor : '#fff', //默认透明
						shadowBlur: 0
					},
					formatter:function(v){
						switch (v + '') {
							case '0' : return '低';
							case '1' : return '农村';
							case '2' : return '高';
						}
					}
				},
				splitLine: {           // 分隔线
					length :15,         // 属性length控制线长
					lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
						width: 2,
						color: '#fff',
						shadowColor : '#fff', //默认透明
						shadowBlur: 0
					}
				},
				pointer: {
					width:2,
					shadowColor : '#fff', //默认透明
					shadowBlur: 5
				},
				title : {
					show: false
				},
				detail : {
					show: false
				},
				data:[{value: 0.5, name: '元'}]
			}
		]
	}
	
	$.extend(dfop,options);
	for(var i=0; i<options.seriess.length;i++){
		$.extend(dfop.series[i],options.seriess[i]);
	};
	myEchart.setOption(dfop);
};


/*双饼图*/
function makePieCharts(id, options, version){
	myEchart = getVersionEC (id, version);

	var dfop = {
		tooltip: {
			trigger: 'item',
			formatter: "{b}: {c} ({d}%)"
		},
		legend: {
			show: false,
			orient: 'vertical',
			x: 'left',
			data:[]
		},
		color: [],
		series: [
			{
				name:'访问来源',
				type:'pie',
				radius: ['30%', '50%'],
				avoidLabelOverlap: false,
				label: {
					normal: {
						show: true,
						position: 'outside',
						textStyle:{
							fontSize: '14'
						}
					},
					labelLine: {
						normal: {
							show: true
						}
					},
					emphasis: {
						show: true,
						textStyle: {
							fontSize: '16'
						}
					}
				},
				data:[]
			}
		]
	};
	$.extend(dfop,options);
	dfop.series[0].data = options.data;

	myEchart.setOption(dfop);
};


/*
    getColorFigureMap 色温图
    ----------------------------------------------
	getColorFigureMap('provincial-info-charts', {
	    // 定义地图名
	    mapName: 'zhejiang',
	    mapUrl: 'contents/mapjson/earth/world/china/zhejiang.json',
	    // 色温条
	    visualMap: {
	        min: 0,
	        max: 100,
	        inRange: {
	            color: ['#1db4ff', '#fff']
	        },
	        itemWidth: 10,
	        right: 0
	    },
	    // 浮动提示
	    tooltip: {
	        trigger: 'item',
	        formatter: '{b}'
	    },
	    // 选择功能
	    selectedMode: {
	    	type: 'single',  // 选择功能
	    	areaColor: '#f90', // 街区颜色
	    	borderWidth: 5, // 边框大小
	    	borderColor: '#fff' // 边框颜色
	    },
        // 数据
        data:[
            {name:'杭州市', value: 999, selected:true},
            {name:'湖州市', value: 899},
            {name:'嘉兴市', value: 799},
            {name:'绍兴市', value: 899},
            {name:'金华市', value: 599},
            {name:'衢州市', value: 499},
            {name:'丽水市', value: 399},
            {name:'温州市', value: 699},
            {name:'台州市', value: 399},
            {name:'宁波市', value: 899},
            {name:'舟山市', value: 199}
        ]

    });
    ------------------------------------------------
    2016/8/4                               
*/
function getColorFigureMap(id, option, version) {

    var myEcharts = getVersionEC (id, version);
    var position = option.position || [];

    $.get(option.mapUrl)
    .done(function(data) {
        
        version.registerMap(option.mapName, data);

    	options = {
            tooltip: option.tooltip,
            visualMap: option.visualMap,
            geo: option.geo,
            layoutCenter: option.layout[0],
            layoutSize: option.layout[1],
    	    series: [
                {
                    name: option.mapName,
                    type: 'map',
                    mapType: option.mapName,
                    selectedMode : option.selectedMode.type,
                    top: position[0],
                    right: position[1],
                    bottom: position[2],
                    right: position[3],
                    label: {
                        normal: {
                            show: true,
                            textStyle: option.normal.textStyle
                        },
                        emphasis: {
                            show: true,
                            textStyle: option.selectedMode.textStyle
                        }
                    },
                    itemStyle: {
                    	normal: option.normal,
                    	emphasis: option.selectedMode
                    },
                    data: option.data
                }
            ]
    	};

        myEcharts.setOption(options);

        // 添加随窗口变化自动调整
        resizeCharts(myEcharts)
        
    })
    .fail(function(err) {
        console.log('没有找到地图信息!')
    })
}



/*
	合并对象
	-----------------------------------------
	@obj 要输出的对象
	@obj2 用来添加的对象
*/
function extendObj(obj, obj2) {

	var findObj = function(_obj, _obj2) {

		for (var key in _obj2) {

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


/*
	区域警告图
	-----------------------------------------
	option = {
		id: 'echart',
		title: {
			text: '多组数据警告'
		},
		xAxis: {
			name: 'ND',
			nameLocation: 'start',
		    data: [1,2,3,4,5,6]
		},
		yAxis: {
			max: 2,
			min: -2,
			margin: 0.5,
			warnColor: ['#f90', 'red']
		},
		barColor: ['#03adf5', '#690'],
		series: [
		    [1.2, -1, 1.2, 3.3, -3.3, -2.2],
		    [1.4, -1.1, -1.2, 2.3, -0.3, -1.5]
		]
	};
	areaWarning.init(option)
	------------------------------------------
	2016/8/9
*/
areaWarning = {
	options: {
		tooltip: {
			formatter: function(params){
				var result = '<p>';

				// ico
				result += '<i style="display:inline-block;width: 12px; height: 12px; border-radius: 100%; background:'+params.color+'; margin-right: 5px"></i>';

				result += params.name;
				result += '<span style="display:inline-block;width: 10px;"></span>';

				if (typeof params.data === 'object') {
					result += params.data.resetVal;
				} else {
					result += params.data  ;
				}

				// return params.name
				return result +'</p>'
			}
		},
	    xAxis: {
	        silent: false,
	        axisLine: {onZero: true},
	        splitLine: {show: false},
	        splitArea: {show: false}
	    },
	    yAxis: {
	        splitArea: {show: false}
	    }
	},
	init: function(option) {
		var _series = [];
		var topVal = option.yAxis.max + option.yAxis.margin;
		var bottomVal = option.yAxis.min - option.yAxis.margin;


		for (var i = 0, len = option.series.length; i < len; i++) {

			// 循环数据,对超出数据进行特殊标识
			for (var d = 0, dLen = option.series[i].length; d < dLen; d++) {
				var _warnColor = '';
				var _val = option.series[i][d];
				var _needReset = 0;

				// 对大于警告值的
				if (_val > option.yAxis.max) {
					_warnColor = option.yAxis.warnColor[0];
					if (_val > topVal) _val = topVal;
					_needReset = 1;
				}
				// 对小于警告值的 
				else if ( _val < option.yAxis.min ) {
					_needReset = 1;
					if (_val < bottomVal) _val = bottomVal;
					_warnColor = option.yAxis.warnColor[1];
				};

				// 对大于或小于警告值的数据格式化
				if (_needReset) {
					option.series[i].splice(d, 1, {
						value: _val,
						resetVal: option.series[i][d],
						itemStyle: {
							normal: {
								color: _warnColor
							},
							emphasis: {
								color: _warnColor
							}
						}
					});
				}
			}

			// 格式化数据
			_series.push({
				name: 'bar',
				type: 'bar',
				stack: 'one'+i,
				itemStyle : {
					normal: {
						color: option.barColor[i]
					},
				    emphasis: {
				        barBorderWidth: 1,
				        shadowBlur: 10,
				        shadowOffsetX: 0,
				        shadowOffsetY: 0,
				        shadowColor: 'rgba(0,0,0,0.5)'
				    }
				},
				data: option.series[i]
			})
				
		};


		this.options.series = _series;
		// 将 option 合并到 this.options 中
		this.options = extendObj(this.options, option);
		this.options.yAxis.max = topVal;
		this.options.yAxis.min = bottomVal;
		// 定义图表
		// myEcharts = echarts.init(document.getElementById( option.id ) );
		myEcharts = getVersionEC ( option.id , e3);
		// 输出
		myEcharts.setOption( this.options );

		resizeCharts(myEcharts)
	}
}