/* 组件-sidebar */
function installSidebar() {
    function sidebarToActive(showId) {
        $(`[data-show=${showId}]`).addClass('active').siblings().removeClass('active');
    }
    $('.elem-sidebar-nav li').click(function() {
        var showId = $(this).attr('data-show');
        sidebarToActive(showId);
        $('[data-scrollSpy]').animate({
            scrollTop: $(`#${showId}`).offset().top
        }, 500);
    });

    $(window).scroll(function() {
        var spyDiv = $('[data-scrollSpy]').attr('data-scrollSpy');
        var divs = $(`#${spyDiv}`).children();
        for (var i = 0; i < divs.length; i++) {
            if(divs[i].offsetTop - $(this).scrollTop() < window.innerHeight*0.3) {
                sidebarToActive(divs[i].id);
            }
        }
    });
}

$(document).ready(function() {
    installSidebar();
})