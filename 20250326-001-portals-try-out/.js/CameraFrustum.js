import * as THREE from 'three';

class CameraFrustum
{
  constructor(camera)
  {
    this.camera = camera;
    // Six planes: front, back, left, right, top, bottom.
    this.planes = {
      front: new THREE.Plane(),
      back: new THREE.Plane(),
      left: new THREE.Plane(),
      right: new THREE.Plane(),
      top: new THREE.Plane(),
      bottom: new THREE.Plane()
    };

    // Eight corner points:
    this.points = {
      nearBottomLeft: new THREE.Vector3(),
      nearBottomRight: new THREE.Vector3(),
      nearTopLeft: new THREE.Vector3(),
      nearTopRight: new THREE.Vector3(),
      farBottomLeft: new THREE.Vector3(),
      farBottomRight: new THREE.Vector3(),
      farTopLeft: new THREE.Vector3(),
      farTopRight: new THREE.Vector3()
    };

    // Local space transform (for merging planes, if needed) is identity by default.
    this.localMatrix = new THREE.Matrix4();

    this.update();
  }

  update()
  {
    // Compute the view-projection matrix: VP = projectionMatrix * camera.matrixWorldInverse
    const vpMatrix = new THREE.Matrix4();
    vpMatrix.multiplyMatrices(this.camera.projectionMatrix, this.camera.matrixWorldInverse);
    const invVP = new THREE.Matrix4().copy(vpMatrix).invert();

    // Define the 8 NDC corners
    const ndcCorners = [
      new THREE.Vector3(-1, -1, -1), // near bottom left
      new THREE.Vector3(1, -1, -1), // near bottom right
      new THREE.Vector3(-1, 1, -1), // near top left
      new THREE.Vector3(1, 1, -1), // near top right
      new THREE.Vector3(-1, -1, 1), // far bottom left
      new THREE.Vector3(1, -1, 1), // far bottom right
      new THREE.Vector3(-1, 1, 1), // far top left
      new THREE.Vector3(1, 1, 1)  // far top right
    ];

    // Transform NDC corners to world space.
    const worldCorners = ndcCorners.map(ndc =>
    {
      const v4 = new THREE.Vector4(ndc.x, ndc.y, ndc.z, 1);
      v4.applyMatrix4(invVP);
      v4.divideScalar(v4.w);
      return new THREE.Vector3(v4.x, v4.y, v4.z);
    });

    // Assign corner points
    this.points.nearBottomLeft.copy(worldCorners[0]);
    this.points.nearBottomRight.copy(worldCorners[1]);
    this.points.nearTopLeft.copy(worldCorners[2]);
    this.points.nearTopRight.copy(worldCorners[3]);
    this.points.farBottomLeft.copy(worldCorners[4]);
    this.points.farBottomRight.copy(worldCorners[5]);
    this.points.farTopLeft.copy(worldCorners[6]);
    this.points.farTopRight.copy(worldCorners[7]);

    // Compute the six frustum planes from three points each.
    this.planes.left.setFromCoplanarPoints(this.points.nearBottomLeft, this.points.nearTopLeft, this.points.farTopLeft);
    this.planes.right.setFromCoplanarPoints(this.points.nearTopRight, this.points.nearBottomRight, this.points.farBottomRight);
    this.planes.top.setFromCoplanarPoints(this.points.nearTopLeft, this.points.nearTopRight, this.points.farTopRight);
    this.planes.bottom.setFromCoplanarPoints(this.points.nearBottomRight, this.points.nearBottomLeft, this.points.farBottomLeft);
    this.planes.front.setFromCoplanarPoints(this.points.nearBottomLeft, this.points.nearBottomRight, this.points.nearTopRight);
    this.planes.back.setFromCoplanarPoints(this.points.farBottomRight, this.points.farBottomLeft, this.points.farTopLeft);
  }

  // // Example method: try to merge an input plane.
  // addPlaneIfInside(inputPlane)
  // {
  //   // Transform input plane into local space.
  //   const invLocal = new THREE.Matrix4().copy(this.localMatrix).invert();
  //   const localPlane = inputPlane.clone().applyMatrix4(invLocal);
  //   if (localPlane.normal.x > 0)
  //   {
  //     if (localPlane.constant > this.planes.right.constant)
  //     {
  //       this.planes.right.copy(inputPlane);
  //     }
  //   }
  //   // Additional axes logic could be added here.
  // }
}

export { CameraFrustum };
