import { Vector2 } from "three";

const RandomPixelDisplaceShader = {

	self: this,

	uniforms:
	{
		'tDiffuse': { value: null }, //diffuse texture
		'resolution': { value: new Vector2(800, 800) }, 
		'minXOffset': { value: -10 }, 
		'maxXOffset': { value:  10 }, 
		'minYOffset': { value: -10 }, 
		'maxYOffset': { value:  10 }, 
	},

	addGuiFolder : function (gui, pass, openFolder)
	{
		const self = this;

		let folder = gui.addFolder('Random Pixel Displace');

		folder.add(pass.uniforms.resolution.value, 'x', 1, 2048, 1.0).name('X-resolution');
		folder.add(pass.uniforms.resolution.value, 'y', 1, 2048, 1.0).name('Y-resolution');
		folder.add(pass.uniforms.minXOffset, 'value', -400, 0, 1.0).name('Min X-Offset');
		folder.add(pass.uniforms.maxXOffset, 'value', 0, 400, 1.0).name('Max X-Offset');
		folder.add(pass.uniforms.minYOffset, 'value', -400, 0, 1.0).name('Min Y-Offset');
		folder.add(pass.uniforms.maxYOffset, 'value', 0, 400, 1.0).name('Max Y-Offset');
		folder.add(pass, 'enabled').name('Enable/disable');

		if((openFolder === undefined && pass.enabled == false) || openFolder == false)
		{
			folder.close();
		}

		return folder;
	},

	vertexShader: /* glsl */`

		varying vec2 v_Uv;

		void main() {
			v_Uv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,

	fragmentShader: /* glsl */`

		uniform sampler2D tDiffuse;
		uniform vec2 resolution;
		uniform float minXOffset;
		uniform float maxXOffset;
		uniform float minYOffset;
		uniform float maxYOffset;

		varying vec2 v_Uv;

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

		float random( float x, float min, float max ) { return min + ((max - min) * random(x)); }
		float random( vec2 v, float min, float max ) { return min + ((max - min) * random(v)); }
		float random( vec3 v, float min, float max ) { return min + ((max - min) * random(v)); }
		float random( vec4 v, float min, float max ) { return min + ((max - min) * random(v)); }

		void main()
		{
			vec2 offset = vec2(8.4894f, 3.28765);
			vec2 fraction = vec2(1.0, 1.0) / resolution.xy;

			float x = v_Uv.x + (fraction.x * random(v_Uv, minXOffset, maxXOffset));
			float y = v_Uv.y + (fraction.y * random(v_Uv + offset, minYOffset, maxYOffset));

			// texture1D, texture12D & texture3D are deprecated, see p99 https://registry.khronos.org/OpenGL/specs/gl/GLSLangSpec.3.30.pdf
			gl_FragColor = texture(tDiffuse, vec2(x, y));
		}`

};

export { RandomPixelDisplaceShader };