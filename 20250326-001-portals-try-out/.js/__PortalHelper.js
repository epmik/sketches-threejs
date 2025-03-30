import * as THREE from 'three';

class PortalHelper extends THREE.Object3D {
    constructor({ portal, color = 0xffffff, opacity = 0.5, side = THREE.DoubleSide }) 
    {
        super();

        this.portal = portal;

        // Create the portal plane
        this.geometry = new THREE.PlaneGeometry(this.portal.width, this.portal.height);
        this.material = new THREE.MeshBasicMaterial({ color, transparent : opacity !== 1 ? true: false, opacity, side });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.add(this.mesh);

        // Set position and orientation
        this.position.copy(this.portal.position);
      
        const lookAtTarget = this.portal.position.clone().add(this.portal.normal);
        this.lookAt(lookAtTarget);

        // Normal visualization
        this.normalHelper = new THREE.ArrowHelper(this.portal.plane.normal, new THREE.Vector3(0, 0, 0), 1, 0xff0000);
        
        this.add(this.normalHelper);

        this.update();
    }

    update()
    {
        // Set position and orientation
        this.position.copy(this.portal.position);
      
        const lookAtTarget = this.portal.position.clone().add(this.portal.normal);
        this.lookAt(lookAtTarget);

        this.normalHelper.setDirection(this.portal.plane.normal);
    }

    // toggleNormal() 
    // {
    //     this.normalHelper.visible = !this.normalHelper.visible;
    // }
}

export { PortalHelper };
