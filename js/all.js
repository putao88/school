/**
 * Created by John on 2017/7/13.
 */
function a() {
    var docEl = document.documentElement;
    var metaEl = document.querySelector('meta[name="viewport"]');
    var dpr = window.devicePixelRatio || 1;
    var scale = 1 / dpr;

    //               设置viewport，进行缩放，达到高清效果
    metaEl.setAttribute('content', 'width=' + dpr * docEl.clientWidth + ',initial-scale=' + scale + ',maximum-scale=' + scale + ', minimum-scale=' + scale + ',user-scalable=no');

    function getSize() { // 获取屏幕的宽度
        var screenWidth = docEl.clientWidth;
        docEl.style.fontSize = screenWidth / (750 / 40) + 'px';
    }
    getSize(); // 页面加载完执行一次
    window.onresize = function() {
        getSize();
    }
}
a();

