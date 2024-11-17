import {
	Color,
	Vector4
} from 'three';

const SpecleShader =
{
	name: 'SpecleShader',

	uniforms:
	{
		tDiffuse: { value: null },
		seed: { value: Date.now() },
		coverPercentage: { value: 0.05 },
		specleColor: { value: new Vector4(0, 0, 0, 1) },
		grayscale: { value: true }
	},

	vertexShader: `

		varying vec2 vUv;

		void main()
		{
			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,

	fragmentShader: `

		#include <common>

		uniform sampler2D tDiffuse;
		uniform float seed;
		uniform float coverPercentage;
		uniform vec3 specleColor;
		uniform bool grayscale;

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
			bool specle = random( vec3(gl_FragCoord.xy, seed)) <= coverPercentage;

			if(specle)
			{
				if(grayscale)
				{
					float g = random( vec3(gl_FragCoord.xy, seed + 4923.1287));

					gl_FragColor = vec4(g, g, g, 1);
				}
				else
				{
					gl_FragColor = vec4(specleColor, 1);
				}
			}
			else
			{
				gl_FragColor = texture2D( tDiffuse, vUv );
			}
		}
		`
};			

export { SpecleShader };