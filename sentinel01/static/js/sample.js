layui.use(['form','layer','laydate','table','laytpl','jquery','layedit'], function () {
    //定义变量
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        laydate = layui.laydate,
        table = layui.table;

    //样本列表
    var tableIns = table.render({
        elem: '#sampleList',
        url : 'get',
        method:'GET',
        cellMinWidth : 95,
        page : true,
        height : 720,
        limit : 20, //默认条目数
        limits : [10,15,20,25],
        id : "newsListTable",
        cols : [[
            {type: "checkbox", width:50},
            {field: 'code', title: '条形码', width:150, align:"center"},
            {field: 'name', title: '姓名', align:'center',width:120},
            {field: 'gend', title: '性别', align:'center',width:120},
            {field: 'birt', title: '年龄', align:'center',width:120,templet:function(d){
			    if(d.birt=='1900-01-01'){return '/'}else{return jsGetAge(d.birt)}
			}},
            {field: 'test', title: '检测项目',  align:'center',width:200},
            {field: 'styp', title: '送检样本',  align:'center',width:180},
            {field: 'stat', title: '样本状态', align:'center', width:120},
			{field: 'unit', title: '送检单位', align:'center',width:180},
			{field: 'send', title: '联系人', align:'center',width:120},
            {title: '登记日期', align:'center', width:120,templet:function(d){
			    return d.djoi.substring(0,10)
			}},
            // {field: 'djoi', title: '状态', align:'center',width:100,templet:function(d){
			//     if(d.esta==null){return '未审核'}else{return '已审核'}
			// }},
            {field: 'esta', title: '审核状态', align:'center',width:100},
            {title: '操作', templet:'#newsListBar',align:"center",width:180},
        ]]
    });

    //重载表格数据
    var active = {
        reload:function(){
            var code = $('#code');
            var name = $('#name');
            var state = $('#state');
            var index = layer.msg('查询中，请稍后...',{icon:16,time:false,shade:0});
            setTimeout(function(){
                layer.close(index);
                table.reload('newsListTable', { //newsListTable为重载表的id号
                    page:{
                        curr:1,//从第一页开始
                    },
                    where: {
                        code: code.val(),
                        name: name.val(),
                        state: state.val(),
                    }
                });
            },100);
        }
    };

    $('#search_btn').on('click', function(){
        var type = $(this).data('type'); //代表
        active[type] ? active[type].call(this) : '';
    });

    //列表操作
    table.on('tool(sampleList)', function(obj){
        var layEvent = obj.event,
            data = obj.data;
        if(layEvent === 'look'){
			layer.alert("预览数据")


        } else if(layEvent === 'edit'){
		    layer.alert("编辑数据")


        } else if(layEvent === 'check'){
            layer.confirm('请选择审核方式',{
                btn: ['已审核','中止检测','停止检测'],
                icon:3,
                title:'提示信息',
                shade:[0.5, '#6e7b8b'],//遮罩,即弹出层外区域，0.5是透明度
                resize:false,//不允许拉伸
                btn1: function(index, layero){
                    check(data.code,'已审核');
                },
                btn2: function(index, layero){
                    check(data.code,'中止检测');
                },
                btn3: function(index, layero){
                    check(data.code,'停止检测');
                },
            });


            // layer.confirm('确定审核？',{icon:3, title:'提示信息'},function(index){
            //     $.get("check",{
            //         'code' : data.code  //将需要审核的条形码传入
            //     },function(data){
            //         //alert(typeof(data)) //查看返回值的格式
            //         //data = JSON.parse(data);  //回调的是字符串格式，所以要把字符串转成JSON格式
            //         if(data.success==200 ){
            //             layer.alert('hehe');
            //             top.layer.close(index);
            //             top.layer.msg(data.msg);
            //             tableIns.reload();
            //             return true;  //必须这个才能回调成功！
            //          }
            //         if(data.success==201){
            //             top.layer.close(index);
            //             top.layer.msg(data.msg);
            //             tableIns.reload();
            //             return false;
            //         }
            //
            //         //layer.close(index);
            //     },
            //     'json',) //返回值为JSON格式
            // });
            // //layer.alert("审核数据")
        }
    });

    function check(code,state){
        $.get({
            url:'check',
            data:{'code':code,'state':state,},
            dataType:'json',
            success:function(data){
                layer.msg(data.msg);
                tableIns.reload(); //回调后就完成了，所以只能在这个位置放置表格重载；
                return false;
            }
        });
    }

    //添加样本信息
    $(".addNews_btn").click(function(){
        addNews();
    });

    //删除样本
    $(".delAll_btn").click(function(){
        var checkStatus = table.checkStatus('newsListTable'),
            data = checkStatus.data,
            codes = [];
        if(data.length > 0) {
            layer.confirm('确定删除选中样本信息？', {icon: 3, title: '提示信息'}, function (index) {
                for (var i in data) {
                    codes.push(data[i].code);
                }
                $.get("delete",{ //'delete'是url请求
                     'codes': codes //将需要删除的newsId作为参数传入
                },function(data){
                    //data = JSON.parse(data);
                    if(data.success==200){
                        //layer.alert(data); //data是返回值
                        layer.close(index);
                        top.layer.msg(data.msg);
                        tableIns.reload();
                        return true;
                    }

                },
                'json')//返回值为JSON格式
            })
        }else{
            layer.msg("请选择需要删除的样本信息");
        }
    });

    //日期控件
    laydate.render({
        elem: '#date0',
    });
    laydate.render({
        elem: '#date1',
    });
    laydate.render({
        elem: '#date2',
    });
    laydate.render({
        elem: '#date3',
        value: new Date(),
    });

    //自定义验证规则，与lay-verify参数结合使用
    form.verify({
        code: function (value) {
            if (value.length < 5) {
                return '条形码至少得5个字符啊';
            }
        },
        phon: [
            /^[\S]{11}$/
            , '手机号码必须11位，且不能出现空格'
        ],
        styp: function (value) {
            if (value=="") {
                return '请选择样本类型';
            }
        },
        test: function (value) {
            if (value=="") {
                return '请选择检测项目';
            }
        }
    });

    // 如果增加csrf验证，规避跨站请求攻击
    var csrftoken = $.cookie('csrftoken');
    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        },
        data:{csrfmiddlewaretoken:'{{ csrf_token }}'}
    });


    //监听指定点击事件开关
    form.on("submit(submit)", function() {
        submit();
        return false;
    });
    // form.on("submit(search_btn)",function(){
    //     search();
    //     return false;
    // })

});


//监听按钮提交
submit =  function () {
    var index = top.layer.msg('数据提交中，请稍候',{icon: 16,time:false,shade:0.8});
    var formObject = {};
    var formArray =$("#form1").serializeArray();
    $.each(formArray,function(i,item){
        formObject[item.name] = item.value;
    });
    $.ajax({
        url:'/laboratory/sampleList/addSample/',
        data:formObject,
        type:'POST',
        dataType:'JSON', //返回值为JSON格式
        global:false, //是否触发全局
        success: function (data) { //成功的回调，data为服务端返回的数据，也可以写成success
                if (data.success == 200) { //success为后端返回的key值，也可以用msg进行判断
                    top.layer.close(index);
                    top.layer.msg(data.msg);
                    //window.location.href = "/laboratory/sampleList/addSample/"; //跳转到指定url
                    $('#reset').click();
                    return true;
                }
                if (data.success == 201) {
                    top.layer.close(index);
                    top.layer.msg(data.msg);
                    //alert(data.msg);
                    return false;
                }
            },
        error : function(data) { //失败的回调
            //layer.alert(data);
            top.layer.close(index);
            top.layer.msg("信息异常！");
        },
    })
};

//添加样本信息
function addNews(edit){
    var index = layui.layer.open({
        title : ["请填写样本信息","font-size:20px;"],
        type : 2,
        area : ['800px','850px'],
        content : "addSample",
        success : function(layero, index){
            var body = layui.layer.getChildFrame('body', index);
            if(edit){
                body.find(".newsName").val(edit.newsName);
                body.find(".abstract").val(edit.abstract);
                body.find(".thumbImg").attr("src",edit.newsImg);
                body.find("#news_content").val(edit.content);
                body.find(".newsStatus select").val(edit.newsStatus);
                body.find(".openness input[name='openness'][title='"+edit.newsLook+"']").prop("checked","checked");
                body.find(".newsTop input[name='newsTop']").prop("checked",edit.newsTop);
                form.render();
            }
            setTimeout(function(){
                layui.layer.tips('点击此处关闭当前页', '.layui-layer-setwin .layui-layer-close', {
                    tips: 3
                });
            },500)
        }
    })
}

/*
*根据出生日期算出年龄
* 按年月日计算年龄
* */
function jsGetAge(strBirthday){
    var returnAge;
    var strBirthdayArr=strBirthday.toString().split("-");
    var birthYear = parseInt(strBirthdayArr[0]); //parseInt函数将字符串转整数，也可以按进制转换如，2进制的parseInt（'155',2）
    var birthMonth = parseInt(strBirthdayArr[1]);
    var birthDay = parseInt(strBirthdayArr[2]);

    d = new Date();
    var nowYear = d.getFullYear();
    var nowMonth = d.getMonth() + 1;
    var nowDay = d.getDate();
    if(nowYear == birthYear){
        returnAge = 0;//同年 则为0岁
    }
    else{
        var ageDiff = nowYear - birthYear ; //年之差
        if(ageDiff > 0){
            if(nowMonth == birthMonth) {
                var dayDiff = nowDay - birthDay;//日之差
                if(dayDiff < 0)
                {
                    returnAge = ageDiff - 1;
                }
                else
                {
                    returnAge = ageDiff ;
                }
            }
            else
            {
                var monthDiff = nowMonth - birthMonth;//月之差
                if(monthDiff < 0)
                {
                    returnAge = ageDiff - 1;
                }
                else
                {
                    returnAge = ageDiff ;
                }
            }
        }
        else
        {
            returnAge = -1;//返回-1 表示出生日期输入错误 晚于今天
        }
    }
    return returnAge;//返回周岁年龄
}

