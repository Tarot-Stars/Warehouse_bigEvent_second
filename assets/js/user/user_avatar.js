$(function () {
    // 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }
    // 获取裁剪区域的 DOM 元素，创建裁剪区域
    $('#image').cropper(options);
    $('#btnChooseImage').on('click', function () {
        $('#file').click();
    });
    // 为文件选择框绑定 change 事件
    $('#file').on('change', function (e) {
        // 获取用户选择的文件
        var filelist = e.target.files;
        if (filelist.length === 0) return layer.msg('请选择照片！');
        // 1. 拿到用户选择的文件
        var file = e.target.files[0];
        // 2. 将文件，转化为路径
        var imgURL = URL.createObjectURL(file);
        // 3. 重新初始化裁剪区域
        // 销毁旧的裁剪区域，重新设置图片路径，重新初始化裁剪区域
        $('#image').cropper('destroy').attr('src', imgURL).cropper(options);
    });
    var layer = layui.layer;
    // 为确定按钮绑定点击事件
    $('#btnUpload').on('click', function () {
        var dataURL = $('#image').cropper('getCroppedCanvas',
            {
                width: 100,
                height: 100
            }).toDataURL('image/png', 'image/jpeg', 'image/jpg');
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更换头像失败！');
                }
                layer.msg('更换头像成功！');
                window.parent.getUserInfo();
            }
        })
    });
})
