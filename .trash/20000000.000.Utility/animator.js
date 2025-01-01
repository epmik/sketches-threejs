import * as THREE from 'three';

class Animator
{
    _currentAnimation = null;
    _previousAnimation = null;
    _mesh = null;
    _mixer = null;
    _animations = {};
    _defaultAnimationName = null;
    _fadeInTime = 0.25;
    _fadeOutTime = 0.25;
    
    constructor()
    {

    }

    init(mesh, animations)
    {
        this._mesh = mesh;

        this._mixer = new THREE.AnimationMixer(this._mesh);

        this._mixer._animator = this;

        for (let i = 0; i < animations.length; i++) 
        {
            var name = animations[i].name;

            this._animations[name] = {};
            this._animations[name]._name = name;
            this._animations[name]._clip = animations[i];

            this._animations[name]._action = this._mixer.clipAction(animations[i]);
            this._animations[name]._action.loop = THREE.LoopOnce;        
            this._animations[name]._action.repetitions = 1;

            // this._animations[name]._loopEventListener = (e) => 
            // {
            //     console.log(e);
            // }

            // this._animations[name]._finishedEventListener = (e) => 
            // {
            //     // properties of e: type, action and direction
    
            //     var clip = e.action._clip;
    
            //     var name = clip.name;
    
            //     var mixer = e.action._mixer;
    
            //     var listeners = mixer._listeners;
    
            //     var animation = mixer._animator._animations[name];
    
            //     // console.log(e);
    
            //     console.log("removeEventListener");
            //     console.log(this._animations[name]._finishedEventListener);
    
            //     mixer.removeEventListener('finished', this._animations[name]._finishedEventListener);
                
            //     console.log(e);
            //     console.log(listeners);
    
            //     if (listeners.finished && listeners.finished.length === 0)
            //     {
            //         mixer._animator._currentAnimation = null;
            //     }
            // };
    

            // https://threejs.org/docs/index.html#api/en/animation/AnimationAction.clampWhenFinished
            // this._animations[name]._action.clampWhenFinished = false;

            // https://threejs.org/docs/index.html#api/en/animation/AnimationAction.loop
            // this._animations[name]._action.loop = THREE.LoopOnce;        
        }  
    }

    defaultAnimation(name)
    {
        this._defaultAnimationName = name;
    }

    settings(name, settings)
    {
        if (settings === null)
        {
            return;
        }

        var animation = this._animations[name];

        if (animation === null)
        {
            return;    
        }

        if (settings.repetitions !== null)
        {
            if (settings.repetitions === 1)    
            {
                animation._action.loop = THREE.LoopOnce;        
                animation._action.repetitions = 1;
            }
            else
            {
                animation._action.loop = THREE.LoopRepeat;        
                animation._action.repetitions = settings.repetitions == 0 || settings.repetitions == Infinity ? Infinity : settings.repetitions;
            }
        }

        if (settings.clamp === true)    
        {
            animation._action.clampWhenFinished = true;        
        }
        else
        {
            animation._action.clampWhenFinished = false;        
        }
    }

    update(delta)
    {
        if (!this._mixer)
        {
            return;
        }

        // if (!this._currentAnimation && this._defaultAnimationName)
        // {
        //     this.play(this._defaultAnimationName);
        // }

        this._mixer.update( delta );
    }

    play(name)
    {
        var animation = this._animations[name];

        if (!animation || (this._currentAnimation && this._currentAnimation === animation))
        {
            return;
        }

        // if (this._currentAnimation)
        // {
        // }

        // if (!this._currentAnimation._loopEventListener)
        // {
        //     console.log("add loop EventListener");

        //     this._currentAnimation._loopEventListener = (e) =>
        //     {
        //         // properties of e: type, action and loopDelta
    
        //         var clip = e.action._clip;
    
        //         var name = clip.name;
    
        //         var mixer = e.action._mixer;
    
        //         var listeners = mixer._listeners;
    
        //         var animation = mixer._animator._animations[name];
    
        //         // console.log(e);
    
        //         // console.log("remove loop EventListener");
        //         // console.log(this._animations[name]._finishedEventListener);
    
        //         // mixer.removeEventListener('loop', loopEventListener);
                
        //         console.log(e);

        //         // console.log(listeners);
    
        //         // if (listeners.finished && listeners.finished.length === 0)
        //         // {
        //         //     mixer._animator._currentAnimation = null;
        //         // }
        //     }  

        //     this._mixer.addEventListener('loop', this._currentAnimation._loopEventListener);
        // }

        // if (!this._currentAnimation._loopEventListener)
        // {
        //     console.log("add loop EventListener");
        //     // console.log(this._currentAnimation._finishedEventListener);
    
        //     const loopEventListener = (e) =>
        //     {
        //         // properties of e: type, action and direction

        //         var clip = e.action._clip;

        //         var name = clip.name;

        //         var mixer = e.action._mixer;

        //         var listeners = mixer._listeners;

        //         var animation = mixer._animator._animations[name];

        //          console.log(e);
        //         // console.log(listeners);

        //         // console.log("remove loop EventListener");

        //         // mixer.removeEventListener('loop', mixer._animator._animations[name]._loopEventListener);
        //         // mixer._animator._animations[name]._loopEventListener = null;
                
        //         // console.log("remove finished EventListener");

        //         // mixer.removeEventListener('finished', finishedEventListener);

        //         // mixer._animator._animations[name]._finishedEventListener = null;
                
        //         // console.log(listeners);

        //         // if (listeners.finished && listeners.finished.length === 0)
        //         // {
        //         //     mixer._animator._currentAnimation = null;
        //         // }
        //     }  

        //     this._mixer.addEventListener('loop', loopEventListener);
        //     this._currentAnimation._loopEventListener = loopEventListener;
        // }
        
        this._currentAnimation = animation;

        if (!this._currentAnimation._finishedEventListener)
        {
            console.log("add finished EventListener");
            // console.log(this._currentAnimation._finishedEventListener);
    
            const finishedEventListener = (e) =>
            {
                // properties of e: type, action and direction

                var clip = e.action._clip;

                var name = clip.name;

                var mixer = e.action._mixer;

                var listeners = mixer._listeners;

                var animation = mixer._animator._animations[name];

                console.log(e);
                console.log(listeners);

                // console.log("remove loop EventListener");

                // mixer.removeEventListener('loop', mixer._animator._animations[name]._loopEventListener);
                // mixer._animator._animations[name]._loopEventListener = null;
                
                console.log("remove finished EventListener");

                mixer.removeEventListener('finished', finishedEventListener);

                mixer._animator._animations[name]._finishedEventListener = null;
                
                console.log(listeners);

                if (listeners.finished && listeners.finished.length === 0)
                {
                    mixer._animator._currentAnimation = null;
                }
            }  

            this._mixer.addEventListener('finished', finishedEventListener);
            this._currentAnimation._finishedEventListener = finishedEventListener;
        }

        this._previousAnimation = this._currentAnimation;

        this._previousAnimation._action.fadeOut(this._fadeOutTime);

       
        this._currentAnimation._action
            .reset()
            .setEffectiveTimeScale( 1 )
            .setEffectiveWeight( 1 )
            .fadeIn(this._fadeInTime)
            .play();
    }
}

export { Animator };