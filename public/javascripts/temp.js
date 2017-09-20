$(document).ready(function() {
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