// import { Vector3, Color } from 'three';

"use strict";

class RandomGenerator {
    _seed;
    _randomFunction;
    inclusiveMax = false; // Determines if 'max' is inclusive

    static SeedRoot = Date.now();

    constructor(seed) {
        this.ReSeed(seed);
    }

    _splitmix32(a) {
        return function () {
            a |= 0;
            a = (a + 0x9e3779b9) | 0;
            let t = a ^ (a >>> 16);
            t = Math.imul(t, 0x21f0aaad);
            t ^= t >>> 15;
            t = Math.imul(t, 0x735a2d97);
            return ((t ^= t >>> 15) >>> 0) / 4294967296;
        };
    }

    Seed() {
        return this._seed;
    }

    ReSeed(seed) {
        if (seed == null) { // Handles both null and undefined
            seed = RandomGenerator.SeedRoot++;
        }
        this._seed = seed;
        this._randomFunction = this._splitmix32(this._seed);
        return this._seed;
    }

    Single(min = 0, max = 1) {
        let rangeAdjust = this.inclusiveMax ? Number.EPSILON : 0;
        return min + this._randomFunction() * (max - min + rangeAdjust);
    }

    Double(min = 0, max = 1) {
        let rangeAdjust = this.inclusiveMax ? Number.EPSILON : 0;
        return min + this._randomFunction() * (max - min + rangeAdjust);
    }

    Int(min = 0, max = Number.MAX_SAFE_INTEGER) {
        let rangeAdjust = this.inclusiveMax ? 1 : 0;
        return Math.floor(min + this._randomFunction() * (max - min + rangeAdjust));
    }

    Bool() {
        return this._randomFunction() < 0.5;
    }

    // Color({ minHue = 0, maxHue = 1, minSaturation = 0, maxSaturation = 1, minLightness = 0, maxLightness = 1 } = {}) {
    //     const hue = this.Single(minHue, maxHue);
    //     const saturation = this.Single(minSaturation, maxSaturation);
    //     const lightness = this.Single(minLightness, maxLightness);
        
    //     const color = new Color();
    //     color.setHSL(hue, saturation, lightness);
    //     return color;
    // }    

    // UnitVector(randomizeX = true, randomizeY = true, randomizeZ = true) 
    // {
    //     // https://mathworld.wolfram.com/SpherePointPicking.html

    //     const theta = this.Single() * Math.PI * 2;
    //     const u = this.Single() * 2 - 1;
    //     const c = Math.sqrt( 1 - u * u );

    //     let v = new Vector3(c * Math.cos(theta), u, c * Math.sin(theta));

    //     if (!randomizeX) v.x = 0;
    //     if (!randomizeY) v.y = 0;
    //     if (!randomizeZ) v.z = 0;
        
    //     return v.normalize();
    // }    
}

export { RandomGenerator };
