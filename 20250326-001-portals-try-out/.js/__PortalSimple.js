import * as THREE from 'three';

class PortalSimple 
{
    constructor({ width = 1, height = 1, position = new THREE.Vector3(), normal = new THREE.Vector3(0, 0, 1) }) 
    {
        this.width = width;
        this.height = height;
        this.position = new THREE.Vector3();
        this.normal = new THREE.Vector3(0, 0, 1);

        this.position.copy(position);
        this.normal.copy(normal);

        // Create the plane for portal calculations
        this.plane = new THREE.Plane();

        this.update();
    }

    update()
    {
        this.plane.setFromNormalAndCoplanarPoint(this.normal, this.position);
    }
}

export { PortalSimple };
