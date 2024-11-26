import { Vector2, Vector3, Vector4, Color } from "three";

const GradientShader = {

	self: this,

	uniforms:
	{
		'tDiffuse': { value: null }, //diffuse texture
		'resolution': { value: new Vector2(800, 800) }, 
		'gradientType': { value: 0 }, 	// 0 == Linear, 1 == Radial
		'gradientAngle': { value: 0 }, 	// 0 == Horizontal, 90 == Vertical
		'colorMixType': { value: 0 }, 	// 0 == RGB, 1 == HSV, 2 == HSL, 3 == LAB
		'color1': { value: new Vector4(0, 0, 0, 1) }, 
		'color2': { value: new Vector4(1, 1, 1, 1) }, 
	},

	addGuiFolder : function (gui, pass, openFolder)
	{
		const self = this;

		let folder = gui.addFolder('Gradient Shader');

		let settings = 
		{
			color1: { r: pass.uniforms.color1.value.x, g: pass.uniforms.color1.value.y, b: pass.uniforms.color1.value.z },
			color2: { r: pass.uniforms.color2.value.x, g: pass.uniforms.color2.value.y, b: pass.uniforms.color2.value.z },
		}

		folder.add(pass.uniforms.resolution.value, 'x', 1, 2048, 1.0).name('X-resolution');
		folder.add(pass.uniforms.resolution.value, 'y', 1, 2048, 1.0).name('Y-resolution');
		folder.add(pass.uniforms.gradientType, 'value', { 'Linear': 0, 'Radial': 1 }).name('Gradient Type');
		folder.add(pass.uniforms.gradientAngle, 'value', { 'Horizontal': 0, 'Vertical': 1 }).name('Gradient Angle');
		folder.add(pass.uniforms.colorMixType, 'value', { 'RGB': 0, 'HSV': 1, 'HSL': 2, 'LAB': 3 }).name('Color Mix Type');
		folder.addColor(settings, 'color1').name('color 1').onChange(function(c) { pass.uniforms.color1.value.x = c.r; pass.uniforms.color1.value.y = c.g; pass.uniforms.color1.value.z = c.b; });
		folder.addColor(settings, 'color2').name('color 2').onChange(function(c) { pass.uniforms.color2.value.x = c.r; pass.uniforms.color2.value.y = c.g; pass.uniforms.color2.value.z = c.b; });
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
		uniform int gradientType;
		uniform int gradientAngle;
		uniform int colorMixType;
		uniform vec4 color1;
		uniform vec4 color2;

		varying vec2 v_Uv;

		void main()
		{
			vec2 p = vec2(1.0, 1.0) / resolution.xy;

			vec2 st = gl_PointCoord;	// gl_FragCoord
			// float mixValue = distance(st, vec2(0, 1));

			float factor = gradientAngle == 0 ? v_Uv.x : 1.0 - v_Uv.y;

			vec4 color = mix(color1, color2, factor);

			gl_FragColor = color;
			// gl_FragColor = vec4(color, 1);
  		}`
};

export { GradientShader };