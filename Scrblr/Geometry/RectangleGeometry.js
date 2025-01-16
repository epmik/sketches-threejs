import * as THREE from 'three';

class RectangleGeometry extends THREE.BufferGeometry {

	constructor( width = 1, height = 1, widthSegments = 1, heightSegments = 1 ) {

		super();

		this.type = 'RectangleGeometry';

		this.parameters = {
			width: width,
			height: height,
			widthSegments: widthSegments,
			heightSegments: heightSegments
		};

		const scope = this;

		// const vertices = new Float32Array( [
		// 	-1.0, -1.0,  1.0, // v0
		// 	 1.0, -1.0,  1.0, // v1
		// 	 1.0,  1.0,  1.0, // v2
		// 	-1.0,  1.0,  1.0, // v3
		// ] );
		
		// const indices = [
		// 	0, 1, 2,
		// 	2, 3, 0,
		// ];

		// const normals = new Float32Array( [
		// 	 0.0, 0.0,  1.0, // v0
		// 	 0.0, 0.0,  1.0, // v1
		// 	 0.0, 0.0,  1.0, // v2
		// 	 0.0, 0.0,  1.0, // v3
		// ]);
		
		// this.setIndex(indices);
		// this.setAttribute('position', new Float32BufferAttribute(vertices, 3));		
		// this.setAttribute('normal', new Float32BufferAttribute(normals, 3));

		
		
		widthSegments = Math.floor( widthSegments );
		heightSegments = Math.floor( heightSegments );

		const widthHalfSize = width / 2;
		const heightHalfSize = height / 2;
		const widthSegmentsSize = width / widthSegments;
		const heightSegmentsSize = height / heightSegments;
		
		// buffers

		const indices = [];
		const vertices = [];
		const normals = [];
		const uvs = [];

		// build geometry
		
		for (let i = 0; i <= heightSegments; i++) 
		{
			const y = ( i * heightSegmentsSize ) - heightHalfSize;

			for (let j = 0; j <= widthSegments; j++) 
			{
				const x = ( j * widthSegmentsSize ) - widthHalfSize;

				vertices.push( x, - y, 0 );
				normals.push( 0, 0, 1 );
			}
		}

		// generate indices (data for element array buffer)

		for (let i = 0; i < heightSegments; i++) 
		{
			for (let j = 0; j < widthSegments; j++) 
			{
				const a = i * ( heightSegments + 1 ) + ( j + 1 );
				const b = i * ( heightSegments + 1 ) + j;
				const c = ( i + 1 ) * ( heightSegments + 1 ) + j;
				const d = ( i + 1 ) * ( heightSegments + 1 ) + ( j + 1 );

				// generate two faces (triangles) per iteration

				indices.push( a, b, d ); // face one
				indices.push( b, c, d ); // face two

			}
		}

		this.setIndex( indices );
		this.setAttribute( 'position', new Float32BufferAttribute( vertices, 3 ) );
		this.setAttribute('normal', new Float32BufferAttribute(normals, 3));
		// this.setAttribute( 'uv', new Float32BufferAttribute( uvs, 2 ) );
	}

	copy( source ) {

		super.copy( source );

		this.parameters = Object.assign( {}, source.parameters );

		return this;

	}

	static fromJSON( data ) {

		return new RectangleGeometry( data.width, data.height, data.widthSegments, data.heightSegments );

	}

}

export { RectangleGeometry };