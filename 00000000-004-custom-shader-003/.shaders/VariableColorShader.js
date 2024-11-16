import {
	Color,
	Vector3,
	Vector4
} from 'three';

const VariableColorShader =
{
	name: 'VariableColorShader',

	uniforms:
	{
		u_color: { value: new Vector3(1, 0, 0) },
	},

	vertexShader: `

		void main()
		{
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}
	`,

	fragmentShader: `

		#include <common>
	
		uniform vec3 u_color;
		
		void main()
		{
			gl_FragColor = vec4(u_color, 1.0);
		}
		`,

	// update(elapsed, time)
	// {
	// 	this.uniforms.u_color = new Vector3(1 + Math.sin(time) * 0.5, 1 + Math.cos(time), 1 + Math.sin(time));
	// },
};			

export { VariableColorShader };