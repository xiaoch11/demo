var setGetUserMedia = function() {
    //处理无法兼容情况

    //不支持mediaDevices属性
    if (navigator.mediaDevices === undefined) {
      navigator.mediaDevices = {};
    }

    //不支持mediaDevices.getUserMedia
    if (navigator.mediaDevices.getUserMedia === undefined) {
        navigator.mediaDevices.getUserMedia = function(constraints) {
            var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
            
            if(!getUserMedia) {
                return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
            }
            
            return new Promise(function(resolve, reject) {
                getUserMedia.call(navigator, constraints, resolve, reject);
            });
        }
    }  
};

var useStream = function(constraints) {
    navigator.mediaDevices.getUserMedia(constraints)
    .then(function(stream) {
        var video = document.querySelector("#video");
        //判断浏览器是否支持srcObject
        if ("srcObject" in video) {
            video.srcObject = stream;
        } else {
            //旧方案
            video.src = window.URL.createObjectURL(stream);
        }
        // video.onloadedmetadata = function(e) {
        //     video.play();
        // };
    }).catch(function(err) {
        alert(err.name + ": " + err.message);
    });
};

var constraints = {
    video: true
};

setGetUserMedia();
useStream(constraints);