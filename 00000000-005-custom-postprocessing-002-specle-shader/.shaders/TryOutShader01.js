import {
	Color
} from 'three';

const TryOutShader01 =
{
	name: 'TryOutShader01',

	uniforms: {

		tDiffuse: { value: null },
		tSpecle: { value: null },
		vColor: { value: new Color( 0xFFFF00 ) },  
		uTime: { value: 0.0 }
	},

	vertexShader: `

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,

	fragmentShader: `

		#include <common>

		uniform sampler2D tDiffuse;
		uniform sampler2D tSpecle;
		uniform vec3 vColor;
		uniform float uTime;

		varying vec2 vUv;

		void main() {

			// vec4 texel = texture2D( tDiffuse, vUv );

			// float l = luminance(texel.rgb);
			vec4 t = texture2D( tSpecle, vUv);

			gl_FragColor = mix(vec4(vColor, 1), t, uTime);
			//gl_FragColor = texture2D( tSpecle, vUv );
			//gl_FragColor = vec4( l, l, l, texel.w );

		}`
};			

export { TryOutShader01 };