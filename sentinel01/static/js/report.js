/**
 * 渲染主表
 * 实现添加检测信息事件
 */
layui.use(['form','layer','laydate','table','laytpl'],function(){
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        laydate = layui.laydate,
        laytpl = layui.laytpl,
        table = layui.table;

    //报告列表
    var tableIns = table.render({
        elem: '#testList',
        url : '../../static/json/newsList.json',
        cellMinWidth : 95,
        page : true,
        height : 620,
        limit : 20,
        limits : [10,15,20,25],
        id : "newsListTable",
        cols : [[
            {type: "checkbox", width:50},
            {field: 'newsId', title: '条形码', width:150, align:"center"},
			{field: 'newsAuthor', title: '姓名', align:'center',width:150},
			{field: 'newsAuthor', title: '送检单位', align:'center',width:150},
			{field: 'newsAuthor', title: '送检人', align:'center',width:150},
			{field: 'newsName', title: '手机号码', align:'center',width:150},
            {field: 'newsStatus', title: '电子邮箱',  align:'center',width:150},
            {field: 'newsStatus', title: '报告类型',  align:'center',width:150},
			{field: 'newsTime', title: '登记日期', align:'center', width:150, templet:function(d){
			    return d.newsTime.substring(0,10);
			}},
			{field: 'newsTime', title: '审核日期', align:'center', width:150, templet:function(d){
			    return d.newsTime.substring(0,10);
			}},
            {field: 'newsTop', title: '状态', align:'center',width:150},
            {title: '操作', templet:'#newsListBar',align:"center",width:180},
        ]]
    });
	
	$(".getReport_btn").click(function(){
	    var checkStatus = table.checkStatus('newsListTable'),
	        data = checkStatus.data,
	        newsId = [];
	    if(data.length > 0) {
	        for (var i in data) {
	            newsId.push(data[i].newsId);
	        }
	        layer.confirm('确定生成报告？', {icon: 3, title: '提示信息'}, function (index) {
	            // $.get("删除文章接口",{
	            //     newsId : newsId  //将需要删除的newsId作为参数传入
	            // },function(data){
	            // tableIns.reload();
	            // layer.close(index);
	            // })
				layer.msg("生成成功");
	        })
	    }else{
	        
			layer.msg("请选择需要生成报告的样本信息");
	    }
	})

    //批量删除
    $(".delAll_btn").click(function(){
        var checkStatus = table.checkStatus('newsListTable'),
            data = checkStatus.data,
            newsId = [];
        if(data.length > 0) {
            for (var i in data) {
                newsId.push(data[i].newsId);
            }
            layer.confirm('确定删除选中样本信息？', {icon: 3, title: '提示信息'}, function (index) {
                // $.get("删除文章接口",{
                //     newsId : newsId  //将需要删除的newsId作为参数传入
                // },function(data){
                tableIns.reload();
                layer.close(index);
                // })
            })
        }else{
            layer.msg("请选择需要删除的样本信息");
        }
    })

    //列表操作
    table.on('tool(testEvent)', function(obj){
        var layEvent = obj.event,
            data = obj.data;
        if(layEvent === 'look'){
            //addNews(data);
			layer.alert("预览数据")
        } else if(layEvent === 'edit'){
		    layer.alert("编辑数据")
            // layer.confirm('确定删除此文章？',{icon:3, title:'提示信息'},function(index){
            //     // $.get("删除文章接口",{
            //     //     newsId : data.newsId  //将需要删除的newsId作为参数传入
            //     // },function(data){
            //         tableIns.reload();
            //         layer.close(index);
            //     // })
            // });
        } else if(layEvent === 'check'){
            layer.alert("审核数据")
        }
    });

})