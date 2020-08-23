$(function () {
    // 渲染获取到的文章信息
    function editForm() {
        // 获取文章的 id 
        var id = location.search.split('=')[1];
        // 发送 ajax 请求
        $.ajax({
            method: 'GET',
            url: '/my/article/' + id,
            success: function (res) {
                if (res.status !== 0) return layer.msg(res.message);
                form.val('form_edit', res.data);
                //  tincMCE 赋值（获取文章内容）
                tinyMCE.activeEditor.setContent(res.data.content);
                if (!res.data.cover_img) return layer.msg('请选择图片');
                var newImgURL = developmentURL + res.data.cover_img;
                // 销毁旧的裁剪区域，重新设置图片路径，重新初始化裁剪区域
                $('#image').cropper('destroy').attr('src', newImgURL).cropper(options);
            }
        })
    }
    var form = layui.form;
    var layer = layui.layer;
    // 定义加载文章分类的方法
    initCate();
    // 初始化富文本编辑器
    initEditor();
    // 定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) return layer.msg(res.message);
                // 调用模板引擎，渲染分类的下拉菜单
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                // 一定要记得调用 form.render() 方法
                form.render();
                editForm();
            }
        })
    }
    // 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    // 初始化图片裁剪器，初始化裁剪区域
    $('#image').cropper(options);
    // 为选择封面的按钮，绑定点击事件处理函数
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click();
    })
    // 监听 coverFile 的 change 事件，获取用户选择的文件列表
    $('#coverFile').on('change', function (e) {
        // 获取到文件的列表数组
        var files = e.target.files;
        // 判断用户是否选择了文件
        if (files.length === 0) return;
        // 根据文件，创建对应的 URL 地址
        var newImgURL = URL.createObjectURL(files[0]);
        // 为裁剪区域重新设置图片
        // 销毁旧的裁剪区域，重新设置图片路径，重新初始化裁剪区域
        $('#image').cropper('destroy').attr('src', newImgURL).cropper(options);
    })
    // 设置文章的状态
    var art_state = '已发布';
    $('#btnSave').on('click', function () {
        art_state = '草稿';
    })
    // 发表文章
    $('#form-pub').on('submit', function (e) {
        // 1. 阻止表单的默认提交行为
        e.preventDefault();
        // 2. 基于 form 表单，快速创建一个 FormData 对象
        var fd = new FormData(this);
        // 3. 将文章的发布状态，存到 fd 中
        fd.append('state', art_state);
        // 将封面裁剪过后的图片，输出为一个文件对象
        $('#image').cropper(
            'getCroppedCanvas',
            // 创建一个 Canvas 画布
            {
                width: 400,
                height: 280
            }
        ).toBlob(function (blob) {
            // 将 Canvas 画布上的内容，转化为文件对象，得到文件对象后，进行后续的操作，将文件对象，存储到 fd 中
            fd.append('cover_img', blob);
            // 发起 ajax 数据请求
            publishArticle(fd);
        })
        function publishArticle(fd) {
            $.ajax({
                method: 'POST',
                url: '/my/article/edit',
                data: fd,
                // 注意：如果向服务器提交的是 FormData 格式的数据，必须添加以下两个配置项
                contentType: false,
                processData: false,
                success: function (res) {
                    if (res.status !== 0) return layer.msg(res.message);
                    layer.msg('修改文章成功！');
                    // 跳转到文章列表页面
                    setTimeout(function () {
                        window.parent.document.querySelector('#jump').click();
                    }, 500)
                }
            })
        }
    })
})