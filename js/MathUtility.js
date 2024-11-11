"use strict";

class MathUtility
{
  static DegreesToRadiansFactor = Math.PI / 180.0;

  static Clamp(value, min, max)
  {
    if (min === undefined && max === undefined)
    {
      min = 0;
      max = 1;
    }

    if (max === undefined)
    {
      max = min;
      min = 0;
    }

    return Math.max(min, Math.min(value, max));
  }

  static Rebase(value, inMin, inMax, outMin, outMax)
  {
    return outMin + (outMax - outMin) * ((value - inMin) / (inMax - inMin));
  }

  static ToRadians(degrees)
  {
    return degrees *  MathUtility.DegreesToRadiansFactor;
  }
}

export { MathUtility };