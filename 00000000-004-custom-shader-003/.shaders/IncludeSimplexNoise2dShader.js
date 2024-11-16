import {
	Color,
	Vector4
} from 'three';

const IncludeSimplexNoise2dShader =
{
	name: 'IncludeSimplexNoise2dShader',

	isRaw: false,

	uniforms:
	{
		u_time: { value: 0.0 },
		u_noiseInputMuliplier: { value: 0.1 },
	},

	vertexShader: `

		varying vec4 v_position;

		void main()
		{
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}
	`,

	fragmentShader: `

		#include <noise2D_glsl>
		// #include <noise3D_glsl>

		uniform float u_time;
		uniform float u_noiseInputMuliplier;

		varying vec4 v_position;

		void main()
		{
			vec3 color = vec3(snoise(gl_FragCoord.xy * u_noiseInputMuliplier) * 0.5 + 0.5);
			//vec3 color = vec3(snoise(v_position * u_noiseInputMuliplier) * 0.5 + 0.5);

			gl_FragColor = vec4(color,1.0);
		}
		`,

		updateUniforms(elapsed, time)
		{
			this.uniforms.u_time.value = time;
		},
};			

export { IncludeSimplexNoise2dShader };