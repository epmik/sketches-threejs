import { Pass } from 'three/addons/postprocessing/Pass.js';

/**
 * Hue and saturation adjustment
 * https://github.com/evanw/glfx.js
 * hue: -1 to 1 (-1 is 180 degrees in the negative direction, 0 is no change, etc.
 * saturation: -1 to 1 (-1 is solid gray, 0 is no change, and 1 is maximum contrast)
 */

const VibrantColorsShader = {

	name: 'VibrantColorsShader',

	uniforms: {

		'tDiffuse': { value: null },
		'minHue': { value: 0.00 },
		'maxHue': { value: 0.00 },
		'minSaturation': { value: 0.00 },
		'maxSaturation': { value: 0.00 },
		'minBrightness': { value: 0.0 },
		'maxBrightness': { value: 0.0 },
		'minContrast': { value: 0.0 },
		'maxContrast': { value: 0.0 },
		'seed': { value: Date.now() },
		'coverPercentage': { value: 1.00 },
	},

	NewShaderMaterial: function ()
	{
		return new ShaderMaterial( 
			{ 
				uniforms: Utility.DeepCloneUniforms(VibrantColorsShader.uniforms), 
				vertexShader: VibrantColorsShader.vertexShader, 
				fragmentShader: VibrantColorsShader.fragmentShader 
			});
	},

	addGuiFolder : function (gui, element, name, openFolder)
	{
		const isPass = (element instanceof Pass);

		name = name === undefined ? (isPass ? 'Vibrant Colors Shader Pass' : 'Vibrant Colors Shader Material') : name;

		let folder = gui.addFolder(name);

		let settings = 
		{
			minHue: Math.floor((1.0 + element.uniforms.minHue.value) * 360),
			maxHue: Math.floor((1.0 + element.uniforms.maxHue.value) * 360),
			minSaturation: Math.floor(element.uniforms.minSaturation.value * 100),
			maxSaturation: Math.floor(element.uniforms.maxSaturation.value * 100),
			minBrightness: Math.floor(element.uniforms.minBrightness.value * 100),
			maxBrightness: Math.floor(element.uniforms.maxBrightness.value * 100),
			minContrast: Math.floor(element.uniforms.minContrast.value * 100),
			maxContrast: Math.floor(element.uniforms.maxContrast.value * 100),
			coverPercentage: Math.floor(element.uniforms.coverPercentage.value * 100),
		}

		folder.add(settings, 'minHue', 0, 360, 1).name('Min Hue').onChange(function (c) { element.uniforms.minHue.value = c *  0.0027777777777778 - 1.0; });
		folder.add(settings, 'maxHue', 0, 360, 1).name('Max Hue').onChange(function (c) { element.uniforms.maxHue.value = c * -0.0027777777777778 - 1.0; });
		folder.add(settings, 'minSaturation', -100, 100, 1).name('Min Saturation').onChange(function (c) { element.uniforms.minSaturation.value = c * -0.01; });
		folder.add(settings, 'maxSaturation', -100, 100, 1).name('Max Saturation').onChange(function (c) { element.uniforms.maxSaturation.value = c *  0.01; });
		folder.add(settings, 'minBrightness', -100, 100, 1).name('Min Brightness').onChange(function (c) { element.uniforms.minBrightness.value = c * -0.01; });
		folder.add(settings, 'maxBrightness', -100, 100, 1).name('Max Brightness').onChange(function (c) { element.uniforms.maxBrightness.value = c *  0.01; });
		folder.add(settings, 'minContrast', -100, 100, 1).name('Min Contrast').onChange(function (c) { element.uniforms.minContrast.value = c * -0.01; });
		folder.add(settings, 'maxContrast', -100, 100, 1).name('Max Contrast').onChange(function (c) { element.uniforms.maxContrast.value = c *  0.01; });
		folder.add(settings, 'coverPercentage', 0, 100, 1).name('Cover Percentage').onChange(function (c) { element.uniforms.coverPercentage.value = c * 0.01; });
		
		if(isPass)
		{
			folder.add(element, 'enabled').name('Enable/disable');
		}

		if(openFolder !== false)
		{
			folder.close();
		}

		return folder;
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
		uniform float minHue;
		uniform float maxHue;
		uniform float minSaturation;
		uniform float maxSaturation;
		uniform float minBrightness;
		uniform float maxBrightness;
		uniform float minContrast;
		uniform float maxContrast;

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

			bool specle = coverPercentage < 1.0
				? coverPercentage > 0.0
					? random( vec3(gl_FragCoord.xy, seed)) <= coverPercentage
					: false
				: true;

			if(specle)
			{
				float hue = random(vec3(gl_FragCoord.xy, seed), minHue, maxHue);
			
				if(hue != 0.0)
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
				}

				float saturation = random(vec3(gl_FragCoord.xy, seed) + vec3(0.2871, 4.8954, 3.4598), minSaturation, maxSaturation);

				if(saturation != 0.0)
				{
					// saturation
					float average = (gl_FragColor.r + gl_FragColor.g + gl_FragColor.b) / 3.0;
					if (saturation > 0.0) {
						gl_FragColor.rgb += (average - gl_FragColor.rgb) * (1.0 - 1.0 / (1.001 - saturation));
					} else {
						gl_FragColor.rgb += (average - gl_FragColor.rgb) * (-saturation);
					}
				}

				float brightness = random(vec3(gl_FragCoord.xy, seed) + vec3(4.8954, 3.4598, 0.2871), minBrightness, maxBrightness);

				gl_FragColor.rgb += brightness;

				float contrast = random(vec3(gl_FragCoord.xy, seed) + vec3(3.4598, 0.2871, 4.8954), minContrast, maxContrast);

				if (contrast > 0.0) 
				{
					gl_FragColor.rgb = (gl_FragColor.rgb - 0.5) / (1.0 - contrast) + 0.5;
				} 
				else 
				{
					gl_FragColor.rgb = (gl_FragColor.rgb - 0.5) * (1.0 + contrast) + 0.5;
				}				
			}
		}`

};

export { VibrantColorsShader };
