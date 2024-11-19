
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

		//
		// GLSL textureless classic 2D noise "cnoise",
		// with an RSL-style periodic variant "pnoise".
		// Author:  Stefan Gustavson (stefan.gustavson@liu.se)
		// Version: 2024-11-07
		//
		// Many thanks to Ian McEwan of Ashima Arts for the
		// ideas for permutation and gradient selection.
		//
		// Copyright (c) 2011 Stefan Gustavson. All rights reserved.
		// Distributed under the MIT license. See LICENSE file.
		// https://github.com/stegu/webgl-noise
		//

		vec4 mod289(vec4 x)
		{
		  return x - floor(x * (1.0 / 289.0)) * 289.0;
		}
		
		vec4 permute(vec4 x)
		{
		  return mod289(((x*34.0)+10.0)*x);
		}

		vec4 taylorInvSqrt(vec4 r)
		{
		return 1.79284291400159 - 0.85373472095314 * r;
		}

		vec2 fade(vec2 t) {
		return t*t*t*(t*(t*6.0-15.0)+10.0);
		}

		// Classic Perlin noise
		float cnoise(vec2 P)
		{
		vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
		vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
		Pi = mod289(Pi); // To avoid truncation effects in permutation
		vec4 ix = Pi.xzxz;
		vec4 iy = Pi.yyww;
		vec4 fx = Pf.xzxz;
		vec4 fy = Pf.yyww;

		vec4 i = permute(permute(ix) + iy);

		vec4 gx = fract(i * (1.0 / 41.0)) * 2.0 - 1.0 ;
		vec4 gy = abs(gx) - 0.5 ;
		vec4 tx = floor(gx + 0.5);
		gx = gx - tx;

		vec2 g00 = vec2(gx.x,gy.x);
		vec2 g10 = vec2(gx.y,gy.y);
		vec2 g01 = vec2(gx.z,gy.z);
		vec2 g11 = vec2(gx.w,gy.w);

		vec4 norm = taylorInvSqrt(vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11)));

		float n00 = norm.x * dot(g00, vec2(fx.x, fy.x));
		float n10 = norm.y * dot(g10, vec2(fx.y, fy.y));
		float n01 = norm.z * dot(g01, vec2(fx.z, fy.z));
		float n11 = norm.w * dot(g11, vec2(fx.w, fy.w));

		vec2 fade_xy = fade(Pf.xy);
		vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
		float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
		return 2.3 * n_xy;
		}

		// Classic Perlin noise, periodic variant
		float pnoise(vec2 P, vec2 rep)
		{
		vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
		vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
		Pi = mod(Pi, rep.xyxy); // To create noise with explicit period
		Pi = mod289(Pi);        // To avoid truncation effects in permutation
		vec4 ix = Pi.xzxz;
		vec4 iy = Pi.yyww;
		vec4 fx = Pf.xzxz;
		vec4 fy = Pf.yyww;

		vec4 i = permute(permute(ix) + iy);

		vec4 gx = fract(i * (1.0 / 41.0)) * 2.0 - 1.0 ;
		vec4 gy = abs(gx) - 0.5 ;
		vec4 tx = floor(gx + 0.5);
		gx = gx - tx;

		vec2 g00 = vec2(gx.x,gy.x);
		vec2 g10 = vec2(gx.y,gy.y);
		vec2 g01 = vec2(gx.z,gy.z);
		vec2 g11 = vec2(gx.w,gy.w);

		vec4 norm = taylorInvSqrt(vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11)));

		float n00 = norm.x * dot(g00, vec2(fx.x, fy.x));
		float n10 = norm.y * dot(g10, vec2(fx.y, fy.y));
		float n01 = norm.z * dot(g01, vec2(fx.z, fy.z));
		float n11 = norm.w * dot(g11, vec2(fx.w, fy.w));

		vec2 fade_xy = fade(Pf.xy);
		vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
		float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
		return 2.3 * n_xy;
		}		

		// --------------------------------

		// #version 120

		// Cellular noise ("Worley noise") in 2D in GLSL.
		// Copyright (c) Stefan Gustavson 2011-04-19. All rights reserved.
		// This code is released under the conditions of the MIT license.
		// See LICENSE file for details.
		// https://github.com/stegu/webgl-noise

		// Modulo 7 without a division
		vec3 mod7(vec3 x) {
		return x - floor(x * (1.0 / 7.0)) * 7.0;
		}

		// Cellular noise, returning F1 and F2 in a vec2.
		// Standard 3x3 search window for good F1 and F2 values
		vec2 cellular(vec2 P) {
		#define K 0.142857142857 // 1/7
		#define Ko 0.428571428571 // 3/7
		#define jitter 1.0 // Less gives more regular pattern
			vec2 Pi = mod289(floor(P));
			vec2 Pf = fract(P);
			vec3 oi = vec3(-1.0, 0.0, 1.0);
			vec3 of = vec3(-0.5, 0.5, 1.5);
			vec3 px = permute(Pi.x + oi);
			vec3 p = permute(px.x + Pi.y + oi); // p11, p12, p13
			vec3 ox = fract(p*K) - Ko;
			vec3 oy = mod7(floor(p*K))*K - Ko;
			vec3 dx = Pf.x + 0.5 + jitter*ox;
			vec3 dy = Pf.y - of + jitter*oy;
			vec3 d1 = dx * dx + dy * dy; // d11, d12 and d13, squared
			p = permute(px.y + Pi.y + oi); // p21, p22, p23
			ox = fract(p*K) - Ko;
			oy = mod7(floor(p*K))*K - Ko;
			dx = Pf.x - 0.5 + jitter*ox;
			dy = Pf.y - of + jitter*oy;
			vec3 d2 = dx * dx + dy * dy; // d21, d22 and d23, squared
			p = permute(px.z + Pi.y + oi); // p31, p32, p33
			ox = fract(p*K) - Ko;
			oy = mod7(floor(p*K))*K - Ko;
			dx = Pf.x - 1.5 + jitter*ox;
			dy = Pf.y - of + jitter*oy;
			vec3 d3 = dx * dx + dy * dy; // d31, d32 and d33, squared
			// Sort out the two smallest distances (F1, F2)
			vec3 d1a = min(d1, d2);
			d2 = max(d1, d2); // Swap to keep candidates for F2
			d2 = min(d2, d3); // neither F1 nor F2 are now in d3
			d1 = min(d1a, d2); // F1 is now in d1
			d2 = max(d1a, d2); // Swap to keep candidates for F2
			d1.xy = (d1.x < d1.y) ? d1.xy : d1.yx; // Swap if smaller
			d1.xz = (d1.x < d1.z) ? d1.xz : d1.zx; // F1 is in d1.x
			d1.yz = min(d1.yz, d2.yz); // F2 is now not in d2.yz
			d1.y = min(d1.y, d1.z); // nor in  d1.z
			d1.y = min(d1.y, d2.x); // F2 is in d1.y, we're done.
			return sqrt(d1.xy);
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
					r = (1.0 + snoise(gl_FragCoord.xy * multiplier.xy)) * 0.5;
					g = (1.0 + snoise((gl_FragCoord.xy + vec2(4.3289, 9.2487)) * multiplier.xy)) * 0.5;
					b = (1.0 + snoise((gl_FragCoord.xy + vec2(9.2487, 1.89832)) * multiplier.xy)) * 0.5;
					break;
				case 3:
					r = (1.0 + cnoise(gl_FragCoord.xy * multiplier.xy)) * 0.5;
					g = (1.0 + cnoise((gl_FragCoord.xy + vec2(4.3289, 9.2487)) * multiplier.xy)) * 0.5;
					b = (1.0 + cnoise((gl_FragCoord.xy + vec2(9.2487, 1.89832)) * multiplier.xy)) * 0.5;
					break;
				default:
					r = (1.0 + cellular(gl_FragCoord.xy * multiplier.xy)) * 0.5;
					g = (1.0 + cellular((gl_FragCoord.xy + vec2(4.3289, 9.2487)) * multiplier.xy)) * 0.5;
					b = (1.0 + cellular((gl_FragCoord.xy + vec2(9.2487, 1.89832)) * multiplier.xy)) * 0.5;
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