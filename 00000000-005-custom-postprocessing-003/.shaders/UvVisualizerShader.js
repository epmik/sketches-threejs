
import { Vector2 } from "three";

const UvVisualizerShader = {

	uniforms:
	{
		'tDiffuse': { value: null }, //diffuse texture
		'resolution': { value: new Vector2(800, 800) }, 
		'visualizeXaxis': { value: true }, 
		'visualizeType': { value: 0 }, 
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
		uniform bool visualizeXaxis;
		uniform int visualizeType;

		varying vec2 v_Uv;

		void main()
		{
			// gl_FragCoord.xy are screen space coordinates of current pixel based on viewport size. So if viewport width is 5, then
			// gl_FragCoord.x runs from 0.5 to 4.5

			// divide by resolution to get a value in the range 0 to 1
			vec2 p = gl_FragCoord.xy / resolution.xy;

			vec2 v = v_Uv;

			if(visualizeType == 1)
			{
				v = p.xy;
			}

			float c = visualizeXaxis ? v.x : v.y;
	
			gl_FragColor = vec4(c, c, c, 1.0);
		}`

};

export { UvVisualizerShader };