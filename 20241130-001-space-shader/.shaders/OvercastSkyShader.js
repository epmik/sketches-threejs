
import { Vector2, Vector3 } from "three";

const OvercastSkyShader = {

	uniforms:
	{
		'tDiffuse': { value: null }, //diffuse texture
		'resolution': { value: new Vector2(800, 800) }, 
		'bias': { value: 0.0 }, 
		'noiseFuncionType': { value: 0 }, 
		'blackAndWhite': { value: true }, 
		'multiplier': { value: new Vector3(0.01, 0.01, 0.01) }, 
		'time': { value: 0.0 }, 
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
		uniform bool blackAndWhite;
		uniform vec3 multiplier;
		uniform float time;

		varying vec2 v_Uv;

		// https://www.shadertoy.com/view/Mtd3W7

		vec3 rgb2hsv(vec3 c)
		{
			vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
			vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
			vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
			float d = q.x - min(q.w, q.y);
			float e = 1.0e-10;
			return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
		}

		vec3 hsv2rgb(vec3 c)
		{
			vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
			vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
			return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
		}


		float rand(vec2 n) {
			float value = fract(sin(cos(dot(n, vec2(12.9898,8.1414)))) * 42758.5453);
			return sqrt(value)/1.25;
		}

		float noise(vec2 n) {
			const vec2 d = vec2(0.0, 1.0);
			vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
			return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
		}

		float fbm(vec2 n, float iTime) {
			float total = 0.0, amplitude = 1.0;
			for (int i = 0; i <4; i++) {
				total += noise(n) * amplitude;
				n += n*2.1;
				amplitude *= 0.377 + sin(iTime)/500.0;
			}
			return total;
		}

		float fbm_readded(vec2 uv, float iTime)
		{
			float i = fbm(uv, iTime);
			uv.x = uv.x * 1.5;    
			uv.y += 0.5f;
			float i2 = fbm(uv, iTime);
			uv.y = uv.y * 2.0;
			uv.x -= 0.3f;
			float i3 = fbm(uv, iTime);
			uv.x = uv.x * 2.0;
			uv.y += 0.7f;
			float i4 = fbm(uv, iTime);
			uv.y = uv.y * 1.5;
			uv.x += .4f;
			float i5 = fbm(uv, iTime);
			return (i + i2 + i3 - i4 + i5)/3.0;
			
		}


		// --------------------------------

		void main()
		{
			// for an explanation about gl_FragCoord, see https://computergraphics.stackexchange.com/a/5725

			// https://www.shadertoy.com/view/Mtd3W7

			float iTime = time;

			vec2 uv = gl_FragCoord.xy / resolution.xy * 1.5;
			//uv.x -= iTime/8.0 + 1.8;
			uv.y -= iTime/12.4 + .89;
			uv.x -= iTime/9.0 + 1.9;
			//uv.y -= iTime/9.4 + 0.9817;
			vec2 uv2 = uv;
			uv2.x +=  (iTime+10.0)/15.0;
			uv2.y +=  (iTime-8.0)/12.0;
			vec2 uv3 = uv2;
			uv3.x += (iTime-7.0)/102.0;
			uv3.y += (iTime+9.0)/96.0;
			float main_cloudiness = fbm_readded(uv * multiplier.xy, iTime);
			float intensity = max(main_cloudiness, 
								1.3*fbm_readded(uv2 * multiplier.xy, iTime))+ .9*main_cloudiness * fbm(uv2 * multiplier.xy, iTime) * fbm(uv3 * multiplier.xy, iTime);
			intensity *= .64;
			intensity += cos(sin(iTime/10.0))/7.0 - .3;
			if (intensity < 0.5)
				intensity *= intensity;
			
			vec3 color = vec3(1.0, 1.0, 1.0);
			color *= intensity; 
			vec3 hsv = rgb2hsv(color);
			hsv.z *= hsv.z ;
			float overflow = 0.0;
			if (hsv.z > 1.0)
			{
				overflow = hsv.z - 1.0;
				hsv.y -= 0.01;
			}
			else if (hsv.z > 0.6)
			{
				hsv.y -= 0.05;
				hsv.z -= 0.096;
				hsv.z *= .93;
				hsv.z *= sqrt(hsv.z)* 1.29;        
			}
			else
			{
				hsv.z -= 0.1;
				hsv.z *= .9;
			
			}
			hsv.z -= 0.02;
			hsv.y -= 0.02;
			color = hsv2rgb(hsv);  
			color.b = 1.0;
			color = color * sqrt(color);
			color.r -= 2.0*overflow; 
			color.g -= 2.0*overflow;
			gl_FragColor = vec4(color,1.0);
			gl_FragColor *= gl_FragColor;
			





			// vec3 p = gl_FragCoord.xyz / vec3(resolution.xy, 1.0);
			

			// r = biasValue(r, bias);
			// g = biasValue(g, bias);
			// b = biasValue(b, bias);

			// if(blackAndWhite)
			// {
			// 	r = g = b;
			// }
	
			// gl_FragColor = vec4(r, g, b, 1.0);
		}`

};

export { OvercastSkyShader };