# Canvas 基础



## 判断浏览器支持情况

``` javascript
if (!canvas.getContentext) {
    alert('你的浏览器支持Canvas')
} else {
    alert('你的浏览器不支持 Canvas')
}
```



## 部分方式调用说明

### fillStyle = color

__填充样式__

``` javascript
// 填充色
context.fillStyle = red;
context.fillStyle = '#f00';
context.fillStyle = 'rgb(255,0, 0)';
```



### fillRect(x, y, height, width)

__填充__

``` javascript
// 填充一个正方形
// 例子: 基础/绘制曲线.html 中的树干
context.fillRect(40, 40, 100, 100)
```



### globalAlpha = value

- value 取值在1-0之间

``` javascript
// 设置透明度为 0.5
globalAlpha = .5;
```





### globalCompositeOpearation = 'options'

__定义绘制图像的层叠方式__

| 值                | 描述                                     |
| ---------------- | -------------------------------------- |
| source-over      | 默认。在目标图像上显示源图像。                        |
| source-atop      | 在目标图像顶部显示源图像。源图像位于目标图像之外的部分是不可见的。      |
| source-in        | 在目标图像中显示源图像。只有目标图像内的源图像部分会显示，目标图像是透明的。 |
| source-out       | 在目标图像之外显示源图像。只会显示目标图像之外源图像部分，目标图像是透明的。 |
| destination-over | 在源图像上方显示目标图像。                          |
| destination-atop | 在源图像顶部显示目标图像。源图像之外的目标图像部分不会被显示。        |
| destination-in   | 在源图像中显示目标图像。只有源图像内的目标图像部分会被显示，源图像是透明的。 |
| destination-out  | 在源图像外显示目标图像。只有源图像外的目标图像部分会被显示，源图像是透明的。 |
| lighter          | 显示源图像 + 目标图像。                          |
| copy             | 显示源图像。忽略目标图像。                          |
| source-over      | 使用异或操作对源图像与目标图像进行组合。                   |

##### 参考:

[本地Demo](http://localhost/~zwl/Canvas/%E5%9F%BA%E7%A1%80/%E5%90%88%E6%88%90-GlobalCompositeOperation.html)

[HTML 5 canvas globalCompositeOperation 属性](http://www.w3school.com.cn/tags/canvas_globalcompositeoperation.asp)

[moz 文档](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation)

