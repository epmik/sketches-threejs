
import { Vector2, Vector3, Vector4, Color } from "three";
import { Pass } from 'three/addons/postprocessing/Pass.js';

const HorizontalGaussianBlurShader = {

	uniforms:
	{
		'tDiffuse': { value: null }, //diffuse texture
		'resolution': { value: new Vector2(800, 800) }, 
		'radius': { value: 9.0 }, 
	},

	addGuiFolder : function (gui, element, name, openFolder)
	{
		const isPass = (element instanceof Pass);

		name = name === undefined ? (isPass ? 'Horizontal Gaussian Blur Shader Pass' : 'Horizontal Gaussian Blur Shader Material') : name;

		let folder = gui.addFolder(name);

		folder.add(element.uniforms.resolution.value, 'x', 1, 2048, 1.0).name('X-resolution');
		folder.add(element.uniforms.resolution.value, 'y', 1, 256, 1.0).name('Y-resolution');
		folder.add(element.uniforms.radius, 'value', 0, 1024, 1).name('radius');

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

		uniform sampler2D tDiffuse;
		uniform vec2 resolution;
		uniform float radius;

		varying vec2 v_Uv;

		// --------------------------------
			
		void main()
		{
			if(radius < 1.0)
			{
				gl_FragColor = texture2D(tDiffuse, v_Uv);

				return;
			}

			float x, y, rr = radius * radius, d, w, w0;
			vec2 p = v_Uv; // 0.5 * (vec2(1.0, 1.0) + gl_FragCoord.xy);
			vec4 col = vec4(0.0, 0.0, 0.0, 0.0);
			w0 = 0.5135 / pow(radius, 0.96);
			for (d = 1.0 / resolution.x, x = -radius, p.x += x * d; x <= radius; x++, p.x += d)
			{
				w = w0 * exp((-x * x) / (2.0 * rr));
				col += texture2D(tDiffuse, p) * w;
			}
			gl_FragColor = col;
		}`

};

export { HorizontalGaussianBlurShader };