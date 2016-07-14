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
		xName: '平均活跃值',
		yName: '平均贡献值',
		max: 200,
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
		        right: '7%',
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
		            	[0, options.max],
		            	[0,0],
		            	[options.max, 0],
		            	[options.max, options.max]
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
		                    	yAxis: options.max/2,
		                    	name: options.yName
		                   	},
		                    { 
		                    	xAxis: options.max/2, 
		                    	name: options.xName
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
		xName: '平均活跃值',
		yName: '平均贡献值',
		max: 200,
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
function vennEcharts(id, options, version) {

	var venn = getVersionEC (id, version);;
	var data = [];

	for (var i = 0; i < options.data.length; i++) {
		data.push( {
			name: options.data[i].name,
			value: options.data[i].value,
			itemStyle: {
				normal: {
					color: options.data[i].color
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
	        show : true,
	        feature : {
	            mark : {show: true},
	            dataView : {show: true, readOnly: false},
	            restore : {show: true},
	            saveAsImage : {show: true}
	        }
	    },
	    calculable : false,
	    series : [
	        {
	            name: options.name,
	            type:'venn',
	            itemStyle: {
	                normal: {
	                    label: {
	                        show: true,
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
		myEchart = echart.init(document.getElementById(id));
	}

	return myEchart;
}