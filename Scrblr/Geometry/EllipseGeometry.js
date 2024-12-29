import { Vector2, Vector3, BufferGeometry, Float32BufferAttribute, MathUtils } from "three";

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

		this.options.segments = Math.max( 3, this.options.segments);

		// buffers

		const indices = [];
		const vertices = [];
		const normals = [];
		const uvs = [];

		// helper variables

		const vertex = new Vector3();
		const uv = new Vector2();

		const thetaStart = MathUtils.degToRad(this.options.startAngleInDegrees);
		const thetaLength = MathUtils.degToRad(this.options.stopAngleInDegrees);

		if (this.options.thickness === undefined)
		{
			const hWidth = this.options.width * 0.5;
			const hHeight = this.options.height * 0.5;
			const maxRadius = Math.max(hWidth, hHeight);
	
			// center point

			vertices.push( 0, 0, 0 );
			normals.push( 0, 0, 1 );
			uvs.push( 0.5, 0.5 );

			for (let s = 0, i = 3; s <= this.options.segments; s++, i += 3) 
			{
				const segment = thetaStart + s / this.options.segments * thetaLength;

				// vertex

				vertex.x = hWidth * Math.cos( segment );
				vertex.y = hHeight * Math.sin( segment );

				vertices.push( vertex.x, vertex.y, vertex.z );

				// normal

				normals.push( 0, 0, 1 );

				// uvs

				uv.x = ( vertices[ i ] / maxRadius + 1 ) / 2;
				uv.y = ( vertices[ i + 1 ] / maxRadius + 1 ) / 2;

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
			const hOuterWidth = this.options.width * 0.5;
			const hOuterHeight = this.options.height * 0.5;
			const hInnerWidth = (this.options.width - this.options.thickness) * 0.5;
			const hInnerHeight = (this.options.height - this.options.thickness) * 0.5;
			const maxOuterRadius = Math.max(hOuterWidth, hOuterHeight);
			const maxInnerRadius = Math.max(hInnerWidth, hInnerHeight);

			for (let s = 0, i = 3; s <= this.options.segments; s++, i += 3) 
			{
				const segment = thetaStart + s / this.options.segments * (thetaLength - thetaStart);

				// inner vertex

				vertex.x = hInnerWidth * Math.cos( segment );
				vertex.y = hInnerHeight * Math.sin( segment );

				vertices.push( vertex.x, vertex.y, vertex.z );

				// inner normal

				normals.push( 0, 0, 1 );

				// inner uv

				uv.x = ( vertices[ i ] / maxInnerRadius + 1 ) / 2;
				uv.y = ( vertices[ i + 1 ] / maxInnerRadius + 1 ) / 2;

				uvs.push( uv.x, uv.y );

				// outer vertex

				vertex.x = hOuterWidth * Math.cos( segment );
				vertex.y = hOuterHeight * Math.sin( segment );

				vertices.push( vertex.x, vertex.y, vertex.z );

				// outer normal

				normals.push( 0, 0, 1 );

				// outer uv

				uv.x = ( vertices[ i ] / maxOuterRadius + 1 ) / 2;
				uv.y = ( vertices[ i + 1 ] / maxOuterRadius + 1 ) / 2;

				uvs.push( uv.x, uv.y );
			}

			for (let i = 0; i <= this.options.segments * 2 - 2; i += 2)
			{
				indices.push(i, i + 1, i + 3);
				indices.push(i, i + 2, i + 3);
			}	
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