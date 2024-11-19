
import { Vector2 } from "three";

const VisualizeRandomShader = {

	uniforms:
	{
		'tDiffuse': { value: null }, //diffuse texture
		'resolution': { value: new Vector2(800, 800) }, 
		'bias': { value: 0.0 }, 
		'randomFuncionType': { value: 0 }, 
		'blackAndWhite': { value: true }, 
	},

	vertexShader: /* glsl */`

		varying vec2 v_Uv;

		void main() {
			v_Uv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,

	fragmentShader: /* glsl */`

		uniform sampler2D tDiffuse;
		uniform float bias;
		uniform vec2 resolution;
		uniform int randomFuncionType;
		uniform bool blackAndWhite;

		varying vec2 v_Uv;

		// --------------------------------
		// https://stackoverflow.com/a/4275343

		float randomOneLiner(vec2 co)
		{
			return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
		}

		// --------------------------------
		// https://stackoverflow.com/a/17479300

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

		// https://stackoverflow.com/a/17479300
		// Pseudo-random value in half-open range [0:1].
		float randomIntHash( float x ) { return floatConstruct(hash(floatBitsToUint(x))); }
		float randomIntHash( vec2  v ) { return floatConstruct(hash(floatBitsToUint(v))); }
		float randomIntHash( vec3  v ) { return floatConstruct(hash(floatBitsToUint(v))); }
		float randomIntHash( vec4  v ) { return floatConstruct(hash(floatBitsToUint(v))); }

		float randomIntHash( float x, float min, float max ) { return min + ((max - min) * randomIntHash(x)); }
		float randomIntHash( vec2 v, float min, float max ) { return min + ((max - min) * randomIntHash(v)); }
		float randomIntHash( vec3 v, float min, float max ) { return min + ((max - min) * randomIntHash(v)); }
		float randomIntHash( vec4 v, float min, float max ) { return min + ((max - min) * randomIntHash(v)); }

		// --------------------------------

		// taken from https://youtu.be/lctXaT9pxA0?t=458

		float biasValue(float x, float bias)
		{
			float k = pow(1.0 - bias, 3.0);
			
			return (x * k) / (x * k - x + 1.0);
		}

		// --------------------------------
		// https://stackoverflow.com/a/28095165

		float PHI = 1.61803398874989484820459;  // Φ = Golden Ratio   

		float gold_noise(in vec2 xy, in float seed)
		{
			return fract(tan(distance(xy*PHI, xy)*seed)*xy.x);
		}

		// --------------------------------
		// https://stackoverflow.com/a/57390568

		highp float randomImprovedOneLiner(vec2 co)
		{
			highp float a = 12.9898;
			highp float b = 78.233;
			highp float c = 43758.5453;
			highp float dt= dot(co.xy ,vec2(a,b));
			highp float sn= mod(dt,3.14);
		
			return fract(sin(sn) * c);
		}

		// --------------------------------

		void main()
		{
			// for an explanation about gl_FragCoord, see https://computergraphics.stackexchange.com/a/5725
			
			vec2 p = gl_FragCoord.xy / resolution.xy;
			
			float r = 0.0,  g = 0.0,  b = 0.0;
			
			switch (randomFuncionType) 
			{
				case 1:
					r = randomOneLiner(gl_FragCoord.xy);
					g = randomOneLiner(gl_FragCoord.xy + vec2(4.3289, 9.2487));
					b = randomOneLiner(gl_FragCoord.xy + vec2(9.2487, 4.3289));
					break;
				case 2:
					r = gold_noise(gl_FragCoord.xy, 0.0);
					g = gold_noise(gl_FragCoord.xy, 0.2487);
					b = gold_noise(gl_FragCoord.xy, 0.3289);
					break;
				case 3:
					r = randomImprovedOneLiner(gl_FragCoord.xy);
					g = randomImprovedOneLiner(gl_FragCoord.xy + vec2(4.3289, 9.2487));
					b = randomImprovedOneLiner(gl_FragCoord.xy + vec2(9.2487, 4.3289));
					break;
				default:
					r = randomIntHash(gl_FragCoord.xy);
					g = randomIntHash(gl_FragCoord.xy + vec2(4.3289, 9.2487));
					b = randomIntHash(gl_FragCoord.xy + vec2(9.2487, 4.3289));
					break;
			}			

			r = biasValue(r, bias);
			g = biasValue(g, bias);
			b = biasValue(b, bias);

			if(blackAndWhite)
			{
				r = g = b;
			}
	
			gl_FragColor = vec4(r, g, b, 1.0);
		}`

};

export { VisualizeRandomShader };