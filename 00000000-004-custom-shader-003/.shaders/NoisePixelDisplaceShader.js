import {
	Color,
	Vector4
} from 'three';

const NoisePixelDisplaceShader =
{
	name: 'NoisePixelDisplaceShader',

	isRaw: false,

	uniforms:
	{
		seed: { value: 0.0 },
	},

	vertexShader: `

		varying vec2 v_Uv;

		void main()
		{
			v_Uv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}
	`,

	fragmentShader: `

		// #include <common>

		uniform sampler2D tDiffuse;

		varying vec2 v_Uv;

		float rand(vec2 co)
		{
			return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
		}

		void main()
		{
			gl_FragColor = texture2D (tDiffuse, v_Uv);
		}
		`
};			

export { NoisePixelDisplaceShader };