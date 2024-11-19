
import { Vector2, Vector3 } from "three";

const VisualizeNoiseShader = {

	uniforms:
	{
		'tDiffuse': { value: null }, //diffuse texture
		'resolution': { value: new Vector2(800, 800) }, 
		'bias': { value: 0.0 }, 
		'noiseFuncionType': { value: 0 }, 
		'blackAndWhite': { value: true }, 
		'multiplier': { value: new Vector3(0.01, 0.01, 0.01) }, 
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
		uniform int noiseFuncionType;
		uniform bool blackAndWhite;
		uniform vec3 multiplier;

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
		// https://stackoverflow.com/a/54874852

		int b(int N, int B) { return N>>B & 1; }
		int T[] = int[](0x15,0x38,0x32,0x2c,0x0d,0x13,0x07,0x2a);
		int A[] = int[](0,0,0);

		int b(int i, int j, int k, int B) { return T[b(i,B)<<2 | b(j,B)<<1 | b(k,B)]; }

		int shuffle(int i, int j, int k) {
			return b(i,j,k,0) + b(j,k,i,1) + b(k,i,j,2) + b(i,j,k,3) +
				b(j,k,i,4) + b(k,i,j,5) + b(i,j,k,6) + b(j,k,i,7) ;
		}

		float K(int a, vec3 uvw, vec3 ijk)
		{
			float s = float(A[0]+A[1]+A[2])/6.0;
			float x = uvw.x - float(A[0]) + s,
				y = uvw.y - float(A[1]) + s,
				z = uvw.z - float(A[2]) + s,
				t = 0.6 - x * x - y * y - z * z;
			int h = shuffle(int(ijk.x) + A[0], int(ijk.y) + A[1], int(ijk.z) + A[2]);
			A[a]++;
			if (t < 0.0)
				return 0.0;
			int b5 = h>>5 & 1, b4 = h>>4 & 1, b3 = h>>3 & 1, b2= h>>2 & 1, b = h & 3;
			float p = b==1?x:b==2?y:z, q = b==1?y:b==2?z:x, r = b==1?z:b==2?x:y;
			p = (b5==b3 ? -p : p); q = (b5==b4 ? -q : q); r = (b5!=(b4^b3) ? -r : r);
			t *= t;
			return 8.0 * t * t * (p + (b==0 ? q+r : b2==0 ? q : r));
		}

		float AndrewMeservyKenPerlinNoise(float x, float y, float z)
		{
			float s = (x + y + z) / 3.0;  
			vec3 ijk = vec3(int(floor(x+s)), int(floor(y+s)), int(floor(z+s)));
			s = float(ijk.x + ijk.y + ijk.z) / 6.0;
			vec3 uvw = vec3(x - float(ijk.x) + s, y - float(ijk.y) + s, z - float(ijk.z) + s);
			A[0] = A[1] = A[2] = 0;
			int hi = uvw.x >= uvw.z ? uvw.x >= uvw.y ? 0 : 1 : uvw.y >= uvw.z ? 1 : 2;
			int lo = uvw.x <  uvw.z ? uvw.x <  uvw.y ? 0 : 1 : uvw.y <  uvw.z ? 1 : 2;
			return K(hi, uvw, ijk) + K(3 - hi - lo, uvw, ijk) + K(lo, uvw, ijk) + K(0, uvw, ijk);
		}		

		float AndrewMeservyKenPerlinNoise(vec3 xyz)
		{
			float s = (xyz.x + xyz.y + xyz.z) / 3.0;  
			
			vec3 ijk = vec3(int(floor(xyz.x+s)), int(floor(xyz.y+s)), int(floor(xyz.z+s)));
			
			s = float(ijk.x + ijk.y + ijk.z) / 6.0;
			
			vec3 uvw = vec3(xyz.x - float(ijk.x) + s, xyz.y - float(ijk.y) + s, xyz.z - float(ijk.z) + s);
			
			A[0] = A[1] = A[2] = 0;
			
			int hi = uvw.x >= uvw.z ? uvw.x >= uvw.y ? 0 : 1 : uvw.y >= uvw.z ? 1 : 2;
			int lo = uvw.x <  uvw.z ? uvw.x <  uvw.y ? 0 : 1 : uvw.y <  uvw.z ? 1 : 2;
			
			return K(hi, uvw, ijk) + K(3 - hi - lo, uvw, ijk) + K(lo, uvw, ijk) + K(0, uvw, ijk);
		}		

		// --------------------------------

		//
		// Description : Array and textureless GLSL 2D simplex noise function.
		//      Author : Ian McEwan, Ashima Arts.
		//  Maintainer : stegu
		//     Lastmod : 20110822 (ijm)
		//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
		//               Distributed under the MIT License. See LICENSE file.
		//               https://github.com/ashima/webgl-noise
		//               https://github.com/stegu/webgl-noise
		// 

		vec3 mod289(vec3 x) 
		{
			return x - floor(x * (1.0 / 289.0)) * 289.0;
		}

		vec2 mod289(vec2 x) 
		{
			return x - floor(x * (1.0 / 289.0)) * 289.0;
		}

		vec3 permute(vec3 x) 
		{
			return mod289(((x*34.0)+10.0)*x);
		}

		float snoise(vec2 v)
		{
		const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
							0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
							-0.577350269189626,  // -1.0 + 2.0 * C.x
							0.024390243902439); // 1.0 / 41.0
		// First corner
		vec2 i  = floor(v + dot(v, C.yy) );
		vec2 x0 = v -   i + dot(i, C.xx);

		// Other corners
		vec2 i1;
		//i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0
		//i1.y = 1.0 - i1.x;
		i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
		// x0 = x0 - 0.0 + 0.0 * C.xx ;
		// x1 = x0 - i1 + 1.0 * C.xx ;
		// x2 = x0 - 1.0 + 2.0 * C.xx ;
		vec4 x12 = x0.xyxy + C.xxzz;
		x12.xy -= i1;

		// Permutations
		i = mod289(i); // Avoid truncation effects in permutation
		vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
				+ i.x + vec3(0.0, i1.x, 1.0 ));

		vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
		m = m*m ;
		m = m*m ;

		// Gradients: 41 points uniformly over a line, mapped onto a diamond.
		// The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)

		vec3 x = 2.0 * fract(p * C.www) - 1.0;
		vec3 h = abs(x) - 0.5;
		vec3 ox = floor(x + 0.5);
		vec3 a0 = x - ox;

		// Normalise gradients implicitly by scaling m
		// Approximation of: m *= inversesqrt( a0*a0 + h*h );
		m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

		// Compute final noise value at P
		vec3 g;
		g.x  = a0.x  * x0.x  + h.x  * x0.y;
		g.yz = a0.yz * x12.xz + h.yz * x12.yw;
		return 130.0 * dot(m, g);
		}		

		// --------------------------------

		void main()
		{
			// for an explanation about gl_FragCoord, see https://computergraphics.stackexchange.com/a/5725
			
			vec3 p = gl_FragCoord.xyz / vec3(resolution.xy, 1.0);
			
			float r = 0.0,  g = 0.0,  b = 0.0;
			
			switch (noiseFuncionType) 
			{
				case 1:
					r = (1.0 + AndrewMeservyKenPerlinNoise(gl_FragCoord.xyz * multiplier)) * 0.5;
					g = (1.0 + AndrewMeservyKenPerlinNoise((gl_FragCoord.xyz + vec3(4.3289, 9.2487, 1.89832)) * multiplier)) * 0.5;
					b = (1.0 + AndrewMeservyKenPerlinNoise((gl_FragCoord.xyz + vec3(9.2487, 1.89832, 4.3289)) * multiplier)) * 0.5;
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
					r = (1.0 + snoise(gl_FragCoord.xy * multiplier.xy)) * 0.5;
					g = (1.0 + snoise((gl_FragCoord.xy + vec2(4.3289, 9.2487)) * multiplier.xy)) * 0.5;
					b = (1.0 + snoise((gl_FragCoord.xy + vec2(9.2487, 1.89832)) * multiplier.xy)) * 0.5;
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

export { VisualizeNoiseShader };