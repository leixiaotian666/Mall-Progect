function $ajax(obj) {
    function objtostring(obj) {
        if (Object.prototype.toString.call(obj).slice(8, -1) === 'Object') {
            let arr = [];
            for (let attr in obj) {
                arr.push(attr + '=' + obj[attr])//[a=1, b=2 ,c=3]
            }
            return arr.join('&');//a=1&b=2&c=3
        } else {
            throw new Error('你输入的不是一个纯粹的对象');
        }
    }
    let ajax = new XMLHttpRequest();

    //obj.type默认设置为get
    obj.type = obj.type || 'get';
    //判断url是否存在
    if (!obj.url) {
        throw new Error('接口地址不能为空!');
    }
    //判断是否传输数据
    if (obj.data) {//判断数据是否存在，同时数据是否是对象,是的话转换成字符串
        if (Object.prototype.toString.call(obj.data).slice(8, -1) === 'Object') {
            obj.data = objtostring(obj.data);
        } else {//不是对象
            obj.data = obj.data;
        }
    }

    //当传输方式为get时
    if (obj.data && obj.type === 'get') {
        obj.url += '?' + obj.data;
    }
    //判断是否异步,设置默认为异步
    if (obj.async === 'false' || obj.async === false) {
        obj.async = false;
    } else {
        obj.async = true;
    }
    ajax.open(obj.type, obj.url, obj.async);
    //当传输方式为post时
    if (obj.data && obj.type === 'post') {
        ajax.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
        ajax.send(obj.data);
    } else {
        ajax.send();//发送解析。
    }

    

    //如果是异步，执行onreadystatechange
    if (obj.async) {
        ajax.onreadystatechange = function () {
            if (ajax.readyState === 4) {
                if (ajax.status === 200) {
                    //获取接口数据，将数据接口传递出来
                    //success方法存在，且success为函数时才执行后面的调用
                    obj.success && typeof (obj.success) === 'function' && obj.success(ajax.responseText);//执行调用对象的里面方法。
                } else {
                    throw new Error('地址错误' + ajax.status);
                }
            }
        }
    } else {//如果是同步，不需要执行onreadystatechange
        if (ajax.status === 200) {
            console.log(JSON.parse(ajax.responseText));
        } else {
            throw new Error('地址错误' + ajax.status);
        }
    }

}