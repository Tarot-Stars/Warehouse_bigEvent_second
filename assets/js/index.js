$(function () {
    getUserInfo();
    // 退出功能
    var layer = layui.layer;
    $('#btnSignOut').on('click', function () {
        layer.confirm(
            '是否退出？',
            { icon: 3, title: '提示' },
            function (index) {
                // 清空本地存储中的 token 值
                localStorage.removeItem('token');
                // 跳转到登录页面
                location.href = './login.html';
                // 固有属性（不能删除）
                layer.close(index);
            }
        )
    });
});
// 获取用户基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        /* headers: {
            Authorization: localStorage.getItem('token') || ''
        }, */
        success: function (res) {
            if (res.status !== 0) return layui.layer.msg(res.message);
            // 渲染头像
            renderAvatar(res.data);
        },
        /*  complete: function (res) {
             if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败') {
                 // 强制清空 token
                 localStorage.removeItem('token');
                 // 强制跳转至登录页面
                 location.href = './login.html';
             }
         } */
    });
}
// 渲染头像
function renderAvatar(user) {
    // 昵称的显示（昵称优先，没有昵称用登录用户名代替）
    var Name = user.nickname || user.username;
    $('#welcome').html('欢迎&nbsp;&nbsp;' + Name);
    // 头像的显示
    if (user.user_pic !== null) {
        // 证明有头像
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        $('.layui-nav-img').hide();
        var text = Name[0].toUpperCase();
        $('.text-avatar').html(text).show();
    }
}