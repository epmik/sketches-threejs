"use strict";

import { RandomGenerator } from '../js/RandomGenerator.js';
import { MathUtility } from '../js/MathUtility.js';
import { Color } from '../js/Color.js';

class LinearGradient
{
    constructor(min, max, seed) 
    {
        this._minTime = 0;
        this._maxTime = 0;
       
        this._entryArray = [];

        if (min === undefined)
        {
            min = 0;
        }
        else if (min instanceof LinearGradient)
        {
            this._minTime = min._minTime;
            this._maxTime = min._maxTime;

            for (var i = 0; i < min._entryArray.length; i++)
            {
                const e = min._entryArray[i];

                this._entryArray[i] = new LinearGradientEntry(e.Time, e.Color.R(), e.Color.G(), e.Color.B(), e.Color.A());
            }

            return;
        }

        if (max === undefined)
        {
            max = 1;
        }

        this.Insert(min, 1, 1, 1, 1);
        this.Insert(max, 0, 0, 0, 1);
    }

    Invert()
    {
        for (var i = 0; i < this._entryArray.length; i++)
        {
            this._entryArray[i].Time = this._maxTime - this._entryArray[i].Time;
        }
        this._entryArray.sort((i, j) => i.Time - j.Time);
    }
    
    Insert(time, r, g, b, a)
    {
        this._entryArray = this._entryArray.filter(e => e.Time != time);

        this._minTime = time < this._minTime ? time : this._minTime;
        this._maxTime = time > this._maxTime ? time : this._maxTime;

        this._entryArray.push(new LinearGradientEntry(time, r, g, b, a));

        this._entryArray.sort((i, j) => i.Time - j.Time);
    }
    
    Clear()
    {
        this._entryArray = [];
    }
    
    Entries()
    {
        return this._entryArray;
    }

    ColorAt(time)
    {
        time = MathUtility.Clamp(time, this._minTime, this._maxTime);

        let first = 0, last = 0; 
      
        for (const entry of this._entryArray) 
        {
            if (entry.Time >= time) 
            {
                break;
            }
            last++;
        }

        first = last - 1;

        if (first < 0) 
        {
            first = last;
        }

        var firstEntry = this._entryArray[first];
        var lastEntry = this._entryArray[last];

        var t = (lastEntry.Time - firstEntry.Time);

        t = t > 0 ? ((time - firstEntry.Time) / t) : 0;

        return Color.Interpolate(firstEntry.Color, lastEntry.Color, t);
    }
}

class LinearGradientEntry
{
    constructor(time, r, g, b, a)
    {
        if (a === undefined)
        {
            a = 1;
        }
        
        this.Time = time;   
        this.Color = new Color(r, g, b, a);
    }     

}

export { LinearGradient };