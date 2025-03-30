import * as THREE from 'three';

/**
 * Helper class to visualize the frustum with yellow lines.
 * Draws the near plane, far plane, and connecting edges.
 */
class PortalFrustumHelper extends THREE.Object3D 
{
  constructor(frustum) 
  {
    super();
    this.frustum = frustum;
    this.material = new THREE.LineBasicMaterial({ color: 0xffff00 });
    this.geometry = new THREE.BufferGeometry();
    // 12 edges → 24 vertices.
    this.positions = new Float32Array(24 * 3);
    this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    this.lineSegments = new THREE.LineSegments(this.geometry, this.material);
    this.add(this.lineSegments);
    this.update();
  }

  update() {
    const { points } = this.frustum;
    // Order: near plane: bottomLeft, bottomRight, topRight, topLeft; far plane: same order.
    const edges = [
      // Near plane edges
      points.nearBottomLeft, points.nearBottomRight,
      points.nearBottomRight, points.nearTopRight,
      points.nearTopRight, points.nearTopLeft,
      points.nearTopLeft, points.nearBottomLeft,
      // Far plane edges
      points.farBottomLeft, points.farBottomRight,
      points.farBottomRight, points.farTopRight,
      points.farTopRight, points.farTopLeft,
      points.farTopLeft, points.farBottomLeft,
      // Connecting edges
      points.nearBottomLeft, points.farBottomLeft,
      points.nearBottomRight, points.farBottomRight,
      points.nearTopRight, points.farTopRight,
      points.nearTopLeft, points.farTopLeft,
    ];
    for (let i = 0; i < edges.length; i++) {
      this.positions[i * 3] = edges[i].x;
      this.positions[i * 3 + 1] = edges[i].y;
      this.positions[i * 3 + 2] = edges[i].z;
    }
    this.geometry.attributes.position.needsUpdate = true;
  }
}

export { PortalFrustumHelper };
