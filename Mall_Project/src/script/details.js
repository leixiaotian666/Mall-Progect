$('.header').load('head.html')
$('.bg_footer').load('footer.html')

!function ($) {
    //获取列表页传来的sid
    let $sid = location.search.substring(1).split('=')[1];//substring(1)截取？号后面的字符串，用split将sid=1拆分成数组取第二位
    let $sidname = location.search.substring(1).split('=')[0];//substring(1)截取？号后面的字符串，用split将sid=1拆分成数组取第一位
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
            sidname:$sidname,
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

    //点击+-改变商品数量
    //增加数量
    $('.add').on('click', function () {
        let $num = $(this).parents('.shuliang').find('.num').val();
        $num++;
        $(this).parents('.shuliang').find('.num').val($num);

    });
    //减少数量
    $('.less').on('click', function () {
        let $num = $(this).parents('.shuliang').find('.num').val();
        $num--;
        if ($num < 1) {
            $num = 1;
        }
        $(this).parents('.shuliang').find('.num').val($num);
      
    });

    // 购物车按钮点击判断
    // 点击“加入购物车”判断用户是否登录，未登录则跳转至登录页面
    $('.gouwuche').on("click", function (){
        let $username=jscookie.get('username')
        if(!$username){
            alert("您尚未登录！");
            $(".gouwuche").attr('href','login.html');
        }
    })

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


