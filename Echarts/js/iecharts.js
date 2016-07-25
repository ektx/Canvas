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
	zwl <530675800@qq.com>             2016.7.14
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
	--------------------------------------------
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