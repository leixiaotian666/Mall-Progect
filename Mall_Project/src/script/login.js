$('.bg_footer').load('footer.html')
!function ($) {
    $('.btn').on('click', function () {
        if ($('.username').val() !== '' && $('.password').val() !== '') {
            $.ajax({
                type: 'post',
                url: 'http://localhost:8080/Mall-Project/Mall_Project/php/login.php',
                data: {
                    user: $('.username').val(),
                    pass: hex_sha1($('.password').val())
                }
            }).done(function (result) {
                if (result) {
                    location.href = "index.html";
                    localStorage.setItem('username', $('.username').val());
                    jscookie.add('username',$('.username').val(),100);
                } else {
                    $('.password').val('');
                    alert('用户名或者密码错误');
                }
            });
        } else {
            alert('用户名或密码不能为空！')          
        }
    });
}(jQuery);
