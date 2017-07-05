var container;
var camera, scene, renderer;
var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

init();
animate();

/*** Initialize ***/
function init() {
  // This <div> will host the canvas for our scene.
  container = document.createElement( 'div' );
  document.body.appendChild( container );

  // You can adjust the cameras distance and set the FOV to something
  // different than 45°. The last two values set the clippling plane.
  camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
  camera.position.z = 500;

  // These variables set the camera behaviour and sensitivity.
  controls = new THREE.TrackballControls( camera );
  controls.rotateSpeed = 5.0;
  controls.zoomSpeed = 5;
  controls.panSpeed = 2;
  controls.noZoom = false;
  controls.noPan = false;
  controls.staticMoving = true;
  controls.dynamicDampingFactor = 0.3;

  // This is the scene we will add all objects to.
  scene = new THREE.Scene();

  // You can set the color of the ambient light to any value.
  // I have chose a completely white light because I want to paint
  // all the shading into my texture. You propably want something darker.
  var ambient = new THREE.AmbientLight( 0xffffff );
  scene.add( ambient );

  // Uncomment these lines to create a simple directional light.
  var directionalLight = new THREE.DirectionalLight( 0xffeedd );
  directionalLight.position.set( 0, 0, 1 ).normalize();
  scene.add( directionalLight );

  /*** Texture Loading ***/
  var manager = new THREE.LoadingManager();
  manager.onProgress = function ( item, loaded, total ) {
    console.log( item, loaded, total );
  };
  var texture = new THREE.Texture();
  var loader = new THREE.ImageLoader( manager );

  // You can set the texture properties in this function. 
  // The string has to be the path to your texture file.

  loader.load( '/models/textures/texture.png', function ( image ) {
    console.log('texture load start');
    texture.image = image;
    texture.needsUpdate = true;
    // I wanted a nearest neighbour filtering for my low-poly character,
    // so that every pixel is crips and sharp. You can delete this lines
    // if have a larger texture and want a smooth linear filter.
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestMipMapLinearFilter;
    console.log('texture load finished');
  } );
  console.log('texture loaded');

  /*** OBJ Loading ***/
  var loader = new THREE.OBJLoader( manager );
  console.log('OBJLoader loaded');

  // As soon as the OBJ has been loaded this function looks for a mesh
  // inside the data and applies the texture to it.

  loader.load( '/models/batman/Batman.obj', function ( event ) {
    console.log('object load start'); //doesn't run
    var object = event;
    object.traverse( function ( child ) {
      if ( child instanceof THREE.Mesh ) {
        child.material.map = texture;
      }
    } );

    // My initial model was too small, so I scaled it upwards.
    object.scale = new THREE.Vector3( 25, 25, 25 );

    // You can change the position of the object, so that it is not
    // centered in the view and leaves some space for overlay text.
    object.position.y -= 2.5;
    scene.add( object );
    console.log('object load complete');
  });

  // console.log('object loaded');
  // loader.load('models/head.obj', function (object) {
  //   console.log('begin loading object');
  //   object.traverse( function ( child ) {
  //     if ( child instanceof THREE.Mesh ) {
  //       child.material.map = texture;
  //     }
  //   });
  //   object.position.y = - 80;
  //   scene.add(object);
  // });

  // geometry = new THREE.BoxGeometry( 200, 200, 200 );
  // material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );
  // mesh = new THREE.Mesh( geometry, material );

  // scene.add( mesh );

  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  container.appendChild( renderer.domElement );
  console.log('init complete');
}

/*** The Loop ***/
function animate() {
  // This function calls itself on every frame. You can for example change
  // the objects rotation on every call to create a turntable animation.
  requestAnimationFrame( animate );

  // On every frame we need to calculate the new camera position
  // and have it look exactly at the center of our scene.
  controls.update();
  // camera.lookAt(scene.position);
  renderer.render(scene, camera);
}