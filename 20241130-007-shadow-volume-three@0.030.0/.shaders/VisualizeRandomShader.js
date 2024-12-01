
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
		// https://github.com/patriciogonzalezvivo/lygia/blob/main/generative/random.glsl 

		/*
		contributors: ["Patricio Gonzalez Vivo", "David Hoskins", "Inigo Quilez"]
		description: Pass a value and get some random normalize value between 0 and 1
		use: float random[2|3](<float|vec2|vec3> value)
		options:
			- RANDOM_HIGHER_RANGE: for working with a range over 0 and 1
			- RANDOM_SINLESS: Use sin-less random, which tolerates bigger values before producing pattern. From https://www.shadertoy.com/view/4djSRW
			- RANDOM_SCALE: by default this scale if for number with a big range. For producing good random between 0 and 1 use bigger range
		examples:
			- /shaders/generative_random.frag
		license:
			- MIT License (MIT) Copyright 2014, David Hoskins
		*/

		#ifndef RANDOM_SCALE
		#ifdef RANDOM_HIGHER_RANGE
		#define RANDOM_SCALE vec4(.1031, .1030, .0973, .1099)
		#else
		#define RANDOM_SCALE vec4(443.897, 441.423, .0973, .1099)
		#endif
		#endif

		#ifndef FNC_RANDOM
		#define FNC_RANDOM
		float random(in float x) {
		#ifdef RANDOM_SINLESS
			x = fract(x * RANDOM_SCALE.x);
			x *= x + 33.33;
			x *= x + x;
			return fract(x);
		#else
			return fract(sin(x) * 43758.5453);
		#endif
		}

		float random(in vec2 st) {
		#ifdef RANDOM_SINLESS
			vec3 p3  = fract(vec3(st.xyx) * RANDOM_SCALE.xyz);
			p3 += dot(p3, p3.yzx + 33.33);
			return fract((p3.x + p3.y) * p3.z);
		#else
			return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453);
		#endif
		}

		float random(in vec3 pos) {
		#ifdef RANDOM_SINLESS
			pos  = fract(pos * RANDOM_SCALE.xyz);
			pos += dot(pos, pos.zyx + 31.32);
			return fract((pos.x + pos.y) * pos.z);
		#else
			return fract(sin(dot(pos.xyz, vec3(70.9898, 78.233, 32.4355))) * 43758.5453123);
		#endif
		}

		float random(in vec4 pos) {
		#ifdef RANDOM_SINLESS
			pos = fract(pos * RANDOM_SCALE);
			pos += dot(pos, pos.wzxy + 33.33);
			return fract((pos.x + pos.y) * (pos.z + pos.w));
		#else
			float dot_product = dot(pos, vec4(12.9898,78.233,45.164,94.673));
			return fract(sin(dot_product) * 43758.5453);
		#endif
		}

		vec2 random2(float p) {
			vec3 p3 = fract(vec3(p) * RANDOM_SCALE.xyz);
			p3 += dot(p3, p3.yzx + 19.19);
			return fract((p3.xx + p3.yz) * p3.zy);
		}

		vec2 random2(vec2 p) {
			vec3 p3 = fract(p.xyx * RANDOM_SCALE.xyz);
			p3 += dot(p3, p3.yzx + 19.19);
			return fract((p3.xx + p3.yz) * p3.zy);
		}

		vec2 random2(vec3 p3) {
			p3 = fract(p3 * RANDOM_SCALE.xyz);
			p3 += dot(p3, p3.yzx + 19.19);
			return fract((p3.xx + p3.yz) * p3.zy);
		}

		vec3 random3(float p) {
			vec3 p3 = fract(vec3(p) * RANDOM_SCALE.xyz);
			p3 += dot(p3, p3.yzx + 19.19);
			return fract((p3.xxy + p3.yzz) * p3.zyx); 
		}

		vec3 random3(vec2 p) {
			vec3 p3 = fract(vec3(p.xyx) * RANDOM_SCALE.xyz);
			p3 += dot(p3, p3.yxz + 19.19);
			return fract((p3.xxy + p3.yzz) * p3.zyx);
		}

		vec3 random3(vec3 p) {
			p = fract(p * RANDOM_SCALE.xyz);
			p += dot(p, p.yxz + 19.19);
			return fract((p.xxy + p.yzz) * p.zyx);
		}

		vec4 random4(float p) {
			vec4 p4 = fract(p * RANDOM_SCALE);
			p4 += dot(p4, p4.wzxy + 19.19);
			return fract((p4.xxyz + p4.yzzw) * p4.zywx);   
		}

		vec4 random4(vec2 p) {
			vec4 p4 = fract(p.xyxy * RANDOM_SCALE);
			p4 += dot(p4, p4.wzxy + 19.19);
			return fract((p4.xxyz + p4.yzzw) * p4.zywx);
		}

		vec4 random4(vec3 p) {
			vec4 p4 = fract(p.xyzx * RANDOM_SCALE);
			p4 += dot(p4, p4.wzxy + 19.19);
			return fract((p4.xxyz + p4.yzzw) * p4.zywx);
		}

		vec4 random4(vec4 p4) {
			p4 = fract(p4  * RANDOM_SCALE);
			p4 += dot(p4, p4.wzxy + 19.19);
			return fract((p4.xxyz + p4.yzzw) * p4.zywx);
		}
		#endif

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
				case 4:
					r = randomIntHash(gl_FragCoord.xy);
					g = randomIntHash(gl_FragCoord.xy + vec2(4.3289, 9.2487));
					b = randomIntHash(gl_FragCoord.xy + vec2(9.2487, 4.3289));
					break;
				default:
					r = random(gl_FragCoord.xy);
					g = random(gl_FragCoord.xy + vec2(4.3289, 9.2487));
					b = random(gl_FragCoord.xy + vec2(9.2487, 4.3289));
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