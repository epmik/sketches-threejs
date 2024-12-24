
import * as THREE from '/node_modules/three/build/three.module.js';
import { OrbitControls } from '/node_modules/three/examples/jsm/controls/OrbitControls.js';
import { FirstPersonControls } from '/node_modules/three/examples/jsm/controls/FirstPersonControls.js';
import Stats from '/node_modules/three/examples/jsm/libs/stats.module.js';
import { GUI } from "/node_modules/dat.gui/build/dat.gui.module.js";
import { Easing } from "/js/easing.js";

let camera, scene, renderer, stats;
let landscapeGeometry;
let simplexNoiseJonasWagner;
var gridsize = { x: 200, z: 200 };
var pointsCount = 1000;

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
	CurrentNoiseOption: noiseOptions.SimplexJonasWagner,
	NoiseMultiplierX: 0.015,
	NoiseMultiplierZ: 0.015,
	HeightMultiplier: 8.0
};

init();
animate();

function init() 
{
	// var noise = new Noise(Math.random());
	simplexNoiseJonasWagner = new SimplexNoise();

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	//

	camera = new THREE.PerspectiveCamera( 27, window.innerWidth / window.innerHeight, 1, 3500 );
	camera.position.x = 0;
	camera.position.y = 480;
	camera.position.z = 600;

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
		var x = THREE.Math.randFloat(-1.0, 1.0);
		var xpositive = x >= 0 ? true : false;
		x = Easing.EaseOutQuartic(Math.abs(x));
		x = (xpositive ? x : -x) * gridsize.x;


		var z = THREE.Math.randFloat(-1.0, 1.0);
		var zpositive = z >= 0 ? true : false;
		z = Easing.EaseOutQuartic(Math.abs(z));
		z = (zpositive ? z : -z) * gridsize.z;

		// var z = (Easing.EaseInExpo(THREE.Math.randFloat(0.0, 1.0)) * 2.0 - 1.0) * gridsize.z;
		// let z = THREE.Math.randFloat(0.0, 1.0) * gridsize.z - (gridsize.z / 2);
		let y = 0;// NoiseValue(x / gridsize.x * 5, z / gridsize.z * 5) * 50;
		points3d.push(new THREE.Vector3(x, y, z));
	}

	landscapeGeometry = new THREE.BufferGeometry().setFromPoints(points3d);
	landscapeGeometry.attributes.position.usage = THREE.DynamicDrawUsage;
	var cloud = new THREE.Points(landscapeGeometry, new THREE.PointsMaterial({ color: 0x99ccff, size: 2 }));
	scene.add(cloud);

	//

	// triangulate x, z
	var indexDelaunay = Delaunator.from(points3d.map(v => { return [v.x, v.z]; }));

	var meshIndex = []; // delaunay index => three.js index
	for (let i = 0; i < indexDelaunay.triangles.length; i++){
	  meshIndex.push(indexDelaunay.triangles[i]);
	}

	landscapeGeometry.setIndex(meshIndex); // add three.js index to the existing geometry
	landscapeGeometry.computeVertexNormals();
	var mesh = new THREE.Mesh(
		landscapeGeometry, // re-use the existing geometry
	  new THREE.MeshLambertMaterial({ color: 0xff0000, wireframe: true })
	);
	scene.add(mesh);
	

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

	landscapeGeometry.computeFaceNormals();
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
			return simplexNoiseJonasWagner.noise2D(x, z);
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

	gui.add(noiseSettings, 'NoiseMultiplierX').min(0.001).max(4).step(0.001).onChange(function() { 
		UpdateGeometry(); 
	});

	gui.add(noiseSettings, 'NoiseMultiplierZ').min(0.001).max(4).step(0.001).onChange(function() { 
		UpdateGeometry(); 
	});

	gui.add(noiseSettings, 'HeightMultiplier').min(1).max(50).step(1).onChange(function() { 
		UpdateGeometry(); 
	});
}
