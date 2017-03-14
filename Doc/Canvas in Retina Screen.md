# Canvas in Retina Screen

获取视网膜屏的设备像素比.

```javascript
function getDevPixelRatio(ctx) {
    if ('devicePixelRatio' in window) {
        if (window.devicePixelRatio > 1) {
            return window.devicePixelRatio;
        }
    }
    return 1;
}
```

## 参考

[Setting Up the Canvas](https://developer.apple.com/library/content/documentation/AudioVideo/Conceptual/HTML-canvas-guide/SettingUptheCanvas/SettingUptheCanvas.html)