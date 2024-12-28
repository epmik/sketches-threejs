import * as THREE from 'three';

class QuadGeometry extends THREE.BufferGeometry 
{
	constructor() 
	{
		super();

		this.type = 'QuadGeometry';

		const vertices = [];
		const normals = [];
		const colors = [];
		const uvs = [];
		const indices = [];

		vertices.push(-0.5, 0.5, 0 );
		normals.push( 0, 0, 1 );
		colors.push( 1, 1, 1, 1 );
		// uvs.push( 0, 0, 0 );
		uvs.push( 0, 1 );

		vertices.push(-0.5, -0.5, 0 );
		normals.push( 0, 0, 1 );
		colors.push( 1, 1, 1, 1 );
		// uvs.push( 1, 0, 0 );
		uvs.push( 0, 0 );

		vertices.push( 0.5, 0.5, 0 );
		normals.push( 0, 0, 1 );
		colors.push( 1, 1, 1, 1 );
		// uvs.push( 1, 1, 0 );
		uvs.push( 1, 1 );

		vertices.push( 0.5, -0.5, 0 );
		normals.push( 0, 0, 1 );
		colors.push( 1, 1, 1, 1);
		// uvs.push( 0, 1, 0 );
		uvs.push( 1, 0 );

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

	vertex(index, x, y, z)
	{
		if (Array.isArray(x))
		{
			z = x[2];
			y = x[1];
			x = x[0];
		}

		const vertices = this.attributes.position.array;

		vertices[index * 3 + 0] = x;
		vertices[index * 3 + 1] = y;
		vertices[index * 3 + 2] = z;

		this.attributes.position.needsUpdate = true;
	}

	normal(index, x, y, z)
	{
		if (Array.isArray(x))
		{
			z = x[2];
			y = x[1];
			x = x[0];
		}

		const normals = this.attributes.normal.array;

		normals[index * 3 + 0] = x;
		normals[index * 3 + 1] = y;
		normals[index * 3 + 2] = z;

		this.attributes.normal.needsUpdate = true;
	}

	color(index, r, g, b, a = 1.0)
	{
		if (Array.isArray(r))
		{
			a = r.length > 3 ? r[3] : 1.0;
			b = r[2];
			g = r[1];
			r = r[0];
		}

		const colors = this.attributes.color.array;

		colors[index * 4 + 0] = r;
		colors[index * 4 + 1] = g;
		colors[index * 4 + 2] = b;
		colors[index * 4 + 3] = a;

		this.attributes.color.needsUpdate = true;
	}

	uv(index, x, y, z = 0.0)
	{
		if (Array.isArray(x))
		{
			z = x.length > 2 ? x[2] : 0.0;
			y = x[1];
			x = x[0];
		}

		const uvs = this.attributes.uv.array;

		uvs[index * 4 + 0] = x;
		uvs[index * 4 + 1] = y;
		// uvs[index * 4 + 2] = z;

		this.attributes.uv.needsUpdate = true;
	}

	copy( source ) {

		super.copy( source );

		return this;

	}

	static fromJSON(data) 
	{
		return JSON.parse(data);
	}

}

export { QuadGeometry };