import * as THREE from 'three';

class PortalFrustum {
  /**
   * @param {THREE.Object3D} portal - The portal object (expected to have a child mesh named "portalMesh")
   * @param {number} near - Optional near distance. If null/undefined, the portal's actual vertices are used.
   * @param {number} far - The distance at which to compute the far plane.
   */
  constructor({ camera, portal, near, far }) {
    this.portal = portal;
    this.camera = camera;
    this.near = near; // If defined, will be used to position near points.
    this.far = far;
    this.points = {}; // Will hold eight named points.
    this.planes = {}; // Will hold six planes.
    this.update(camera);
  }

  /**
   * Updates the frustum based on the given camera.
   *
   * @param {THREE.Camera} camera - The camera whose position and orientation define the frustum.
   */
  update() {
    // Retrieve the four unique world-space vertices of the portal.
    const portalCorners = getPortalWorldVertices(this.portal);
    if (portalCorners.length !== 4) {
      console.warn('Expected exactly 4 unique portal vertices.');
      return;
    }

    // Compute the portal center.
    const center = new THREE.Vector3();
    portalCorners.forEach(v => center.add(v));
    center.divideScalar(portalCorners.length);

    // Determine portal local axes (using the portalMesh's quaternion).
    const portalMesh = this.portal.mesh;
    const portalQuat = portalMesh.getWorldQuaternion(new THREE.Quaternion());
    const portalUp = new THREE.Vector3(0, 1, 0).applyQuaternion(portalQuat).normalize();
    const portalRight = new THREE.Vector3(1, 0, 0).applyQuaternion(portalQuat).normalize();

    // Classify corners into four positions.
    let nearTopLeft, nearTopRight, nearBottomLeft, nearBottomRight;
    portalCorners.forEach(v => {
      const diff = new THREE.Vector3().subVectors(v, center);
      const upProj = diff.dot(portalUp);
      const rightProj = diff.dot(portalRight);
      if (upProj >= 0 && rightProj <= 0) nearTopLeft = v;
      if (upProj >= 0 && rightProj > 0) nearTopRight = v;
      if (upProj < 0 && rightProj <= 0) nearBottomLeft = v;
      if (upProj < 0 && rightProj > 0) nearBottomRight = v;
    });

    // Helper: compute a point along the ray from the camera through the portal corner.
    const computePoint = (corner, distance) => {
      const dir = new THREE.Vector3().subVectors(corner, this.camera.position).normalize();
      return new THREE.Vector3().copy(this.camera.position).addScaledVector(dir, distance);
    };

    // Determine near points. If this.near is defined, compute points along rays;
    // otherwise, use the portal's actual vertex positions.
    const nearBL = (this.near != null) ? computePoint(nearBottomLeft, this.near) : nearBottomLeft.clone();
    const nearBR = (this.near != null) ? computePoint(nearBottomRight, this.near) : nearBottomRight.clone();
    const nearTL = (this.near != null) ? computePoint(nearTopLeft, this.near) : nearTopLeft.clone();
    const nearTR = (this.near != null) ? computePoint(nearTopRight, this.near) : nearTopRight.clone();

    // Compute far points by extending rays from the camera through the portal corners.
    const farBL = computePoint(nearBottomLeft, this.far);
    const farBR = computePoint(nearBottomRight, this.far);
    const farTL = computePoint(nearTopLeft, this.far);
    const farTR = computePoint(nearTopRight, this.far);

    // Save the eight frustum points with clear names.
    this.points = {
      nearBottomLeft: nearBL,
      nearBottomRight: nearBR,
      nearTopLeft: nearTL,
      nearTopRight: nearTR,
      farBottomLeft: farBL,
      farBottomRight: farBR,
      farTopLeft: farTL,
      farTopRight: farTR
    };

    // Create six frustum planes.
    let frontPlane = new THREE.Plane().setFromCoplanarPoints(nearBL, nearBR, nearTR);
    if (frontPlane.distanceToPoint(this.camera.position) > 0) frontPlane.negate();

    let backPlane = new THREE.Plane().setFromCoplanarPoints(farTR, farBR, farBL);
    if (backPlane.distanceToPoint(this.camera.position) < 0) backPlane.negate();

    let leftPlane = new THREE.Plane().setFromCoplanarPoints(this.camera.position, nearBL, nearTL);
    if (leftPlane.distanceToPoint(this.camera.position) > 0) leftPlane.negate();

    let rightPlane = new THREE.Plane().setFromCoplanarPoints(this.camera.position, nearTR, nearBR);
    if (rightPlane.distanceToPoint(this.camera.position) > 0) rightPlane.negate();

    let topPlane = new THREE.Plane().setFromCoplanarPoints(this.camera.position, nearTL, nearTR);
    if (topPlane.distanceToPoint(this.camera.position) > 0) topPlane.negate();

    let bottomPlane = new THREE.Plane().setFromCoplanarPoints(this.camera.position, nearBR, nearBL);
    if (bottomPlane.distanceToPoint(this.camera.position) > 0) bottomPlane.negate();

    this.planes = {
      front: frontPlane,
      back: backPlane,
      left: leftPlane,
      right: rightPlane,
      top: topPlane,
      bottom: bottomPlane
    };
  }
}

/**
 * Helper function to retrieve the unique world-space vertices of a portal.
 * Assumes the portal has a child mesh named "portalMesh" with BufferGeometry.
 *
 * @param {THREE.Object3D} portal - The portal object.
 * @returns {THREE.Vector3[]} An array of unique vertices.
 */
function getPortalWorldVertices(portal) {
  const vertices = [];
  const geometry = portal.mesh.geometry;
  const posAttr = geometry.attributes.position;
  for (let i = 0; i < posAttr.count; i++) {
    const v = new THREE.Vector3().fromBufferAttribute(posAttr, i);
    portal.mesh.localToWorld(v);
    if (!vertices.some(u => u.distanceToSquared(v) < 1e-6)) {
      vertices.push(v);
    }
  }
  return vertices;
}

export { PortalFrustum };
