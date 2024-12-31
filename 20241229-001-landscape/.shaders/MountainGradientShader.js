import { Vector2, Vector3, Vector4, Color, ShaderMaterial, UniformsUtils } from "three";
import { Pass } from 'three/addons/postprocessing/Pass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { Utility } from 'scrblr';

const MountainGradientShader = {

	self: this,

	uniforms:
	{
		'tDiffuse': { value: null }, //diffuse texture
		'resolution': { value: new Vector2(800, 800) }, 
		'gradientType': { value: 0 }, 	// 0 == Linear, 1 == Radial
		'gradientAngle': { value: 0 }, 	// 0 == Horizontal, 90 == Vertical
		'colorMixType': { value: 0 }, 	// 0 == RGB, 1 == HSV, 2 == HSL, 3 == LAB
		'radialCenter': { value: new Vector2(0.5, 0.5) }, 
		'radialRadius': { value: 0.5 }, 
		'useWindowCoordinates': { value: false }, 
		'gradient': {
			value: [
			
				{ time:  0.0, color: new Vector4(1, 1, 1, 1) },
				{ time:  1.0, color: new Vector4(0, 0, 0, 1) },
				{ time: -1.0, color: new Vector4(0, 0, 0, 1) },
				{ time: -1.0, color: new Vector4(0, 0, 0, 1) },

				{ time: -1.0, color: new Vector4(0, 0, 0, 1) },
				{ time: -1.0, color: new Vector4(0, 0, 0, 1) },
				{ time: -1.0, color: new Vector4(0, 0, 0, 1) },
				{ time: -1.0, color: new Vector4(0, 0, 0, 1) },



				{ time: -1.0, color: new Vector4(0, 0, 0, 1) },
				{ time: -1.0, color: new Vector4(0, 0, 0, 1) },
				{ time: -1.0, color: new Vector4(0, 0, 0, 1) },
				{ time: -1.0, color: new Vector4(0, 0, 0, 1) },

				{ time: -1.0, color: new Vector4(0, 0, 0, 1) },
				{ time: -1.0, color: new Vector4(0, 0, 0, 1) },
				{ time: -1.0, color: new Vector4(0, 0, 0, 1) },
				{ time: -1.0, color: new Vector4(0, 0, 0, 1) },



				{ time: -1.0, color: new Vector4(0, 0, 0, 1) },
				{ time: -1.0, color: new Vector4(0, 0, 0, 1) },
				{ time: -1.0, color: new Vector4(0, 0, 0, 1) },
				{ time: -1.0, color: new Vector4(0, 0, 0, 1) },

				{ time: -1.0, color: new Vector4(0, 0, 0, 1) },
				{ time: -1.0, color: new Vector4(0, 0, 0, 1) },
				{ time: -1.0, color: new Vector4(0, 0, 0, 1) },
				{ time: -1.0, color: new Vector4(0, 0, 0, 1) },



				{ time: -1.0, color: new Vector4(0, 0, 0, 1) },
				{ time: -1.0, color: new Vector4(0, 0, 0, 1) },
				{ time: -1.0, color: new Vector4(0, 0, 0, 1) },
				{ time: -1.0, color: new Vector4(0, 0, 0, 1) },

				{ time: -1.0, color: new Vector4(0, 0, 0, 1) },
				{ time: -1.0, color: new Vector4(0, 0, 0, 1) },
				{ time: -1.0, color: new Vector4(0, 0, 0, 1) },
				{ time: -1.0, color: new Vector4(0, 0, 0, 1) },
			]
		},
	},

	NewShaderMaterial: function ()
	{
		return new ShaderMaterial( 
			{ 
				uniforms: Utility.DeepCloneUniforms(MountainGradientShader.uniforms), 
				vertexShader: MountainGradientShader.vertexShader, 
				fragmentShader: MountainGradientShader.fragmentShader 
			});
	},

	addGradientIndex : 0,

	addGradient: function (time, r, g, b, a)
	{
		let divisor = 1.0;

		if (r > 1.0 || g > 1.0 || b > 1.0 || a === undefined || a > 1.0)
		{
			a = a === undefined ? 255 : a;
			divisor = 0.003921568627451;
		}

		if (a === undefined)
		{
			a = 1.0;
		}
	
		this.uniforms.gradient.value[this.addGradientIndex].time = time;
		this.uniforms.gradient.value[this.addGradientIndex].color.x = r * divisor;
		this.uniforms.gradient.value[this.addGradientIndex].color.y = g * divisor;
		this.uniforms.gradient.value[this.addGradientIndex].color.z = b * divisor;
		this.uniforms.gradient.value[this.addGradientIndex].color.w = a * divisor;

		this.addGradientIndex++;
	},

	addGuiFolder : function (gui, element, name, openFolder)
	{
		const isPass = (element instanceof Pass);

		name = name === undefined ? (isPass ? 'Gradient Shader Pass' : 'Gradient Shader Material') : name;

		let folder = gui.addFolder(name);

		let settings = 
		{
			color1: { r: element.uniforms.gradient.value[0].color.x, g: element.uniforms.gradient.value[0].color.y, b: element.uniforms.gradient.value[0].color.z },
			color2: { r: element.uniforms.gradient.value[1].color.x, g: element.uniforms.gradient.value[1].color.y, b: element.uniforms.gradient.value[1].color.z },
		}

		folder.add(element.uniforms.resolution.value, 'x', 1, 2048, 1.0).name('X-resolution');
		folder.add(element.uniforms.resolution.value, 'y', 1, 2048, 1.0).name('Y-resolution');
		folder.add(element.uniforms.gradientType, 'value', { 'Linear': 0, 'Radial': 1 }).name('Gradient Type');
		folder.add(element.uniforms.gradientAngle, 'value', { '0°': 0, '90°': 90, '180°': 180, '270°': 270 }).name('Gradient Angle');
		folder.add(element.uniforms.colorMixType, 'value', { 'RGB': 0, 'HSV': 1, 'HSL': 2, 'LAB': 3 }).name('Color Mix Type');
		folder.add(element.uniforms.radialCenter.value, 'x', 0, 1, 0.01).name('X-radial Center');
		folder.add(element.uniforms.radialCenter.value, 'y', 0, 1, 0.01).name('Y-radial Center');
		folder.add(element.uniforms.radialRadius, 'value', 0, 4, 0.01).name('Radial Radius');
		folder.add(element.uniforms.useWindowCoordinates, 'value').name('Use Window Coordinates');
		folder.addColor(settings, 'color1').name('color 1').onChange(function(c) { element.uniforms.gradient.value[0].color.x = c.r; element.uniforms.gradient.value[0].color.y = c.g; element.uniforms.gradient.value[0].color.z = c.b; });
		folder.addColor(settings, 'color2').name('color 2').onChange(function(c) { element.uniforms.gradient.value[1].color.x = c.r; element.uniforms.gradient.value[1].color.y = c.g; element.uniforms.gradient.value[1].color.z = c.b; });
		
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

		varying vec2 v_Uv;

		void main()
		{
			v_Uv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,

	fragmentShader: /* glsl */`

		struct GradientEntry
		{
			float time;
			vec4 color;
		};

		#define MaxGradients 32
	
		uniform sampler2D tDiffuse;
		uniform vec2 resolution;
		uniform int gradientType;		// 0 == Linear, 1 == Gradiant
		uniform int gradientAngle;		// 0 == Horizontal, 1 == Vertical
		uniform int colorMixType;		// 0 == RGB, 1 == HSV, 2 == HSL, 3 == LAB
		uniform vec2 radialCenter;
		uniform float radialRadius;
		uniform bool useWindowCoordinates;
		uniform GradientEntry gradient[MaxGradients];

		varying vec2 v_Uv;

		// https://stackoverflow.com/a/17479300/527843

		// A single iteration of Bob Jenkins' One-At-A-Time hashing algorithm.
		uint hash( uint x )
		{
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
		float floatConstruct( uint m )
		{
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

		float SRGBToLinear(float c)
		{
			// https://github.com/mrdoob/three.js/blob/master/src/math/ColorManagement.js
			return (c < 0.04045) ? c * 0.0773993808 : pow(c * 0.9478672986 + 0.0521327014, 2.4);
		}

		float LinearToSRGB(float c)
		{
			// https://github.com/mrdoob/three.js/blob/master/src/math/ColorManagement.js
			return (c < 0.0031308) ? c * 12.92 : 1.055 * (pow(c, 0.41666)) - 0.055;
		}

		vec3 SRGBToLinear(vec3 c)
		{
			return vec3(SRGBToLinear(c.x), SRGBToLinear(c.y), SRGBToLinear(c.z));
		}

		vec3 LinearToSRGB(vec3 c)
		{
			return vec3(LinearToSRGB(c.x), LinearToSRGB(c.y), LinearToSRGB(c.z));
		}

		vec4 SRGBToLinear(vec4 c)
		{
			return vec4(SRGBToLinear(c.x), SRGBToLinear(c.y), SRGBToLinear(c.z), c.w);
		}

		vec4 LinearToSRGB(vec4 c)
		{
			return vec4(LinearToSRGB(c.x), LinearToSRGB(c.y), LinearToSRGB(c.z), c.w);
		}

		vec4 colorAt(float time)
		{
			int first = 0;
			int last = 0;
		  
			for(int i = 0; i < MaxGradients; i++)
			{
				if (gradient[i].time >= time)
				{
					break;
				}
				last++;
			}
	
			first = last - 1;
	
			if (first < 0)
			{
				first = last;
			}
	
			GradientEntry firstEntry = gradient[first];
			GradientEntry lastEntry = gradient[last];
	
			float t = (lastEntry.time - firstEntry.time);
	
			t = t > 0.0 ? ((time - firstEntry.time) / t) : 0.0;
			
			return mix(firstEntry.color, lastEntry.color, t);
		}
	
		void main()
		{
			vec2 w = gl_FragCoord.xy / resolution;
			// w.y = 1.0 - w.y;
			
			vec2 v = useWindowCoordinates ? (gl_FragCoord.xy / resolution) : v_Uv;

			float factor = v.x;
			
			if(gradientAngle == 180)
			{
				factor = 1.0 - v.x;
			}
			else if(gradientAngle == 90)
			{
				factor = 1.0 - v.y;
			}
			else if(gradientAngle == 270)
			{
				factor = v.y;
			}

			if(gradientType == 1)	// radial
			{
				factor = distance(v, radialCenter) * (1.0 / radialRadius);
			}

			gl_FragColor = mix(texture(tDiffuse, w), gradient[0].color, v_Uv.y);
  		}`
};

export { MountainGradientShader };