const username = document.querySelector('.username');
const password = document.querySelector('.password');
const btn = document.querySelector('.btn');
 
btn.onclick = function () {
    if (username.value !== '' && password.value !== '') {
        //传输
        $ajax({
            type: 'post',
            url: 'http://localhost:8080/loginregistry/src/login.html',
            data: {
                user: username.value,
                pass: password.value
            },
            success: function (d) {
                if (!d) {
                    alert('登录失败，用户名或者密码错误');
                } else {
                    location.href = 'index.html';
                    //存储cookie
                    jscookie.add('loginname', username.value, 7)
                }
            }
        })
    } else {
        alert('用户名或者密码不能为空');
    }
}