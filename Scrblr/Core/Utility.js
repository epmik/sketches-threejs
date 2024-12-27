import { Vector2, Vector3, Vector4, Color } from "three";

class Utility 
{
	constructor() 
	{
		if (this instanceof Utility) 
		{
			throw Error('Utility class cannot be instantiated.');
	  	}
	}

	static DeepCloneUniforms(src) 
	{
		const dst = {};
	
		for (const u in src)
		{
	
			dst[u] = {};
	
			for (const p in src[u])
			{
	
				const property = src[u][p];
	
				if (property && (property.isColor ||
					property.isMatrix3 || property.isMatrix4 ||
					property.isVector2 || property.isVector3 || property.isVector4 ||
					property.isTexture || property.isQuaternion))
				{
	
					if (property.isRenderTargetTexture)
					{
	
						console.warn('UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms().');
						dst[u][p] = null;
	
					} else
					{
	
						dst[u][p] = property.clone();
	
					}
	
				} else if (Array.isArray(property))
				{
	
					dst[u][p] = structuredClone(property);
	
				}
				else
				{
	
					dst[u][p] = property;
	
				}
	
			}
	
		}
	
		return dst;
	}	

	static CircleRadiusInScreenSpace(radius, camera, renderer)
	{
		const o = Utility.TransformVectorToScreenSpace(new Vector3( radius, 0, 0), camera, renderer);
		const p = Utility.TransformVectorToScreenSpace(new Vector3(-radius, 0, 0), camera, renderer);

		return p.sub(o).length();
	}

	static CircleCircumferenceInScreenSpace(radius, camera, renderer)
	{
		return Utility.CircleRadiusInScreenSpace(radius, camera, renderer) * Math.PI * 2.0;
	}

	static EllipseResolutionFactor = 0.25;
	static MinEllipseResolution = 3;
	static MaxEllipseResolution = 2880;

	static CircleResolution(
		radius,
		camera,
		renderer,
		factor = Utility.EllipseResolutionFactor,
		minResolution = Utility.MinEllipseResolution,
		maxResolution = Utility.MaxEllipseResolution)
	{
		return Math.floor(Math.min(maxResolution, Math.max(minResolution, Utility.CircleCircumferenceInScreenSpace(radius, camera, renderer) * factor)));
	}

	static EllipseResolution(
		width,
		height,
		camera,
		renderer,
		factor = Utility.EllipseResolutionFactor,
		minResolution = Utility.MinEllipseResolution,
		maxResolution = Utility.MaxEllipseResolution)
	{
		return Utility.CircleResolution(Math.max(width,	height), camera, renderer, factor, minResolution, maxResolution);
	}

	static TransformVectorToScreenSpace(vector, camera, renderer)
	{
		vector.project(camera);

		const r = renderer.domElement.getBoundingClientRect();

		let hw = r.width * 0.5;
		let hh = r.height * 0.5;

		return new Vector2((vector.x * hw) + hw, (vector.y * hh) + hh);
	}

	static TransformObjectToScreenSpace(object, camera, renderer)
	{
		return Utility.TransformVectorToScreenSpace(new Vector3().setFromMatrixPosition(object.matrixWorld), camera, renderer);
	}

	static UpdateResolutionUniforms(resolution, passes)
	{
		for(let i = 0; i < passes.length; i++)
		{
			if(passes[i].uniforms === undefined || passes[i].uniforms.resolution === undefined || passes[i].uniforms.resolution === null)
			{
				continue;
			}

			passes[i].uniforms.resolution.value.x = resolution.x;
			passes[i].uniforms.resolution.value.y = resolution.y;
		}
	}
}

export { Utility };
