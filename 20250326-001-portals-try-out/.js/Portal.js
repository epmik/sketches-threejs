import * as THREE from 'three';

class Portal extends THREE.Object3D 
{
    constructor({ width = 1, height = 1, position = new THREE.Vector3(), normal = new THREE.Vector3(0, 0, 1), color = 0xffffff, opacity = 0.5, side = THREE.FrontSide }) 
    {
        super();

        this.width = width;
        this.height = height;
        this.normal = new THREE.Vector3(0, 0, 1);

        this.position.copy(position);
        this.normal.copy(normal);

        // Create the portal plane
        this.geometry = new THREE.PlaneGeometry(width, height);
        this.material = new THREE.MeshBasicMaterial({ color, transparent : opacity !== 1 ? true: false, opacity, side });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.add(this.mesh);

        const lookAtTarget = position.clone().add(normal);
        this.lookAt(lookAtTarget);

        // Create the plane for portal calculations
        this.plane = new THREE.Plane();

        // Normal visualization
        this.normalHelper = new THREE.ArrowHelper(this.normal.clone().normalize(), this.position, 1, 0xff0000); // Red arrow for normal
        this.add(this.normalHelper);

        // Add a grid helper to visualize the plane
        this.planeHelper = new THREE.PlaneHelper(this.plane, 1, 0x00ff00); // Green for the plane
        this.add(this.planeHelper);

        this.update();
    }

    update()
    {
        // Update the plane based on the current position and normal
        this.plane.setFromNormalAndCoplanarPoint(this.normal.clone().normalize(), this.position);

        // Update the normal helper's direction and position
        this.normalHelper.position.copy(this.position);
        this.normalHelper.setDirection(this.normal.clone().normalize());

        // Update the plane helper to match the plane
        this.planeHelper.plane = this.plane;

        const lookAtTarget = this.position.clone().add(this.normal);
        this.lookAt(lookAtTarget);
    }

    toggleNormal() {
        this.normalHelper.visible = !this.normalHelper.visible;
        this.planeHelper.visible = !this.planeHelper.visible;
    }
}

export { Portal };

class Portal2 extends THREE.Object3D 
{
    constructor({ width = 1, height = 1, position = new THREE.Vector3(), normal = new THREE.Vector3(0, 0, 1), color = 0xffffff, opacity = 0.5, side = THREE.DoubleSide }) 
    {
        super();

        this.width = width;
        this.height = height;
        this.normal = new THREE.Vector3(0, 0, 1);

        this.position.copy(position);
        this.normal.copy(normal);

        // Create the portal plane
        this.geometry = new THREE.PlaneGeometry(width, height);
        this.material = new THREE.MeshBasicMaterial({ color, transparent : opacity !== 1 ? true: false, opacity, side });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.add(this.mesh);

      
        const lookAtTarget = position.clone().add(normal);
        this.lookAt(lookAtTarget);

        // Create the plane for portal calculations
        this.plane = new THREE.Plane();

        // Normal visualization
        this.normalHelper = new THREE.ArrowHelper(this.plane.normal, new THREE.Vector3(0, 0, 0), 1, 0xff0000);
        this.add(this.normalHelper);

        this.update();
    }

    update()
    {
        this.plane.setFromNormalAndCoplanarPoint(this.normal, this.position);

        const lookAtTarget = this.position.clone().add(this.normal);
        this.lookAt(lookAtTarget);

        this.normalHelper.setDirection(this.plane.normal);
    }

    toggleNormal() {
        this.normalHelper.visible = !this.normalHelper.visible;
    }
}

export { Portal2 };
    

