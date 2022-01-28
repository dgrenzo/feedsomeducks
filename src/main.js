import { Duck } from './duck.js'
import { setPosition } from './util.js';
import { PerspectiveCamera, Scene, Vector2, Vector3, WebGLRenderer } from './three/Three.js';

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

  /** @type {Duck[]} */
  const ducks = [];

  for (let i = 0; i < 10; i ++) {
    const duck = new Duck();

    duck.setPosition( (Math.random()-0.5) * 30, 0, (Math.random()-0.5) * 30)

    scene.add(duck.root);

    ducks.push(duck);
  }

  setPosition(camera, 0, 5, 24);
  
  let opacity = 0;

  const max_opacity = 150;

  function update() {
    requestAnimationFrame(update);

    for (const duck of ducks) {
      
      seperate(duck);
      cohesion(duck);
      align(duck);


      stayClose(duck);

      duck.update();
      
    }
    if (opacity < max_opacity + 1) {
      canvas.style.opacity = 1;//Math.min(1, Math.pow(opacity ++ / max_opacity, 2));
    }

    renderer.render(scene, camera);
  }

  /**
   * 
   * @param {Duck} duck 
   */
  function stayClose(duck) {
    const distance = duck.root.position.length();
    const intensity = 0.005;

    const max = duck.max_wander;

    if (distance > max) {

      const steer = new Vector2(duck.root.position.x, duck.root.position.z);

      steer.normalize();
      steer.multiplyScalar(distance - max);
      steer.multiplyScalar(intensity);

      duck.velocity.sub(steer);


    }

  }

  /**
   * 
   * @param {Duck} duck 
   */
  function seperate(duck) {
    const intensity = 0.0125;

    const desired = 2;
    const desired_squared = Math.pow(desired, 2);

    const delta = new Vector2(0,0);

    const steer = new Vector2(0,0);
    let count = 0;

    for (let i = 0; i < ducks.length; i ++) {
      const other = ducks[i];
      if (other === duck) {
        continue;
      }
      const dSquared = distanceSquared(duck, other);

      if (dSquared < desired_squared) {
        // const d = desired_squared - dSquared;
        const d = Math.sqrt(dSquared);
        
        delta.x = duck.root.position.x - other.root.position.x;
        delta.y = duck.root.position.z - other.root.position.z;
        
        delta.setLength(desired - d);
        steer.add(delta);
        count ++;
      }
    }

    if (count > 0) {
      steer.divideScalar(count);
      // steer.normalize();
      steer.multiplyScalar(intensity)

      duck.velocity.add(steer);
    }
  }

  /**
   * @param {Duck} duck 
   */
  function cohesion(duck) {
    const intensity = 0.0015;

    const max_dist = duck.cohesion_distance;
    const max_squared = Math.pow(max_dist, 2);

    const sum_pos = new Vector2(0,0);
    let count = 0;

    for (let i = 0; i < ducks.length; i ++) {
      const other = ducks[i];
      if (other === duck) {
        continue;
      }
      const dSquared = distanceSquared(duck, ducks[i]);
      if (dSquared < max_squared) {
        sum_pos.x += other.root.position.x;
        sum_pos.y += other.root.position.z;
        count ++;
      }
    }

    if (count > 0) {
      sum_pos.divideScalar(count);

      const direction = new Vector2(
        duck.root.position.x - sum_pos.x,
        duck.root.position.z - sum_pos.y
      );

      direction.normalize();
      direction.multiplyScalar(intensity);
      

      duck.velocity.sub(direction);
    }

  }

  function align(duck) {
    const intensity = 0.125;

    const max_dist = duck.align_distance;
    const max_squared = Math.pow(max_dist, 2);

    const direction = new Vector2(0,0);
    let count = 0;

    for (let i = 0; i < ducks.length; i ++) {
      const other = ducks[i];
      if (other === duck) {
        continue;
      }
      const dSquared = distanceSquared(duck, ducks[i]);
      if (dSquared < max_squared) {
        direction.add(other.velocity);
        count ++;
      }
    }

    if (count > 0) {
      direction.divideScalar(count);
      direction.normalize();

      direction.multiplyScalar(intensity);

      duck.velocity.add(direction);
    }

  }

    
    


  update();
}
/**
 * 
 * @param {Duck} duck 
 * @param {Duck} other 
 */
function distanceSquared(duck, other) {
  /** @type {Vector3} */
  const p1 = duck.root.position;
  /** @type {Vector3} */
  const p2 = other.root.position;

  return p1.distanceToSquared(p2);
}



Game();