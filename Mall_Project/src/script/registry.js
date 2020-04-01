$('.bg_footer').load('footer.html')
!function ($) {
    //得到焦点input框为空
    $('input').on('focus', function () {
        $(this).val("");
        $(this).parents('.form-group').find('.success').html("")
        $(this).parents('.form-group').find('.faild').html("")
    })
    //给每一个文本框设定一个标记，证明这个文本框是通过检测的
    let flag1 = true;
    let flag2 = true;
    let flag3 = true;
    let flag4 = true;
    //1、用户名验证
    $('#exampleInputUsername').on('blur', function () {
        let $reg = /^([a-zA-Z0-9_\u4e00-\u9fa5]{3,16})$/;
        if ($(this).val() != '') {
            if ($reg.test($(this).val())) {//输入的值是否在正则条件中
                // 给后端传输数据
                $.ajax({
                    type: 'post',
                    url: 'http://localhost:8080/Mall-Project/Mall_Project/php/registry.php',
                    data: {
                        username: $('#exampleInputUsername').val()
                    }
                }).done(function ($result) {//判断用户名是否存在
                    if (!$result) {//不存在
                        $('#exampleInputUsername').parents('.form-group').find('.success').html('√').css("color", 'green');
                        flag1 = true;
                    } else {
                        $('#exampleInputUsername').parents('.form-group').find('.faild').html("该用户名已存在！").css("color", 'red');
                        flag1 = false;
                    }
                })

            } else {
                $(this).parents('.form-group').find('.faild').html("用户名格式有误！").css("color", 'red');
                flag1 = false;
            }
        } else {
            $(this).parents('.form-group').find('.faild').html("用户名不能为空！").css("color", 'red');
            flag1 = false;
        }
    })
    //2、邮箱验证
    $('#exampleInputEmail').on('blur', function () {
        let $reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        if ($(this).val() != '') {

            if ($reg.test($(this).val())) {//输入的值是否在正则条件中
                // 满足条件，当前操作的元素后面显示√
                $(this).parents('.form-group').find('.success').html("√").css("color", 'green');
                flag2 = true;
            } else {
                $(this).parents('.form-group').find('.faild').html("邮箱格式有误！").css("color", 'red');
                flag2 = false;
            }
        } else {
            $(this).parents('.form-group').find('.faild').html("邮箱不能为空！").css("color", 'red');
            flag2 = false;
        }
    })

    //3、密码验证
    $('#exampleInputPassword').on('blur', function () {
        let $reg = /^(?!\d+$)(?![A-Za-z]+$)(?![-.!@#$%^&*()+?><]+$)[a-zA-Z0-9-.!@#$%^&*()+?><]{6,}$/;
        if ($(this).val() != '') {

            if ($reg.test($(this).val())) {//输入的值是否在正则条件中
                // 满足条件，当前操作的元素后面显示√
                $(this).parents('.form-group').find('.success').html("√").css("color", 'green');
                flag3 = true;
            } else {
                $(this).parents('.form-group').find('.faild').html("密码格式有误！").css("color", 'red');
                flag3 = false;
            }
        } else {
            $(this).parents('.form-group').find('.faild').html("密码不能为空！").css("color", 'red');
            flag3 = false;
        }
    })

    //4、密码确认
    $('#exampleInputRepassword').on('blur', function () {
        if ($(this).val() != '') {
            if ($(this).val() === $('#exampleInputPassword').val()) {
                $(this).parents('.form-group').find('.success').html("√").css("color", 'green');
                flag4 = true;
            } else {
                $(this).parents('.form-group').find('.faild').html("密码不一致！").css("color", 'red');
                flag4 = false;
            }
        } else {
            $(this).parents('.form-group').find('.faild').html("密码不能为空！").css("color", 'red');
            flag4 = false;
        }
    })

    //提交按钮点击判断
    $('form').on('submit', function () {
        if ($('#exampleInputUsername').val() === '') {
            $(this).parents('.form-group').find('.faild').html("用户名不能为空！").css("color", 'red');
            flag1 = false;
        }
        if ($('#exampleInputEmail').val() === '') {
            $(this).parents('.form-group').find('.faild').html("邮箱不能为空！").css("color", 'red');
            flag2 = false;
        }
        if ($('#exampleInputPassword').val() === '') {
            $(this).parents('.form-group').find('.faild').html("密码不能为空！").css("color", 'red');
            flag3 = false;
        }
        if ($('#exampleInputRepassword').val() === '') {
            $(this).parents('.form-group').find('.faild').html("密码不能为空！").css("color", 'red');
            flag4 = false;
        }

        // 其中一个条件不满足便阻止跳转
        if (!flag1 || !flag2 || !flag3 || !flag4) {
            return false;//阻止跳转
        } 

    })

}(jQuery)
