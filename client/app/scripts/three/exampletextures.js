'use strict';

var container, stats;

var camera, controls, scene, renderer, particleSystem, smoke, smokeParticles, loadedObject, loadedObject2;

var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var clock = new THREE.Clock;

var smokeOn = false;
var particlesOn = false;

var modelRotationSpeed = 0.0;
var particlesRotationSpeed = 0.0;
var smokeRotationSpeed = 0.0;
var smokeRisingSpeed = 0.0;

var addSmoke, addSnowflakes;

function init() {

	container = document.createElement( 'div' );
	document.body.appendChild( container );

	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
	camera.position.z = 500;

	// set camera behavior and controls
	controls = new THREE.TrackballControls( camera );
    controls.rotateSpeed = 5.0;
	controls.zoomSpeed = 5;
	controls.panSpeed = 2;
	controls.noZoom = false;
	controls.noPan = false;
	controls.staticMoving = true;
	controls.dynamicDampingFactor = 0.3;

	// scene

	scene = new THREE.Scene();

	//$scope.lightingColor = data.lightingColor;
	var ambient = new THREE.AmbientLight( 0x444444 );
	scene.add( ambient );

	var directionalLight = new THREE.DirectionalLight( 0xffeedd );
	directionalLight.position.set( 1, 1, 1 ).normalize();
	scene.add( directionalLight );

	var pointLight = new THREE.PointLight(0x777777);
	pointLight.position.set(150, 250, -400);

	scene.add(pointLight);

	// background / effects / particles

	// particle: smoke

	addSmoke = function () {

		smokeParticles = new THREE.Geometry;
		for (var i = 0; i < 1000; i++) {
			var particle = new THREE.Vector3(Math.random() * 150 - 75, Math.random() * 230, Math.random() * 150 - 75);//Math.random() * 50 - 25);
			smokeParticles.vertices.push(particle);
		}

		var smokeTexture = THREE.ImageUtils.loadTexture('../models/textures/smoke.png');
		var smokeMaterial = new THREE.ParticleBasicMaterial({ map: smokeTexture, transparent: true, blending: THREE.AdditiveBlending, size: 50, color: 0x111111 });

		smoke = new THREE.ParticleSystem(smokeParticles, smokeMaterial);
		smoke.sortParticles = true;
		smoke.position.y = -100;

		scene.add(smoke);

	}

	if (smokeOn) {

		addSmoke();

	}

	// particles: snowflake

	addSnowflakes = function () {

		var particles = new THREE.Geometry;

		for (var p = 0; p < 2000; p++) {
			var particle = new THREE.Vector3(Math.random() * 500 - 250, Math.random() * 500 - 250, Math.random() * 500 - 250);
			particles.vertices.push(particle);
		}

		//the line below adds texture to the particles
		var particleTexture = THREE.ImageUtils.loadTexture('../models/textures/snowflake.png');

		// var particleMaterial = new THREE.ParticleBasicMaterial({ color: 0xeeeeee, size: 2 });

		var particleMaterial = new THREE.ParticleBasicMaterial({ color: 0xFFFFFF, map: particleTexture, transparent: true, size: 5, blending: THREE.AdditiveBlending });

		particleSystem = new THREE.ParticleSystem(particles, particleMaterial);

		scene.add(particleSystem);

	}

	if (particlesOn) {

		addSnowflakes();

	}

	// model

	// var modelPath = '../models/Paris/Paris2010_0.obj';
	// var mtlPath = '../models/Paris/Paris2010.mtl';

	// var modelPath = '../models/batman/Batman.obj';
	// var mtlPath = '../models/batman/Batman.mtl';

	// var modelPath = '../../../../models/batman/Batman.obj';
	// var mtlPath = '../../../../models/batman/Batman.mtl';

	var modelPath = './testinvalid/path.obj';
	var mtlPath = './testinvalid/path.mtl';

	var loader = new THREE.OBJMTLLoader();
	// var loader = new THREE.OBJLoader();
	loader.load( modelPath, mtlPath, function ( object ) {
	// loader.load( '../models/zero/zero.obj', '../models/zero/zero.mtl', function ( object ) {

		object.position.y = - 80;
		loadedObject = object;
		scene.add( object );

	} );

	var modelPath2 = '../models/batman/Cape.obj';
	var mtlPath2 = '../models/batman/Cape.mtl';

	loader.load( modelPath2, mtlPath2, function (object) {
		object.position.y = -80;
		loadedObject2 = object;
		scene.add(object);
	})

	//

	renderer = new THREE.WebGLRenderer( { alpha: true } );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );

	window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}


function animate() {

	requestAnimationFrame( animate );
	// render();

	var delta = clock.getDelta();

	if (particlesOn) {
		particleSystem.rotation.y += delta * particlesRotationSpeed;
	}

	if (modelRotationSpeed != 0) {
		loadedObject.rotation.y -= delta * modelRotationSpeed;
	}

	if (smokeOn) {
		smoke.rotation.y -= delta * smokeRotationSpeed;
	}

	if (modelRotationSpeed != 0) {
		loadedObject2.rotation.y -= delta * modelRotationSpeed;
	}

	controls.update();

	if (smokeOn) {
		var particleCount = smokeParticles.vertices.length;
		while (particleCount--) {
			var particle = smokeParticles.vertices[particleCount];
			particle.y += delta * 50 * smokeRisingSpeed;
			if (particle.y >= 230 && smokeRisingSpeed > 0) {
				particle.y = Math.random() * 16;
				particle.x = Math.random() * 150 - 75;
				// particle.z = Math.random() * 50 - 25;
				particle.z = Math.random() * 150 - 75;
			} else if (particle.y <= 16 && smokeRisingSpeed < 0) {
				particle.y = (Math.random() * 250);
				particle.x = -(Math.random() * 150 - 75);
				// particle.z = Math.random() * 50 - 25;
				particle.z = -(Math.random() * 150 - 75);
			}
		}
		smokeParticles.__dirtyVertices = true;
	}

	renderer.render(scene, camera);

}

init();
animate();