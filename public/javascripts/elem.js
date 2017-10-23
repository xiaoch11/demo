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
    
    var spyDiv = $('.elem-sidebar').attr('data-scrollSpy');
    if(spyDiv) {
        checkView(spyDiv);
        spyOn(spyDiv);
    }

    // 切换页面
    $('.elem-sidebar-nav li').click(function() {
        var showId = $(this).attr('data-show');
        spyOff();
        sidebarToActive(showId);
        $('body').animate({
            scrollTop: $(`#${showId}`).offset().top
        }, 'normal', 'linear', function() {
            spyOn(spyDiv);
        });
    });
}

/* 组件-dragItem */
function initDragIem() {
    function dragStart(target, event) {
        var left = parseFloat(target.css('left'));
        var top = parseFloat(target.css('top'));
        var originX = event.pageX;
        var originY = event.pageY;
        $(document).mousemove(function(event) {
            var disX = event.pageX - originX;
            var disY = event.pageY - originY;
            target.css('left', left + disX);
            target.css('top', top + disY);
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

/* 组件-dragList */
function initDragList() {
    function dragStart(target, subs, event) {
        var prev = target.prev();
        var next = target.next();

        var left = parseFloat(subs.css('left'));
        var top = parseFloat(subs.css('top'));
        var originX = event.pageX;
        var originY = event.pageY;

        $(document).mousemove(function(event) {
            var disX = event.pageX - originX;
            var disY = event.pageY - originY;

            subs.css('left', left + disX);
            subs.css('top', top + disY);
            console.log(event.pageY);
            console.log(next[0].offsetTop + next.innerWidth()/2);
            if(event.pageY > next[0].offsetTop + next.innerWidth()/2) {
                target.remove();
                next.after(target);
                prev = target.prev();
                next = target.next();
            }
        });
        $(document).mouseup(function() {
            $(document).unbind('mousemove');
            setTimeout(function(){
                $(document).unbind('mouseup');
            }, 0);
        });
    }

    $('.elem-dragList li').mousedown(function(event) {
        function cloneTarget(target) {
            var subs = target.clone();
            subs.css('z-index', '2');
            subs.css('float', 'left');
            target.before(subs);
            target.css('visibility', 'hidden');
            return subs;
        }
        var subs = cloneTarget($(this));
        dragStart($(this), subs, event);
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

function MenuPopup(trigger, options) {
    var defaultOptions = {
        style: {
            position: 'bottom',
            offset: 10,
            triggerClass: 'elem-menuPopup-trigger',
            menuClass: 'elem-menuPopup-menu'
        },
        render: {
            way: 'elem', // data or elem
            data: [],
            createElem: function(data, trigger) {
                var ul = $('<ul></ul>');
                for (var i = 0; i < data.length; i++) {
                    var li = $('<li></li>').text(data[i]);
                    ul.append(li);
                }
                // $('body').append(ul);
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
    var trigger = this.trigger;
    var menu = null;

    // 生成menu
    if(render.way == 'data') {
        menu = render.createElem(render.data, trigger);
    } else if(render.way == 'elem') {
        menu = $(`#${this.trigger.attr('data-menuPopup')}`);
    }
    this.menu = menu;

    // 调用cb()
    render.cb(menu);

    // 设置样式
    trigger.addClass(style.triggerClass);
    menu.addClass(style.menuClass);
    trigger.append(menu);
    function setPosition(style, trigger, menu) {
        var triggerPos = {
            x: trigger.offset().left,
            y: trigger.offset().top,
            h: trigger.innerHeight(),
            w: trigger.innerWidth()
        };
        var menuPos = {
            x: menu.offset().left,
            y: menu.offset().top,
            h: menu.innerHeight(),
            w: menu.innerWidth(),
            left: parseFloat(menu.css('left')),
            top: parseFloat(menu.css('top'))
        };

        if(menu.css('position') != 'absolute') menu.css('position', 'absolute');
        switch(style.position) {
            case 'top':
                menu.css('left', menuPos.left + triggerPos.x - menuPos.x - (menuPos.w - triggerPos.w)/2);
                menu.css('top', menuPos.top + triggerPos.y - menuPos.y - menuPos.h - style.offset);
                menu.addClass('top');
                break;
            case 'right':
                menu.css('left', menuPos.left + triggerPos.x - menuPos.x + triggerPos.w + style.offset);
                menu.css('top', menuPos.top + triggerPos.y - menuPos.y - (menuPos.h - triggerPos.h)/2);
                menu.addClass('right');
                break;
            case 'left':
                menu.css('left', menuPos.left + triggerPos.x - menuPos.x - menuPos.w - style.offset);
                menu.css('top', menuPos.top + triggerPos.y - menuPos.y - (menuPos.h - triggerPos.h)/2);
                menu.addClass('left');
                break;
            default:
                menu.css('left', menuPos.left + triggerPos.x - menuPos.x - (menuPos.w - triggerPos.w)/2);
                menu.css('top', menuPos.top + triggerPos.y - menuPos.y + triggerPos.h + style.offset);
                menu.addClass('bottom');
        }
    }

    // setStyle(style, trigger, menu);
    trigger.mouseover(function(event) {
        setPosition(style, trigger, menu);
        menu.css('visibility', 'visible');
        trigger.mouseout( function(event) {
            menu.css('visibility', 'hidden');
        });
    });
}


/* 组件-carousel */
function initCarousel() {
    var carousel = $('.elem-carousel');
    var caroIndex = $('.elem-carousel-index');
    var caroList = $('.elem-carousel-list');
    var cnt = 0;

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
        var listSize = caroList.children().length;
        var autoSlide = setInterval(function() {
            cnt = (cnt + 1)%listSize;
            caroToActive(caroIndex.children().get(cnt).getAttribute('data-show'));
        }, time);
    }

    setWidth();
    caroIndex.children().click(function() {
        cnt = $(this).index();
        caroToActive($(this).attr('data-show'));
    });
    setAutoSlide(parseInt(carousel.attr('data-interval')));
}

/* 组件-loading动画 */
function Loading(container, options) {
    var defaultOptions = {
        radiusBig: 50,
        radiusSmall: 5,
        coreX: 60,
        coreY: 60,
        internal: Math.PI/6,
        num: 9
    };
    
    var canvas = $('<canvas class="elem-loadingCanvas"></canvas>');
    container.append(canvas);
    this.container = container;
    this.canvas = canvas;
    this.options = extend(defaultOptions, options);
}

Loading.prototype.drawLoading = function() {
    var canvas = this.canvas;
    var options = this.options;

    function drawCircle(ctx, x, y, r, fillStyle, globalAlpha) {
        ctx.fillStyle = fillStyle;
        ctx.globalAlpha = globalAlpha;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI*2, true);
        ctx.closePath();
        ctx.fill();
    }
    function draw(ctx, options) {
        for (var j = 0; j < options.num; j++) {
            var angle = j * options.internal;
            drawCircle(ctx, options.radiusBig * Math.cos(angle), 0 - options.radiusBig * Math.sin(angle), options.radiusSmall, 'blue', (options.num - j)/options.num);
        };
    }
 
    canvas.attr('width', 2*options.coreX + 'px');
    canvas.attr('height', 2*options.coreY + 'px');
    var ctx = canvas[0].getContext('2d');

    ctx.translate(options.coreX, options.coreY);
    draw(ctx, options);
}

/* 组件-Three */
function Three(container, options) {
    var defaultOptions = {
        width: 600,
        height: 300,
        camera: {
            fov: 75,
            aspect: 2,
            near: 0.1,
            far: 1000
        }
    };
    options = extend(defaultOptions, options);
    // 创建场景
    var scene = new THREE.Scene();
    // 创建相机
    var camera = new THREE.PerspectiveCamera(options.camera.fov, options.camera.aspect, options.camera.near, options.camera.far);
    // 创建渲染器
    var renderer = new THREE.WebGLRenderer();

    // 设置场景大小，并添加到页面中
    renderer.setSize(options.width, options.height);
    container.append(renderer.domElement);
    this.main = {
        scene: scene,
        camera: camera,
        renderer: renderer
    }
    this.objects = [];
    this.options = options;
}

Three.prototype.addObject = function(type, options) {
    // 向场景中添加物体
    var geometry;
    var material;
    var object = null;
    if(type === 'cube') { // 创建几何体
        geometry = new THREE.CubeGeometry(options.x, options.y, options.z);
        material = new THREE.MeshLambertMaterial({color: options.color});
        object = new THREE.Mesh(geometry, material);
    } else if(type === 'line') { // 创建直线
        geometry = new THREE.Geometry();  // 声明了一个几何体geometry，几何体里面有一个vertices变量，可以用来存放点
        material = new THREE.LineBasicMaterial(options.material);  // 定义线条的材质
        var p1 = new THREE.Vector3(options.point1.x, options.point1.y, options.point1.z);  // 定义两个顶点的位置
        var p2 = new THREE.Vector3(options.point2.x, options.point2.y, options.point2.z);
        geometry.vertices.push(p1);
        geometry.vertices.push(p2);
        if(options.material.vertexColors) {
            geometry.colors.push(new THREE.Color(0x444444), new THREE.Color(0xFF0000));
        }
        object = new THREE.Line(geometry, material, THREE.Segments);
    } else if(type === 'directionalLight') {
        object = new THREE.DirectionalLight(options.hex, options.intensity);
        object.position.set(options.position.x, options.position.y, options.position.z);
    }
    if(object) {
        this.main.scene.add(object);
        this.objects.push(object);
    }
}

Three.prototype.initCamera = function(options) {
    var defaultOptions = {
        position: {
            x: 0,
            y: 0,
            z: 10
        }
    };
    var ops = extend(defaultOptions, options);
    var camera = this.main.camera;
    camera.position.set(options.position.x, options.position.y, options.position.z);
}

Three.prototype.renderThree = function(render) {
    var main = this.main;
    var objects = this.objects;

    render(objects, main);
}

$(document).ready(function() {
    initSidebar();
    initDragIem();
    initDragList()
    initTooltip();
    initCarousel();
});