import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { Animator } from './animator.js';

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
    
    geometry = new THREE.BoxGeometry( 1, 1, 1 );
    material = new THREE.MeshBasicMaterial( { color: 0x00FF00 } );
    whiteMaterial = new THREE.MeshLambertMaterial( { color: 0xFFFFFF } );
    redMaterial = new THREE.MeshLambertMaterial( { color: 0xFF0000 } );

    cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
    cubeMaterial = new THREE.MeshLambertMaterial({
        color: 0x0095DD
    });

    cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cubeMesh.position.x = -2;
    cubeMesh.castShadow = true; //default is false
    cubeMesh.receiveShadow = false; //default    
    scene.add(cubeMesh);

    // 0x404040 soft white light
    cubeAmbientLight = new THREE.AmbientLight(0xFFFFFF, 0.0175);
    scene.add(cubeAmbientLight);

    var cubeHemisphereLight = new THREE.HemisphereLight(0x404040, 0xFFFFFF, 0.25);
    // scene.add(cubeHemisphereLight);    

    cubePointLight = new THREE.PointLight(0xFFFFFF, 200);
    scene.add(cubePointLight);

    const cubePointLightHelper = new THREE.PointLightHelper( cubePointLight, 0.25, 0xFF00000 );
    scene.add( cubePointLightHelper );
    

    const planeGeometry = new THREE.PlaneGeometry(20, 20);
    const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
    planeMesh.position.y = -2;
    planeMesh.rotation.x = THREE.MathUtils.degToRad(90);
    planeMesh.receiveShadow = true;
    scene.add(planeMesh);  
    
    
    const grid = new THREE.GridHelper( 20, 20, 0x000000, 0x000000 );
    grid.material.opacity = 0.2;
    grid.material.transparent = true;
    // scene.add(grid);
    
    // planeMesh.add(grid);

    edgesBoxGeometry = new THREE.BoxGeometry(
        2, 2, 2,
        4, 4, 4);
    
    const edgesGeometry = new THREE.EdgesGeometry(edgesBoxGeometry); 
    edgesMesh = new THREE.Mesh(edgesBoxGeometry, redMaterial);
    edgesMesh.castShadow = true; //default is false
    edgesMesh.receiveShadow = false; //default    

    edgesLineSegments = new THREE.LineSegments(edgesGeometry, new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.5
    })); 

    edgesMesh.position.x = 2;
    edgesLineSegments.position.x = 2;

    // edgesMesh.add(edgesLineSegments);
    
    scene.add( edgesMesh );
    scene.add(edgesLineSegments);

    stats = new Stats();
    document.body.appendChild(stats.dom);
    
    api = { state: 'Walking', runningAnimation: null };

    animator = new Animator();
    
    const loader = new GLTFLoader();

    loader.load('/media/models/RobotExpressive/RobotExpressive.glb', function (gltf) 
    {

        // console.log("gltf: ");
        // console.log(gltf);
        // console.log("gltf.scene: ");
        // console.log(gltf.scene);
        // console.log("gltf.scene contains: " + gltf.scene.children.length + " children");
        // console.log("gltf.animations contains: " + gltf.animations.length + " animations");
        // console.log("gltf.cameras contains: " + gltf.cameras.length + " cameras");

        horseMesh = gltf.scene.children[0];

        animator.init(horseMesh, gltf.animations);

        animator.defaultAnimation("Idle");

        animator.settings("Running", { repetitions: 8 });
        animator.settings("Walking", { repetitions: 4 });
        animator.settings("Dance", { repetitions: 2 });
        animator.settings("Wave", { repetitions: 2 });
        animator.settings("Yes", { repetitions: 2 });
        animator.settings("No", { repetitions: 2 });
        animator.settings("Idle", { repetitions: 0, clamp: true });

        
        horseMesh.scale.set( 1.0, 1.0, 1.0 );
        scene.add( horseMesh );

        const emoteFolder = gui.addFolder( 'Animations' );

        function __guiPlayAnimationCallback(name, index) 
        {
            api[name] = function () 
            {
                animator.play(name);
            };

            emoteFolder.add( api, name );
        }

        for (let i = 0; i < gltf.animations.length; i++) 
        {
            __guiPlayAnimationCallback(gltf.animations[i].name, i);
        }

        emoteFolder.open();      
    }, undefined, function (e) 
    {

        console.error( e );

    } );    
    
    
    const horseLight0 = new THREE.DirectionalLight(0xefefff, 4);
    horseLight0.position.set( 2, 2, 2 );
    horseLight0.castShadow = true; // default false
    horseLight0.shadow.mapSize.width = 512; // default
    horseLight0.shadow.mapSize.height = 512; // default
    horseLight0.shadow.camera.near = 0.5; // default
    horseLight0.shadow.camera.far = 500; // default
    scene.add( horseLight0 );
        
    const horseLight0Helper = new THREE.DirectionalLightHelper( horseLight0, 0.25, 0xFF00000 );
    scene.add(horseLight0Helper);

    const horseLight1 = new THREE.DirectionalLight(0xffefef, 4);
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

    animator.update( delta );  

	requestAnimationFrame( update );

	cubeMesh.rotation.x = cubeMesh.rotation.y -= 0.0025;

    edgesLineSegments.rotation.x = edgesLineSegments.rotation.y = edgesMesh.rotation.x = edgesMesh.rotation.y += 0.005;
    
    cubePointLight.position.set(0, 0, 0);
    cubePointLight.rotation.y += 0.0125;
    cubePointLight.translateX(6);
    cubePointLight.translateY(4);    

    if (horseMesh)
    {
        // horseMesh.rotation.y += 0.005;
    }
    
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