"use strict";

import { RandomGenerator } from '../js/RandomGenerator.js';

class LinearGradientBackground
{
    constructor(angle, seed) 
    {
        this.Angle = 0;
        this.Gradient = new LinearGradient(0, 1, seed);
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