import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js';
// import { WebGLRenderTarget } from 'three/src/renderers/WebGLRenderTarget.js';
// import { Scene } from 'three/src/scenes/Scene.js';
// import { BufferAttribute } from 'three/src/core/BufferAttribute.js';
// import { BufferGeometry } from 'three/src/core/BufferGeometry.js';
// import { Color } from 'three/src/math/Color.js';
// import { Points } from 'three/src/objects/Points.js';
// import { PointsMaterial } from 'three/src/materials/PointsMaterial.js';
// import { prng_alea } from '../../node_modules/esm-seedrandom/esm/alea.min.mjs';
// import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
// import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
// import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
// import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

class Sketch
{
	// THREE.Scene _scene; _renderer, _camera; 

	constructor()
	{
		this.htmlElement = undefined;
		this.htmlElementId = 'sketch-container';
		this._width = undefined;
		this._height = undefined;
		this._renderer = undefined;
		this._camera = undefined;
		this._scene = undefined;
		this._near = 1;
		this._far = 1000;
		this._fov = 60;
		this._clock = undefined;
		this._deltaTime = undefined;
		this._time = undefined;
}

	static Run(sketch) 
	{
		sketch.setup();
	}

	setup()
	{
		this.htmlElement = document.getElementById(this.htmlElementId);

		this._width = this._width === undefined ? window.innerWidth : this._width;
		this._height = this._height === undefined ? window.innerHeight : this._height;

		this._renderer = new THREE.WebGLRenderer( { antialias: true, samples: 4, stencil: true, alpha: true } );
		this._renderer.setPixelRatio( window.devicePixelRatio );
		this._renderer.setSize( this._width, this._height );
		// renderer.shadowMap.enabled = true;
		this.htmlElement.appendChild( this._renderer.domElement );


		this._camera = new THREE.OrthographicCamera( -1, 1, -1, 1, this._near, this._far);
		// this._camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 1000 );
		this._camera.position.set( 0, 0, -10);
		this._camera.lookAt( 0, 0, 0 );

		// scene
		this._scene = new THREE.Scene();

		this._clock = new THREE.Clock();


		this._stats = new Stats();
		this._renderer.domElement.appendChild( this._stats.dom );

		this._self = this;

		this._renderer.domElement.addEventListener("keydown", this.onKeyDown, false);
		this._renderer.domElement.addEventListener("keyup", this.onKeyUp, false);
		this._renderer.domElement.addEventListener("mousemove", this.onMouseMove, false);
		this._renderer.domElement.addEventListener("mousedown", this.onMouseDown, false);
		this._renderer.domElement.addEventListener("mouseup", this.onMouseUp, false);

		window.addEventListener('resize', this.onWindowResize);

		this._renderer.setAnimationLoop( this._internalUpdate );
	}

	_internalUpdate()
	{
		// this.update();

		// console.log(this);

		// _preRender();

		// this.render();

		// _postRender();
	}

	_preRender()
	{
		let autoClear = this._renderer.autoClear;

		this._renderer.autoClear = false;

		this._renderer.render(this._scene, _camera);

		this._renderer.autoClear = autoClear;
	}

	_postRender()
	{
		
	}

	onKeyDown(event) 
	{
		event.preventDefault();

		var keyCode = event.which;

		switch(keyCode)
		{
			default: 
				break;
		}
	};            

	onKeyUp(event) 
	{
		event.preventDefault();
	};            

	onMouseDown(event) 
	{
		event.preventDefault();

		switch(event.button)
		{
			case 0:
				// updateLineSegmentPositions();
				break;
		}

		// console.log(event.button);
		// console.log(event.buttons);
	}; 

	onMouseUp(event) 
	{
		event.preventDefault();
	};  

	onMouseMove(event) 
	{
		event.preventDefault();

		// event.clientX    // The X coordinate of the mouse pointer in viewport coordinates.
		// event.clientY    // The Y coordinate of the mouse pointer in viewport coordinates.
		// event.altKey     // Returns true if the alt key was down when the mouse event was fired.
		// event.ctrlKey    // Returns true if the ctrl key was down when the mouse event was fired.
		// event.shiftKey   // Returns true if the shift key was down when the mouse event was fired.
		// event.button     // The button number that was pressed (if applicable) when the mouse event was fired.
		// event.buttons    // The buttons being pressed (if any) when the mouse event was fired.
		// event.movementX  // The X coordinate of the mouse pointer relative to the position of the last mousemove event.
		// event.movementY  // The Y coordinate of the mouse pointer relative to the position of the last mousemove event.
		// event.screenX    // The X coordinate of the mouse pointer in screen coordinates.
		// event.screenY    // The Y coordinate of the mouse pointer in screen coordinates.
	};            

	onWindowResize() 
	{
		_self._camera.aspect = _self._width / _self._height;
		_self._camera.updateProjectionMatrix();

		_self._renderer.setSize(_self._width, _self._height);

		// if(_useEffectsComposer)
		// {
		// 	_effectsComposer.setSize(this._width, this._height);
		// }
	}
}

export { Sketch };
