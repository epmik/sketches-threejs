import * as LIL from 'three/addons/libs/lil-gui.module.min.js';
import { Vector2, Vector3, Vector4 } from "three";
import { Pass } from 'three/addons/postprocessing/Pass.js';

class Gui 
{
	g = null;

	static _ignoreList = new Set(['tDiffuse']);

	constructor(options) 
	{
		this.g = new LIL.GUI(options);

		// if (this instanceof Utility) 
		// {
		// 	throw Error('Utility class cannot be instantiated.');
	  	// }
	}

	AddFolder(element, name, openFolder)
	{
		// const self = this;

		const isPass = (element instanceof Pass);

		const uniforms = isPass ? element.uniforms : element;

		name = name === undefined ? (isPass ? 'Shader Pass' : 'Shader Material') : name;

		let folder = this.g.addFolder(name);

		for (const [key, value] of Object.entries(uniforms)) 
		{
			if (!uniforms.hasOwnProperty(key) || typeof uniforms[key] == 'function' || Gui._ignoreList.has(key) || uniforms[key].value === undefined)
			{
				continue;
			}

			if (uniforms[key].value instanceof Vector2)
			{
				folder.add(uniforms[key].value, 'x').name('x-' + key);	
				folder.add(uniforms[key].value, 'y').name('y-' + key);	
				
				continue;
			}

			if (uniforms[key].value instanceof Vector3)
			{
				folder.add(uniforms[key].value, 'x').name('x-' + key);	
				folder.add(uniforms[key].value, 'y').name('y-' + key);	
				folder.add(uniforms[key].value, 'z').name('z-' + key);	
				
				continue;
			}
	
			folder.add(uniforms[key], 'value').name(key);
		}		

		if(isPass)
		{
			folder.add(element, 'enabled').name('Enable/disable');
		}

		if(openFolder != true)
		{
			folder.close();
		}	

		return folder;
	}
}

export { Gui };
