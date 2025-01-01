// Define a function to split a triangle with a plane
export function splitBufferGeometryWithPlane(bufferGeometry, plane, fuzzy) // Tolerance for floating point comparisons)
{
    const FUZZY = 0.0001; // Tolerance for floating point comparisons

    if (fuzzy === undefined || fuzzy === null)
    {
        fuzzy = FUZZY;
    }

    var hasPosition = bufferGeometry.hasAttribute('position');
    var hasNormal = bufferGeometry.hasAttribute('normal');
    var hasColor = bufferGeometry.hasAttribute('color');
    var hasUv = bufferGeometry.hasAttribute('uv');

    var index = bufferGeometry.getIndex();

    if (index === null)
    {
        index = [];

        
    }

    mesh.geometry.faces.forEach(face =>
    { 
        face.a
    });

    geometry.faces.forEach(face =>
    { 

    });
}

// Define a function to split a triangle with a plane
export function splitTriangleWithPlane(triangle, planeNormal, planePoint)
{
    const EPSILON = 0.000001; // Tolerance for floating point comparisons

    // Define the vectors of the triangle
    const [v0, v1, v2] = triangle;

    // Calculate the signed distances from each vertex to the plane
    const d0 = (v0.x - planePoint.x) * planeNormal.x + (v0.y - planePoint.y) * planeNormal.y + (v0.z - planePoint.z) * planeNormal.z;
    const d1 = (v1.x - planePoint.x) * planeNormal.x + (v1.y - planePoint.y) * planeNormal.y + (v1.z - planePoint.z) * planeNormal.z;
    const d2 = (v2.x - planePoint.x) * planeNormal.x + (v2.y - planePoint.y) * planeNormal.y + (v2.z - planePoint.z) * planeNormal.z;

    // Determine which side of the plane each vertex lies on
    const side0 = Math.sign(d0);
    const side1 = Math.sign(d1);
    const side2 = Math.sign(d2);

    // Initialize arrays to store the triangles on each side of the plane
    let trianglesFront = [];
    let trianglesBack = [];

    // Check if the triangle lies on the plane
    if (Math.abs(side0) < EPSILON && Math.abs(side1) < EPSILON && Math.abs(side2) < EPSILON) {
        trianglesFront.push(triangle);
        trianglesBack.push(triangle);
        return { trianglesFront, trianglesBack };
    }

    // Check if the triangle is intersected by the plane
    if (side0 === 0 || side1 === 0 || side2 === 0 || 
        (side0 !== side1) || (side0 !== side2) || (side1 !== side2)) {
        // Calculate intersection points
        const intersectionPoints = [];
        if (side0 !== side1) intersectionPoints.push(intersectEdgeWithPlane(v0, v1, planeNormal, planePoint));
        if (side1 !== side2) intersectionPoints.push(intersectEdgeWithPlane(v1, v2, planeNormal, planePoint));
        if (side2 !== side0) intersectionPoints.push(intersectEdgeWithPlane(v2, v0, planeNormal, planePoint));

        // Create triangles from intersection points and vertices
        for (let i = 0; i < intersectionPoints.length; i++) {
            const intersectionPoint = intersectionPoints[i];
            const frontTriangle = [intersectionPoint, null, null];
            const backTriangle = [intersectionPoint, null, null];

            // Determine which vertex of the original triangle lies behind the plane
            if (side0 < 0) {
                backTriangle[1] = v0;
                frontTriangle[1] = intersectionPoint;
            } else {
                backTriangle[1] = intersectionPoint;
                frontTriangle[1] = v0;
            }

            if (side1 < 0) {
                backTriangle[2] = v1;
                frontTriangle[2] = intersectionPoint;
            } else {
                backTriangle[2] = intersectionPoint;
                frontTriangle[2] = v1;
            }

            if (side2 < 0) {
                backTriangle[2] = v2;
                frontTriangle[2] = intersectionPoint;
            } else {
                backTriangle[2] = intersectionPoint;
                frontTriangle[2] = v2;
            }

            // Add the triangles to the appropriate arrays
            trianglesFront.push(frontTriangle);
            trianglesBack.push(backTriangle);
        }
    } else {
        // Triangle lies completely on one side of the plane
        if (side0 > 0) {
            trianglesFront.push(triangle);
        } else {
            trianglesBack.push(triangle);
        }
    }

    return { trianglesFront, trianglesBack };
}

// Function to find intersection point of an edge with a plane
function intersectEdgeWithPlane(vertexA, vertexB, planeNormal, planePoint) {
    const t = ((planePoint.x - vertexA.x) * planeNormal.x + (planePoint.y - vertexA.y) * planeNormal.y + (planePoint.z - vertexA.z) * planeNormal.z) /
              ((vertexB.x - vertexA.x) * planeNormal.x + (vertexB.y - vertexA.y) * planeNormal.y + (vertexB.z - vertexA.z) * planeNormal.z);
    
    const intersectionPoint = {
        x: vertexA.x + t * (vertexB.x - vertexA.x),
        y: vertexA.y + t * (vertexB.y - vertexA.y),
        z: vertexA.z + t * (vertexB.z - vertexA.z)
    };

    return intersectionPoint;
}

// if (!module)
// {
//     module = {};    
// }

// module.exports = { splitTriangleWithPlane };
