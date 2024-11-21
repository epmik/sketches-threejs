import * as THREE from 'three';

class TriangleGeometry extends THREE.BufferGeometry {

	constructor( width = 1, height = 1) 
	{
		super();

		this.type = 'TriangleGeometry';

		this.parameters = {
			width: width,
			height: height,
		};

		const scope = this;

		const hWidth = width / 2;
		const hHeigh = height / 2;
		
		// buffers

		const indices = [];
		const vertices = [];
		const normals = [];
		const colors = [];
		const uvs = [];

		vertices.push(-hWidth, hHeigh, 0 );
		normals.push( 0, 0, 1 );
		colors.push( 0, 0, 0 );
		uvs.push( 0, 0, 0 );

		vertices.push(-hWidth, -hHeigh, 0 );
		normals.push( 0, 0, 1 );
		colors.push( 0, 0, 0 );
		uvs.push( 1, 0, 0 );

		vertices.push( hWidth, hHeigh, 0 );
		normals.push( 0, 0, 1 );
		colors.push( 0, 0, 0 );
		uvs.push( 1, 1, 0 );

		vertices.push( hWidth, -hHeigh, 0 );
		normals.push( 0, 0, 1 );
		colors.push( 0, 0, 0 );
		uvs.push( 0, 1, 0 );

		indices.push(0);
		indices.push(1);
		indices.push(2);

		indices.push(2);
		indices.push(1);
		indices.push(3);

		this.setIndex( indices );
		this.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
		this.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
		this.setAttribute('color', new THREE.Float32BufferAttribute(colors, 4));
		this.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
	}

	copy( source ) {

		super.copy( source );

		this.parameters = Object.assign( {}, source.parameters );

		return this;

	}

	static fromJSON( data ) {

		return new TriangleGeometry( data.width, data.height );

	}

}

export { TriangleGeometry };