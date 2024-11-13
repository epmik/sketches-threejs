"use strict";

import { MathUtility } from '../js/MathUtility.js';

class Color
{
  static ByteToDoubleFactor = 1.0 / 255.0;
  static DegreesToDoubleFactor = 1.0 / 360.0;
  static PercentageToDoubleFactor = 1.0 / 100.0;
  
  // private static IRandomGenerator RandomGenerator = new RandomGenerator();
  // private static ColorPicker DefaultColorPicker = new ColorPicker();


  constructor(r, g, b, a) 
  {
    this._r = 1;
    this._g = 1;
    this._b = 1;
    this._a = 1;
    this._hue = 0;
    this._saturation = 0;
    this._brightness = 0;

    this.Rgb(r, g, b, a);
  }

//   public static int RInt(color)
//   {
//     return color >> 16 & 0xff;
//   }

//   public static int GInt(color)
//   {
//     return color >> 8 & 0xff;
//   }

//   public static int BInt(color)
//   {
//     return color & 0xff;
//   }

//   public static int AInt(color)
//   {
//     return color >> 24 & 0xff;
//   }

  static FromInt(color) 
  {
    return FromRgb(color >> 16 & 0xff, color >> 8 & 0xff, color & 0xff, color >> 24 & 0xff);
  }

//   static FromRgb(int r, int g, int b) 
//   {
//     return FromRgb(r, g, b, 255);
//   }

//   public static Color FromRgb(int r, int g, int b, int a) 
//   {
//     return FromRgb((float)(r * ByteToDoubleFactor), (float)(g * ByteToDoubleFactor), (float)(b * ByteToDoubleFactor), (float)(a * ByteToDoubleFactor));
//   }


  static FromRgb(r, g, b, a) 
  {
    return new Color(r, g, b, a);
  }
  
  /**
   * @param     h   the hue component of the color, between 0 and 1f
   * @param     s   the saturation component of the color, between 0 and 1f
   * @param     b   the brightness component of the color, between 0 and 1f
   * @param     a   the alpha component of the color, between 0f and 1f
   * @return    a Color class object
   */
  static FromHsb(h, s, b, a) 
  {
    return new Color(0, 0, 0, 1).Hsb(h, s, b, a);
  }


  R(r)
  {
      if (r !== undefined)
      {
          this._r = MathUtility.Clamp(a);
      }

      this.CalculateHsb();

      return this._r;
  }

  G(g)
  {
      if (g !== undefined)
      {
          this._g = MathUtility.Clamp(a);
      }

      this.CalculateHsb();

      return this._g;
  }

  B(b)
  {
      if (b !== undefined)
      {
          this._b = MathUtility.Clamp(a);
      }

      this.CalculateHsb();

      return this._b;
  }

    A(a)
    {
        if (a !== undefined)
        {
            this._a = MathUtility.Clamp(a);
        }

        this.CalculateHsb();

        return this._a;
    }


//   public Color Rgb(int r, int g, int b)
//   {
//     return Rgb(r, g, b, 255); 
//   }

//   public Color Rgb(int r, int g, int b, int a)
//   {
//     return Rgb((float)(r * ByteToDoubleFactor), (float)(g * ByteToDoubleFactor), (float)(b * ByteToDoubleFactor), (float)(a * ByteToDoubleFactor));
//   }

//   public Color Rgb(float r, float g, float b)
//   {
//     return Rgb(r, g, b, 1f); 
//   }

  Hue(hue)
  {
    if (hue !== undefined)
    {
        this._hue = Color.Wrap(hue);
    }
      
      this.CalculateRgb();
      
    return _hue;
  }

  HueInt()
  {
    return _hue * 360;
  }

  Saturation(saturation)
  {
    if (saturation !== undefined)
    {
        this._saturation = MathUtility.Clamp(saturation);
    }
        
    this.CalculateRgb();

    return _saturation;
  }

  SaturationInt()
  {
    return _saturation * 100;
  }

  Brightness(brightness)
  {
    if (brightness !== undefined)
        {
            this._brightness = MathUtility.Clamp(brightness);
        }
            
        this.CalculateRgb();

      return _brightness;
  }

  BrightnessInt()
  {
    return _brightness * 100;
  }

//   public Color Saturation(float s)
//   {
//     _saturation = Utility.Math.Clamp(s);
//     return CalculateRgb();
//   }

//   public Color Brightness(float b)
//   {
//     _brightness = Utility.Math.Clamp(b);
//     return CalculateRgb();
//   }

//   public Color Hsb(float h, float s, float b)
//   {
//     return Hsb(h, s, b, 1f);
//   }

Rgb(r, g, b, a)
{
  if(r === undefined)
  {
      r = 0;
  }
  if(g === undefined)
  {
      g = 0;
  }
  if(b === undefined)
  {
      b = 0;
  }
  if(a === undefined)
  {
      a = 1;
  }

  this._r = MathUtility.Clamp(r);
  this._g = MathUtility.Clamp(g);
  this._b = MathUtility.Clamp(b);
  this._a = MathUtility.Clamp(a);
    
  return this.CalculateHsb(); 
}

  Hsb(h, s, b, a)
  {
    if(a === undefined)
    {
        a = 1;
    }

    this._hue = Color.Wrap(h);
    this._saturation = MathUtility.Clamp(s);
    this._brightness = MathUtility.Clamp(b);
    this._a = MathUtility.Clamp(a);
      
    return this.CalculateRgb();
  }
  
  ToInt()
  {
    return (this.AInt() << 24 | this.RInt() << 16 | this.GInt() << 8 | this.BInt());
  }

  RInt()
  {
    return Math.floor(this._r * 255);
  }

  GInt()
  {
    return Math.floor(this._g * 255);
  }

  BInt()
  {
    return Math.floor(this._b * 255);
  }

  AInt()
  {
    return Math.floor(this._a * 255);
  }

  static Interpolate(c1, c2, time) 
  {
    time = MathUtility.Clamp(time);

    return new Color(
      (c1._r + (c2._r - c1._r) * time),
      (c1._g + (c2._g - c1._b) * time),
      (c1._b + (c2._b - c1._b) * time),
      (c1._a + (c2._a - c1._a) * time));
  } 
 
  CalculateHsb() 
  {
    // copied from
    // https://hg.openjdk.org/jdk8/jdk8/jdk/file/687fd7c7986d/src/share/classes/java/awt/Color.java#l907

    let r = this.RInt(), g = this.GInt(), b = this.BInt();

    let cmax = (r > g) ? r : g;
    if (b > cmax)
      cmax = b;
    let cmin = (r < g) ? r : g;
    if (b < cmin)
      cmin = b;

    this._brightness = cmax / 255.0;
    if (cmax != 0)
        this._saturation = (cmax - cmin) / cmax;
    else
    this._saturation = 0;
    if (this._saturation == 0)
        this._hue = 0;
    else {
        let redc = ((cmax - r)) / ((cmax - cmin));
        let greenc = ((cmax - g)) / ((cmax - cmin));
        let bluec = ((cmax - b)) / ((cmax - cmin));
      if (r == cmax)
        this._hue = (bluec - greenc);
      else if (g == cmax)
        this._hue = (2.0 + redc - bluec);
      else
      this._hue = (4.0 + greenc - redc);
      this._hue = this._hue / 6.0;
      if (this._hue < 0)
        this._hue = this._hue + 1.0;
    }
    return this;
  }
 
  CalculateRgb() 
  {
    // copied from
    // https://hg.openjdk.org/jdk8/jdk8/jdk/file/687fd7c7986d/src/share/classes/java/awt/Color.java#l839

    let r = 0, g = 0, b = 0;
    
    if (this._saturation == 0) 
    {
      r = g = b = (int) (this._brightness * 255.0 + 0.5);
    } 
    else 
    {
        let h = (this._hue - Math.floor(this._hue)) * 6.0;
        let f = h - Math.floor(h);
        let p = this._brightness * (1.0 - this._saturation);
        let q = this._brightness * (1.0 - this._saturation * f);
        let t = this._brightness * (1.0 - (this._saturation * (1.0 - f)));
        switch (Math.floor(h))
        {
        case 0:
          r = Math.floor(this._brightness * 255.0 + 0.5);
          g = Math.floor(t * 255.0 + 0.5);
          b = Math.floor(p * 255.0 + 0.5);
          break;
        case 1:
          r = Math.floor(q * 255.0 + 0.5);
          g = Math.floor(this._brightness * 255.0 + 0.5);
          b = Math.floor(p * 255.0 + 0.5);
          break;
        case 2:
          r = Math.floor(p * 255.0 + 0.5);
          g = Math.floor(this._brightness * 255.0 + 0.5);
          b = Math.floor(t * 255.0 + 0.5);
          break;
        case 3:
          r = Math.floor(p * 255.0 + 0.5);
          g = Math.floor(q * 255.0 + 0.5);
          b = Math.floor(this._brightness * 255.0 + 0.5);
          break;
        case 4:
          r = Math.floor(t * 255.0 + 0.5);
          g = Math.floor(p * 255.0 + 0.5);
          b = Math.floor(this._brightness * 255.0 + 0.5);
          break;
        case 5:
          r = Math.floor(this._brightness * 255.0 + 0.5);
          g = Math.floor(p * 255.0 + 0.5);
          b = Math.floor(q * 255.0 + 0.5);
          break;
      }
    }

    this._r = MathUtility.Clamp(r * Color.ByteToDoubleFactor);
    this._g = MathUtility.Clamp(g * Color.ByteToDoubleFactor);
    this._b = MathUtility.Clamp(b * Color.ByteToDoubleFactor);
    
    return this;
  }
 
  static Wrap(v)
  {
    if (v < 0) {
      return Color.Wrap(v + 1);
    }
    if (v > 1) {
      return Color.Wrap(v - 1);
    }
    return v;
  }
  













  

  // public static double Red(int color) 
  // {
  //   return (color >> 16 & 0xff) / 255.0;
  // }

  // public static double Green(int color) 
  // {
  //   return (color >> 8 & 0xff) / 255.0;
  // }

  // public static double Blue(int color) 
  // {
  //   return (color & 0xff) / 255.0;
  // }
 
  // public static double Hue(int color) 
  // {
  //   var hsb = IntToHsb(color);

  //   return hsb[0];
  // }
  
  // public static double Saturation(int color) 
  // {
  //   var hsb = IntToHsb(color);

  //   return hsb[1];
  // }
  
  // public static double Brightness(int color) 
  // {
  //   var hsb = IntToHsb(color);

  //   return hsb[2];
  // }
  
  // public static double Alpha(int color) 
  // {
  //   return (color >> 24 & 0xff) / 255.0;
  // }
  
  // public static double[] IntToHsb(int color) 
  // {
  //   return RgbToHsb(IntToRgb(color));
  // }
  
    // /**
    //  * Converts the components of a color, as specified by the HSB
    //  * model, to an equivalent set of values for the default RGB model.
    //  * <p>
    //  * The <code>saturation</code> and <code>brightness</code> components
    //  * should be floating-point values between zero and one
    //  * (numbers in the range 0.0-1.0).  The <code>hue</code> component
    //  * can be any floating-point number.  The floor of this number is
    //  * subtracted from it to create a fraction between 0 and 1.  This
    //  * fractional number is then multiplied by 360 to produce the hue
    //  * angle in the HSB color model.
    //  * <p>
    //  * The integer that is returned by <code>HSBtoRGB</code> encodes the
    //  * value of a color in bits 0-23 of an integer value that is the same
    //  * format used by the method {@link #getRGB() getRGB}.
    //  * This integer can be supplied as an argument to the
    //  * <code>Color</code> constructor that takes a single integer argument.
    //  * @param     hue   the hue component of the color
    //  * @param     saturation   the saturation of the color
    //  * @param     brightness   the brightness of the color
    //  * @return    the RGB value of the color with the indicated hue,
    //  *                            saturation, and brightness.
    //  */
    // public static int HsbToInt(double hue, double saturation, double brightness) 
    // {
    //   return HsbToInt(hue, saturation, brightness, 1.0);
    // }

//     /**
//      * Converts the components of a color, as specified by the HSB
//      * model, to an equivalent set of values for the default RGB model.
//      * <p>
//      * The <code>saturation</code> and <code>brightness</code> components
//      * should be floating-point values between zero and one
//      * (numbers in the range 0.0-1.0).  The <code>hue</code> component
//      * can be any floating-point number.  The floor of this number is
//      * subtracted from it to create a fraction between 0 and 1.  This
//      * fractional number is then multiplied by 360 to produce the hue
//      * angle in the HSB color model.
//      * <p>
//      * The integer that is returned by <code>HSBtoRGB</code> encodes the
//      * value of a color in bits 0-23 of an integer value that is the same
//      * format used by the method {@link #getRGB() getRGB}.
//      * This integer can be supplied as an argument to the
//      * <code>Color</code> constructor that takes a single integer argument.
//      * @param     hue   the hue component of the color
//      * @param     saturation   the saturation of the color
//      * @param     brightness   the brightness of the color
//      * @param     alpha   the alpha value of the color
//      * @return    the RGB value of the color with the indicated hue,
//      *                            saturation, and brightness.
//      * @see       java.awt.Color#getRGB()
//      * @see       java.awt.Color#Color(int)
//      * @see       java.awt.image.ColorModel#getRGBdefault()
//      * @since     JDK1.0
//      */
//     public static int HsbToInt(double hue, double saturation, double brightness, double alpha) 
//     {
//       // mostly copied from
//       // http://hg.openjdk.java.net/jdk8/jdk8/jdk/file/687fd7c7986d/src/share/classes/java/awt/Color.java

//       int r = 0, g = 0, b = 0, a = (int) (alpha * 255);

//       if (saturation == 0) {
//         r = g = b = (int) (brightness * 255.0 + 0.5);
//       } else {
//         double h = (hue - java.lang.Math.floor(hue)) * 6.0;
//         double f = h - java.lang.Math.floor(h);
//         double p = brightness * (1.0f - saturation);
//         double q = brightness * (1.0f - saturation * f);
//         double t = brightness * (1.0f - (saturation * (1.0f - f)));
//         switch ((int) h) {
//           case 0:
//             r = (int) (brightness * 255.0f + 0.5f);
//             g = (int) (t * 255.0f + 0.5f);
//             b = (int) (p * 255.0f + 0.5f);
//             break;
//           case 1:
//             r = (int) (q * 255.0f + 0.5f);
//             g = (int) (brightness * 255.0f + 0.5f);
//             b = (int) (p * 255.0f + 0.5f);
//             break;
//           case 2:
//             r = (int) (p * 255.0f + 0.5f);
//             g = (int) (brightness * 255.0f + 0.5f);
//             b = (int) (t * 255.0f + 0.5f);
//             break;
//           case 3:
//             r = (int) (p * 255.0f + 0.5f);
//             g = (int) (q * 255.0f + 0.5f);
//             b = (int) (brightness * 255.0f + 0.5f);
//             break;
//           case 4:
//             r = (int) (t * 255.0f + 0.5f);
//             g = (int) (p * 255.0f + 0.5f);
//             b = (int) (brightness * 255.0f + 0.5f);
//             break;
//           case 5:
//             r = (int) (brightness * 255.0f + 0.5f);
//             g = (int) (p * 255.0f + 0.5f);
//             b = (int) (q * 255.0f + 0.5f);
//             break;
//         }
//       }
//       return RgbToInt(r, g, b, a);
//     }
    
//     public static double[] RgbToHsb(int [] rgba) 
//     {
//       return RgbToHsb(rgba[0], rgba[1], rgba[2], rgba[3]);
//     }
    
//     public static double[] RgbToHsb(float [] rgba) 
//     {
//       return RgbToHsb(rgba[0], rgba[1], rgba[2], rgba[3]);
//     }
    
//     public static double[] RgbToHsb(double [] rgba) 
//     {
//       return RgbToHsb(rgba[0], rgba[1], rgba[2], rgba[3]);
//     }
  
//     public static double[] RgbToHsb(int r, int g, int b)
//     {
//       return RgbToHsb(r, g, b, 255);
//     }

//     public static double[] RgbToHsb(float r, float g, float b)
//     {
//       return RgbToHsb(r, g, b, 1.0f);
//     }

//     public static double[] RgbToHsb(double r, double g, double b)
//     {
//       return RgbToHsb(r, g, b, 1.0);
//     }

//     public static double[] RgbToHsb(float r, float g, float b, float a)
//     {
//       return RgbToHsb((int) (r * 255.0f), (int) (g * 255.0f), (int) (b * 255.0f), (int) (a * 255.0f));
//     }

//     public static double[] RgbToHsb(double r, double g, double b, double a)
//     {
//       return RgbToHsb((int) (r * 255.0), (int) (g * 255.0), (int) (b * 255.0), (int) (a * 255.0));
//     }
  
//   public static double[] RgbToHsb(int r, int g, int b, int a) 
//   {
//     // mostly copied from
//     // http://hg.openjdk.java.net/jdk8/jdk8/jdk/file/687fd7c7986d/src/share/classes/java/awt/Color.java

//     double hue, saturation, brightness, alpha = (double) a / 255.0;
//     var hsbvals = new double[4];

//     int cmax = (r > g) ? r : g;
//     if (b > cmax)
//       cmax = b;
//     int cmin = (r < g) ? r : g;
//     if (b < cmin)
//       cmin = b;

//     brightness = ((double) cmax) / 255.0f;
//     if (cmax != 0)
//       saturation = ((double) (cmax - cmin)) / ((double) cmax);
//     else
//       saturation = 0;
//     if (saturation == 0)
//       hue = 0;
//     else {
//       double redc = ((double) (cmax - r)) / ((double) (cmax - cmin));
//       double greenc = ((double) (cmax - g)) / ((double) (cmax - cmin));
//       double bluec = ((double) (cmax - b)) / ((double) (cmax - cmin));
//       if (r == cmax)
//         hue = bluec - greenc;
//       else if (g == cmax)
//         hue = 2.0f + redc - bluec;
//       else
//         hue = 4.0f + greenc - redc;
//       hue = hue / 6.0f;
//       if (hue < 0)
//         hue = hue + 1.0f;
//     }
//     hsbvals[0] = hue;
//     hsbvals[1] = saturation;
//     hsbvals[2] = brightness;
//     hsbvals[3] = alpha;

//     return hsbvals;
//   }




  // public static double[] RgbaToDouble(int r, int g, int b, int a) 
  // {
  //   return RgbaToDouble(RgbToInt(r, g, b, a));
  // }

  // public static double[] RgbaToDouble(int color) 
  // {
  //   return new double[] {
  //     ByteToFloatFactor * (color >> 16 & 0xff),   // r
  //     ByteToFloatFactor * (color >> 8 & 0xff),    // g
  //     ByteToFloatFactor * (color & 0xff),         // b
  //     ByteToFloatFactor * (color >> 24 & 0xff),   // a
  //   };
  // }

  // public static int[] IntToRgba(int color) 
  // {
  //   return new int[] {
  //     (color >> 16 & 0xff),   // r
  //     (color >> 8 & 0xff),    // g
  //     (color & 0xff),         // b
  //     (color >> 24 & 0xff),   // a
  //   };
  // }

//   public static double[] IntToRgb(int color) 
//   {
//     return new double[] {
//       (color >> 16 & 0xff) * ByteToDoubleFactor,   // r
//       (color >> 8 & 0xff) * ByteToDoubleFactor,    // g
//       (color & 0xff) * ByteToDoubleFactor,         // b
//       (color >> 24 & 0xff) * ByteToDoubleFactor,   // a
//     };
//   }

//   public static int RgbToInt(int r, int g, int b, int a) 
//   {
//     return (int)(a << 24 | r << 16 | g << 8 | b);
//   }

//   public static int RgbToInt(float r, float g, float b, float a) 
//   {
//     return RgbToInt((int)(r * 255), (int)(g * 255), (int)(b * 255), (int)(a * 255));
//   }

//   public static int RgbToInt(double r, double g, double b, double a) 
//   {
//     return RgbToInt((int)(r * 255), (int)(g * 255), (int)(b * 255), (int)(a * 255));
//   }

//   public static int RgbToInt(int r, int g, int b) 
//   {
//     return RgbToInt(r, g, b, 255);
//   }

//   public static int RgbToInt(int grey) 
//   {
//     return RgbToInt(grey, grey, grey, 255);
//   }

//   public static int RgbToInt(float grey) 
//   {
//     return RgbToInt(grey, grey, grey, 1.0f);
//   }

//   public static int RgbToInt(double grey) 
//   {
//     return RgbToInt(grey, grey, grey, 1.0);
//   }

//   public static int RgbToInt(float r, float g, float b) 
//   {
//     return RgbToInt(r, g, b, 1.0F);
//   }

//   public static int RgbToInt(double r, double g, double b) 
//   {
//     return RgbToInt(r, g, b, 1.0);
//   }

//   public static double DegreesToDouble(int degrees) 
//   {
//     return (double)degrees * DegreesToDoubleFactor;
//   }

//   private static double Clamp(double value) 
//   {
//     if (value < 0.0) {
//       return 0.0;
//     }
//     if (value > 1.0) {
//       return 1.0;
//     }
//     return value;
//   }

//   public Color Brighter(float fraction) 
//   {
//     return Brighter(fraction, 1f);
//   }

//   public Color Brighter(float fraction, float max) 
//   {
//     return Brighter(fraction, 0f, 1f);
//   }

  Brighter(fraction, min, max) 
  {
      if (min === undefined && max === undefined)
      {
          min = 0;
          max = 1;
      }
      else if (max === undefined)
    {
        max = min;
        min = 0;
    }
        
    _brightness = MathUtility.Clamp(_brightness + fraction, min, max);
      
    return CalculateRgb();
  }
}

export { Color };