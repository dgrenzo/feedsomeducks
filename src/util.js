
/**
 * @param {*} object 
 * @param {number} x 
 * @param {number} y 
 * @param {number} z 
 */
export function setPosition(object, x = 1, y = 1, z = 1) {
  object.position.x = x;
  object.position.y = y;
  object.position.z = z;
}


/**
 * @param {*} object 
 * @param {number} x 
 * @param {number} y 
 * @param {number} z 
 */
 export function setScale(object, x = 1, y = 1, z = 1) {
  object.scale.x = x;
  object.scale.y = y,
  object.scale.z = z;
}

