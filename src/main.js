import { Duck } from './duck.js'
import { setPosition } from './util.js';
import { PerspectiveCamera, Scene, WebGLRenderer } from './three/Three.js';

function Game() {
  const scene = new Scene();
  const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  const canvas = document.getElementById('game_canvas');
  const renderer = new WebGLRenderer( { antialias:true, canvas, alpha: true } );
  renderer.setClearColor([0.48, 0.78, 1.0], 0);

  const WindowResize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width/height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
  }
  WindowResize();
  window.addEventListener('resize', WindowResize);

  const ducks = [];

  for (let i = 0; i < 10; i ++) {
    const duck = new Duck();

    duck.setPosition(Math.random() * 20 - 10, 0.25, Math.random() * 10 - 5)

    scene.add(duck.root);

    ducks.push(duck);
  }

  setPosition(camera, 0, 5, 20);
  
  function update() {
    requestAnimationFrame(update);
    for (const duck of ducks) {
      duck.update();
    }
    renderer.render(scene, camera);
  }
  update();
}
Game();