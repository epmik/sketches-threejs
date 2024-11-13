"use strict";

import * as THREE from 'three';
import { RandomGenerator } from '/js/RandomGenerator.js';

class Graphics
{
    constructor(camera, renderer) 
    {
        this._camera = camera;
        this._renderer = renderer;
        
        this._triangleGeometryBufferElementTotal = 1024 * 256;
        this._triangleGeometryBufferElementCount = 0;
        this._triangleGeometryBuffer = undefined;
        this._triangleGeometryMaterial = undefined;
        this._triangleGeometryBufferMesh = undefined;

        this.scene = new THREE.Scene();
    }

    // Scene()
    // {
    //     return this._geometryScene;
    // }

    AddMesh(mesh)
    {
        this.scene.add(mesh);
    }

    Triangle(
        x0, y0, c0,
        x1, y1, c1,
        x2, y2, c2)
    {
        if (this._triangleGeometryBufferMesh === undefined)
        {
            this._triangleGeometryBuffer = new THREE.BufferGeometry();
            this._triangleGeometryBuffer.setAttribute('position', new THREE.Float32BufferAttribute( new Float32Array( this._triangleGeometryBufferElementTotal * 3 ), 3));
            this._triangleGeometryBuffer.setAttribute('color', new THREE.Float32BufferAttribute( new Float32Array( this._triangleGeometryBufferElementTotal * 4), 4));
            this._triangleGeometryBuffer.attributes.position.usage = THREE.DynamicDrawUsage;
            this._triangleGeometryBuffer.attributes.color.usage = THREE.DynamicDrawUsage;
    
            this._triangleGeometryMaterial = new THREE.MeshBasicMaterial({ wireframe: false, side: THREE.DoubleSide, vertexColors: true });
    
            this._triangleGeometryBufferMesh = new THREE.Mesh( this._triangleGeometryBuffer, this._triangleGeometryMaterial);

            this.scene.add(this._triangleGeometryBufferMesh);
        }

        this._triangleGeometryBuffer.attributes.position.needsUpdate = true;                        
        this._triangleGeometryBuffer.attributes.color.needsUpdate = true;

        const co0 = new THREE.Color(c0);

        this._triangleGeometryBuffer.attributes.position.setXYZ(this._triangleGeometryBufferElementCount, x0, y0, 0);                    
        this._triangleGeometryBuffer.attributes.color.setXYZW(this._triangleGeometryBufferElementCount, co0.r, co0.g, co0.b, 1);
        this._triangleGeometryBufferElementCount++;

        const co1 = new THREE.Color(c1);

        this._triangleGeometryBuffer.attributes.position.setXYZ(this._triangleGeometryBufferElementCount, x1, y1, 0);                    
        this._triangleGeometryBuffer.attributes.color.setXYZW(this._triangleGeometryBufferElementCount, co1.r, co1.g, co1.b, 1);
        this._triangleGeometryBufferElementCount++;

        const co2 = new THREE.Color(c2);

        this._triangleGeometryBuffer.attributes.position.setXYZ(this._triangleGeometryBufferElementCount, x2, y2, 0);                    
        this._triangleGeometryBuffer.attributes.color.setXYZW(this._triangleGeometryBufferElementCount, co2.r, co2.g, co2.b, 1);
        this._triangleGeometryBufferElementCount++;

        this._triangleGeometryBuffer.setDrawRange(0, this._triangleGeometryBufferElementCount);

        return this._triangleGeometryBufferElementCount;
    }

    Quad(
        x0, y0, c0,
        x1, y1, c1,
        x2, y2, c2,
        x3, y3, c3)
    {
        // triangle 1
        this.Triangle(
            x0, y0, c0,
            x1, y1, c1,
            x2, y2, c2);

        // triangle 2
        return this.Triangle(
            x1, y1, c1,
            x2, y2, c2,
            x3, y3, c3);
    }

    Line(
        x0, y0, c0, w0,
        x1, y1, c1, w1)
    {
        const wh0 = w0 * 0.5;
        const wh1 = w1 * 0.5;

        this.Circle(x0, y0, wh0, c0);
        this.Circle(x1, y1, wh1, c1);

        const p = this.PerpendicularVector2(new THREE.Vector2(x1 - x0, y1 - y0)).normalize();

        return this.Quad(
            x0 + p.x * wh0, y0 + p.y * wh0, c0, 
            x0 - p.x * wh0, y0 - p.y * wh0, c0, 
            x1 + p.x * wh1, y1 + p.y * wh1, c1, 
            x1 - p.x * wh1, y1 - p.y * wh1, c1);
    }

    Circle(x, y, radius, color, segments)
    {
        if(radius === undefined)
        {
            radius = 1;
        }
        
        if(color === undefined)
        {
            color = 0x000000;
        }
        
        if(segments === undefined)
        {
            segments = this.CalculateCircleSegments(x, y, radius);
        }

        const step = 2 * Math.PI / segments;

        for(var i = 0, a = 0; i < segments; i++, a += step)
        {
            const s0x = x + (radius * Math.cos(a));
            const s0y = y + (radius * Math.sin(a));

            const s1x = x + (radius * Math.cos(a + step));
            const s1y = y + (radius * Math.sin(a + step));

            this.Triangle(x, y, color, s0x, s0y, color, s1x, s1y, color);
        }
    }

    CalculateCircleSegments(x, y, radius)
    {
        const p00 = this.TransformVectorToScreenSpace(new THREE.Vector3(x, y, 0));
        const p01 = this.TransformVectorToScreenSpace(new THREE.Vector3(x, y + radius, 0));

        const circumference = p01.sub(p00).length() * Math.PI;

        return Math.max(8, Math.ceil(circumference * 0.25));
    }

    PerpendicularVector2(vector)
    {
        return new THREE.Vector2(vector.y, -vector.x);
    }

    TransformVectorToScreenSpace(vector)
    {
        vector.project(this._camera);

        const r = this._renderer.domElement.getBoundingClientRect();

        let hw = r.width * 0.5;
        let hh = r.height * 0.5;

        return new THREE.Vector2((vector.x * hw) + hw, (vector.y * hh) + hh);
    }

    TransformObjectToScreenSpace(object)
    {
        return this.TransformVectorToScreenSpace(new THREE.Vector3().setFromMatrixPosition(object.matrixWorld), this._camera);
    }
}

export { Graphics };