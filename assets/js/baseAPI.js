// 开发环境服务器地址
var developmentURL = 'http://ajax.frontend.itheima.net';
// 测试环境服务器地址
var testURL = 'http://ajax.frontend.itheima.net';
// 生产环境服务器地址
var productionURL = 'http://ajax.frontend.itheima.net';
// 拦截所有的 Ajax 请求：GET/POST/Ajax ,处理参数
$.ajaxPrefilter(function (options) {
    // 统一为有权限的接口设置 headers 请求头
    if (options.url.indexOf('/my/') === 0) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }
    options.complete = function (res) {
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 强制清空 token
            localStorage.removeItem('token');
            // 强制跳转至登录页面
            location.href = './login.html';
        }
    }
    options.url = developmentURL + options.url;
});
