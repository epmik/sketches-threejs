import { Vector2, Vector3, BufferGeometry, Float32BufferAttribute } from "three";

class EllipseGeometry extends BufferGeometry 
{
	static defaultOptions = 
	{
		width: 1.0,
		height: 1.0,
		segments: 32,
		startAngleInDegrees: 0.0,
		stopAngleInDegrees: 360.0,
		thickness: undefined,
	};	
	
	

	constructor( options ) {

		super();

		this.type = 'EllipseGeometry';

		this.options = Object.assign({}, EllipseGeometry.defaultOptions);
		Object.assign(this.options, options);

		this.options = Math.max( 3, this.options );

		// buffers

		const indices = [];
		const vertices = [];
		const normals = [];
		const uvs = [];

		// helper variables

		const vertex = new Vector3();
		const uv = new Vector2();

		if (this.options.thickness == undefined)
		{
			// center point

			vertices.push( 0, 0, 0 );
			normals.push( 0, 0, 1 );
			uvs.push( 0.5, 0.5 );

			for ( let s = 0, i = 3; s <= this.options.segments; s ++, i += 3 ) {

				const segment = s / this.options.segments * Math.PI * 2;

				// vertex

				vertex.x = this.options.width * Math.cos( segment );
				vertex.y = this.options.height * Math.sin( segment );

				vertices.push( vertex.x, vertex.y, vertex.z );

				// normal

				normals.push( 0, 0, 1 );

				// uvs

				uv.x = ( vertices[ i ] / this.options.width + 1 ) / 2;
				uv.y = ( vertices[ i + 1 ] / this.options.height + 1 ) / 2;

				uvs.push( uv.x, uv.y );
			}

			// indices

			for (let i = 1; i <= this.options.segments; i++) 
			{
				indices.push( i, i + 1, 0 );
			}
		}
		else
		{
			
		}

		// build geometry

		this.setIndex( indices );
		this.setAttribute( 'position', new Float32BufferAttribute( vertices, 3 ) );
		this.setAttribute( 'normal', new Float32BufferAttribute( normals, 3 ) );
		this.setAttribute( 'uv', new Float32BufferAttribute( uvs, 2 ) );

	}

	copy( source ) {

		super.copy( source );

		this.parameters = Object.assign( {}, source.parameters );

		return this;

	}

	static fromJSON( data ) {

		return new EllipseGeometry( data.width, data.height, data.segments );

	}

}


export { EllipseGeometry };