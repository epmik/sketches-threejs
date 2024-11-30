"use strict";

class RandomGenerator
{
    _seed;
    _randomFunction;

    // new Date().getTime();

    static SeedRoot = Date.now();
  
    constructor(seed)
    {
        this.ReSeed(seed);
    }

    _splitmix32(a) 
    {
        // https://stackoverflow.com/a/47593316/527843

        return function () 
        {
          a |= 0;
          a = a + 0x9e3779b9 | 0;
          let t = a ^ a >>> 16;
          t = Math.imul(t, 0x21f0aaad);
          t = t ^ t >>> 15;
          t = Math.imul(t, 0x735a2d97);
            
          return ((t = t ^ t >>> 15) >>> 0) / 4294967296;
         }
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
        this._randomFunction = this._splitmix32(this._seed);

        return this._seed;
    }
  
    Value(min, max)
    {
        return this.Double(min, max);
    }
    
    Single(min, max)
    {
        if (min === undefined && max == undefined)
        {
            min = 0;
            max = 1;
        }
        
        if (max == undefined)
        {
            max = min;
            min = 0;
        }

        return (min + this._randomFunction() * (max - min));
    }
     
    Double(min, max)
    {
        if (min === undefined && max == undefined)
        {
            min = 0;
            max = 1;
        }
        
        if (max == undefined)
        {
            max = min;
            min = 0;
        }

        return (min + this._randomFunction() * (max - min));
    }
     
    Int(min, max)
    {
        if (min === undefined && max == undefined)
        {
            min = 0;
            max = Number.MAX_SAFE_INTEGER;
        }
        
        if (max == undefined)
        {
            max = min;
            min = 0;
        }

        return Math.floor(min + this._randomFunction() * (max - min));
    }
    
    Bool()
    {
        return Int(0, 2) == 0;
    }
}

export { RandomGenerator };