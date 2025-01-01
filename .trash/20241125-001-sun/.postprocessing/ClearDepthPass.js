
import { Pass } from 'three/addons/postprocessing/Pass.js';

class ClearDepthPass extends Pass 
{
    constructor() 
    {
        super();
    }

    render(renderer, writeBuffer, readBuffer /*, deltaTime, maskActive */) 
    {
		renderer.setRenderTarget( this.renderToScreen ? null : readBuffer );
        renderer.clearDepth();
	}
}

export { ClearDepthPass };