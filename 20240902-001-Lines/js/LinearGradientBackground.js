"use strict";

import { RandomGenerator } from '../js/RandomGenerator.js';

class LinearGradientBackground
{
    constructor(size, seed) 
    {
        this.Angle = 0;
        this.Gradient = new LinearGradient(0, size, seed);
    }
 
    ColorAt(time)
    {
        return Gradient.ColorAt(time);
    }

    Update(elapsed)
    {
        
    }

    Render(renderer)
    {
        
    }
}

export { LinearGradientBackground };