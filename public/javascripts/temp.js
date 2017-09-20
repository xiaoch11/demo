function isObject(obj) {
    return Object.prototype.toString.call(obj) == '[object Object]';
}

function extend(defaultOptions, options) {
    var option;
    for (option in defaultOptions) {
        if (options.hasOwnProperty(option)) {
            if (isObject(defaultOptions[option])&&isObject(options[option])) {
                extend(defaultOptions[option], options[option]);
            }
        }
        else {
            options[option] = defaultOptions[option];
        }
    }
    return options;
}

function MenuPopup(trigger, options) {
    var defaultOptions = {
        style: {
            position: 'bottom',
            offset: '10px',
            triggerClass: 'elem-menuPopup-trigger',
            menuClass: 'elem-menuPopup-menu',
            // arrowPosition: 'middle'
        },
        render: {
            way: 'elem', // data or elem
            data: [],
            createElem: function(data) {
                var ul = $('<ul></ul>');
                for (var i = 0; i < data.length; i++) {
                    var li = $('<li></li>').text(data[i]);
                    ul.append(li);
                }
                $('body').append(ul);
                return ul;
            },
            cb: function(menu) {},
        }
    }
    this.options = extend(defaultOptions, options);
    this.trigger = trigger;
}

MenuPopup.prototype.renderMenu = function() {
    var render = this.options.render;
    var style = this.options.style;
    var menu = null;

    if(render.way == 'data') {
        menu = render.createElem(render.data);
    } else if(render.way == 'elem') {
        menu = $(`#${this.trigger.attr('data-menuPopup')}`);
    }
    render.cb(menu);
    this.menu = menu;

    function setStyle(style, trigger, menu) {
        trigger.addClass(style.triggerClass);
        menu.addClass(style.menuClass);
        var triggerPos = {
            x: trigger.offset().left,
            y: trigger.offset().top,
            h: trigger.innerHeight,
            w: trigger.innerWidth
        };
        var menuPos = {
            x: menu.offset().left,
            y: menu.offset().top,
            h: menu.innerHeight,
            w: menu.innerWidth,
            left: parseFloat(menu.css('left')),
            top: parseFloat(menu.css('top'))
        };
        console.log(menuPos);
        console.log(triggerPos);

        if(menu.css('position') != 'absolute') menu.css('position', 'absolute');
        switch(style.position) {
            case 'top':
                menu.css('left', menuPos.left + triggerPos.x - menuPos.x - (menuPos.w - triggerPos.w)/2);
                menu.css('top', menuPos.top + triggerPos.y - menuPos.y - menuPos.h - style.offset);
                $('head').append(`<style>.elem-menuPopup-menu:after{left:${menuPos.w/2-5}, top:${menuPos.h}}`);
                break;
            case 'right':
                menu.css('left', menuPos.left + triggerPos.x - menuPos.x + triggerPos.w + style.offset);
                menu.css('top', menuPos.top + triggerPos.y - menuPos.y);
                break;
            case 'left':
                menu.css('left', menuPos.left + triggerPos.x - menuPos.x - menuPos.w - style.offset);
                menu.css('top', menuPos.top + triggerPos.y - menuPos.y);
                break;
            default:
                menu.css('left', menuPos.left + triggerPos.x - menuPos.x - (menuPos.w - triggerPos.w)/2);
                menu.css('top', menuPos.top + triggerPos.y - menuPos.y + triggerPos.h + style.offset);
                $('head').append(`<style>.elem-menuPopup-menu:after{left:${menuPos.w/2-5}px, top:-20px}`);
        }
    }

    setStyle(style, this.trigger, this.menu);
}

$(document).ready(function() {
    var menupop = new MenuPopup($('#menuPopupTrigger'), {
        render: {
            way: 'data',
            data: ['7月1号香河孔雀城专线看房团','7月1号香河孔雀城专线看房团','7月1号香河孔雀城专线看房团','7月1号香河孔雀城专线看房团']
        }
    });
    menupop.renderMenu();
})