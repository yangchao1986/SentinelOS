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

    //样本列表
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
			{field: 'newsAuthor', title: '样本类型', align:'center',width:150},
			{field: 'newsAuthor', title: '核酸类型', align:'center',width:150},
			{field: 'newsName', title: '检测项目', align:'center',width:150},
            {field: 'newsStatus', title: '核酸提取',  align:'center',width:150},
            {field: 'newsLook', title: '基因检测', align:'center',width:150},
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

    //添加核酸提取信息
    function addNews(edit){
        var index = layui.layer.open({
            title : ["请填写检测信息","font-size:20px;"],
            type : 2,
			area : ["600px","700px"],
            content : "addTest",
            success : function(layero, index){
                var body = layui.layer.getChildFrame('body', index);
                // if(edit){
                //     body.find(".newsName").val(edit.newsName);
                //     body.find(".abstract").val(edit.abstract);
                //     body.find(".thumbImg").attr("src",edit.newsImg);
                //     body.find("#news_content").val(edit.content);
                //     body.find(".newsStatus select").val(edit.newsStatus);
                //     body.find(".openness input[name='openness'][title='"+edit.newsLook+"']").prop("checked","checked");
                //     body.find(".newsTop input[name='newsTop']").prop("checked",edit.newsTop);
                //     form.render();
                // }
                setTimeout(function(){
                    layui.layer.tips('点击此处关闭当前页', '.layui-layer-setwin .layui-layer-close', {
                        tips: 3
                    });
                },500)
            }
        })

    }
    $(".addNews_btn").click(function(){
        addNews();
    })
	
	//添加基因检测信息
	function addGene(edit){
	    var index = layui.layer.open({
	        title : ["请填写检测信息","font-size:20px;"],
	        type : 2,
			area : ["555px","600px"],
	        content : "addGene",
	        success : function(layero, index){
	            // var body = layui.layer.getChildFrame('body', index);
	            // if(edit){
	            //     body.find(".newsName").val(edit.newsName);
	            //     body.find(".abstract").val(edit.abstract);
	            //     body.find(".thumbImg").attr("src",edit.newsImg);
	            //     body.find("#news_content").val(edit.content);
	            //     body.find(".newsStatus select").val(edit.newsStatus);
	            //     body.find(".openness input[name='openness'][title='"+edit.newsLook+"']").prop("checked","checked");
	            //     body.find(".newsTop input[name='newsTop']").prop("checked",edit.newsTop);
	            //     form.render();
	            // }
	            setTimeout(function(){
	                layui.layer.tips('点击此处关闭当前页', '.layui-layer-setwin .layui-layer-close', {
	                    tips: 3
	                });
	            },500)
	        }
	    })
	
	}
	$(".addGene_btn").click(function(){
	    addGene();
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