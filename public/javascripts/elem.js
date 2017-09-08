/* 组件-sidebar */
function initSidebar() {
    function sidebarToActive(showId) {
        $(`[data-show=${showId}]`).addClass('active').siblings().removeClass('active');
    }

    function checkView(spyDiv) {
        var divs = $(`#${spyDiv}`).children();
        for (var i = 0; i < divs.length; i++) {
            if(divs[i].offsetTop - $(window).scrollTop() < window.innerHeight*0.4) {
                sidebarToActive(divs[i].id);
            }
        }
    }

    function spyOn(spyDiv) {
        $(window).scroll(function() {
            checkView(spyDiv);
        });
    }

    function spyOff() {
        $(window).unbind('scroll');
    }

    // 切换页面
    $('.elem-sidebar-nav li').click(function() {
        var showId = $(this).attr('data-show');
        spyOff();
        sidebarToActive(showId);
        $('body').animate({
            scrollTop: $(`#${showId}`).offset().top
        }, 'normal', 'linear', spyOn());
    });
    
    var spyDiv = $('.elem-sidebar').attr('data-scrollSpy');
    if(spyDiv) {
        checkView(spyDiv);
        spyOn(spyDiv);
    }
}

/* 组件-dragItem */
function initDragIem() {
    function dragStart(target, event) {
        var left = parseFloat(target.css('left'));
        var top = parseFloat(target.css('top'));
        var originX = event.pageX;
        var originY = event.pageY;
        $(document).mousemove(function(event) {
            var desX = event.pageX - originX;
            var desY = event.pageY - originY;
            target.css('left', left + desX);
            target.css('top', top + desY);
        });
        $(document).mouseup(function() {
            $(document).unbind('mousemove');
            setTimeout(function(){
                $(document).unbind('mouseup');
            }, 0);
        });
    }

    $('.elem-dragItem').mousedown(function(event) {
        dragStart($(this), event);
    });
}

/* 组件-tooltip */
function initTooltip() {
    function showTooltipWindow(trigger, tooltipWindow) {
        tooltipWindow.css('left', parseFloat(tooltipWindow.css('left')) + trigger.offset().left - tooltipWindow.offset().left);
        tooltipWindow.css('top', parseFloat(tooltipWindow.css('top')) + trigger.offset().top + trigger.height() - tooltipWindow.offset().top + 10);
        tooltipWindow.css('visibility', 'visible');
    }

    function hideTooltipWindow(windowId) {
        var tooltipWindow = $(`#${windowId}`);
        tooltipWindow.css('visibility', 'hidden');
    }

    $('.elem-tooltip-trigger').mouseover(function(event) {
        var windowId = $(this).attr('data-tooltip');
        var tooltipWindow = $(`#${windowId}`);
        var trigger = $(this);

        showTooltipWindow(trigger, tooltipWindow);
        $(document).mouseover(function(event) {
            if(!event.target.className.match('elem-tooltip')) {
                hideTooltipWindow(windowId);
                $(this).unbind('mouseover');
            }
        });
    });
}

/* 组件-carousel */
function initCarousel() {
    var carousel = $('.elem-carousel');
    var caroIndex = $('.elem-carousel-index');
    var caroList = $('.elem-carousel-list');

    function setWidth() {
        var listSize = caroList.children().length;
        caroList.css('width', listSize*100 + '%');
        caroList.children().css('width', 100/listSize + '%');
    }

    function slideAnim(num) {
        caroList.animate({
            left: num*(-100) + '%'
        });
    }

    function caroToActive(showId) {
        $(`[data-show=${showId}]`).addClass('active').siblings().removeClass('active');
        var num = $(`[data-show=${showId}]`).index();
        slideAnim(num);
    }

    function setAutoSlide(time) {
        var cnt = 0;
        var listSize = caroList.children().length;
        var autoSlide = setInterval(function() {
            cnt = (cnt + 1)%listSize;
            caroToActive(caroIndex.children().get(cnt).getAttribute('data-show'));
        }, time);
    }

    setWidth();
    caroIndex.children().click(function() {
        caroToActive($(this).attr('data-show'));
    });
    setAutoSlide(parseInt(carousel.attr('data-interval')));
}

$(document).ready(function() {
    initSidebar();
    initDragIem();
    initTooltip();
    initCarousel();
});