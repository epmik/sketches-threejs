
import { Mesh } from "three";
import { FullscreenTriangleGeometry } from '../Geometry/FullscreenTriangleGeometry.js';

class FullScreenMesh extends Mesh 
{
	static _fullscreenTriangleGeometry = new FullscreenTriangleGeometry();

	constructor( material ) 
	{
		super(FullScreenMesh._fullscreenTriangleGeometry, material);
	}
}

export { FullScreenMesh };
