import * as THREE from '/node_modules/three/build/three.module.js';
import { OrbitControls } from '/node_modules/three/examples/jsm/controls/OrbitControls.js';
import { FirstPersonControls } from '/node_modules/three/examples/jsm/controls/FirstPersonControls.js';
import { GLTFLoader } from '/node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import { EffectComposer } from '/node_modules/three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from '/node_modules/three/examples/jsm/postprocessing/RenderPass.js';
import { GlitchPass } from '/node_modules/three/examples/jsm/postprocessing/GlitchPass.js';
import { ShaderPass } from '/node_modules/three/examples/jsm/postprocessing/ShaderPass.js';
import { LuminosityShader } from '/node_modules/three/examples/jsm/shaders/LuminosityShader.js';
import Stats from '/node_modules/three/examples/jsm/libs/stats.module.js';
import { GUI } from "/node_modules/dat.gui/build/dat.gui.module.js";
import { Easing } from "/js/easing.js";

$(function ($) {

	let ScreenCapturePrefix = "20210321-001-stacked-block-layers";
	let camera, scene, renderer, stats;
	let prng;
	let boxStackSettings, boxStack;
	let actionsObject;
	let audioContext;
	// let simplexNoiseJonasWagner;

	// console.log(noiseOptions.PerlinStefanGustavson);
	// console.log(noiseOptions.SimplexStefanGustavson);
	// console.log(noiseOptions.SimplexJonasWagner);

	function initAudio() 
	{
		audioContext = new AudioContext();
		// Now we need to have the audio context take control of your HTML Audio Element.
		
		// Select the Audio Element from the DOM
		const htmlAudioElement = document.getElementById("audio");
		// Create an "Audio Node" from the Audio Element
		const source = audioContext.createMediaElementSource(htmlAudioElement);
		// Connect the Audio Node to your speakers. Now that the audio lives in the
		// Audio Context, you have to explicitly connect it to the speakers in order to
		// hear it
		source.connect(audioContext.destination);

		const rmsLevelRangeElement = document.getElementById("rmsLevelRange");
		const zcrLevelRangeElement = document.getElementById("zcrLevelRange");
		const energyLevelRangeElement = document.getElementById("energyLevelRange");
		const amplitudeSpectrumLevelRangeElement = document.getElementById("amplitudeSpectrumLevelRange");
		const powerSpectrumLevelRangeElement = document.getElementById("powerSpectrumLevelRange");
		const spectralCentroidLevelRangeElement = document.getElementById("spectralCentroidLevelRange");
		const spectralFlatnessLevelRangeElement = document.getElementById("spectralFlatnessLevelRange");
		const spectralFluxLevelRangeElement = document.getElementById("spectralFluxLevelRange");
		const spectralSlopeLevelRangeElement = document.getElementById("spectralSlopeLevelRange");
		const spectralRolloffLevelRangeElement = document.getElementById("spectralRolloffLevelRange");
		const spectralSpreadLevelRangeElement = document.getElementById("spectralSpreadLevelRange");
		const spectralSkewnessLevelRangeElement = document.getElementById("spectralSkewnessLevelRange");
		const spectralKurtosisLevelRangeElement = document.getElementById("spectralKurtosisLevelRange");
		const chromaLevelRangeCElement = document.getElementById("chromaLevelRangeC");
		const chromaLevelRangeCSharpElement = document.getElementById("chromaLevelRangeCSharp");
		const chromaLevelRangeDElement = document.getElementById("chromaLevelRangeD");
		const chromaLevelRangeDSharpElement = document.getElementById("chromaLevelRangeDSharp");
		const chromaLevelRangeEElement = document.getElementById("chromaLevelRangeE");
		const chromaLevelRangeFElement = document.getElementById("chromaLevelRangeF");
		const chromaLevelRangeFSharpElement = document.getElementById("chromaLevelRangeFSharp");
		const chromaLevelRangeGElement = document.getElementById("chromaLevelRangeG");
		const chromaLevelRangeGSharpElement = document.getElementById("chromaLevelRangeGSharp");
		const chromaLevelRangeAElement = document.getElementById("chromaLevelRangeA");
		const chromaLevelRangeASharpElement = document.getElementById("chromaLevelRangeASharp");
		const chromaLevelRangeBElement = document.getElementById("chromaLevelRangeB");
		const loudnessLevelRangeElement = document.getElementById("loudnessLevelRange");

		console.log(loudnessLevelRangeElement);

		if (typeof Meyda === "undefined") {
			console.log("Meyda could not be found! Have you included it?");
		}
		else {

			console.log("creating analyzer");

			// Create the Meyda Analyzer
			const analyzer = Meyda.createMeydaAnalyzer({
				// Pass in the AudioContext so that Meyda knows which AudioContext Box to work with
				"audioContext": audioContext,
				// Source is the audio node that is playing your audio. It could be any node,
				// but in this case, it's the MediaElementSourceNode corresponding to your
				// HTML 5 Audio Element with your audio in it.
				"source": source,
				// Buffer Size tells Meyda how often to check the audio feature, and is
				// measured in Audio Samples. Usually there are 44100 Audio Samples in 1
				// second, which means in this case Meyda will calculate the level about 86
				// (44100/512) times per second.
				"bufferSize": 512,
				// Here we're telling Meyda which audio features to calculate. While Meyda can
				// calculate a variety of audio features, in this case we only want to know
				// the "rms" (root mean square) of the audio signal, which corresponds to its
				// level
				"featureExtractors": [
					"rms",
					"zcr",
					"energy",
					"amplitudeSpectrum",
					"powerSpectrum",
					"spectralCentroid",
					"spectralFlatness",
					// "spectralFlux",
					"spectralSlope",
					"spectralRolloff",
					"spectralSpread",
					"spectralSkewness",
					"spectralKurtosis",
					"chroma",
					"loudness"],
				// Finally, we provide a function which Meyda will call every time it
				// calculates a new level. This function will be called around 86 times per
				// second.
				"callback": features => {
					console.log(features.loudness);
					rmsLevelRangeElement.value = features.rms;
					zcrLevelRangeElement.value = features.zcr;
					energyLevelRangeElement.value = features.energy;
					amplitudeSpectrumLevelRangeElement.value = features.amplitudeSpectrum[0];
					powerSpectrumLevelRangeElement.value = features.powerSpectrum[0];
					spectralCentroidLevelRangeElement.value = features.spectralCentroid;
					spectralFlatnessLevelRangeElement.value = features.spectralFlatness;
					// spectralFluxLevelRangeElement.value = features.spectralFlux;
					spectralSlopeLevelRangeElement.value = features.spectralSlope;
					spectralRolloffLevelRangeElement.value = features.spectralRolloff;
					spectralSpreadLevelRangeElement.value = features.spectralSpread;
					spectralSkewnessLevelRangeElement.value = features.spectralSkewness;
					spectralKurtosisLevelRangeElement.value = features.spectralKurtosis;
					chromaLevelRangeCElement.value = features.chroma[0];
					chromaLevelRangeCSharpElement.value = features.chroma[1];
					chromaLevelRangeDElement.value = features.chroma[2];
					chromaLevelRangeDSharpElement.value = features.chroma[3];
					chromaLevelRangeEElement.value = features.chroma[4];
					chromaLevelRangeFElement.value = features.chroma[5];
					chromaLevelRangeFSharpElement.value = features.chroma[6];
					chromaLevelRangeGElement.value = features.chroma[7];
					chromaLevelRangeGSharpElement.value = features.chroma[8];
					chromaLevelRangeAElement.value = features.chroma[9];
					chromaLevelRangeASharpElement.value = features.chroma[10];
					chromaLevelRangeBElement.value = features.chroma[11];
					loudnessLevelRangeElement.value = features.loudness.total;
				}
			});
			console.log('analyzer.start();');
			analyzer.start();

		}
	}

	function initScene() 
	{
		prng = new Alea();

		// var noise = new Noise(Math.random());
		// simplexNoiseJonasWagner = new SimplexNoise();

		renderer = new THREE.WebGLRenderer( { antialias: true } );
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFShadowMap;
		
		document.body.appendChild( renderer.domElement );

		//

		camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 5000);
		camera.position.x = 0;
		camera.position.y = 25;
		camera.position.z = 75;

		scene = new THREE.Scene();
		scene.background = new THREE.Color( 0xFFFFFF );

		//

		var controls = new OrbitControls(camera, renderer.domElement);

		//

		const light = new THREE.SpotLight( 0xffffff, 1.5 );
		light.position.set( 0, 500, 2000 );
		light.angle = Math.PI / 9;

		boxStackSettings = {
			LayerCount: 100,
			MinWidth: 2.0,
			MaxWidth: 30.0,
			MinDepth: 2.0,
			MaxDepth: 30.0,
			MinHeight: 0.1,
			MaxHeight: 1.5,
			AllowRotation: true,
			MinTranslationX: 0.0,
			MaxTranslationX: 10.0,
			MinTranslationZ: 0.0,
			MaxTranslationZ: 10.0,
			HeightOffsetFactor: 1.0,
		};

		boxStack = [];

		actionsObject = {
			ProcessScreenCapture: function () { ProcessScreenCapture(); }
		};

		// light.castShadow = true;
		// light.shadow.camera.near = 1000;
		// light.shadow.camera.far = 4000;
		// light.shadow.mapSize.width = 1024;
		// light.shadow.mapSize.height = 1024;
		
		scene.add(light);
		
		CreateAndUpdateMeshes();

		stats = new Stats();
		document.body.appendChild( stats.dom );

		//
		initGui();

		//

		// window.addEventListener( 'resize', onWindowResize );

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

		gui.add(boxStackSettings, 'LayerCount').min(1).max(100).step(1).onChange(function() { 
			CreateAndUpdateMeshes(); 
		});

		gui.add(boxStackSettings, 'MinWidth').min(1).max(40).step(0.1).onChange(function() { 
			CreateAndUpdateMeshes(); 
		});

		gui.add(boxStackSettings, 'MaxWidth').min(1).max(40).step(0.1).onChange(function() { 
			CreateAndUpdateMeshes(); 
		});

		gui.add(boxStackSettings, 'MinDepth').min(1).max(40).step(0.1).onChange(function() { 
			CreateAndUpdateMeshes(); 
		});

		gui.add(boxStackSettings, 'MaxDepth').min(1).max(40).step(0.1).onChange(function() { 
			CreateAndUpdateMeshes(); 
		});

		gui.add(boxStackSettings, 'MinHeight').min(0.1).max(4).step(0.1).onChange(function() { 
			CreateAndUpdateMeshes(); 
		});

		gui.add(boxStackSettings, 'MaxHeight').min(0.1).max(4).step(0.1).onChange(function() { 
			CreateAndUpdateMeshes(); 
		});

		gui.add(boxStackSettings, 'AllowRotation').onChange(function() { 
			UpdateMeshPositionsAndRorations(); 
		});

		gui.add(boxStackSettings, 'MinTranslationX').min(0.1).max(8).step(0.1).onChange(function() { 
			UpdateMeshPositionsAndRorations(); 
		});

		gui.add(boxStackSettings, 'MaxTranslationX').min(0.1).max(8).step(0.1).onChange(function() { 
			UpdateMeshPositionsAndRorations(); 
		});

		gui.add(boxStackSettings, 'MinTranslationZ').min(0.1).max(8).step(0.1).onChange(function() { 
			UpdateMeshPositionsAndRorations(); 
		});

		gui.add(boxStackSettings, 'MaxTranslationZ').min(0.1).max(8).step(0.1).onChange(function() { 
			UpdateMeshPositionsAndRorations(); 
		});

		gui.add(boxStackSettings, 'HeightOffsetFactor').min(0.1).max(2).step(0.1).onChange(function() { 
			CreateAndUpdateMeshes(); 
		});

		gui.add(actionsObject, 'ProcessScreenCapture').name('Capture screen ...');

		// gui.add(noiseSettings, 'NoiseMultiplierX').min(0.001).max(4).step(0.001).onChange(function() { 
		// 	UpdateGeometry(); 
		// });

		// gui.add(noiseSettings, 'NoiseMultiplierZ').min(0.001).max(4).step(0.001).onChange(function() { 
		// 	UpdateGeometry(); 
		// });

		// gui.add(noiseSettings, 'HeightMultiplier').min(1).max(50).step(1).onChange(function() { 
		// 	UpdateGeometry(); 
		// });
	}

	function ProcessScreenCapture()
	{
	/*
		// open in new window like this
		//
		var d = new Date();
		var w = window.open('', '');
		w.document.title = ScreenCapturePrefix + '-' + d.yyyymmdd() + '.' + d.hhmmss() + '.png';
		//w.document.body.style.backgroundColor = "red";
		var img = new Image();
		// Without 'preserveDrawingBuffer' set to true, we must render now
		renderer.render(scene, camera);
		img.src = renderer.domElement.toDataURL();
		w.document.body.appendChild(img);  
	*/
	/*
		// download file like this.
		//
		var d = new Date();
		var a = document.createElement('a');
		// Without 'preserveDrawingBuffer' set to true, we must render now
		renderer.render(scene, camera);
		a.href = renderer.domElement.toDataURL().replace("image/png", "image/octet-stream");
		a.download = ScreenCapturePrefix + '-' + d.yyyymmdd() + '.' + d.hhmmss() + '.png';
		a.click();
	*/

		// New version of file download using toBlob.
		// toBlob should be faster than toDataUrl.
		// But maybe not because also calling createOjectURL.
		renderer.render(scene, camera);
		renderer.domElement.toBlob(function (blob) {
			var d = new Date();
			var a = document.createElement('a');
		var url = URL.createObjectURL(blob);
		a.href = url;
		a.download = ScreenCapturePrefix + '-' + d.yyyymmdd() + '.' + d.hhmmss() +  '.png';
		a.click();
		}, 'image/png', 1.0);   
	}

	function CreateAndUpdateMeshes()
	{
		boxStack.forEach(element => {
			scene.remove(element);
		});

		let y = 0.0;

		const colors = [0xff0000, 0xffffff, 0x000000];
		let colorIndex = 0;
		let previousHalfBoxHeight = 0.0;
		let currentHalfBoxHeight = 0.0;

		for (var l = 0; l < boxStackSettings.LayerCount; l++)
		{
			previousHalfBoxHeight = currentHalfBoxHeight;

			const w = prng.value(boxStackSettings.MinWidth, boxStackSettings.MaxWidth);
			const d = prng.value(boxStackSettings.MinDepth, boxStackSettings.MaxDepth);
			const h = prng.value(boxStackSettings.MinHeight, boxStackSettings.MaxHeight);

			const cube = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshBasicMaterial({ color: colors[colorIndex] }));

			currentHalfBoxHeight = h * 0.5;

			y += (previousHalfBoxHeight + currentHalfBoxHeight) * boxStackSettings.HeightOffsetFactor;

			cube.position.y = y;

			colorIndex++;

			if (colorIndex == colors.length)
			{
				colorIndex = 0;
			}

			boxStack.push(cube);

			scene.add( cube );
		}

		UpdateMeshPositionsAndRorations();
	}

	function UpdateMeshPositionsAndRorations()
	{
		for (var l = 0; l < boxStack.length; l++)
		{
			const cube = boxStack[l];
		
			cube.position.x = prng.value(boxStackSettings.MinTranslationX, boxStackSettings.MaxTranslationX);
			cube.position.z = prng.value(boxStackSettings.MinTranslationZ, boxStackSettings.MaxTranslationZ);

			// console.log(cube.position.z);

			if (boxStackSettings.AllowRotation)
			{
				cube.rotation.y = prng.value(0, Math.PI * 2);
			}
			else {
				cube.rotation.y = 0;
			}
		}
	}

	$('.audio').click(function () {
		
		console.log('audio click');

		if (this.paused == false) {
			this.pause();
		} else {
			initAudio();
		}

		return false;
	});	

	$(document).ready(function ()
	{
		initScene();
		animate();
	});

	$(window).resize(function ()
	{
		onWindowResize();
    });

});
