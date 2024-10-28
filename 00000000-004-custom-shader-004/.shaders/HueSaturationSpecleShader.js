/**
 * Hue and saturation adjustment
 * https://github.com/evanw/glfx.js
 * hue: -1 to 1 (-1 is 180 degrees in the negative direction, 0 is no change, etc.
 * saturation: -1 to 1 (-1 is solid gray, 0 is no change, and 1 is maximum contrast)
 */

const HueSaturationSpecleShader = {

	name: 'HueSaturationSpecleShader',

	uniforms: {

		'tDiffuse': { value: null },
		'hue': { value: -0.5 },
		'saturation': { value: -0.25 },
		'seed': { value: Date.now() },
		'coverPercentage': { value: 0.05 },
	},

	vertexShader: /* glsl */`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,

	fragmentShader: /* glsl */`

		#include <common>

		uniform float seed;
		uniform float coverPercentage;

		uniform sampler2D tDiffuse;
		uniform float hue;
		uniform float saturation;

		varying vec2 vUv;
		// A single iteration of Bob Jenkins' One-At-A-Time hashing algorithm.
		uint hash( uint x ) {
			x += ( x << 10u );
			x ^= ( x >>  6u );
			x += ( x <<  3u );
			x ^= ( x >> 11u );
			x += ( x << 15u );
			return x;
		}


		// Compound versions of the hashing algorithm I whipped together.
		uint hash( uvec2 v ) { return hash( v.x ^ hash(v.y)                         ); }
		uint hash( uvec3 v ) { return hash( v.x ^ hash(v.y) ^ hash(v.z)             ); }
		uint hash( uvec4 v ) { return hash( v.x ^ hash(v.y) ^ hash(v.z) ^ hash(v.w) ); }



		// Construct a float with half-open range [0:1] using low 23 bits.
		// All zeroes yields 0.0, all ones yields the next smallest representable value below 1.0.
		float floatConstruct( uint m ) {
			const uint ieeeMantissa = 0x007FFFFFu; // binary32 mantissa bitmask
			const uint ieeeOne      = 0x3F800000u; // 1.0 in IEEE binary32

			m &= ieeeMantissa;                     // Keep only mantissa bits (fractional part)
			m |= ieeeOne;                          // Add fractional part to 1.0

			float  f = uintBitsToFloat( m );       // Range [1:2]
			return f - 1.0;                        // Range [0:1]
		}



		// Pseudo-random value in half-open range [0:1].
		float random( float x ) { return floatConstruct(hash(floatBitsToUint(x))); }
		float random( vec2  v ) { return floatConstruct(hash(floatBitsToUint(v))); }
		float random( vec3  v ) { return floatConstruct(hash(floatBitsToUint(v))); }
		float random( vec4  v ) { return floatConstruct(hash(floatBitsToUint(v))); }

		float random( float x, float min, float max ) { return min + (max * random(x)); }
		float random( vec2 v, float min, float max ) { return min + (max * random(v)); }
		float random( vec3 v, float min, float max ) { return min + (max * random(v)); }
		float random( vec4 v, float min, float max ) { return min + (max * random(v)); }
		

		void main()
		{
			gl_FragColor = texture2D( tDiffuse, vUv );

			bool specle = random( vec3(gl_FragCoord.xy, seed)) <= coverPercentage;

			if(specle)
			{
				// hue
				float angle = hue * 3.14159265;
				float s = sin(angle), c = cos(angle);
				vec3 weights = (vec3(2.0 * c, -sqrt(3.0) * s - c, sqrt(3.0) * s - c) + 1.0) / 3.0;
				float len = length(gl_FragColor.rgb);
				gl_FragColor.rgb = vec3(
					dot(gl_FragColor.rgb, weights.xyz),
					dot(gl_FragColor.rgb, weights.zxy),
					dot(gl_FragColor.rgb, weights.yzx)
				);

				// saturation
				float average = (gl_FragColor.r + gl_FragColor.g + gl_FragColor.b) / 3.0;
				if (saturation > 0.0) {
					gl_FragColor.rgb += (average - gl_FragColor.rgb) * (1.0 - 1.0 / (1.001 - saturation));
				} else {
					gl_FragColor.rgb += (average - gl_FragColor.rgb) * (-saturation);
				}
			}
		}`

};

export { HueSaturationSpecleShader };
