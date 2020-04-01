!function ($) {
     // 判断用户名是否存在，改变登录状态
     let $username=jscookie.get('username');
     if($username){
         $('.username').html($username);
         $('.top-1').show();
         $('.top-0').hide();
         $('.top-1 span').css('color','#333')
  
     }else{
         $('.top-0').show();
 
     };
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
                $('.bg_nav').css({ 'position': 'fixed', 'top': '0', 'left': '0','width':'100%','z-index':'10'});
                $('.nav').css({'background':'#f1f1f1'})
            } else {
                $('.bg_nav').css({ 'position': '', 'top': '' });
                $('.nav').css({'background':'#fff'})
            }
        })
    })

}(jQuery)