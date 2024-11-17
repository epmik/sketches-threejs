
import { Vector2 } from "three";

const UvVisualizerShader = {

	uniforms:
	{
		'tDiffuse': { value: null }, //diffuse texture
		'resolution': { value: new Vector2(800, 800) }, 
		'visualizeX': { value: true }, 
	},

	vertexShader: /* glsl */`

		varying vec2 v_Uv;

		void main() {
			v_Uv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,

	fragmentShader: /* glsl */`

		uniform sampler2D tDiffuse;
		uniform vec2 resolution;
		uniform bool visualizeX;

		varying vec2 v_Uv;

		void main()
		{
			// for an explanation about gl_FragCoord, see https://computergraphics.stackexchange.com/a/5725
			vec2 p = gl_FragCoord.xy / resolution.xy;
	
			gl_FragColor = visualizeX ? vec4(v_Uv.x, v_Uv.x, v_Uv.x, 1.0) : vec4(v_Uv.y, v_Uv.y, v_Uv.y, 1.0);
		}`

};

export { UvVisualizerShader };