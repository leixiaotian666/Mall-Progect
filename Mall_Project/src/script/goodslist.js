$('.header').load('head.html')
$('.bg_footer').load('footer.html')
!(function ($) {
    let array_default = [];//排序前的li数组
    let array = [];//排序后的li数组
    let prev = null;
    let next = null;

    //渲染列表页的数据
    const $list = $(".rightcontent .list");
    $.ajax({
        url: "http://localhost:8080/Mall-Project/Mall_Project/php/listdata.php",
        dataType: "json"
    }).done(function (data) {
        let $strhtml = "<ul>";
        $.each(data, function (index, value) {
            $strhtml += `
                <li>
                    <a href="detail.html?listsid=${value.sid}">
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
        //排序
        $('.list li').each(function (index, element) {
            array[index] = $(this);
            array_default[index] = $(this);
        });      
    });
    //2.分页效果
    $('.page').pagination({
        pageCount: 3,//总的页数
        jump: true,//是否开启跳转到指定的页数，布尔值。
        coping: true,//是否开启首页和尾页，布尔值。
        prevContent: '上一页',
        nextContent: '下一页',
        homePage: '首页',
        endPage: '尾页',
        callback: function (api) {
            console.log(api.getCurrent());//获取的页码给后端
            $.ajax({
                url: 'http://localhost:8080/Mall-Project/Mall_Project/php/listdata.php',
                data: {
                    page: api.getCurrent()
                },
                dataType: 'json'
            }).done(function (data) {
                let $strhtml = '<ul>';
                $.each(data, function (index, value) {
                    $strhtml += `
                        <li>
                            <a href="detail.html?listsid=${value.sid}" target="_blank">
                                <img src="${value.url}"/>
                                <p>${value.sid}${value.title}</p>
                                <span class="price">￥${value.price}</span>
                            </a>
                        </li>
                    `;
                });
                $strhtml += '</ul>';
                $list.html($strhtml);

                array_default = [];//排序前的li数组
                array = [];//排序中的数组
                prev = null;
                next = null;

                //将页面的li元素加载到两个数组中
                $('.list li').each(function (index, element) {
                    array[index] = $(this);
                    array_default[index] = $(this);
                });

            })
        }
    });
    // 3.排序
    // 默认排序
    $('.paixu').eq(0).on('click', function () {
        $.each(array_default, function (index, value) {
            $('.list ul').append(value);
        });
        return;
    });

    // 升序
    console.log(array);
    $('.paixu').eq(1).on('click', function () {
        for (let i = 0; i < array.length - 1; i++) {
            for (let j = 0; j < array.length - i - 1; j++) {
                // console.log(parseFloat(array[j].find('span').html().substring(1)));
                prevprice = parseFloat(array[j].find('span').html().substring(1));
                nextprice = parseFloat(array[j + 1].find('span').html().substring(1));
                //通过价格大小比较，交换li的位置
                if (prevprice>nextprice) {
                    let temp = array[j];
                    array[j] = array[j + 1];
                    array[j + 1] = temp;
                }
            }
        }
        //清空原来的列表，将排序后的列表重新赋值
        $('.list ul').empty();
        $.each(array, function (index, value) {
            $('.list ul').append(value);
        })
    });
    // 降序
    $('.paixu').eq(2).on('click', function () {
        for (let i = 0; i < array.length - 1; i++) {
            for (let j = 0; j < array.length - i - 1; j++) {
                // console.log(parseFloat(array[j].find('span').html().substring(1)));
                prevprice = parseFloat(array[j].find('span').html().substring(1));
                nextprice = parseFloat(array[j + 1].find('span').html().substring(1));
                //通过价格大小比较，交换li的位置
                if (prevprice < nextprice) {
                    let temp = array[j];
                    array[j] = array[j + 1];
                    array[j + 1] = temp;
                }
            }
        }
        //清空原来的列表，将排序后的列表重新赋值
        $('.list ul').empty();
        $.each(array, function (index, value) {
            $('.list ul').append(value);
        })
    })
})(jQuery);

