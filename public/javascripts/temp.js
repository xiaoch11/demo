$(document).ready(function() {
    var three = new Three($('#webGL'), {
        width: 400,
        height: 200,
        camera: {
            fov: 90,
            aspect: 2,
            near: 1,
            far: 1000
        }
    });
    three.addObject('cube', {
        x: 10,
        y: 10,
        z: 10,
        color: '#fff'
    });
    three.addObject('directionalLight', {
        hex: 0xff00000,
        intensity: 1,
        position: {
            x: 20,
            y: 20,
            z: 20
        }
    });
    three.initCamera({
        position: {
            x: 0,
            y: 0,
            z: 20
        }
    });
    three.renderThree(function(objects, main) {
        main.renderer.setClearColor(0xffffff, 1.0);
        var cube = objects[0];
        // var tween = new TWEEN.Tween(cube.position).to({x: -50}, 2000).repeat(Infinity).start();

        function animation() {
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
            main.renderer.render(main.scene, main.camera);
            requestAnimationFrame(animation);
            // tween.update();
        }
        animation();
    });

    // 加载动画
    var loading = new Loading($('#elem-loadingAnim'), {});
    loading.drawLoading();

    // 弹出菜单列表
    var menupop1 = new MenuPopup($('#menuPopupTrigger1'), {
        style: {
            position: 'bottom',
        },
        render: {
            way: 'data',
            data: ['7月1号香河孔雀城专线看房团','7月1号香河孔雀城专线看房团','7月1号香河孔雀城专线看房团','7月1号香河孔雀城专线看房团']
        }
    });
    menupop1.renderMenu();
    var menupop2 = new MenuPopup($('#menuPopupTrigger2'), {
        style: {
            position: 'right'
        },
        render: {
            way: 'elem'
        }
    });
    menupop2.renderMenu();
})