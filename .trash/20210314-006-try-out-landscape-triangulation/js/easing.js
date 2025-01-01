const Easing = {

    // http://gizma.com/easing/
    // https://github.com/jesusgollonet/processing-penner-easing/blob/master/src/Linear.java
    // http://vitiy.info/easing-functions-for-your-animations/
    // https://joshondesign.com/2013/03/01/improvedEasingEquations
    // https://gist.github.com/gre/1650294

    // https://easings.net/ !!!!

    Linear: function(time) {
        return time;
    },
  
    // quadratic easing in - accelerating from zero velocity
    EaseInQuadratic: function(time) {
        return time * time;
    },		

    // quadratic easing out - decelerating to zero velocity
    EaseOutQuadratic: function(time) {
        return 1 - Easing.EaseInQuadratic(1-time);
    },        

    // quadratic easing in/out - acceleration until halfway, then deceleration
    EaseInOutQuadratic: function(time) {
        if(time < 0.5) 
        {
            return Easing.EaseInQuadratic(time*2.0)/2.0;
        }
        return 1-Easing.EaseInQuadratic((1-time)*2)/2;            
    },




    // cubic easing in - accelerating from zero velocity
    EaseInCubic: function(time) {
        return Math.pow(time, 3);
    },        

    // cubic easing out - decelerating to zero velocity
    EaseOutCubic: function(time) {
        return 1 - Easing.EaseInCubic(1-time);
    },

    // cubic easing in/out - acceleration until halfway, then deceleration
    EaseInOutCubic: function(time) {
        if(time < 0.5) 
        {
            return Easing.EaseInCubic(time*2.0)/2.0;
        }
        return 1-Easing.EaseInCubic((1-time)*2)/2;            
    },
    
    


    // quartic easing in - accelerating from zero velocity
    EaseInQuartic: function(time) {
        return Math.pow(time, 4);
    },

    // quartic easing out - decelerating to zero velocity
    EaseOutQuartic: function(time) {
        return 1 - Easing.EaseInQuartic(1-time);
    },		

    // quartic easing in/out - acceleration until halfway, then deceleration
    EaseInOutQuartic: function(time) {
        if(time < 0.5) 
        {
            return Easing.EaseInQuartic(time*2.0)/2.0;
        }
        return 1-Easing.EaseInQuartic((1-time)*2)/2;            
    },




    // quintic easing in - accelerating from zero velocity
    EaseInQuintic: function(time) {
        return Math.pow(time, 5);
    },        

    // quintic easing out - decelerating to zero velocity
    EaseOutQuintic: function(time) {
        return 1 - Easing.EaseInQuintic(1-time);
    },            

    // quintic easing in/out - acceleration until halfway, then deceleration
    EaseInOutQuintic: function(time) {
        if(time < 0.5) 
        {
            return Easing.EaseInQuintic(time*2.0)/2.0;
        }
        return 1-Easing.EaseInQuintic((1-time)*2)/2;            
    },
		



    EaseInExpo: function(time) {
        return time == 0 ? 0 : Math.pow(2, 10 * time - 10);
    },

    EaseOutExpo: function(time) {
        return 1 - Easing.EaseInExpo(1-time);
    },

    EaseInOutExpo: function(time) {
        if(time < 0.5) 
        {
            return Easing.EaseInExpo(time*2.0)/2.0;
        }
        return 1-Easing.EaseInExpo((1-time)*2)/2;            
    },



    // sinusoidal easing in - accelerating from zero velocity
    EaseInSine: function(time) {
        return -Math.cos(time/1 * (Math.PI/2)) + 1;
    },

    // sinusoidal easing out - decelerating to zero velocity
    EaseOutSine: function(time) {
        return Math.sin(time/1 * (Math.PI/2));
    },

    // sinusoidal easing out - decelerating to zero velocity
    EaseInOutSine: function(time) {
        return -(Math.cos(Math.PI * time) - 1) / 2;
    },




    EaseInCircular: function(time) {
        return 1 - Math.sqrt(1 - Math.pow(time, 2));
    },

    EaseOutCircular: function(time) {
        return 1 - Easing.EaseInCircular(1-time);
    },

    EaseInOutCircular: function(time) {
        if(time < 0.5) 
        {
            return Easing.EaseInCircular(time*2.0)/2.0;
        }
        return 1-Easing.EaseInCircular((1-time)*2)/2;            
    },




    EaseInBack: function(time) {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        
        return c3 * time * time * time - c1 * time * time;
    },

    EaseOutBack: function(time) {
        return 1 - Easing.EaseInBack(1-time);
    },

    EaseInOutBack: function(time) {
        if(time < 0.5) 
        {
            return Easing.EaseInBack(time*2.0)/2.0;
        }
        return 1-Easing.EaseInBack((1-time)*2)/2;            
    },




    EaseInElastic: function(time) {
        const c4 = (2 * Math.PI) / 3;

        return time == 0
            ? 0
            : time == 1
            ? 1
            : -Math.pow(2, 10 * time - 10) * Math.sin((time * 10 - 10.75) * c4);
    },

    EaseOutElastic: function(time) {
        return 1 - Easing.EaseInElastic(1-time);
    },

    EaseInOutElastic: function(time) {
        if(time < 0.5) 
        {
            return Easing.EaseInElastic(time*2.0)/2.0;
        }
        return 1-Easing.EaseInElastic((1-time)*2)/2;            
    },




    EaseInBounce: function(time) {
        return 1 - Easing.EaseOutBounce(1 - time);
    },

    EaseOutBounce: function(time) {
        const n1 = 7.5625;
        const d1 = 2.75;

        if (time < 1 / d1) {
            return n1 * time * time;
        } else if (time < 2 / d1) {
            return n1 * (time -= 1.5 / d1) * time + 0.75;
        } else if (time < 2.5 / d1) {
            return n1 * (time -= 2.25 / d1) * time + 0.9375;
        } else {
            return n1 * (time -= 2.625 / d1) * time + 0.984375;
        }
    },

    EaseInOutBounce: function(time) {
        return time < 0.5
            ? (1 - Easing.EaseOutBounce(1 - 2 * time)) / 2
            : (1 + Easing.EaseOutBounce(2 * time - 1)) / 2;   
    }
};

export { Easing };
