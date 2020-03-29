$('.header').load('head.html');
$('.bg_footer').load('footer.html');
!function ($) {
    //获取cookie渲染对应的商品列表，利用clone隐藏元素来实现
    function showlist(sid,num) {
        $.ajax({
            url:'http://localhost:8080/Mall-Project/Mall_Project/php/alldata.php',
            dataType:'json',
        }).done(function(data){
            // console.log(data);
            $.each(data,function(index,value){
                if(sid==value.sid){
                    let $clonebox = $('.cart-list:hidden').clone(true, true);//克隆隐藏的商品购物车列表(:hidden匹配所有不可见的元素)
                    $clonebox.css('display', 'block');
                    $('.cart').append($clonebox);
                    $clonebox.find('.goodsinf').find('img').attr('src', value.url);
                    $clonebox.find('.goodsinf').find('.title').html( value.title);
                    $clonebox.find('.goodsinf').find('img').attr('sid', value.sid);          
                    $clonebox.find('.goodsprice').find('.danjia').html(value.price);
                    $clonebox.find('.goodsnum').find('input').val(num);
                    //计算单个商品的价格
                    $clonebox.find('.addprice').find('.xiaoji').html((value.price*num).toFixed(2));
                    allprice();//计算总价
                }
            })
        })
    }
    //获取cookie渲染数据
    if (jscookie.get('cookiesid') && jscookie.get('cookienum')) {
        let $arrsid = jscookie.get('cookiesid').split(',');//获取cookie 同时转换成数组
        let $arrnum = jscookie.get('cookienum').split(',');//获取cookie 同时转换成数组
        $.each($arrsid,function(index,value){
            showlist($arrsid[index],$arrnum[index]);
        })
    }
    //计算总价格
    function allprice() {
        let $sum = 0;//商品的件数
        let $count = 0;//商品的总价
        // 计算总价前判断复选框是否勾选
        $('.cart-list:visible').each(function (index, ele) {
            if ($(ele).find('.check input').prop('checked')) {//复选框勾选
                $sum += parseInt($(ele).find('.goodsnum input').val());
                $count += parseFloat($(ele).find('.addprice .xiaoji').html());
            }
        });
        $('.cart-foot').find('.commoditynum').html($sum);
        $('.cart-foot').find('.sum').html($count.toFixed(2));
    }
    //全选
    $('.allsel').on('change', function () {
        $('.cart-list:visible').find(':checkbox').prop('checked', $(this).prop('checked'));//:checkbox用来匹配所有的复选框
        $('.allsel').prop('checked', $(this).prop('checked'));
        allprice();
    });
    let $inputs = $('.cart-list:visible').find(':checkbox');
    $('.cart').on('change', $inputs, function () {
        //判断当前选中的复选框的长度是否等于所有复选框的长度，长度一样则全选，否则取消全选
        if ($('.cart-list:visible').find(':checkbox').length === $('.cart-list:visible').find('input:checked').size()) {
            $('.allsel').prop('checked', true);
        } else {
            $('.allsel').prop('checked', false);
        }
        allprice();
    });

    //点击+-改变商品数量
    //增加数量
    $('.add').on('click', function () {
        let $num = $(this).parents('.cart-list').find('.goodsnum input').val();
        $num++;
        $(this).parents('.cart-list').find('.goodsnum input').val($num);

        $(this).parents('.cart-list').find('.addprice .xiaoji').html(newprice($(this)));
        allprice();//计算总价
        setcookie($(this));
    });
    //减少数量
    $('.less').on('click', function () {
        let $num = $(this).parents('.cart-list').find('.goodsnum input').val();
        $num--;
        if ($num < 1) {
            $num = 1;
        }
        $(this).parents('.cart-list').find('.goodsnum input').val($num);
        $(this).parents('.cart-list').find('.addprice .xiaoji').html(newprice($(this)));
        allprice();//计算总价
        setcookie($(this));
    });
    //input框输入改变
    $('.goodsnum input').on('input', function () {
        let $reg = /^\d+$/g;//只能输入数字
        let $value = $(this).val();
        if (!$reg.test($value)) {//不是数字
            $(this).val(1);
        }
        $(this).parents('.cart-list').find('.addprice .xiaoji').html(newprice($(this)));
        allprice();//计算总价
        setcookie($(this));
    });
    //计算数量改变后的单价
    function newprice(obj) {
        let $danjia= parseFloat(obj.parents('.cart-list').find('.goodsprice .danjia').html());
        let $num = parseInt(obj.parents('.cart-list').find('.goodsnum input').val());
        return ($danjia * $num).toFixed(2)
    }

    //将改变后的数量存放到cookie中
    let arrsid = [];//存储商品的编号。
    let arrnum = [];//存储商品的数量。
    function getcookie() {
        if (jscookie.get('cookiesid') && jscookie.get('cookienum')) {
            arrsid = jscookie.get('cookiesid').split(',');//获取cookie 同时转换成数组。[1,2,3,4]
            arrnum = jscookie.get('cookienum').split(',');//获取cookie 同时转换成数组。[12,13,14,15]
        } else {
            arrsid = [];
            arrnum = [];
        }
    }
    function setcookie(obj) {
        getcookie();
        let $sid = obj.parents('.cart-list').find('img').attr('sid');
        arrnum[$.inArray($sid, arrsid)] = obj.parents('.cart-list').find('.goodsnum input').val();
        jscookie.add('cookienum', arrnum, 60);
    }

     //删除
     function delcookie(sid, arrsid) {//sid:当前删除的sid  arrsid:存放sid的数组
        let $index = -1;//删除的索引位置
        $.each(arrsid, function (index, value) {
            if (sid === value) {
                $index = index;
            }
        });
        arrsid.splice($index, 1);
        arrnum.splice($index, 1);

        jscookie.add('cookiesid', arrsid, 60);
        jscookie.add('cookienum', arrnum, 60);
    }
    $('.caozuo a').on('click', function () {
        getcookie();
        if (window.confirm('你确定要删除吗?')) {
            $(this).parents('.cart-list').remove();
            delcookie($(this).parents('.cart-list').find('img').attr('sid'), arrsid);
            calcprice();//计算总价
        }
    });

    $('.operation a').on('click', function () {
        getcookie();
        if (window.confirm('你确定要全部删除吗?')) {
            $('.cart-list:visible').each(function () {
                if ($(this).find(':checkbox').is(':checked')) {//判断复选框是否选中
                    $(this).remove();
                    delcookie($(this).find('img').attr('sid'), arrsid);
                }
            });
            allprice();//计算总价
        }
    });
}(jQuery)

    

   

