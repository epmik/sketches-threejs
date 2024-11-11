"use strict";

class MathUtility
{
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
}

export { MathUtility };