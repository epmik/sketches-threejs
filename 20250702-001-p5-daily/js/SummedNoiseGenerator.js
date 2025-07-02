"use strict";

import { OpenSimplexNoiseGenerator } from './OpenSimplexNoiseGenerator.js';

class SummedNoiseGenerator
{
    NoiseGenerator;
	_frequency = 1.0;
	_lacunarity = 2.0;
	_persistence = 0.5;
    _octaves = 4;
  
    constructor(seed)
    {
        this.NoiseGenerator = new OpenSimplexNoiseGenerator(seed);
    }
     
    Value(x, y, z, w)
    {
        if (y == undefined)
        {
            return this.Value1d(x);
        }
        else if (z == undefined)
        {
            return this.Value2d(x, y);
        }

        else if (w == undefined)
        {
            return this.Value2d(x, y, z);
        }

        return this.Value2d(x, y, z, w);
    }   
     
    Value1d(x)
    {
        return Value2d(x, x);
    }
     
    Value2d(x, y)
    {
		let value = 0.0;
		let amplitude = 1.0;
        let frequency = this._frequency;

		for (var c = 0; c < this._octaves; c++)
		{
			value += this.NoiseGenerator.Value(x * frequency, y * frequency) * amplitude;

			frequency *= this._lacunarity;
			amplitude *= this._persistence;
		}

        return value;
    }
    
    Value3d(x, y, z)
    {
		let value = 0.0;
		let amplitude = 1.0;
        let frequency = this._frequency;

		for (var c = 0; c < this._octaves; c++)
		{
			value += this.NoiseGenerator.Value(x * frequency, y * frequency, z * frequency) * amplitude;

			frequency *= this._lacunarity;
			amplitude *= this._persistence;
		}

        return value;
    }
    
    Value4d(x, y, z, w)
    {
		let value = 0.0;
		let amplitude = 1.0;
        let frequency = this._frequency;

		for (var c = 0; c < this._octaves; c++)
		{
			value += this.NoiseGenerator.Value(x * frequency, y * frequency, z * frequency, w * frequency) * amplitude;

			frequency *= this._lacunarity;
			amplitude *= this._persistence;
		}

        return value;
    }
}

export { SummedNoiseGenerator };