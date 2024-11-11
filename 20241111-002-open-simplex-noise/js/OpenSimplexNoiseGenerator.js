"use strict";

import { RandomGenerator } from '../js/RandomGenerator.js';
import { createNoise2D, createNoise3D, createNoise4D } from 'https://cdn.jsdelivr.net/npm/simplex-noise@4.0.3/+esm';

class OpenSimplexNoiseGenerator
{
    _seed;
    _seedFunction;
    _noise2dFunction;
    _noise3dFunction;
    _noise4dFunction;
  
    constructor(seed)
    {
        this.ReSeed(seed);
    }
    
    Seed()  
    {
      return this._seed;
    }

    ReSeed(seed)
    {
        if (seed === undefined)
        {
            seed = RandomGenerator.SeedRoot++;
        }

        this._seed = seed;
        this._seedFunction = function () { return seed; }
        this._noise2dFunction = createNoise2D(this._seedFunction);
        this._noise3dFunction = createNoise3D(this._seedFunction);
        this._noise4dFunction = createNoise4D(this._seedFunction);

        return this._seed;
    }
     
    Value(x, y, z, w)
    {
        return 0;
    }
}

export { OpenSimplexNoiseGenerator };