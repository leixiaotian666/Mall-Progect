//失去焦点做用户名是否重名的检测
const username = document.querySelector('.username');
const spanerr = document.querySelector('span');
const form = document.querySelector('form');
let userlock = true;
username.onblur = function () {
    if (username.value !== '') {//判断值不能为空
        $ajax({
            type: 'post',
            url: 'http://localhost:8080/loginregistry/src/registry.html',
            data: {
                xingming: username.value
            },
            success: function (d) {
                if (!d) {//返回的是空，不存在数据库，可以注册的。取反判断
                    spanerr.innerHTML = '√';
                    spanerr.style.color = 'green';
                    userlock = true;
                } else {
                    spanerr.innerHTML = '该用户名已经存在';
                    spanerr.style.color = 'red';
                    userlock = false;
                }
            }
        })
    } else {
        spanerr.innerHTML = '该用户名不能为空';
        spanerr.style.color = 'red';
        userlock = false;
    }
}
 
//提交事件
 
form.onsubmit = function () {
    if (username.value === '') {//判断值不能为空
        spanerr.innerHTML = '该用户名不能为空';
        spanerr.style.color = 'red';
        userlock = false;
    }
    if (!userlock) {
        return false;//阻止跳转。
    }
}