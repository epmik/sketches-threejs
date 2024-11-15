
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import glNoise from 'https://cdn.jsdelivr.net/npm/gl-noise@1.6.1/+esm'
import { createNoise2D } from 'https://cdn.jsdelivr.net/npm/simplex-noise@4.0.3/+esm'
import * as alea from 'https://cdn.jsdelivr.net/npm/alea@1.0.1/+esm';

let camera, scene, renderer, stats;
let landscapeGeometry;
let simplexNoiseJonasWagner;
var gridsize = { x: 200, z: 200 };
var pointsCount = 10000;

var noiseOptions = 
{ 
	PerlinStefanGustavson: 0, 
	SimplexStefanGustavson: 1, 
	SimplexJonasWagner: 2
};

// console.log(noiseOptions.PerlinStefanGustavson);
// console.log(noiseOptions.SimplexStefanGustavson);
// console.log(noiseOptions.SimplexJonasWagner);

var noiseSettings = 
{ 
	CurrentNoiseOption: noiseOptions.PerlinStefanGustavson,
	NoiseMultiplierX: 0.025,
	NoiseMultiplierZ: 0.025,
	HeightMultiplier: 9.0
};

init();
animate();

function init() 
{
	// var noise = new Noise(Math.random());
	simplexNoiseJonasWagner = createNoise2D();

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	//

	camera = new THREE.PerspectiveCamera( 27, window.innerWidth / window.innerHeight, 1, 3500 );
	camera.position.y = 40;
	camera.position.z = 220;

	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0x050505 );

	//

	var controls = new OrbitControls(camera, renderer.domElement);

	//

	const light = new THREE.HemisphereLight();
	scene.add( light );

	//

	var points3d = [];
	for (let i = 0; i < pointsCount; i++) 
	{
		let x = THREE.MathUtils.randFloatSpread(gridsize.x);
		let z = THREE.MathUtils.randFloatSpread(gridsize.z);
		let y = 0;// NoiseValue(x / gridsize.x * 5, z / gridsize.z * 5) * 50;
		points3d.push(new THREE.Vector3(x, y, z));
	}

	landscapeGeometry = new THREE.BufferGeometry().setFromPoints(points3d);
	landscapeGeometry.attributes.position.usage = THREE.DynamicDrawUsage;
	var cloud = new THREE.Points(landscapeGeometry, new THREE.PointsMaterial({ color: 0x99ccff, size: 2 }));
	scene.add(cloud);

	//
	// console.log(position);

	stats = new Stats();
	document.body.appendChild( stats.dom );

	//
	UpdateGeometry();

	initGui();

	//

	window.addEventListener( 'resize', onWindowResize );

}

function UpdateGeometry()
{
	const position = landscapeGeometry.attributes.position;

	for ( let i = 0; i < position.count; i ++ ) 
	{
		const y = NoiseValue(position.getX(i) * noiseSettings.NoiseMultiplierX, position.getZ(i) * noiseSettings.NoiseMultiplierZ) * noiseSettings.HeightMultiplier;
		position.setY(i, y);
	}

	position.needsUpdate = true;
}

function NoiseValue(x, z)
{
	switch(parseInt(noiseSettings.CurrentNoiseOption))
	{
		case noiseOptions.PerlinStefanGustavson:
			return noise.perlin2(x, z);
		case noiseOptions.SimplexStefanGustavson:
			return noise.simplex2(x, z);
		case noiseOptions.SimplexJonasWagner:
			return simplexNoiseJonasWagner(x, z);
		default:
			throw 'unknown currentNoiseOptionType in NoiseValue(): ' + noiseSettings.CurrentNoiseOption;
	}
}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

//

function animate() {

	requestAnimationFrame( animate );

	render();

	stats.update();
}

function render() 
{
	renderer.render( scene, camera );
}

function initGui()
{
	const gui = new GUI();

	gui.add(noiseSettings, 'CurrentNoiseOption', noiseOptions ).onChange(function() { 
		UpdateGeometry(); 
	});

	gui.add(noiseSettings, 'NoiseMultiplierX').min(0.001).max(0.25).step(0.001).onChange(function() { 
		UpdateGeometry(); 
	});

	gui.add(noiseSettings, 'NoiseMultiplierZ').min(0.001).max(0.25).step(0.001).onChange(function() { 
		UpdateGeometry(); 
	});

	gui.add(noiseSettings, 'HeightMultiplier').min(1).max(20).step(1).onChange(function() { 
		UpdateGeometry(); 
	});
}
