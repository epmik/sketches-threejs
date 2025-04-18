import {
	DataTexture,
	FloatType,
	MathUtils,
	RedFormat,
	ShaderMaterial,
	UniformsUtils
} from 'three';
import { Pass, FullScreenQuad } from 'three/addons/postprocessing/Pass.js';
import { UvVisualizerShader } from '../.shaders/UvVisualizerShader.js';

class UvVisualizerPass extends Pass {

	constructor()
	{
		super();

		const shader = UvVisualizerShader;

		this.uniforms = UniformsUtils.clone( shader.uniforms );

		this.material = new ShaderMaterial( {
			uniforms: this.uniforms,
			vertexShader: shader.vertexShader,
			fragmentShader: shader.fragmentShader
		} );

		this.fsQuad = new FullScreenQuad( this.material );
	}

	render(renderer, writeBuffer, readBuffer /*, deltaTime, maskActive */) 
	{
		this.uniforms['tDiffuse'].value = readBuffer.texture;
		
		if ( this.renderToScreen ) {

			renderer.setRenderTarget( null );
			this.fsQuad.render( renderer );

		} else {

			renderer.setRenderTarget( writeBuffer );
			if ( this.clear ) renderer.clear();
			this.fsQuad.render( renderer );

		}

	}

	dispose() {

		this.material.dispose();

		this.fsQuad.dispose();

	}

}

export { UvVisualizerPass };