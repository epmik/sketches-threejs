import {
	Color,
	Vector4
} from 'three';

const EmptyShader =
{
	name: 'EmptyShader',

	uniforms:
	{
		seed: { value: 0.0 },
	},

	vertexShader: `

		void main()
		{
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}
	`,

	fragmentShader: `

		#include <common>
	
		void main()
		{
			gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
		}
		`
};			

export { EmptyShader };