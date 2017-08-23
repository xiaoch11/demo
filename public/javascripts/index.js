window.addEventListener("load", function(){
    console.log("global listener");
    var last = getCookie('last');
    if (last == "") {
    	setCookie('last');
    	console.log("setCookie called");
    }
    else {
    	console.log(last);
    }
});

window.testEvent = function() {
	console.log("Mouseover event listener");
}

window.testXML = function() {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET", '/', false);
	xmlhttp.send(null);
}

function setCookie(keyName) {
	var _date = new Date();
	var value = _date.toString();
	_date.setDate(_date.getDate() + 1);
	document.cookie = keyName + "=" + value + "; expires=" + _date.toGMTString();
}

function getCookie(keyName) {
	if (document.cookie.length > 0) {
		var start = document.cookie.indexOf(keyName);
		if (start != -1) {
			start = start + keyName.length + 1;
			end = document.cookie.indexOf(";", start);
			if (end == -1) { end = document.cookie.length; }
			return unescape(document.cookie.substring(start, end));
		}
	}
	return "";
}