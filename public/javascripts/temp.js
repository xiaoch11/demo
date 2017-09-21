function Three() {
	var defaultOptions = {};
	this.main = {};
	this.objects = [];
}

Three.prototype.initThree = function() {
	// 创建场景
	var scene = new THREE.Scene();
    // 创建相机
    var camera = new THREE.PerspectiveCamera(75, 2, 0.1, 1000);
    // 创建渲染器
    var renderer = new THREE.WebGLRenderer();

    // 设置场景大小，并添加到页面中
    renderer.setSize(600, 300);
    document.getElementById('webGL').appendChild(renderer.domElement);
    renderer.setClearColor(0xffffff, 1.0);
    this.main = {
    	scene: scene,
    	camera: camera,
    	renderer: renderer
    }
}

Three.prototype.addObject = function(type) {
    // 向场景中添加物体
    // 创建几何体
    if(type === 'cube') {
    	var geometry = new THREE.CubeGeometry(1,1,1);
	    var material = new THREE.MeshBasicMaterial({color: 0x666666});
	    var cube = new THREE.Mesh(geometry, material);
		this.main.scene.add(cube);
		this.objects.push(cube);
    }
}

Three.prototype.renderThree = function() {
	var main = this.main;
	var cube = this.objects[0];
	main.camera.position.z = 5;
	// 渲染
    function render() {
    	requestAnimationFrame(render);
        cube.rotation.x += 0.1;
        cube.rotation.y += 0.1;
        main.renderer.render(main.scene, main.camera); 
    }
    render();
}

$(document).ready(function() {
	var three = new Three();
	three.initThree();
	three.addObject('cube');
	//three.renderThree();
})