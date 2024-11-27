export default /* glsl */`

//
// Description : Array and textureless GLSL 2D simplex noise function.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : stegu
//     Lastmod : 20110822 (ijm)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise
//               https://github.com/stegu/webgl-noise
//


float permute(float x) {
     return mod289(((x*34.0)+10.0)*x);
}

vec3 permute(vec3 x) {
  return mod289(((x*34.0)+10.0)*x);
}

vec4 permute(vec4 x) {
     return mod289(((x*34.0)+10.0)*x);
}
`;
