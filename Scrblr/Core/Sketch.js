import * as THREE from 'three';
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
	constructor(renderer) 
	{
		// super();

		this._renderer = renderer;
		this._scene = new Scene();
		// this._scene.background = new THREE.Color(1, 1, 1, 0);
		this.pixelBufferGeometry = null;
		this.pixelPointsMaterial = null;
	}

	// background(color)
	// {
	// 	this._scene.background = color;
	// }

	render(camera)
	{
		let autoClear = this._renderer.autoClear;

		this._renderer.autoClear = false;

		this._renderer.render(this._scene, camera);

		this._renderer.autoClear = autoClear;
	}

	// renderer(renderer)
	// {
	// 	this._renderer = renderer;
	// }

	// scene(scene)
	// {
	// 	this._scene = scene;
	// }

	pixelMesh(x, y, color)
	{
		if (this.pixelBufferGeometry === null)
		{
			this.pixelBufferGeometry = new BufferGeometry();
			this.pixelBufferGeometry.setAttribute('position', new BufferAttribute(new Float32Array([x, y, 0]), 3));
			// this.pixelBufferGeometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array([color.r, color.g, color.b]), 3));

			// this.pixelPointsMaterial = new THREE.PointsMaterial({ size: 1, side: THREE.DoubleSide, depthTest: false, vertexColors: true });

			this.pixelPointsMaterial = new THREE.PointsMaterial({ size: 1, color: color });
		}
		
		// or use vertex colors
		// https://github.com/mrdoob/three.js/blob/master/examples/webgl_buffergeometry_points.html
		let g = new BufferGeometry();
		g.setAttribute('position', new BufferAttribute(new Float32Array([x, y, 0]), 3));

		let m = new PointsMaterial({ size: 1, color: color });

		return new Points(g, m);
	}

	pixel(x, y, color)
	{
		this._scene.add(this.pixelMesh(x, y, color));
	}	

	createRandomPixelTexture(parameters)
	{
		// parameters
		// {
		// 		offscreenRenderer: default is null and a WebGLRenderTarget is created
		// 		offscreenRendererWidth: default is this._renderer.width,
		// 		offscreenRendererHeight: default is this._renderer.height,
		// 		coverPercentage: default = 0.05,
		// 		randomSeed: default = null,
		// 		pixelColor: default = new THREE.Color(0, 0, 0)
		// }

		let offscreenRenderer = parameters.offscreenRenderer;

		if (offscreenRenderer === undefined)
		{
			if (parameters.offscreenRendererWidth === undefined || parameters.offscreenRendererHeight === undefined)
			{
				parameters.offscreenRendererWidth = this._renderer.width;
				parameters.offscreenRendererHeight = this._renderer.height;
			}

			offscreenRenderer = new WebGLRenderTarget(parameters.offscreenRendererWidth, parameters.offscreenRendererHeight, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter });
		}

		if (parameters.coverPercentage === undefined)
		{
			parameters.coverPercentage = 0.05;
		}

		if (parameters.pixelColor === undefined)
		{
			parameters.pixelColor = new Color(0, 0, 0);
		}
	
		const count = offscreenRenderer.width * offscreenRenderer.height * parameters.coverPercentage;

		let random = prng_alea(parameters.randomSeed);

		let orthoCamera = new THREE.OrthographicCamera(0, offscreenRenderer.width, 0, offscreenRenderer.height, 1, 100);

		orthoCamera.position.set(0, 0, 2);

		let renderTarget = this._renderer.getRenderTarget();

		this._renderer.setRenderTarget(offscreenRenderer);

		for (let i = 0; i < count; i++)
		{
			let x = random() * offscreenRenderer.width;
			let y = random() * offscreenRenderer.height;

			this.pixel(x, y, parameters.pixelColor);
		}

		this.render(orthoCamera);

		this._renderer.setRenderTarget(renderTarget);

		return offscreenRenderer;
	}

	async createRandomPixelTextureAsync(parameters)
	{
		// parameters
		// {
		// 		webGlRenderTarget: default is null and a WebGLRenderTarget is created
		// 		webGlRenderTargetWidth: default is this._renderer.width,
		// 		webGlRenderTargetHeight: default is this._renderer.height,
		// 		coverPercentage: default = 0.05,
		// 		randomSeed: default = null,
		// 		pixelColor: default = new THREE.Color(0, 0, 0)
		// }

		let webGlRenderTarget = parameters.webGlRenderTarget;

		if (webGlRenderTarget === undefined)
		{
			if (parameters.webGlRenderTargetWidth === undefined || parameters.webGlRenderTargetHeight === undefined)
			{
				parameters.webGlRenderTargetWidth = this._renderer.width;
				parameters.webGlRenderTargetHeight = this._renderer.height;
			}

			webGlRenderTarget = new WebGLRenderTarget(parameters.webGlRenderTargetWidth, parameters.webGlRenderTargetHeight, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter });
		}

		if (parameters.coverPercentage === undefined)
		{
			parameters.coverPercentage = 0.05;
		}

		if (parameters.pixelColor === undefined)
		{
			parameters.pixelColor = new Color(0, 0, 0);
		}
	
		const count = webGlRenderTarget.width * webGlRenderTarget.height * parameters.coverPercentage;

		let random = prng_alea(parameters.randomSeed);

		let orthoCamera = new THREE.OrthographicCamera(0, webGlRenderTarget.width, 0, webGlRenderTarget.height, 1, 100);

		orthoCamera.position.set(0, 0, 2);

		let renderTarget = this._renderer.getRenderTarget();

		this._renderer.setRenderTarget(webGlRenderTarget);

		for (let i = 0; i < count; i++)
		{
			let x = random() * webGlRenderTarget.width;
			let y = random() * webGlRenderTarget.height;

			this.pixel(x, y, parameters.pixelColor);
		}

		this.render(orthoCamera);

		this._renderer.setRenderTarget(renderTarget);

		return webGlRenderTarget;
	}	

	async renderShader(parameters)
	{
		// parameters
		// {
		// 		webGlRenderTarget: default is null and a WebGLRenderTarget is created
		// 		webGlRenderTargetWidth: default is this._renderer.width,
		// 		webGlRenderTargetHeight: default is this._renderer.height,
		// 		shader: default = 0.05
		// }

		let webGlRenderTarget = parameters.webGlRenderTarget;

		if (webGlRenderTarget === undefined)
		{
			if (parameters.webGlRenderTargetWidth === undefined || parameters.webGlRenderTargetHeight === undefined)
			{
				parameters.webGlRenderTargetWidth = this._renderer.width;
				parameters.webGlRenderTargetHeight = this._renderer.height;
			}

			webGlRenderTarget = new WebGLRenderTarget(parameters.webGlRenderTargetWidth, parameters.webGlRenderTargetHeight, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter });
		}

		let renderTarget = this._renderer.getRenderTarget();

		this._renderer.setRenderTarget(webGlRenderTarget);

		let effectsComposer = new EffectComposer(this._renderer, webGlRenderTarget);
		
		effectsComposer.renderToScreen = false;

		// const renderPass = new RenderPass( _scene, _camera );
		// effectsComposer.addPass( renderPass );

		const shaderPass = new ShaderPass( parameters.shader );
		effectsComposer.addPass( shaderPass );	

		// const outputPass = new OutputPass();
		// effectsComposer.addPass(outputPass);				
		
		effectsComposer.render();

		this._renderer.setRenderTarget(renderTarget);

		return webGlRenderTarget;
	}	
}

export { Sketch };
