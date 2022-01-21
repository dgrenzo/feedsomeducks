import { VertexMat, COLOR } from './assets.js';
import { BoxGeometry, Float32BufferAttribute, Mesh, Object3D, Vector3 }  from './three/Three.js';
import { setPosition, setScale } from './util.js';

function getMesh(color) {
  const geo = new BoxGeometry();
  const vertices = 24;
  const colors = [];
  for (let i = 0; i < vertices; i ++) {
    for (let j = 0; j < color.length; j ++) {
      colors.push(color[j] / 255.0);
    }
  }
  geo.setAttribute('color', new Float32BufferAttribute(colors, 3));
  const mesh = new Mesh(geo, VertexMat);
  return mesh;
} 


export function Duck() {
  this.velocity = {
    x : 0,
    y : 0
  }
  this.angle = 0;

  this.root = new Object3D();
  const bones = {};
  const meshes = {};

  bones.head = new Object3D();
  bones.bill = new Object3D();
  bones.feet = new Object3D();
  meshes.body = getMesh(COLOR.YELLOW);
  meshes.head = getMesh(COLOR.YELLOW);
  meshes.left_eye = getMesh(COLOR.BLACK);
  meshes.right_eye = getMesh(COLOR.BLACK);
  meshes.bill = getMesh(COLOR.ORANGE);
  meshes.left_foot = getMesh(COLOR.ORANGE);
  meshes.right_foot = getMesh(COLOR.ORANGE);
  
  setPosition(bones.head, 1, 1, 0);
  this.root.add(bones.head);
  setPosition(bones.bill, 0.6, -0.1, 0);
  bones.head.add(bones.bill);
  setScale(meshes.body, 1.75, 1.35, 1.25);
  this.root.add(meshes.body);
  setScale(meshes.head, 1, 1, 1);
  bones.head.add(meshes.head);
  setScale(meshes.left_eye, 0.15, 0.15, 0.15);
  setPosition(meshes.left_eye, 0.5, 0.3, -0.2);
  bones.head.add(meshes.left_eye);
  setScale(meshes.right_eye, 0.15, 0.15, 0.15);
  setPosition(meshes.right_eye, 0.5, 0.3, 0.2);
  bones.head.add(meshes.right_eye);
  setScale(meshes.bill, 0.6, 0.4, 0.8);
  bones.bill.add(meshes.bill);

  setPosition(bones.feet, -0.2, -0.7, 0);
  this.root.add(bones.feet);
  setPosition(meshes.left_foot, 0, 0, 0.2);
  setScale(meshes.left_foot, 0.2, 1, 0.6);
  bones.feet.add(meshes.left_foot);
  setPosition(meshes.right_foot, 0, 0, -0.2);
  setScale(meshes.right_foot, 1, 0.2, 0.6);
  bones.feet.add(meshes.right_foot);


  this.root.rotateY( Math.PI * Math.random());
  /**
   * @param {number} x 
   * @param {number} y 
   * @param {number} z 
   */
  this.setPosition = function(x, y, z) {
    /** @type {*} */ this.root;
    this.root.position.x = x;
    this.root.position.y = y;
    this.root.position.z = z;
  }

  const offset = Math.random() * 5000;
  this.update = () => {
    const now = Date.now() + offset;
    bones.head.rotateX(Math.sin(now / 200) / 125);
    bones.feet.rotateZ( Math.PI / -25 );

    const vec = new Vector3();
    this.root.getWorldDirection(vec);


    this.root.translateX(1/ 10);

    this.root.rotateY( Math.PI / 250);
    this.root.rotateZ( Math.sin(now / 200) / 400);
  }
}