"use strict";

import { RandomGenerator } from '../js/RandomGenerator.js';
import { buildPermutationTable, createNoise2D, createNoise3D, createNoise4D } from 'https://cdn.jsdelivr.net/npm/simplex-noise@4.0.3/+esm';

class OpenSimplexNoiseGenerator
{
    RandomGenerator;
    _seedFunction;
    _noise2dFunction;
    _noise3dFunction;
    _noise4dFunction;
  
    constructor(seed)
    {
        this._this = this;
        this.RandomGenerator = new RandomGenerator();
        this.ReSeed(seed);
    }
    
    Seed()  
    {
      return this.RandomGenerator.Seed();
    }

    ReSeed(seed)
    {
        const self = this;
        this.RandomGenerator.ReSeed(seed);
        this._seedFunction = function () { return self.RandomGenerator.Value(); }
        this._noise2dFunction = createNoise2D(this._seedFunction);
        this._noise3dFunction = createNoise3D(this._seedFunction);
        this._noise4dFunction = createNoise4D(this._seedFunction);

        return this.Seed();
    }
     
    Value(x, y, z, w)
    {
        if (y == undefined)
        {
            return this._noise2dFunction(x, x);    
        }

        if (z == undefined)
        {
            return this._noise2dFunction(x, y);    
        }

        if (w == undefined)
        {
            return this._noise3dFunction(x, y, z);    
        }
        
        return this._noise3dFunction(x, y, z, w);    
    }
}

export { OpenSimplexNoiseGenerator };