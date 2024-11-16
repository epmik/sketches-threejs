export { AllRedShader } from '../.shaders/AllRedShader.js';
export { NormalColorShader } from '../.shaders/NormalColorShader.js';
export { VariableColorShader } from '../.shaders/VariableColorShader.js';
export { SimplexNoise2dShader } from '../.shaders/SimplexNoise2dShader.js';
export { IncludeSimplexNoise2dShader } from '../.shaders/IncludeSimplexNoise2dShader.js';

import { ShaderChunk } from 'three';

import noise2D_glsl from '../.shaders/noise2D.glsl.js';
import noise3D_glsl from '../.shaders/noise3D.glsl.js';
import noise4D_glsl from '../.shaders/noise4D.glsl.js';

ShaderChunk['noise2D_glsl'] = noise2D_glsl;
ShaderChunk['noise3D_glsl'] = noise3D_glsl;
ShaderChunk['noise4D_glsl'] = noise4D_glsl;
