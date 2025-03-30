import * as THREE from 'three';

class CameraFrustumHelper extends THREE.Object3D
    {
      constructor(customFrustum)
      {
        super();
        this.customFrustum = customFrustum;

        // Create line segments for edges (yellow).
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffff00 });
        this.lineGeometry = new THREE.BufferGeometry();
        // 12 edges, each with 2 endpoints → 24 vertices, each with 3 components.
        this.edgePositions = new Float32Array(24 * 3);
        this.lineGeometry.setAttribute('position', new THREE.BufferAttribute(this.edgePositions, 3));
        this.edgeLines = new THREE.LineSegments(this.lineGeometry, lineMaterial);
        this.add(this.edgeLines);

        this.update();
      }

      update()
      {
        // Update the custom frustum.
        this.customFrustum.update();

        // Get the eight corner points.
        const pts = this.customFrustum.points;
        const fbl = pts.nearBottomLeft;
        const fbr = pts.nearBottomRight;
        const ftl = pts.nearTopLeft;
        const ftr = pts.nearTopRight;
        const bbl = pts.farBottomLeft;
        const bbr = pts.farBottomRight;
        const btl = pts.farTopLeft;
        const btr = pts.farTopRight;

        // Define edges as pairs of points.
        const edges = [
          // Front face
          fbl, fbr,
          fbr, ftr,
          ftr, ftl,
          ftl, fbl,
          // Back face
          bbl, bbr,
          bbr, btr,
          btr, btl,
          btl, bbl,
          // Connecting edges
          fbl, bbl,
          fbr, bbr,
          ftr, btr,
          ftl, btl
        ];

        // Update edge positions.
        for (let i = 0; i < edges.length; i++)
        {
          this.edgePositions[i * 3] = edges[i].x;
          this.edgePositions[i * 3 + 1] = edges[i].y;
          this.edgePositions[i * 3 + 2] = edges[i].z;
        }
        this.lineGeometry.attributes.position.needsUpdate = true;

        // Update corner cube positions.
        // const cornerPoints = [fbl, fbr, ftr, ftl, bbl, bbr, btr, btl];
        // for (let i = 0; i < 8; i++) {
        //   this.cornerCubes[i].position.copy(cornerPoints[i]);
        // }
      }
    }

export { CameraFrustumHelper };
