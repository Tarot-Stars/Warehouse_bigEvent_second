$(function () {
    var form = layui.form;
    var layer = layui.layer;
    var laypage = layui.laypage;
    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const now_date = new Date(date);
        var year = now_date.getFullYear();
        var month = padZero(now_date.getMonth() + 1);
        var day = padZero(now_date.getDate());
        var hours = padZero(now_date.getHours());
        var minutes = padZero(now_date.getMinutes());
        var seconds = padZero(now_date.getSeconds());
        return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
    }
    // 定义补零的函数
    function padZero(n) {
        return n < 10 ? '0' + n : n;
    }
    // 定义一个查询的参数对象，将来请求数据的时候，
    // 需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }
    initTable();
    initCate();
    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) return layer.msg(res.message);
                // 使用模板引擎渲染页面的数据
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
                // 渲染分页
                renderPage(res.total);
            }
        })
    }
    /* 初始化文章列表 */
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) return layer.msg(res.message);
                // 调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                // 通过 layui 重新渲染表单区域的UI结构
                form.render();
            }
        })
    }
    // 筛选
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        // 获取
        var cate_id = $('[name="cate_id"]').val();
        var state = $('[name="state"]').val();
        // 赋值
        q.cate_id = cate_id;
        q.state = state;
        // 初始化文章列表
        initTable();
    })
    // 渲染分页
    function renderPage(total) {
        // 定义渲染分页的方法
        // 调用 laypage.render() 方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox', // 分页容器的 Id （不能加 # ）
            count: total, // 总数据条数
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum, // 设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],// 每页展示多少条
            // 分页发生切换的时候，触发 jump 回调
            jump: function (obj, first) {
                // console.log(obj.curr);
                // 把最新的页码值，赋值到 q 这个查询参数对象中
                q.pagenum = obj.curr;
                // 把最新的条目数，赋值到 q 这个查询参数对象中
                q.pagesize = obj.limit;
                // 首次不执行
                if (!first) initTable();
            }
        })
    }
    // 通过代理的方式给动态添加的内容绑定点击事件，实现删除功能
    $('tbody').on('click', '.btn-delete', function () {
        // 获取到文章的 id
        var id = $(this).attr('data-id');
        // 询问用户是否要删除数据
        layer.confirm(
            '确认删除?',
            {
                icon: 3,
                title: '提示'
            },
            function (index) {
                $.ajax({
                    method: 'GET',
                    url: '/my/article/delete/' + id,
                    success: function (res) {
                        if (res.status !== 0) return layer.msg(res.message);
                        layer.msg('删除文章成功！');
                        // 页面上删除按钮个数等于 1 && 页数大于 1 
                        if ($('.btn-delete').length === 1 && q.pagenum > 1) q.pagenum--;
                        initTable();
                    }
                })
                layer.close(index);
            })
    })
})