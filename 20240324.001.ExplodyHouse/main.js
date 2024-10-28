import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { Animator } from './animator.js';
import { } from "gl-noise";

let camera, scene, renderer, timerClock;
let gui;
let geometry, material;
let whiteMaterial, redMaterial;
let cubeGeometry, cubeMaterial, cubeMesh, cubeAmbientLight, cubeDirectionalLight;
let planeMesh;
let edgesBoxGeometry, boxEdgeGeometry, edgesMesh, edgesLineSegments;
let stats, horseMesh;
let cubePointLight;
// let animatorState = { object: null, state: '', defaultState: 'Idle', animations:[], mixer: null };
let api;
let animator;

init();

function init() 
{
    gui = new GUI();

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    scene.fog = new THREE.Fog(0xe0e0e0, 20, 100);

    timerClock = new THREE.Clock();

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
    
    document.body.appendChild( renderer.domElement );
    
    // geometry = new THREE.BoxGeometry( 1, 1, 1 );
    // material = new THREE.MeshBasicMaterial( { color: 0x00FF00 } );
    // whiteMaterial = new THREE.MeshLambertMaterial( { color: 0xFFFFFF } );
    // redMaterial = new THREE.MeshLambertMaterial( { color: 0xFF0000 } );

    cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
    cubeMaterial = new THREE.MeshLambertMaterial({
        color: 0x0095DD
    });

    cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cubeMesh.position.y = 1;
    cubeMesh.castShadow = true; //default is false
    cubeMesh.receiveShadow = false; //default    
    scene.add(cubeMesh);

    // 0x404040 soft white light
    // cubeAmbientLight = new THREE.AmbientLight(0xFFFFFF, 0.0175);
    // scene.add(cubeAmbientLight);

    cubePointLight = new THREE.PointLight(0xFFFFFF, 200);
    scene.add(cubePointLight);

    const cubePointLightHelper = new THREE.PointLightHelper( cubePointLight, 0.25, 0xFF00000 );
    scene.add( cubePointLightHelper );
    
    const planeSize = 10;
    const planeGeometry = new THREE.PlaneGeometry(planeSize, planeSize);
    const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
    planeMesh.rotation.x = THREE.MathUtils.degToRad(90);
    planeMesh.receiveShadow = true;
    scene.add(planeMesh);  
    
    
    const grid = new THREE.GridHelper(planeSize, planeSize, 0x000000, 0x000000 );
    grid.material.opacity = 0.2;
    grid.material.transparent = true;
    scene.add(grid);

    stats = new Stats();
    document.body.appendChild(stats.dom);
    
    const horseLight0 = new THREE.DirectionalLight(0xefefff, 2);
    horseLight0.position.set( 2, 2, 2 );
    horseLight0.castShadow = true; // default false
    horseLight0.shadow.mapSize.width = 512; // default
    horseLight0.shadow.mapSize.height = 512; // default
    horseLight0.shadow.camera.near = 0.5; // default
    horseLight0.shadow.camera.far = 500; // default
    scene.add( horseLight0 );
        
    const horseLight0Helper = new THREE.DirectionalLightHelper( horseLight0, 0.25, 0xFF00000 );
    scene.add(horseLight0Helper);

    const horseLight1 = new THREE.DirectionalLight(0xffefef, 2);
    horseLight1.position.set(-2, -2, -2);
    horseLight1.castShadow = true; // default false
    horseLight1.shadow.mapSize.width = 512; // default
    horseLight1.shadow.mapSize.height = 512; // default
    horseLight1.shadow.camera.near = 0.5; // default
    horseLight1.shadow.camera.far = 500; // default
    scene.add( horseLight1 );
    
    const horseLight1Helper = new THREE.DirectionalLightHelper( horseLight1, 0.25, 0xFF00000 );
    scene.add(horseLight1Helper);    

    camera.position.y = 2;
    camera.position.z = 8;

    window.addEventListener('resize', onWindowResize);
       
    update();
}

function update() 
{     
    const delta = timerClock.getDelta();

	requestAnimationFrame( update );

	// cubeMesh.rotation.x = cubeMesh.rotation.y -= 0.0025;

    cubePointLight.position.set(0, 0, 0);
    cubePointLight.rotation.y += 0.0125;
    cubePointLight.translateX(6);
    cubePointLight.translateY(4);    
    
    render();

    stats.update();
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