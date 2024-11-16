import {
	Color,
	Vector4
} from 'three';

const NormalColorShader =
{
	name: 'NormalColorShader',

	uniforms:
	{
		seed: { value: 0.0 },
	},

	vertexShader: `

		varying vec3 v_Normal;

		void main()
		{
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			v_Normal = normal;
		}
	`,

	fragmentShader: `

		#include <common>

		varying vec3 v_Normal;
	
		void main()
		{
			gl_FragColor = vec4(v_Normal, 1.0);
		}
		`
};			

export { NormalColorShader };