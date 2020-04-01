!function ($) {
    // 判断用户名是否存在，改变登录状态
    let $username=jscookie.get('username');
    if($username){
        $('.username').html($username);
        $('.top-1').show();
        $('.top-0').hide();
        $('.top-1 span').css('color','#333')
 
    }
    $('.top-1 button').on('click',function(){
        $('.top-1').hide();
        $('.top-0').show();
        jscookie.del($username);
    })
    // 回到顶部
    $('.loutinav .li4').on('click', function () {
        // document.documentElement.scrollTop = 0;
        $(document).scrollTop(0);
    })
    // 导航栏顶部悬浮
    $(document).ready(function () {
        let top = $('.nav').offset().top;
        $(document).scroll(function () {
            let scrTop = $(window).scrollTop();
            if (scrTop >= top) {
                $('.bg_nav').css({ 'position': 'fixed', 'top': '0', 'left': '0', 'width': '100%', 'z-index': '10' });
                $('.nav').css({ 'background': '#f1f1f1' })
            } else {
                $('.bg_nav').css({ 'position': '', 'top': '' });
                $('.nav').css({ 'background': '#fff' })
            }
        })
    })
    // 轮播图
    var index=0;
    $(".smallnav a").mousemove(function () {
            $(this).addClass("active").siblings().removeClass("active");
            index=$(this).index();
            $(".bannerimg img").eq(index).fadeIn(0).siblings().fadeOut(0);//渐入该图片,渐出其他相邻图片
    });
    //  设置每5秒钟自动轮播：
    //  获取当前位置序号：自加操作；当超过图片最大序号时序号设置为0  
    var time=setInterval(move,5000);
    function move() {
        index++;
        if (index==$('.smallnav a').length){
            index=0
        }
        $(".smallnav a").eq(index).addClass("active").siblings().removeClass("active");
        $(".bannerimg img").eq(index).fadeIn(0).siblings().fadeOut(0);
    };
    // 1.划入时停止自动轮播
    // 2.划出时继续自动轮播
    $(".banner").on('mouseover',function(){
        clearInterval(time);
        $('.gobtn').css('opacity','1')//鼠标移入显示按钮
    });
    $(".banner").on('mouseout',function(){
        time=setInterval(move,5000);
        $('.gobtn').css('opacity','0')//鼠标移出按钮消失
    });
     /*点击右侧按钮时执行*/
    $(".icon-youjiantou").click(function () {
       move();
    });
     /*点击左侧按钮时执行*/
    function moveL() {
         index--;
        if (index<0){
            index=$('.smallnav a').length-1
        }
        $(".smallnav a").eq(index).addClass("current").siblings().removeClass("current");
        $(".bannerimg img").eq(index).fadeIn(0).siblings().fadeOut(0);
    }
    $(".icon-zuojiantou").click(function () {
        moveL();
    });

    // 渲染“为你推荐”部分商品列表
    const $list = $(".bg_content .imglist");
    $.ajax({
        url: "http://localhost:8080/Mall-Project/Mall_Project/php/indexlist.php",
        dataType: "json"
    }).done(function (data) {
        let $strhtml = "<ul>";
        $.each(data, function (index, value) {
            $strhtml += `
                <li>
                    <a href="detail.html?indexsid=${value.sid}">
                        <img  class="lazy" data-original="${value.url}"width="250" height="280"/>
                        <p>${value.title}</p>
                        <span>￥${value.price}</span>               
                    </a>
                </li>
            `;
        });
        $strhtml += "</ul>";
        $list.html($strhtml);
        // 图片懒加载
        $(function(){
            $('img.lazy').lazyload({effect:"fadeIn"});
        })
    });

}(jQuery)