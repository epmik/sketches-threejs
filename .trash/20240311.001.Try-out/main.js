import * as THREE from 'three';

let camera, scene, renderer;
let geometry, material, cube;

init();

function init() 
{
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    
    geometry = new THREE.BoxGeometry( 1, 1, 1 );
    material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    cube = new THREE.Mesh( geometry, material );
    
    scene.add(cube);
    
    camera.position.z = 5;

    window.addEventListener('resize', onWindowResize);
    
    update();
}

function update() 
{
	requestAnimationFrame( update );

	cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    
    render();
}

function render() 
{
	renderer.render( scene, camera );
}

function onWindowResize() 
{
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
}