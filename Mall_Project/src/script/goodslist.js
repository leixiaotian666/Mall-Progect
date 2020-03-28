$('.header').load('head.html')
$('.bg_footer').load('footer.html')
!(function ($) {
    //渲染列表页的数据
    const $list = $(".rightcontent .list");
    $.ajax({
        url: "http://localhost:8080/Mall-Project/Mall_Project/php/listdate.php",
        dataType: "json"
    }).done(function (data) {
        let $strhtml = "<ul>";
        $.each(data, function (index, value) {
            $strhtml += `
                <li>
                    <a href="detail.html?sid=${value.sid}">
                        <img src="${value.url}"/>
                        <p>${value.title}</p>
                        <span>￥${value.price}</span>
                        
                    </a>
                </li>
            `;
        });
        $strhtml += "</ul>";
        $list.html($strhtml);
    });
})(jQuery);

