
import * as THREE from '/node_modules/three/build/three.module.js';

function main()
{
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

  const fov = 75;
  const aspect = window.innerWidth / window.innerHeight;
  const near = 0.1;
  const far = 5;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 2;

  const scene = new THREE.Scene();

  {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
  }

  const boxWidth = 1;
  const boxHeight = 1;
  const boxDepth = 1;
  const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

  function makeInstance(geometry, color, x) {
    const material = new THREE.MeshPhongMaterial({color});

    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    cube.position.x = x;

    return cube;
  }

  const cubes = [
    makeInstance(geometry, 0x44aa88,  0),
    makeInstance(geometry, 0x8844aa, -2),
    makeInstance(geometry, 0xaa8844,  2),
  ];

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const pixelRatio = window.devicePixelRatio;
    const width  = canvas.clientWidth  * pixelRatio | 0;
    const height = canvas.clientHeight * pixelRatio | 0;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function render(time) {
    time *= 0.001;

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    cubes.forEach((cube, ndx) => {
      const speed = 1 + ndx * .1;
      const rot = time * speed;
      cube.rotation.x = rot;
      cube.rotation.y = rot;
    });

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();


// function main()
// {
// //   const canvas = document.querySelector('#c');
// //   const renderer = new THREE.WebGLRenderer({canvas});

// const renderer = new THREE.WebGLRenderer();
// renderer.setSize( window.innerWidth, window.innerHeight );
// document.body.appendChild( renderer.domElement );

//   const fov = 75;
//   const aspect = window.innerWidth / window.innerHeight;
//   const near = 0.1;
//   const far = 5;
//   const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
//   camera.position.z = 2;

//   const scene = new THREE.Scene();

//   {
//     const color = 0xFFFFFF;
//     const intensity = 1;
//     const light = new THREE.DirectionalLight(color, intensity);
//     light.position.set(-1, 2, 4);
//     scene.add(light);
//   }

//   const boxWidth = 1;
//   const boxHeight = 1;
//   const boxDepth = 1;
//   const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

//   const material = new THREE.MeshPhongMaterial({color: 0x44aa88});  // greenish blue

//   const cube = new THREE.Mesh(geometry, material);
//   scene.add(cube);

//   function render(time) {
//     time *= 0.001;  // convert time to seconds

//     cube.rotation.x = time;
//     cube.rotation.y = time;

//     renderer.render(scene, camera);

//     requestAnimationFrame(render);
//   }
//   requestAnimationFrame(render);

// }

// main();





// // const scene = new THREE.Scene();

// // const fov = 75;
// // const aspect = window.innerWidth / window.innerHeight;
// // const near = 0.1;
// // const far = 1000;
// // const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

// // const renderer = new THREE.WebGLRenderer();
// // renderer.setSize( window.innerWidth, window.innerHeight );
// // document.body.appendChild( renderer.domElement );

// // const geometry = new THREE.BoxGeometry();
// // // basic material is not affected by light
// // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
// // //
// // const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
// // const cube = new THREE.Mesh( geometry, material );
// // scene.add(cube);

// // {
// //     const color = 0xFFFFFF;
// //     const intensity = 1;
// //     const light = new THREE.DirectionalLight(color, intensity);
// //     light.position.set(-1, 2, 4);
// //     scene.add(light);
// //   }

// // camera.position.set(0, 0, 5);
// // camera.lookAt(0, 0, 0);



// // const animate = function ()
// // {
// //     requestAnimationFrame( animate );

// //     cube.rotation.x += 0.01;
// //     cube.rotation.y += 0.01;

// //     renderer.render(scene, camera);
// // };

// // animate();
