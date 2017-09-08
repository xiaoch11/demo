/* 组件-sidebar */
function initSidebar() {
    function sidebarToActive(showId) {
        $(`[data-show=${showId}]`).addClass('active').siblings().removeClass('active');
    }

    function checkView(spyDiv) {
        var divs = $(`#${spyDiv}`).children();
        for (var i = 0; i < divs.length; i++) {
            if(divs[i].offsetTop - $(this).scrollTop() < window.innerHeight*0.4) {
                sidebarToActive(divs[i].id);
            }
        }
    }

    // 滚动监听
    var spyDiv = $('.elem-sidebar').attr('data-scrollSpy');
    if(spyDiv) {
        $(window).scroll(function() {
            checkView(spyDiv);
        });
        checkView(spyDiv);
    }

    // 切换页面
    $('.elem-sidebar-nav li').click(function() {
        var showId = $(this).attr('data-show');
        sidebarToActive(showId);
        $('body').animate({
            scrollTop: $(`#${showId}`).offset().top
        }, 500);
    });
}

/* 组件-dragItem */
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
        $(document).unbind();
    });
}

function initDragIem() {
    $('.elem-dragItem').mousedown(function(event) {
        dragStart($(this), event);
    });
}

/* 组件-tooltip */
function showTooltipWindow(trigger, tooltipWindow) {
    tooltipWindow.css('left', parseFloat(tooltipWindow.css('left')) + trigger.offset().left - tooltipWindow.offset().left);
    tooltipWindow.css('top', parseFloat(tooltipWindow.css('top')) + trigger.offset().top + trigger.height() - tooltipWindow.offset().top + 10);
    tooltipWindow.css('visibility', 'visible');
}

function hideTooltipWindow(windowId) {
    var tooltipWindow = $(`#${windowId}`);
    tooltipWindow.css('visibility', 'hidden');
}

function initTooltip() {
    $('.elem-tooltip-trigger').mouseover(function(event) {
        var windowId = $(this).attr('data-tooltip');
        var tooltipWindow = $(`#${windowId}`);
        var trigger = $(this);

        showTooltipWindow(trigger, tooltipWindow);
        $(document).mouseover(function(event) {
            if(!event.target.className.match('elem-tooltip')) {
                hideTooltipWindow(windowId);
                $(this).unbind();
            }
        });
    });
}


$(document).ready(function() {
    initSidebar();
    initDragIem();
    initTooltip();
});