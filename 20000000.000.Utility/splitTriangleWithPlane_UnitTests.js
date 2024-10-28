const { splitTriangleWithPlane } = require('./splitTriangleWithPlane.mjs'); // Assuming the function is in a separate file

describe('splitTriangleWithPlane function', () =>
{
    const coPlanarTriangle = [
        { x: 0, y: 0, z: 0 },
        { x: 1, y: 0, z: 0 },
        { x: 0, y: 1, z: 0 }
    ];
    const coPlanarPlaneNormal = { x: 0, y: 0, z: 1 }; // z-axis
    const coPlanarPlanePoint = { x: 0, y: 0, z: 0 }; // origin
    
    test('Triangle is co-planar to the plane', () =>
    {
        const result = splitTriangleWithPlane(coPlanarTriangle, coPlanarPlaneNormal, coPlanarPlanePoint);
        expect(result.trianglesFront).toEqual([coPlanarTriangle]);
        expect(result.trianglesBack).toEqual([coPlanarTriangle]);
    });

    const inFrontTriangle = [
        { x: 0, y: 0, z: 0 },
        { x: 1, y: 0, z: 0 },
        { x: 0, y: 1, z: 0 }
    ];
    const inFrontPlaneNormal = { x: 0, y: 0, z: 1 }; // z-axis
    const inFrontPlanePoint = { x: 0, y: 0, z: -1 }; // origin
    
    test('Triangle is in front of the plane', () =>
    {
        const result = splitTriangleWithPlane(inFrontTriangle, inFrontPlaneNormal, inFrontPlanePoint);
        expect(result.trianglesFront).toEqual([inFrontTriangle]);
        expect(result.trianglesBack).toEqual([]);
    });

    const behindTriangle = [
        { x: 0, y: 0, z: 0 },
        { x: 1, y: 0, z: 0 },
        { x: 0, y: 1, z: 0 }
    ];
    const behindPlaneNormal = { x: 0, y: 0, z: 1 }; // z-axis
    const behindPlanePoint = { x: 0, y: 0, z: 1 }; // origin
    
    test('Triangle is behind the plane', () =>
    {
        const result = splitTriangleWithPlane(behindTriangle, behindPlaneNormal, behindPlanePoint);
        expect(result.trianglesFront).toEqual([]);
        expect(result.trianglesBack).toEqual([behindTriangle]);
    });

    const twoPointsOnTriangle = [
        { x: 0, y: 0, z: 0 },
        { x: 1, y: 0, z: 0 },
        { x: 0, y: 1, z: 0 }
    ];
    const twoPointsOnPlaneNormal = { x: 1, y: 0, z: 0 }; // z-axis
    const twoPointsOnPlanePoint = { x: 0, y: 0, z: 0 }; // origin
    
    test('Triangle touches with 2 points the plane and 1 point is in front', () =>
    {
        const result = splitTriangleWithPlane(twoPointsOnTriangle, twoPointsOnPlaneNormal, twoPointsOnPlanePoint);
        expect(result.trianglesFront).toEqual([twoPointsOnTriangle]);
        expect(result.trianglesBack).toEqual([]);
    });
});
