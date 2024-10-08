/* eslint-disable no-prototype-builtins */
// @ts-check
const { exists, client: redisClient } = require('./redis');
const { shape_sprites, shape_sprites_level_2 } = require('./sprite');

const getMessages = async (roomId = '0', offset = 0, size = 50) => {
  /**
   * Logic:
   * 1. Check if room with id exists
   * 2. Fetch messages from last hour
   **/
  const roomKey = `room:${roomId}`;
  const roomExists = await exists(roomKey);
  if (!roomExists) {
    return [];
  } else {
    return new Promise((resolve, reject) => {
      redisClient.zrevrange(roomKey, offset, offset + size, (err, values) => {
        if (err) {
          reject(err);
        }
        resolve(values.map((val) => JSON.parse(val)));
      });
    });
  }
};

// Function to check if two objects are equal
function areObjectsEqual(obj1, obj2) {
  return obj1?.name === obj2;
}

const setPlayerObjects = (roomSpritesIndex, isLevel2 = false) => {
  let object = [];
  let nameObject = '';

  console.log('Is this level 2?', isLevel2);
  let sprites = isLevel2 ? shape_sprites_level_2 : shape_sprites;

  console.log('Sprites superset', sprites);
  console.log(
    'the actual room sprites to be compared against',
    roomSpritesIndex
  );

  // Iterate over A and add one object to B if not already present
  for (let i = 0; i < sprites.length; i++) {
    const objA = sprites[i];
    console.log('the object objA', objA);
    let found = false;

    for (let j = 0; j < roomSpritesIndex.length; j++) {
      const objB = roomSpritesIndex[j];
      console.log('the object objB', objB);

      if (areObjectsEqual(objA, objB)) {
        found = true;
        break;
      }
    }

    if (!found) {
      console.log('the object not found - pushing into array', objA);
      nameObject = objA?.name;
      roomSpritesIndex.push(objA[nameObject]);
      object = objA[nameObject];
      break; // Stop iterating after adding one object to B
    }
  }

  console.log('th anem object', nameObject);
  console.log('the sprite in setPlayerObjects', object);

  return {
    randomSprite: object,
    name: nameObject,
  };
};

const getRandomSprites = (isLevel2 = false) => {
  const shapes = isLevel2 ? shape_sprites_level_2 : shape_sprites;
  // Generate a random index within the range of A.length
  const randomIndex = Math.floor(Math.random() * shapes?.length);
  console.log('the shape size to match rondom index', shapes?.length);
  console.log('the random index generated', randomIndex);

  // Retrieve the random object from array A
  const randomObject = shapes[randomIndex];
  const name = randomObject?.name;

  console.log('random index', randomObject[name]);
  return {
    randomSprite: randomObject[name],
    name: name,
  };
};

function addObject(obj, playerName, object) {
  const playerIndex = obj.findIndex((item) => item.hasOwnProperty(playerName));

  if (playerIndex === -1) {
    // Player does not exist, add a new entry
    obj.push({ [playerName]: [object] });
  } else {
    // Player exists, update or add the object
    const playerObj = obj[playerIndex][playerName];
    const objectIndex = playerObj.findIndex((item) => item.id === object.id);

    if (objectIndex === -1) {
      // Object does not exist, add it to the player's array
      playerObj.push(object);
    } else {
      // Object exists, update it
      playerObj[objectIndex] = object;
    }
  }

  return obj; // Return the modified obj array
}

function removeObject(obj, playerName, objectId) {
  console.log(
    `The object I am removing from ${obj} with playerName: ${playerName} and object Id: ${objectId}`
  );

  const playerIndex = obj.findIndex((item) =>
    Object.prototype.hasOwnProperty.call(item, playerName)
  );

  if (playerIndex !== -1) {
    // Player exists, remove the object
    const playerObj = obj[playerIndex][playerName];
    const objectIndex = playerObj.findIndex(
      (item) => item?.shapeUri === objectId
    );

    if (objectIndex !== -1) {
      playerObj.splice(objectIndex, 1);
    }
  }

  return obj; // Return the modified obj array
}

const obj = [
  {
    Jake: [
      { id: 1, name: 'Object 1' },
      { id: 2, name: 'Object 2' },
    ],
  },
  {
    John: [
      { id: 3, name: 'Object 3' },
      { id: 4, name: 'Object 4' },
    ],
  },
];

const newObject = { id: 3, name: 'Object 6' };
const res = removeObject(obj, 'John', 3);

const testObj = [
  { id: 'p2-01-A1', isVisible: true, shapeUri: 'shapeA1-029' },
  { id: 'p2-02-A1', isVisible: true, shapeUri: 'shapeA1-030' },
  { id: 'p2-01-A4', isVisible: true, shapeUri: 'shapeA4-031' },
  { id: 'p2-01-A3', isVisible: true, shapeUri: 'shapeA3-032' },
];
const addOwnerToEachObject = (playerId, objectsList) => {
  if (
    objectsList === null ||
    objectsList === undefined ||
    objectsList.length <= 0
  ) {
    return null;
  }
  const fieldName = 'owner';
  const isOnBoard = 'isOnBoard';
  const xVar = 'x';
  const yVar = 'y';
  objectsList?.forEach((obj) => {
    obj[fieldName] = playerId;
    obj[isOnBoard] = true;
    obj[xVar] = 0;
    obj[yVar] = 0;
  });

  return objectsList;
};

console.log('the rse', addOwnerToEachObject('hdfhhdf', testObj));

module.exports = {
  addOwnerToEachObject,
  addObject,
  removeObject,
  getMessages,
  getRandomSprites,
  setPlayerObjects,
};
