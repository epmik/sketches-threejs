import { Vector2, Vector3, Vector4, Color } from "three";
import { Pass } from 'three/addons/postprocessing/Pass.js';

const GradientShader = {

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
		'color1': { value: new Vector4(0, 0, 0, 1) }, 
		'color2': { value: new Vector4(1, 1, 1, 1) }, 
	},

	addGuiFolder : function (gui, element, name, openFolder)
	{
		const self = this;

		const isPass = (element instanceof Pass);

		name = name === undefined ? (isPass ? 'Gradient Shader Pass' : 'Gradient Shader Material') : name;

		let folder = gui.addFolder(name);

		let settings = 
		{
			color1: { r: element.uniforms.color1.value.x, g: element.uniforms.color1.value.y, b: element.uniforms.color1.value.z },
			color2: { r: element.uniforms.color2.value.x, g: element.uniforms.color2.value.y, b: element.uniforms.color2.value.z },
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
		folder.addColor(settings, 'color1').name('color 1').onChange(function(c) { element.uniforms.color1.value.x = c.r; element.uniforms.color1.value.y = c.g; element.uniforms.color1.value.z = c.b; });
		folder.addColor(settings, 'color2').name('color 2').onChange(function(c) { element.uniforms.color2.value.x = c.r; element.uniforms.color2.value.y = c.g; element.uniforms.color2.value.z = c.b; });
		
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

		void main() {
			v_Uv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,

	fragmentShader: /* glsl */`

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

		varying vec2 v_Uv;

		void main()
		{
			// vec2 p = vec2(1.0, 1.0) / resolution.xy;

			vec2 v = useWindowCoordinates ? (gl_FragCoord.xy / resolution.xy) : v_Uv.xy;

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

			vec4 color = mix(color1, color2, factor);

			gl_FragColor = color;
  		}`
};

export { GradientShader };