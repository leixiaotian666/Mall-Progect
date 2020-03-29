$('.header').load('head.html')
$('.bg_footer').load('footer.html')

!function ($) {
    //获取列表页传来的sid
    let $sid = location.search.substring(1).split('=')[1];//substring(1)截取？号后面的字符串，用split将sid=1拆分成数组取第二位
    const $price = $('.price1');
    const $smallpic = $('#smallpic');
    const $title = $('.title1');
    const $bpic = $('#bpic');

    //如果$sid不存在，默认$sid = 1
    if (!$sid) {
        $sid = 1;
    }

    //将sid传给后端
    $.ajax({
        url: "http://localhost:8080/Mall-Project/Mall_Project/php/getsid.php",
        data: {
            sid: $sid,
        },
        dataType: 'json'
    }).done(function (d) {
        console.log(d)
        //详情页渲染出商品详细信息
        $price.html(d.price);
        $title.html(d.title);
        $smallpic.attr('src', d.url);
        $smallpic.attr('sid', d.sid);
        $bpic.attr('src', d.url);
        //渲染小图下面的图片列表
        // console.log(d.urllist.split(','));
        let $picarr = d.urllist.split(',');
        let $strhtml = '';
        $.each($picarr, function (index, value) {
            $strhtml += '<li><img src="' + value + '"/>></li>';
        });
        $('#list ul').html($strhtml);
    })
    //放大镜效果
    //小图/小放=大图/大放   
    const $spic = $('#spic');
    const $sf = $('#sf');//小放
    const $bf = $('#bf');//大放

    $sf.width($spic.width() * $bf.width() / $bpic.width());
    $sf.height($spic.height() * $bf.height() / $bpic.height());
    let $bili = $bpic.width() / $spic.width();//放大比例：大图/小图

    $spic.hover(function () {
        $sf.css('visibility', 'visible');
        $bf.css('visibility', 'visible');
        $(this).on('mousemove', function (ev) {
            let $leftvalue = ev.pageX - $('.wrap').offset().left - $sf.width() / 2;
            let $topvalue = ev.pageY - $('.wrap').offset().top - $sf.height() / 2;
            //限定小放大镜的移动范围
            if ($leftvalue < 0) {
                $leftvalue = 0;
            } else if ($leftvalue > $spic.width() - $sf.width()) {
                $leftvalue = $spic.width() - $sf.width();
            };
            if ($topvalue < 0) {
                $topvalue = 0;
            } else if ($topvalue > $spic.height() - $sf.height()) {
                $topvalue = $spic.height() - $sf.height();
            }
            //小放大镜移动效果
            $sf.css({
                left: $leftvalue,
                top: $topvalue
            });
            //大图移动效果
            $bpic.css({
                left: -$leftvalue * $bili,
                top: -$topvalue * $bili
            })
        });
    }, function () {
        $sf.css('visibility', 'hidden');
        $bf.css('visibility', 'hidden');
    });
    //列表图片与小图切换
    const $left = $('#left');//左箭头
    const $right = $('#right');//右箭头
    const $list = $('#list');//小图列表
    //使用事件委托寻找li
    $('#list ul').on('click', 'li', function () {
        $imgurl = $(this).find('img').attr('src');
        $smallpic.attr("src", $imgurl);
        $bpic.attr('src', $imgurl)
    })
    //图片列表左右箭头添加点击事件
    //右箭头点击
    let $num = 5;//列表显示的图片个数
    $right.on('click', function () {
        let $lists = $('#list ul li');
        if ($lists.size() > $num) {
            $num++;
            $left.css('color', '#333');
            if ($lists.size() == $num) {
                $right.css('color', '#fff');
            }
            $('#list ul').animate({
                left: -($num - 5) * $lists.eq(0).outerWidth(true)
            });
        }
    });
    //左箭头点击
    $left.on('click', function () {
        let $lists = $('#list ul li');
        if ($num > 5) {
            $num--;
            $right.css('color', '#333');
            if ($num <= 5) {
                $left.css('color', '#fff');
            }
            $('#list ul').animate({
                left: -($num - 5) * $lists.eq(0).outerWidth(true)
            });
        }
    });

    // 购物车按钮点击判断

    let arrsid = [];//存储商品的编号
    let arrnum = [];//存储商品的数量
    // 取出cookie用于判断是否存在
    function getcookie() {
        if (jscookie.get('cookiesid') && jscookie.get('cookienum')) {
            arrsid = jscookie.get('cookiesid').split(',');//获取cookie 同时转换成数组
            arrnum = jscookie.get('cookienum').split(',');//获取cookie 同时转换成数组
        } else {
            arrsid = [];
            arrnum = [];
        }
    }    

    //判断是第一次点击还是多次点击
    $('.gouwuche').on("click", function () {
        //获取当前商品对应的sid(当前点击的按钮与寻找的sid不在同一路径下，需要用parents从大找小)
        let $sid = $(this).parents('.details_top').find('#smallpic').attr('sid');
        
        //$.inArray(value,array,[fromIndex])
        //确定第一个参数在数组中的位置，从0开始计数(如果没有找到则返回 -1 )
        getcookie();
        if($.inArray($sid,arrsid)!=-1){
            let $num=parseInt(arrnum[$.inArray($sid,arrsid)])+parseInt($('.num').val());//将第一次之后点击的商品数量与第一次的数量相加
            arrnum[$.inArray($sid,arrsid)]=$num;//相加后的数量重新赋值给arrnum
            jscookie.add('cookienum',arrnum,60);//将相加后的数量传到cookie中
        }else{
            // 若是第一次点击，将获取到的sid传入arrsid中,将获取到的数量存入arrnum中，然后将arrsid和arrnum传到cookie中
            // alert($sid);
            arrsid.push($sid);
            // 将文本框中的商品数量传入arrnum中
            // alert($('.num').val());
            arrnum.push($('.num').val());
            jscookie.add('cookiesid', arrsid, 60);
            jscookie.add('cookienum', arrnum, 60);

        }
        


    })


}(jQuery)



//购物车的注意事项
//1.购物车的核心存储什么：
//商品的编号：
//商品的数量：

//2.怎么存储--数组
let arrsid = [];//存储商品的编号。
let arrnum = [];//存储商品的数量。
//3.点击加入购物车按钮(确定是第一次点击还是多次点击)
//第一次点击：在购物车列表页面创建商品列表
//多次点击：之前创建过商品列表，只需要数量增加。

//取出cookie,才能判断是第一次还是多次点击
function cookietoarray() {
    if (jscookie.get('cookiesid') && jscookie.get('cookienum')) {
        arrsid = jscookie.get('cookiesid').split(',');//获取cookie 同时转换成数组。[1,2,3,4]
        arrnum = jscookie.get('cookienum').split(',');//获取cookie 同时转换成数组。[12,13,14,15]
    } else {
        arrsid = [];
        arrnum = [];
    }
}


$('.p-btn a').on('click', function () {
    //获取当前商品对应的sid
    let $sid = $(this).parents('.goodsinfo').find('#smallpic').attr('sid');
    //判断是第一次点击还是多次点击
    //多次点击
    //$.inArray(value,array,[fromIndex])
    //确定第一个参数在数组中的位置，从0开始计数(如果没有找到则返回 -1 )。
    cookietoarray();
    if ($.inArray($sid, arrsid) != -1) {//$sid存在，商品列表存在，数量累加
        //先取出cookie中存在的数量+当前添加的数量，一起添加到cookie中。
        let $num = parseInt(arrnum[$.inArray($sid, arrsid)]) + parseInt($('#count').val());//取值
        arrnum[$.inArray($sid, arrsid)] = $num;//赋值
        jscookie.add('cookienum', arrnum, 10);
    } else {
        //第一次点击加入购物车按钮,将商品的sid和商品的数量放到提前准备的数组里面，然后将数组传入cookie.
        arrsid.push($sid);//将编号$sid push到arrsid数组中
        jscookie.add('cookiesid', arrsid, 10);
        arrnum.push($('#count').val());//将数量push到arrnum数组中
        jscookie.add('cookienum', arrnum, 10);
    }
    alert('按钮触发了');
});




// }(jQuery);
