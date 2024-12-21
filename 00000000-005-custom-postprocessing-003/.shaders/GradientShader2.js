import { Vector2, Vector3, Vector4, Color } from "three";
import { Pass } from 'three/addons/postprocessing/Pass.js';


const _emptyGradient =
{
	time: -1.0,
	color: new Vector4(0, 0, 0, 1),
}

const GradientShader2 = {

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
				{ time: 0.0, color: new Vector4(0, 0, 0, 1) }, { time: 1.0, color: new Vector4(1, 1, 1, 1) },
				_emptyGradient, _emptyGradient, _emptyGradient, _emptyGradient, _emptyGradient, _emptyGradient,
				_emptyGradient, _emptyGradient, _emptyGradient, _emptyGradient, _emptyGradient, _emptyGradient,
				_emptyGradient, _emptyGradient, _emptyGradient, _emptyGradient, _emptyGradient, _emptyGradient,
				_emptyGradient, _emptyGradient, _emptyGradient, _emptyGradient, _emptyGradient, _emptyGradient,
				_emptyGradient, _emptyGradient, _emptyGradient, _emptyGradient, _emptyGradient, _emptyGradient,
			]},
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
		folder.add(element.uniforms.gradientAngle, 'value', { 'Horizontal': 0, 'Vertical': 1 }).name('Gradient Angle');
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
		uniform vec4 color1;
		uniform vec4 color2;
		uniform GradientEntry gradient[MaxGradients];

		varying vec2 v_Uv;

		vec4 colorAt(float time)
		{
			// time = MathUtility.Clamp(time, this._minTime, this._maxTime);
	
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

		int firstIndex(float time)
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
			
			return first;
		}
	
		int lastIndex(float time)
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
			
			return last;
		}

		void main()
		{
			vec2 v = useWindowCoordinates ? (gl_FragCoord.xy / resolution) : v_Uv;

			float factor = gradientAngle == 0 ? v.x : 1.0 - v.y;

			if(gradientType == 1)	// radial
			{
				factor = distance(v, radialCenter) * (1.0 / radialRadius);
			}

			float first = float(firstIndex(factor)) * 0.25;
			float last = float(lastIndex(factor)) * 0.25;

			// gl_FragColor = vec4(v_Uv.x, v_Uv.x, v_Uv.x, 1);
			// gl_FragColor = vec4(factor, factor, factor, 1);
			// gl_FragColor = vec4(first, first, first, 1);
			// gl_FragColor = vec4(last, last, last, 1);
			// gl_FragColor = colorAt(factor);
			// gl_FragColor = gradient[firstIndex(factor)].color;
			gl_FragColor = gradient[lastIndex(factor)].color;
  		}`
};

export { GradientShader2 };