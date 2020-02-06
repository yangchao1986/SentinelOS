layui.use(['form','layer'],function(){
    var form = layui.form
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery;
		
	//自定义验证规则，与lay-verify参数结合使用
	form.verify({
	    username:[
			/^[a-zA-Z0-9_-]{4,16}$/,'用户名必须是4到16位含字母、数字或下划线的字符串'
		], 
	    pwd1: [
	        /^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$/
	        , '密码必须是包含至少1个大写字母，1个小写字母，1个数字，1个特殊字符的最少6位字符串'
	    ], 
		pwd2: function (value){
			var reVal= $('#reVal').val()
			if(value!=reVal){
				return "两次输入的密码不一致,请重新输入!"
			}
		}, 
	});

    form.on("submit(addUser)",function(data){
        //弹出loading
        var index = top.layer.msg('数据提交中，请稍候',{icon: 16,time:false,shade:0.8});
        // 实际使用时的提交信息
        // $.post("上传路径",{
        //     userName : $(".userName").val(),  //登录名
        //     userEmail : $(".userEmail").val(),  //邮箱
        //     userSex : data.field.sex,  //性别
        //     userGrade : data.field.userGrade,  //会员等级
        //     userStatus : data.field.userStatus,    //用户状态
        //     newsTime : submitTime,    //添加时间
        //     userDesc : $(".userDesc").text(),    //用户简介
        // },function(res){
        //
        // })
        setTimeout(function(){
            top.layer.close(index);
            top.layer.msg("用户添加成功！");
            layer.closeAll("iframe");
            //刷新父页面
            parent.location.reload();
        },2000);
        return false;
    })

    //格式化时间
    function filterTime(val){
        if(val < 10){
            return "0" + val;
        }else{
            return val;
        }
    }
    //定时发布
    var time = new Date();
    var submitTime = time.getFullYear()+'-'+filterTime(time.getMonth()+1)+'-'+filterTime(time.getDate())+' '+filterTime(time.getHours())+':'+filterTime(time.getMinutes())+':'+filterTime(time.getSeconds());

})