import * as THREE from 'three';

class PolygonHelper extends THREE.Object3D
{
  constructor({ points = null, color = 0xffffff, closed = true })
  {
    super();

    this.points = points;
    this.color = color;
    this.closed = closed;
    this.line = null;

    if (Array.isArray(points) && points.length >= 2)
    {
      this.line = this.createLine();
      this.add(this.line);
    }
  }

  createLine()
  {
    const material = new THREE.LineBasicMaterial({ color: this.color });
    const geometry = new THREE.BufferGeometry().setFromPoints(
      this.closed ? [...this.points, this.points[0]] : this.points
    );
    return new THREE.Line(geometry, material);
  }

  update(points)
  {
    if (!Array.isArray(points) || points.length < 2)
    {
      throw new Error('PolygonHelper update requires an array of at least two THREE.Vector3 points');
    }
    this.points = points;
    if (this.line) this.remove(this.line);
    this.line = this.createLine();
    this.add(this.line);
  }
}

export { PolygonHelper };
