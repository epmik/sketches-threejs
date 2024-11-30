import {
	Vector2
} from 'three';

/**
 * Dot screen shader
 * based on glfx.js sepia shader
 * https://github.com/evanw/glfx.js
 */

const DotScreenShader = {

	name: 'DotScreenShader',

	uniforms: {

		'tDiffuse': { value: null },
		'tSize': { value: new Vector2( 256, 256 ) },
		'center': { value: new Vector2( 0.5, 0.5 ) },
		'angle': { value: 1.57 },
		'scale': { value: 1.0 }
	},

	vertexShader: /* glsl */`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,

	fragmentShader: /* glsl */`

		uniform vec2 center;
		uniform float angle;
		uniform float scale;
		uniform vec2 tSize;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		float pattern() {

			float s = sin( angle ), c = cos( angle );

			vec2 tex = vUv * tSize - center;
			vec2 point = vec2( c * tex.x - s * tex.y, s * tex.x + c * tex.y ) * scale;

			return ( sin( point.x ) * sin( point.y ) ) * 4.0;

		}

		void main() {

			vec4 color = texture2D( tDiffuse, vUv );

			float averageR = color.r;
			float averageG = color.g;
			float averageB = color.b;
			// float averageR = ( color.r + color.g ) / 2.0;
			// float averageG = ( color.g + color.b ) / 2.0;
			// float averageB = ( color.r + color.b ) / 2.0;

			gl_FragColor = vec4( vec3( averageR * 10.0 - 5.0 + pattern(), averageG * 10.0 - 5.0 + pattern(), averageB * 10.0 - 5.0 + pattern() ), color.a );

		}`

};

export { DotScreenShader };