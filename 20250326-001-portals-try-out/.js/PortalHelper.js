import * as THREE from 'three';

  class PortalHelper extends THREE.Object3D {
    constructor(portal, {
      normalLength = 1,
      normalColor = 0xff0000,
      planeSize = 1,
      planeColor = 0x00ff00,
    } = {}) {
      super();
      this.portal = portal;
  
      // Create an arrow helper to visualize the portal's normal.
      // Its direction and position will be updated in the update() method.
      this.arrowHelper = new THREE.ArrowHelper(
        new THREE.Vector3(), // initial dummy vector, will be updated
        new THREE.Vector3(), // initial origin, will be updated
        normalLength,
        normalColor
      );
      this.add(this.arrowHelper);
  
      // Create a plane helper to visualize the portal's plane.
      // It uses the portal's plane which is updated by the portal.
      this.planeHelper = new THREE.PlaneHelper(this.portal.plane, planeSize, planeColor);
      this.add(this.planeHelper);
    }
  
    update() {
      // Get the portal's world position.
      const worldPosition = new THREE.Vector3();
      this.portal.getWorldPosition(worldPosition);
  
      // Get the portal's world rotation so that the local normal is transformed into world space.
      const worldQuaternion = new THREE.Quaternion();
      this.portal.getWorldQuaternion(worldQuaternion);
  
      // Transform the portal's local normal to world space.
      const worldNormal = new THREE.Vector3(0, 0, 1).applyQuaternion(worldQuaternion);
  
      // Update the arrow helper with the calculated world position and world normal.
      this.arrowHelper.position.copy(worldPosition);
      this.arrowHelper.setDirection(this.portal.plane.normal);
  
      // Update the portal's plane using the world-space data.
      this.portal.plane.setFromNormalAndCoplanarPoint(worldNormal, worldPosition);
  
      // Ensure the plane helper reflects the updated plane.
      this.planeHelper.plane = this.portal.plane;
      this.planeHelper.updateMatrixWorld();
    }
  
    toggleVisibility() {
      this.arrowHelper.visible = !this.arrowHelper.visible;
      this.planeHelper.visible = !this.planeHelper.visible;
    }
  }

  export { PortalHelper };
