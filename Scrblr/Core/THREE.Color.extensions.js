import { Color, Vector3, Vector4 } from "three";

Color.prototype.toVector3 = function ()
{
	return new Vector3(this.r, this.g, this.b);
}

Color.prototype.toVector4 = function ()
{
	return new Vector4(this.r, this.g, this.b, 1.0);
}